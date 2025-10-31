import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import type { UserInfo, LLMResponse } from '../../types/cardScanner';

interface ResultScreenProps {
  userInfo: UserInfo;
  llmResponse: LLMResponse | null;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  selfieImage?: string | null;
  onScheduleMeeting: () => void;
  onScanAnother: () => void;
}

export function ResultScreen({ 
  userInfo, 
  llmResponse, 
  processingStatus,
  selfieImage,
  onScheduleMeeting, 
  onScanAnother 
}: ResultScreenProps) {
  const isCompleted = processingStatus === 'completed';
  
  // Debug logging
  console.log('🔍 ResultScreen Debug:', {
    processingStatus,
    isCompleted,
    userEmail: userInfo.email,
    buttonDisabled: !isCompleted || !userInfo.email
  });

  return (
    <div className="flex-1 flex items-center justify-center p-4 max-h-screen overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full my-4"
      >
        <Card className="h-auto">
          <div className="space-y-4 p-4">
            {/* Success Header */}
            <div className="flex items-center justify-center text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mr-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Profile Created!</h2>
                <p className="text-sm text-gray-600">Information extracted successfully</p>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
              {/* Profile Header with Selfie */}
              <div className="flex items-start gap-4 mb-4">
                {selfieImage && (
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img 
                        src={selfieImage} 
                        alt="Profile photo" 
                        className="w-16 h-16 object-cover rounded-full border-2 border-white shadow-md"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    Contact Profile
                  </h3>
                  
                  {userInfo && (
                    <div className="space-y-2">
                      {userInfo.name && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                          <p className="text-gray-800 font-medium text-sm">{userInfo.name}</p>
                        </div>
                      )}
                      
                      {userInfo.title && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Job Title</p>
                          <p className="text-gray-800 font-medium text-sm">{userInfo.title}</p>
                        </div>
                      )}
                      
                      {userInfo.email && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                          <p className="text-gray-800 font-medium text-sm truncate">{userInfo.email}</p>
                        </div>
                      )}
                      
                      {userInfo.phone && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                          <p className="text-gray-800 font-medium text-sm">{userInfo.phone}</p>
                        </div>
                      )}
                      
                      {userInfo.company && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Company</p>
                          <p className="text-gray-800 font-medium text-sm">{userInfo.company}</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {!userInfo?.name && !userInfo?.title && !userInfo?.email && !userInfo?.phone && !userInfo?.company && (
                    <p className="text-gray-500 italic text-sm">No contact information extracted</p>
                  )}
                </div>
              </div>
            </div>

            {/* Confidence Score */}
            {llmResponse?.confidence_score !== undefined && (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-600">Accuracy</p>
                  <p className="text-sm font-bold text-green-600">
                    {(llmResponse.confidence_score * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    style={{ width: `${llmResponse.confidence_score * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {/* Schedule Meeting Button - Primary Action */}
              <Button 
                onClick={onScheduleMeeting}
                disabled={!isCompleted || !userInfo.email}
                className="w-full py-3 text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {!isCompleted ? 'Processing...' : !userInfo.email ? 'Email Required' : 'Schedule Meeting'}
              </Button>
              
              {/* Secondary Actions */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
                <Button 
                  variant="secondary" 
                  onClick={onScanAnother}
                  className="w-full py-2 text-sm font-medium"
                >
                  Scan Another Card
                </Button>
              </div>
            </div>

            {/* Status Messages */}
            {!isCompleted && (
              <p className="text-blue-600 text-xs text-center bg-blue-50 p-2 rounded">
                ⏳ Processing status: {processingStatus}
              </p>
            )}
            {!userInfo.email && isCompleted && (
              <p className="text-amber-600 text-xs text-center bg-amber-50 p-2 rounded">
                ⚠️ Email required for meeting scheduling
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}