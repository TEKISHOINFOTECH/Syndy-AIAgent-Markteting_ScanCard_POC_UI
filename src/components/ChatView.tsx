import { useState } from 'react';
import { Mic, Send, Bot, Users, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import RobotAvatar from './RobotAvatar';
import UploadView from './UploadView';
import ScanView from './ScanView';
import DatabaseView from './DatabaseView';

interface ChatViewProps {
  activeView: 'chat' | 'upload' | 'scan' | 'analysis';
  analysisSubsection?: 'overview' | 'stats' | 'database' | null;
  setAnalysisSubsection?: (subsection: 'overview' | 'stats' | 'database' | null) => void;
  setActiveView?: (view: 'chat' | 'upload' | 'scan' | 'analysis') => void;
}

function ChatView({ activeView, analysisSubsection, setAnalysisSubsection, setActiveView }: ChatViewProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  // Render different views based on activeView
  if (activeView === 'upload') {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setActiveView?.('chat')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            ←
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Upload Files</h2>
        </div>
        <UploadView />
      </div>
    );
  }

  if (activeView === 'scan') {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setActiveView?.('chat')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            ←
          </button>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Scanner</h2>
        </div>
        <ScanView />
      </div>
    );
  }

  if (activeView === 'analysis') {
    // Handle analysis subsections
    if (analysisSubsection === 'database') {
      return (
        <div className="flex flex-col h-full bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
          {/* Light glassmorphism background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-40 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
          </div>

          {/* Header */}
          <div className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 shadow-sm flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setAnalysisSubsection?.('overview')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              ←
            </button>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Database</h2>
          </div>

          {/* Database Content */}
          <div className="relative z-10 flex-1">
            <DatabaseView />
          </div>
        </div>
      );
    }

    // Default analysis overview with stats
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
        {/* Light glassmorphism background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-40 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 shadow-sm flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setActiveView?.('chat')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            ←
          </button>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Analysis Overview</h2>
        </div>
        <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Quick Stats Section */}
            <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-2xl backdrop-blur-sm border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl backdrop-blur-sm border border-green-200">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm sm:text-base">Total Contacts:</span>
                  </div>
                  <span className="text-green-600 font-bold text-lg sm:text-xl">2</span>
                </div>
                <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-2xl backdrop-blur-sm border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl backdrop-blur-sm border border-emerald-200">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm sm:text-base">Active View:</span>
                  </div>
                  <span className="text-emerald-600 font-bold text-lg sm:text-xl">analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default chat view
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
      {/* Light glassmorphism background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 bg-white/70 backdrop-blur-xl">
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Chatterbox</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Chat with your AI assistant to manage contacts.</p>
      </div>

      {/* Chat Messages Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto w-full">
          {/* Central Robot Avatar */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <RobotAvatar />
          </div>


          {/* Chat Messages */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-3 sm:p-4 max-w-2xl border border-gray-200 shadow-sm">
                <p className="text-gray-800 text-sm sm:text-base">
                  Hello! I'm your Tekisho assistant. I can help you manage contacts, show recent entries, or answer questions. Try asking me something!
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-2">5:42:01 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 border-t border-gray-200 bg-white/70 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-14 sm:pr-16 rounded-2xl bg-white border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none resize-none transition-all text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
              <div className="absolute right-2 bottom-2 flex gap-1.5 sm:gap-2">
                <button
                  onClick={toggleRecording}
                  className={`p-1.5 sm:p-2 rounded-lg transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                  }`}
                  title="Voice input"
                >
                  <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="p-1.5 sm:p-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatView;