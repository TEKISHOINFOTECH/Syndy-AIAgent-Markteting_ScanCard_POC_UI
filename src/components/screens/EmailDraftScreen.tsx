import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ChevronLeft, ChevronRight, Send, Edit2, Loader2, User } from 'lucide-react';
import { Card } from '../ui/Card';
import type { UserInfo } from '../../types/cardScanner';

interface EmailDraftScreenProps {
  userInfo: UserInfo | null;
  transactionID: string | null;
  emailDraft?: { to: string; subject: string; body: string } | null;
  includeSelfie: boolean;
  onIncludeSelfieChange: (value: boolean) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  onSaveDraft?: (draft: { to: string; subject: string; body: string }) => void;
  onScheduleMeeting?: () => void;
  isLoading?: boolean;
}

export function EmailDraftScreen({ 
  userInfo, 
  transactionID,
  emailDraft: propEmailDraft,
  includeSelfie,
  onIncludeSelfieChange,
  onPrevious, 
  onNext,
  onSaveDraft,
  onScheduleMeeting,
  isLoading: externalLoading
}: EmailDraftScreenProps) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratedDraft, setIsGeneratedDraft] = useState(false);

  // Initialize email with generated draft (priority) or extracted data
  useEffect(() => {
    // First, check if we have a generated email draft from props
    if (propEmailDraft) {
      if (propEmailDraft.to) {
        setTo(propEmailDraft.to);
      }
      if (propEmailDraft.subject) {
        setSubject(propEmailDraft.subject);
      }
      if (propEmailDraft.body) {
        setBody(propEmailDraft.body);
      }
      setIsGeneratedDraft(true);
      return;
    }

    // Fallback to user info defaults if no generated draft
    if (userInfo) {
      // Set recipient email if available
      if (userInfo.email) {
        setTo(userInfo.email);
      }

      // Generate default subject
      const defaultSubject = userInfo.name 
        ? `Meeting Request - ${userInfo.name}`
        : 'Meeting Request - Business Card Connection';
      setSubject(defaultSubject);

      // Generate default email body template
      const defaultBody = `Dear ${userInfo.name || 'Sir/Madam'},

I hope this email finds you well. I came across your business card and would like to connect with you.

${userInfo.company ? `I noticed you're with ${userInfo.company}.` : ''}

I would love to schedule a meeting to discuss potential collaboration opportunities.

Looking forward to hearing from you.

Best regards`;
      setBody(defaultBody);
      setIsGeneratedDraft(false);
    }
  }, [propEmailDraft, userInfo]);

  const handleSchedule = async () => {
    if (!transactionID) {
      setError('No transaction ID available');
      return;
    }

    if (!to.trim() || !subject.trim() || !body.trim()) {
      setError('Please fill in all email fields');
      return;
    }

    // Save draft if handler is provided
    if (onSaveDraft) {
      onSaveDraft({ to, subject, body });
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call the meeting scheduler API (onScheduleMeeting will handle includeSelfie)
      if (onScheduleMeeting) {
        await onScheduleMeeting();
      }

      // Navigate to next step
      if (onNext) {
        onNext();
      }
    } catch (err) {
      console.error('❌ Meeting scheduling error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to schedule meeting';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const loadingState = isLoading || externalLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 pt-20 pb-6 px-4 sm:px-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onPrevious}
            disabled={!onPrevious}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              onPrevious
                ? 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-700 border border-gray-300 hover:border-green-300 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Previous Step"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={handleSchedule}
            disabled={!transactionID || !to.trim() || !subject.trim() || !body.trim() || loadingState}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              transactionID && to.trim() && subject.trim() && body.trim() && !loadingState
                ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Schedule Meeting"
          >
            {loadingState && <Loader2 className="w-4 h-4 animate-spin" />}
            <span className="hidden sm:inline">{loadingState ? 'Scheduling...' : 'Next'}</span>
            {!loadingState && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Email Draft Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-800">Email Draft</h2>
                  <p className="text-sm text-gray-600">
                    {isGeneratedDraft ? 'AI-generated draft (you can edit)' : 'Compose and edit your email'}
                  </p>
                </div>
                {isGeneratedDraft && (
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    AI Generated
                  </span>
                )}
              </div>

              {/* Loading State */}
              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
                  <p className="text-gray-600 text-center">
                    Generating personalized email draft using AI...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This may take a few seconds
                  </p>
                </div>
              )}

              {/* Email Form - Only render when not generating */}
              {!isGenerating && (
                <div className="space-y-4">
                  {/* To Field */}
                  <div>
                    <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
                      To <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="to"
                      type="email"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="recipient@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Email subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                    />
                  </div>

                  {/* Body Field */}
                  <div>
                    <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="body"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your email message here..."
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y text-gray-800"
                    />
                  </div>

                  {/* Include Selfie Toggle */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <label htmlFor="include-selfie" className="text-sm font-medium text-gray-700 cursor-pointer">
                            Include Selfie in Email
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            {includeSelfie 
                              ? 'Your selfie will be included in the email' 
                              : 'Selfie will not be included in the email'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={includeSelfie}
                        onClick={() => onIncludeSelfieChange(!includeSelfie)}
                        disabled={isLoading || externalLoading}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                          includeSelfie ? 'bg-green-600' : 'bg-gray-300'
                        } ${isLoading || externalLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            includeSelfie ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Transaction ID Info */}
                  {transactionID && (
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Transaction ID: <span className="font-mono text-green-600">{transactionID}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              {!isGenerating && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    <span>Edit the email fields above</span>
                  </div>
                  <button
                    onClick={handleSchedule}
                    disabled={!transactionID || !to.trim() || !subject.trim() || !body.trim() || loadingState}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  >
                    {loadingState ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Scheduling Meeting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Continue to Schedule</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

