import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, User, Building2, Globe, ExternalLink, ChevronLeft, ChevronRight, Sparkles, TrendingUp, Users, DollarSign, Package, Target, FileText, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import type { UserInfo, LLMResponse } from '../../types/cardScanner';

interface ResultScreenProps {
  userInfo: UserInfo;
  llmResponse: LLMResponse | null;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  onScheduleMeeting: () => void;
  onScanAnother: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

export function ResultScreen({
  userInfo,
  llmResponse,
  processingStatus,
  onScheduleMeeting: _onScheduleMeeting,
  onPrevious,
  onNext
}: ResultScreenProps) {

  const structuredData = llmResponse?.extracted_data || {};
  const name = userInfo.name || structuredData.name || 'N/A';
  const title = structuredData.title || 'N/A';
  const email = userInfo.email || structuredData.email || 'N/A';
  const phone = userInfo.phone || structuredData.phone || 'N/A';
  const company = userInfo.company || structuredData.company || 'N/A';
  const website = structuredData.website || '';
  const address = structuredData.address || '';

  const companyInsights = {
    company_description: structuredData.company_description || null,
    products: structuredData.products || null,
    location: structuredData.location || address || null,
    industry: structuredData.industry || null,
    num_of_employees: structuredData.num_of_employees || null,
    revenue: structuredData.revenue || null,
    market_share: structuredData.market_share || null,
    investors: structuredData.investors || null,
    summarised_llm_company_response: structuredData.summarised_llm_company_response || null,
    other_info_of_company: structuredData.other_info_of_company || null,
    website: website,
  };

  const confidence = llmResponse?.confidence_score || structuredData.confidence || 0.85;
  const confidencePercent = Math.round(confidence * 100);

  const InfoField = ({ 
    label, 
    value, 
    loading = false, 
    icon: Icon, 
    className = "" 
  }: { 
    label: string; 
    value?: string | null; 
    loading?: boolean; 
    icon?: any; 
    className?: string;
  }) => (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      </div>
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-sm text-gray-400 italic">Loading...</span>
        </div>
      ) : (
        <p className="text-base font-semibold text-gray-900 leading-relaxed">{value || 'N/A'}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPrevious}
            disabled={!onPrevious}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              onPrevious
                ? 'text-white border-2 shadow-sm hover:shadow-md'
                : 'text-gray-500 cursor-not-allowed border-2'
            }`}
            style={onPrevious ? {
              background: 'rgba(22, 35, 71, 0.8)', 
              borderColor: 'rgba(59, 130, 246, 0.3)'
            } : {
              background: 'rgba(22, 35, 71, 0.3)', 
              borderColor: 'rgba(100, 116, 139, 0.3)'
            }}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            disabled={!onNext}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              onNext
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl'
                : 'text-gray-500 cursor-not-allowed'
            }`}
            style={!onNext ? {background: 'rgba(22, 35, 71, 0.3)'} : {}}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Status Banner */}
        <AnimatePresence mode="wait">
          <motion.div
            key={processingStatus}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            {processingStatus === 'completed' ? (
              <Card className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 border-0 shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center gap-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ type: "spring", duration: 0.8 }}
                      className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
                    >
                      <CheckCircle2 className="w-9 h-9 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                        Profile Complete! <Sparkles className="w-6 h-6" />
                      </h2>
                      <p className="text-emerald-50 text-sm sm:text-base">Card analyzed & company insights enriched with AI</p>
                      <p className="text-white/90 text-sm mt-1 font-medium">✨ Ready for next step: Capture your selfie</p>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-400 border-0 shadow-xl">
                <div className="p-6">
                  <div className="flex items-center gap-5">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">AI Research in Progress...</h2>
                      <p className="text-amber-50 text-sm sm:text-base">Enriching company data with real-time intelligence</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex gap-1">
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          {/* Personal Information - 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="h-full border-2 border-blue-100 hover:border-blue-200 transition-colors shadow-lg hover:shadow-xl">
              <div className="p-6 sm:p-8">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-100">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Personal Info</h3>
                </div>

                <div className="space-y-6">
                  {/* Name & Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoField label="Full Name" value={name} icon={User} />
                    <InfoField label="Job Title" value={title} icon={Target} />
                  </div>

                  {/* Contact Details */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InfoField label="Email Address" value={email} />
                      <InfoField label="Phone Number" value={phone} />
                    </div>
                  </div>

                  {/* Company & Location */}
                  <div className="pt-4 border-t border-gray-200 space-y-4">
                    <InfoField label="Company" value={company} icon={Building2} />
                    {address && <InfoField label="Address" value={address} />}
                  </div>

                  {/* Quick Summary Badge */}
                  {companyInsights.summarised_llm_company_response && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 pt-6 border-t-2 border-blue-100"
                    >
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                          <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider">AI Summary</p>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                          {companyInsights.summarised_llm_company_response}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Company Insights - 3 columns */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card className="h-full border-2 border-orange-100 hover:border-orange-200 transition-colors shadow-lg hover:shadow-xl">
              <div className="p-6 sm:p-8">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-orange-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Company Intelligence</h3>
                  </div>
                  
                  {/* Confidence Badge */}
                  <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-4 py-2 rounded-full border border-orange-300">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-bold text-orange-900">{confidencePercent}% Confident</span>
                  </div>
                </div>

                <div className="space-y-6 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
                  
                  {/* Company Overview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoField label="Company Name" value={company} icon={Building2} />
                    <InfoField 
                      label="Industry" 
                      value={companyInsights.industry} 
                      loading={!companyInsights.industry && processingStatus === 'processing'} 
                      icon={Target}
                    />
                  </div>

                  {/* Website */}
                  {companyInsights.website && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Website</p>
                      </div>
                      <a
                        href={companyInsights.website.startsWith('http') ? companyInsights.website : `https://${companyInsights.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-base font-semibold text-emerald-600 hover:text-emerald-700 hover:underline group"
                      >
                        {companyInsights.website}
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  )}

                  {/* Key Metrics */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <p className="text-xs font-semibold text-blue-900 uppercase">Employees</p>
                        </div>
                        {companyInsights.num_of_employees ? (
                          <p className="text-xl font-bold text-gray-900">{companyInsights.num_of_employees}</p>
                        ) : (
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-sm text-blue-600 italic">Loading...</span>
                          </div>
                        )}
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <p className="text-xs font-semibold text-green-900 uppercase">Revenue</p>
                        </div>
                        {companyInsights.revenue ? (
                          <p className="text-xl font-bold text-gray-900">{companyInsights.revenue}</p>
                        ) : (
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm text-green-600 italic">Loading...</span>
                          </div>
                        )}
                      </div>

                      {companyInsights.market_share && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                            <p className="text-xs font-semibold text-purple-900 uppercase">Market Share</p>
                          </div>
                          <p className="text-xl font-bold text-gray-900">{companyInsights.market_share}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Products */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-5 h-5 text-orange-600" />
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Products & Services</p>
                    </div>
                    {companyInsights.products ? (
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{companyInsights.products}</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm text-gray-500 italic">Researching products...</span>
                      </div>
                    )}
                  </div>

                  {/* AI-Generated Summary */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">AI-Generated Summary</p>
                    </div>
                    {companyInsights.summarised_llm_company_response ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-xl p-5 border-2 border-emerald-200 relative"
                      >
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {companyInsights.summarised_llm_company_response}
                        </p>
                        {processingStatus !== 'completed' && (
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="inline-block w-0.5 h-5 bg-emerald-600 ml-1"
                          />
                        )}
                      </motion.div>
                    ) : (
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-200">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <motion.div
                              animate={{ y: [0, -8, 0] }}
                              transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                              className="w-2.5 h-2.5 bg-emerald-600 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -8, 0] }}
                              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                              className="w-2.5 h-2.5 bg-emerald-600 rounded-full"
                            />
                            <motion.div
                              animate={{ y: [0, -8, 0] }}
                              transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                              className="w-2.5 h-2.5 bg-emerald-600 rounded-full"
                            />
                          </div>
                          <p className="text-sm font-medium text-emerald-700">AI is analyzing company data...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {companyInsights.company_description && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Company Description</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{companyInsights.company_description}</p>
                      </div>
                    </div>
                  )}

                  {/* Investors */}
                  {(companyInsights.investors || processingStatus === 'processing') && (
                    <div className="pt-4 border-t border-gray-200">
                      <InfoField 
                        label="Investors & Funding" 
                        value={companyInsights.investors} 
                        loading={!companyInsights.investors && processingStatus === 'processing'}
                        icon={TrendingUp}
                      />
                    </div>
                  )}

                  {/* Other Information */}
                  {companyInsights.other_info_of_company && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-gray-600" />
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Additional Information</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{companyInsights.other_info_of_company}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #fb923c, #f97316);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #f97316, #ea580c);
        }
      `}</style>
    </div>
  );
}
