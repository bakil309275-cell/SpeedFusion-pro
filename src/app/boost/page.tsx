'use client'

import { useState } from 'react'
import SystemCleaner from '@/components/features/SystemCleaner'
import DnsSwitcher from '@/components/features/DnsSwitcher'
import WifiAnalyzer from '@/components/features/WifiAnalyzer'
import { Zap, Wifi, Globe } from 'lucide-react'

export default function BoostPage() {
  const [activeTab, setActiveTab] = useState<'system' | 'network' | 'dns'>('system')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        التحسين المتقدم
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${
            activeTab === 'system' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Zap className="w-5 h-5" />
          النظام
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${
            activeTab === 'network' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Wifi className="w-5 h-5" />
          الشبكة
        </button>
        <button
          onClick={() => setActiveTab('dns')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition ${
            activeTab === 'dns' 
              ? 'bg-purple-600 text-white' 
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Globe className="w-5 h-5" />
          DNS
        </button>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {activeTab === 'system' && <SystemCleaner />}
        {activeTab === 'network' && <WifiAnalyzer />}
        {activeTab === 'dns' && <DnsSwitcher />}
      </div>
    </div>
  )
}
