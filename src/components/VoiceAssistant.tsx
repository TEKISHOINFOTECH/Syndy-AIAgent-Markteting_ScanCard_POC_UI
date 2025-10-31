import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";
import avatarMascot from '../images/avatar-mascot.png';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistant = ({ isOpen, onClose }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      alert(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
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
                <p className="text-xs sm:text-sm text-gray-800">{transcript}</p>
              ) : (
                <p className="text-xs sm:text-sm text-gray-600 text-center">
                  {isListening ? "Listening..." : "Click the microphone to start"}
                </p>
              )}
            </div>

            <p className="text-xs text-gray-500 text-center leading-tight">
              Speak naturally. Your voice will be transcribed in real-time.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};