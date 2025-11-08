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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20 pb-8 px-4 sm:px-6">
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
                ? 'bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border-2 border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
            }`}
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
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
 
        {/* Status Header - show 'Profile Complete' only when enrichment done */}
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
                      <p className="text-sm text-gray-600 mb-1">Address:</p>
                      <p className="text-base font-medium text-gray-800">{address}</p>
                    </div>
                  )}
                 
                  {/* Summary Section */}
                  {companyInsights.summarised_llm_company_response && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Summary:</p>
                      <p className="text-base font-medium text-gray-800 whitespace-pre-wrap">{companyInsights.summarised_llm_company_response}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
 
          {/* Company Insights Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Company Insights</h3>
                </div>
               
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {/* Basic Company Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Company:</p>
                      <p className="text-base font-medium text-gray-800">{company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Industry:</p>
                      <p className="text-base font-medium text-gray-800">
                        {companyInsights.industry || (
                          <span className="text-gray-400 italic inline-flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                            Analyzing...
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                 
                  {companyInsights.website && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Website:</p>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <a
                          href={companyInsights.website.startsWith('http') ? companyInsights.website : `https://${companyInsights.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-medium text-gray-800 hover:text-green-600 flex items-center gap-1"
                        >
                          {companyInsights.website}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
 
                  {/* Company Stats - Always show section */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Employees:</p>
                      <p className="text-base font-medium text-gray-800">
                        {companyInsights.num_of_employees || (
                          <span className="text-gray-400 italic inline-flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Revenue:</p>
                      <p className="text-base font-medium text-gray-800">
                        {companyInsights.revenue || (
                          <span className="text-gray-400 italic inline-flex items-center gap-2">
                            <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                            Loading...
                          </span>
                        )}
                      </p>
                    </div>
                    {companyInsights.market_share && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Market Share:</p>
                        <p className="text-base font-medium text-gray-800">{companyInsights.market_share}</p>
                      </div>
                    )}
                  </div>
                 
                  {/* Products - Always show */}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Products:</p>
                    {companyInsights.products ? (
                      <p className="text-base font-medium text-gray-800 whitespace-pre-wrap">{companyInsights.products}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                        <p className="text-base font-medium text-gray-400 italic">Researching products...</p>
                      </div>
                    )}
                  </div>
                 
                  {/* Investors - Always show */}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Investors:</p>
                    {companyInsights.investors ? (
                      <p className="text-base font-medium text-gray-800 whitespace-pre-wrap">{companyInsights.investors}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                        <p className="text-base font-medium text-gray-400 italic">Researching investors...</p>
                      </div>
                    )}
                  </div>
                 
                  {/* Company Description - Always show */}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Description:</p>
                    {companyInsights.company_description ? (
                      <p className="text-base font-medium text-gray-800 whitespace-pre-wrap">{companyInsights.company_description}</p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
                        <p className="text-base font-medium text-gray-400 italic">Generating description...</p>
                      </div>
                    )}
                  </div>
                 
                  {/* Summarised LLM Response - Always show with streaming effect */}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Summary:</p>
                    {companyInsights.summarised_llm_company_response ? (
                      <div className="relative">
                        <p className="text-base font-medium text-gray-800 whitespace-pre-wrap leading-relaxed">
                          {companyInsights.summarised_llm_company_response}
                        </p>
                        {/* Show typing cursor if still processing */}
                        {processingStatus !== 'completed' && (
                          <span className="inline-block w-0.5 h-5 bg-green-600 ml-1 animate-pulse" />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <p className="text-base font-medium text-gray-500 italic">AI is researching...</p>
                      </div>
                    )}
                  </div>
                 
                  {/* Other Info - Always show */}
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Other Information:</p>
                    {companyInsights.other_info_of_company ? (
                      <p className="text-base font-medium text-gray-800 whitespace-pre-wrap">{companyInsights.other_info_of_company}</p>
                    ) : (
                      <p className="text-base font-medium text-gray-400 italic">Enriching...</p>
                    )}
                  </div>
                 
                  {/* Data Confidence */}
                  <div className="pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Data Confidence</p>
                      <p className="text-sm font-semibold text-orange-600">{confidencePercent}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
 