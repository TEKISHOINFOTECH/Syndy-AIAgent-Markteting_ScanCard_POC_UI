import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, User, Building2, Globe, ExternalLink, ChevronRight, Sparkles, TrendingUp, Users, DollarSign, Package, Target, FileText, Info } from 'lucide-react';
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
  onPrevious: _onPrevious,
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

  // Confidence score - commented out as per request
  // const confidence = llmResponse?.confidence_score || structuredData.confidence || 0.85;
  // const confidencePercent = Math.round(confidence * 100);

  // Helper function to check if a value should be hidden
  const isEmptyValue = (value: any): boolean => {
    if (!value) return true;
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();
      return lowerValue === 'n/a' || 
             lowerValue === 'not specified' || 
             lowerValue === 'not available' ||
             lowerValue === 'not found' ||
             lowerValue === 'unknown' ||
             lowerValue === '';
    }
    return false;
  };

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
  }) => {
    // Don't render if value is empty/invalid and not loading
    if (!loading && isEmptyValue(value)) {
      return null;
    }
    
    return (
      <div className={`space-y-1 ${className}`}>
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-500" />}
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        </div>
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm text-gray-400 italic">Loading...</span>
          </div>
        ) : (
          <p className="text-base font-semibold text-gray-900 leading-relaxed">{value}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-violet-50/30 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-end mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNext}
            disabled={!onNext}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
              onNext
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
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
              <Card className="bg-gradient-to-br from-purple-500 via-purple-600 to-violet-500 border-0 shadow-2xl">
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
                      <p className="text-purple-50 text-sm sm:text-base">Card analyzed & company insights enriched with AI</p>
                      <p className="text-white/90 text-sm mt-1 font-medium">✨ Ready for next step: Capture your selfie</p>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="bg-gradient-to-br from-purple-400 via-purple-500 to-violet-500 border-0 shadow-xl">
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
                      <p className="text-purple-50 text-sm sm:text-base">Enriching company data with real-time intelligence</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          
          {/* Personal Information - 2 columns */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="h-full border-2 border-purple-100 hover:border-purple-200 transition-all duration-300 shadow-xl hover:shadow-2xl bg-white/80 backdrop-blur-sm">
              <div className="p-6 sm:p-8 lg:p-10">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-8 pb-6 border-b-2 border-purple-100">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Personal Info</h3>
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
                    <InfoField label="Address" value={address} />
                  </div>

                  {/* Quick Summary Badge */}
                  {!isEmptyValue(companyInsights.summarised_llm_company_response) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 pt-6 border-t-2 border-purple-100"
                    >
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border-2 border-purple-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          <p className="text-xs font-semibold text-purple-900 uppercase tracking-wider">AI Summary</p>
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
              <Card className="h-full border-2 border-purple-100 hover:border-purple-200 transition-all duration-300 shadow-xl hover:shadow-2xl bg-white/80 backdrop-blur-sm">
              <div className="p-6 sm:p-8 lg:p-10">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b-2 border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Company Intelligence</h3>
                  </div>
                  
                  {/* Confidence Badge - Hidden as per request */}
                  {/* <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-violet-100 px-4 py-2 rounded-full border border-purple-300">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-bold text-purple-900">{confidencePercent}% Confident</span>
                  </div> */} 
                </div>

                <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                  
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
                  {!isEmptyValue(companyInsights.website) && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Website</p>
                      </div>
                      <a
                        href={companyInsights.website.startsWith('http') ? companyInsights.website : `https://${companyInsights.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-base font-semibold text-purple-600 hover:text-purple-700 hover:underline group"
                      >
                        {companyInsights.website}
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  )}

                  {/* Key Metrics - Only show if at least one metric is available */}
                  {(!isEmptyValue(companyInsights.num_of_employees) || 
                    !isEmptyValue(companyInsights.revenue) || 
                    !isEmptyValue(companyInsights.market_share)) && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Employees Card */}
                        {!isEmptyValue(companyInsights.num_of_employees) && (
                          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                              <Users className="w-5 h-5 text-purple-600" />
                              <p className="text-xs font-semibold text-purple-900 uppercase">Employees</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{companyInsights.num_of_employees}</p>
                          </div>
                        )}

                        {/* Revenue Card */}
                        {!isEmptyValue(companyInsights.revenue) && (
                          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                              <DollarSign className="w-5 h-5 text-purple-600" />
                              <p className="text-xs font-semibold text-purple-900 uppercase">Revenue</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{companyInsights.revenue}</p>
                          </div>
                        )}

                        {/* Market Share Card */}
                        {!isEmptyValue(companyInsights.market_share) && (
                          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border-2 border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="w-5 h-5 text-purple-600" />
                              <p className="text-xs font-semibold text-purple-900 uppercase">Market Share</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{companyInsights.market_share}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {!isEmptyValue(companyInsights.products) && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-5 h-5 text-purple-600" />
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Products & Services</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{companyInsights.products}</p>
                      </div>
                    </div>
                  )}

                  {/* AI-Generated Summary */}
                  {!isEmptyValue(companyInsights.summarised_llm_company_response) && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">AI-Generated Summary</p>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 rounded-xl p-5 border-2 border-purple-200 relative"
                      >
                        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {companyInsights.summarised_llm_company_response}
                        </p>
                        {processingStatus !== 'completed' && (
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="inline-block w-0.5 h-5 bg-purple-600 ml-1"
                          />
                        )}
                      </motion.div>
                    </div>
                  )}

                  {/* Description */}
                  {!isEmptyValue(companyInsights.company_description) && (
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
                  {!isEmptyValue(companyInsights.investors) && (
                    <div className="pt-4 border-t border-gray-200">
                      <InfoField 
                        label="Investors & Funding" 
                        value={companyInsights.investors} 
                        icon={TrendingUp}
                      />
                    </div>
                  )}

                  {/* Other Information */}
                  {!isEmptyValue(companyInsights.other_info_of_company) && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-gray-600" />
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Additional Information</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          {(() => {
                            const data = companyInsights.other_info_of_company;
                            
                            // If it's already a string, return it directly
                            if (typeof data === 'string') {
                              // Try to parse if it looks like JSON
                              try {
                                const parsed = JSON.parse(data);
                                if (typeof parsed === 'object' && parsed !== null) {
                                  // It was JSON, format it
                                  if (Array.isArray(parsed)) {
                                    return parsed.join('. ') + '.';
                                  }
                                  return Object.entries(parsed)
                                    .map(([key, value]) => {
                                      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                      // Handle nested objects/arrays
                                      const formattedValue = typeof value === 'object' 
                                        ? JSON.stringify(value).replace(/[{}"[\]]/g, '').replace(/,/g, ', ')
                                        : value;
                                      return `${formattedKey}: ${formattedValue}`;
                                    })
                                    .join('. ') + '.';
                                }
                              } catch (e) {
                                // Not JSON, return as is
                                return data;
                              }
                              return data;
                            }
                            
                            // If it's an array
                            if (Array.isArray(data)) {
                              return data.map(item => typeof item === 'object' ? JSON.stringify(item) : item).join('. ') + '.';
                            }
                            
                            // If it's an object
                            if (typeof data === 'object' && data !== null) {
                              return Object.entries(data)
                                .map(([key, value]) => {
                                  const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                  // Handle nested objects/arrays
                                  let formattedValue;
                                  if (typeof value === 'object' && value !== null) {
                                    if (Array.isArray(value)) {
                                      formattedValue = value.join(', ');
                                    } else {
                                      formattedValue = JSON.stringify(value).replace(/[{}"]/g, '').replace(/,/g, ', ');
                                    }
                                  } else {
                                    formattedValue = value;
                                  }
                                  return `${formattedKey}: ${formattedValue}`;
                                })
                                .join('. ') + '.';
                            }
                            
                            // Fallback to string
                            return String(data);
                          })()}
                        </p>
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
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #7c3aed);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #6d28d9);
        }
      `}</style>
    </div>
  );
}

