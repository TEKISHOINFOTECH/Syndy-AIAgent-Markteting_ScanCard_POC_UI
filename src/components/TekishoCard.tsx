import { motion } from 'framer-motion';
import { QrCode, Mail, Phone } from 'lucide-react';

interface TekishoCardProps {
  name?: string;
  designation?: string;
  email?: string;
  phone?: string;
  company?: string;
  animated?: boolean;
}

export function TekishoCard({ 
  name = "John Doe",
  designation = "Software Engineer", 
  email = "john@tekisho.com",
  phone = "+1 (555) 123-4567",
  company = "Tekisho Technologies",
  animated = true
}: TekishoCardProps) {
  const cardProps = animated ? {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, type: "spring" as const },
    whileHover: { scale: 1.02, y: -5 },
  } : {};

  if (animated) {
    return (
      <motion.div
        {...cardProps}
        className="relative w-80 h-48 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl overflow-hidden group"
      >
      {/* Moving Shine Effect on Hover */}
      <div className="absolute inset-0 z-20 overflow-hidden rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div 
          className="absolute inset-0 w-[150%] h-full -left-[150%] group-hover:left-[100%] transition-all duration-1500 ease-in-out"
          style={{
            background: 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 55%, transparent 75%)',
            transform: 'skewX(-25deg)'
          }}
        ></div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">T</span>
              </div>
              <span className="text-green-400 font-bold text-sm">Tekisho</span>
            </div>
            <p className="text-gray-400 text-xs">Innovative AI Solutions</p>
          </div>
          
          {/* QR Code */}
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <QrCode className="w-8 h-8 text-gray-800" />
          </div>
        </div>

        {/* Main Info */}
        <div className="space-y-1">
          <h3 className="text-white font-bold text-lg">{name}</h3>
          <p className="text-gray-300 text-sm">{designation}</p>
          <p className="text-green-400 text-sm font-medium">{company}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2 text-gray-400">
            <Mail className="w-3 h-3" />
            <span>{email}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Phone className="w-3 h-3" />
            <span>{phone}</span>
          </div>
        </div>
      </div>

        {/* Green accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
      </motion.div>
    );
  }

  return (
    <div className="relative w-80 h-48 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-bl-full"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">T</span>
              </div>
              <span className="text-green-400 font-bold text-sm">Tekisho</span>
            </div>
            <p className="text-gray-400 text-xs">Innovative AI Solutions</p>
          </div>
          
          {/* QR Code */}
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
            <QrCode className="w-8 h-8 text-gray-800" />
          </div>
        </div>

        {/* Main Info */}
        <div className="space-y-1">
          <h3 className="text-white font-bold text-lg">{name}</h3>
          <p className="text-gray-300 text-sm">{designation}</p>
          <p className="text-green-400 text-sm font-medium">{company}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2 text-gray-400">
            <Mail className="w-3 h-3" />
            <span>{email}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Phone className="w-3 h-3" />
            <span>{phone}</span>
          </div>
        </div>
      </div>

      {/* Green accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
    </div>
  );
}

