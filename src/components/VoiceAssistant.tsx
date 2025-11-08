import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";
import avatarMascot from '../images/avatar-mascot.png';
import { CardScannerAPI } from '../services/api';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  transactionID?: string; // Add transactionID for backend transcription
}

export const VoiceAssistant = ({ isOpen, onClose, transactionID }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // MediaRecorder for backend transcription
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());

        // Upload and transcribe
        await uploadAndTranscribe();
      };

      mediaRecorder.start();
      setIsListening(true);
      setTranscript("Recording... Speak now!");

      console.log('🎤 Recording started');
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setTranscript("Processing...");
      console.log('🛑 Recording stopped');
    }
  };

  const uploadAndTranscribe = async () => {
    if (audioChunksRef.current.length === 0) {
      setError('No audio recorded');
      return;
    }

    if (!transactionID) {
      setError('Transaction ID required for transcription');
      setTranscript("Please upload a business card first");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      console.log('📤 Uploading audio:', `${(audioBlob.size / 1024).toFixed(2)}KB`);

      const result = await CardScannerAPI.recordAudioWithoutAvatar(transactionID, audioBlob);
      
      // Display transcript and analysis
      const displayText = `
📝 Transcript:
${result.transcript}

🔍 Analysis:
${result.analysis.summary}
`.trim();

      setTranscript(displayText);
      console.log('✅ Transcription successful');
    } catch (error) {
      console.error('❌ Transcription failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to transcribe audio';
      setError(errorMessage);
      setTranscript(`Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
          className="fixed bottom-20 right-4 sm:right-6 md:right-8 w-[320px] sm:w-[360px] bg-white/90 backdrop-blur-2xl border border-gray-200/50 rounded-2xl shadow-2xl overflow-hidden z-50"
        >
          <div className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-xl p-2.5 sm:p-3 flex items-center justify-between">
            <h3 className="text-white font-semibold text-sm sm:text-base">Voice Assistant</h3>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-3 bg-gradient-to-br from-emerald-50/50 via-white to-green-50/50">
            {/* Voice Assistant Avatar */}
            <div className="flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-green-100">
                <img 
                  src={avatarMascot} 
                  alt="Voice Assistant Mascot" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <motion.button
                onClick={toggleListening}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  isListening
                    ? "bg-red-500 hover:bg-red-600 shadow-red-500/25"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={isListening ? { scale: [1, 1.1, 1] } : {}}
                transition={isListening ? { repeat: Infinity, duration: 1.5 } : {}}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                ) : (
                  <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </motion.button>
            </div>

            <div className="min-h-[80px] max-h-[120px] overflow-y-auto bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-3">
              {transcript ? (
                <p className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap">{transcript}</p>
              ) : (
                <p className="text-xs sm:text-sm text-gray-600 text-center">
                  {isListening ? "Recording... Speak now!" : isProcessing ? "Processing..." : transactionID ? "Click the microphone to start" : "Please upload a business card first"}
                </p>
              )}
              {error && (
                <p className="text-xs text-red-600 mt-2">⚠️ {error}</p>
              )}
            </div>

            <p className="text-xs text-gray-500 text-center leading-tight">
              {transactionID 
                ? "Speak naturally. Recording will be transcribed and analyzed."
                : "Upload a business card to enable voice recording"}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};