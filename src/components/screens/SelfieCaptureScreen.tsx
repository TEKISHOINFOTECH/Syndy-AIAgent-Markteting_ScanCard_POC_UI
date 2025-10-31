import React, { useEffect, useRef, useState } from 'react';

type SelfieCaptureProps = {
  transactionID: string;
  onCapture: (file: File, previewUrl: string) => Promise<void> | void;
  onSkip: () => void;
  isLoading?: boolean;
};

export const SelfieCaptureScreen: React.FC<SelfieCaptureProps> = ({ 
  transactionID, 
  onCapture, 
  onSkip, 
  isLoading 
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' }, 
          audio: false 
        });
        
        if (!mounted) {
          // Component was unmounted before stream was obtained
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }
        
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.error('Camera error:', err);
        setStreamError(err?.message || 'Camera access denied or unavailable');
      }
    };

    startCamera();

    return () => {
      mounted = false;
      // Clean up stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Clean up stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleTakePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');
      
      // Draw the current frame from video to canvas
      ctx.drawImage(video, 0, 0, width, height);
      
      // Convert canvas to blob and data URL for preview
      const blob: Blob | null = await new Promise(resolve => 
        canvas.toBlob(resolve, 'image/jpeg', 0.9)
      );
      
      if (!blob) throw new Error('Failed to capture image');
      
      // Create file and preview
      const file = new File([blob], `selfie_${transactionID}.jpg`, { type: 'image/jpeg' });
      const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      // Save for preview
      setSelfieFile(file);
      setCapturedImage(imageUrl);
    } catch (err) {
      console.error('Capture error:', err);
      setStreamError('Failed to capture photo. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleConfirmSelfie = async () => {
    if (selfieFile && capturedImage) {
      await onCapture(selfieFile, capturedImage);
    }
  };

  const handleRetakeSelfie = () => {
    setCapturedImage(null);
    setSelfieFile(null);
    setStreamError(null);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-x-hidden max-h-screen overflow-y-auto">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-green-200/50 p-4 max-w-md w-full mx-auto shadow-xl my-4">
        <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Take a Selfie
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Please take a quick selfie to complete your profile
        </p>
        <p className="text-xs text-gray-500 text-center mb-6">
          Transaction ID: <span className="font-mono text-green-600">{transactionID}</span>
        </p>

        {streamError ? (
          <div className="mb-6">
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-4">
              <p className="text-red-400 text-sm">
                <strong>Camera Error:</strong> {streamError}
              </p>
              <p className="text-red-300 text-xs mt-2">
                Please check your browser permissions and ensure your camera is not being used by another application.
              </p>
            </div>
            <button 
              onClick={onSkip} 
              className="w-full px-4 py-2 rounded-xl bg-white/70 hover:bg-white/90 text-gray-700 font-medium transition-colors border border-gray-200 shadow-sm"
            >
              Continue Without Selfie
            </button>
          </div>
        ) : capturedImage ? (
          /* Selfie Preview */
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3 text-center">Preview Your Selfie</h3>
              <div className="relative bg-black rounded-xl overflow-hidden border border-gray-200 h-[200px]">
                <img 
                  src={capturedImage} 
                  alt="Captured selfie" 
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror to match video preview
                />
                
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-gray-800 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                      <p className="text-sm">Uploading...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirmSelfie}
                disabled={isLoading}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium transition-all duration-200 shadow-lg"
              >
                {isLoading ? 'Uploading...' : 'Confirm & Upload'}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleRetakeSelfie}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/70 hover:bg-white/90 disabled:bg-gray-100 text-gray-700 font-medium transition-colors border border-gray-200 text-sm shadow-sm"
                >
                  Retake
                </button>

                <button
                  onClick={onSkip}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/70 hover:bg-white/90 disabled:bg-gray-100 text-gray-700 font-medium transition-colors border border-gray-200 text-sm shadow-sm"
                >
                  Skip
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <div className="relative bg-black rounded-xl overflow-hidden border border-gray-200 h-[200px]">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror effect for better UX
                />
                <canvas 
                  ref={canvasRef} 
                  className="hidden" 
                />
                
                {/* Loading overlay */}
                {(isCapturing || isLoading) && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-gray-800 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                      <p className="text-sm">
                        {isCapturing ? 'Capturing...' : 'Uploading...'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleTakePhoto}
                disabled={isCapturing || isLoading}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-medium transition-all duration-200 shadow-lg"
              >
                {isCapturing || isLoading ? 'Processing...' : 'Capture Selfie'}
              </button>

              <button
                onClick={onSkip}
                disabled={isCapturing || isLoading}
                className="w-full px-4 py-3 rounded-xl bg-white/70 hover:bg-white/90 disabled:bg-gray-100 text-gray-700 font-medium transition-colors border border-gray-200 text-sm shadow-sm"
              >
                Skip Selfie
              </button>
            </div>
          </>
        )}

        <p className="text-xs text-gray-500 text-center mt-4">
          Your selfie helps us verify your identity and improve security.
        </p>
      </div>
    </div>
  );
};