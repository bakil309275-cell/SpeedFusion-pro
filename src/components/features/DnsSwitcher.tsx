'use client'

import { useState } from 'react'
import { Globe, Check, RefreshCw, Zap } from 'lucide-react'
import { DNS_SERVERS, switchDNS, getFastestDNS } from '@/lib/utils/dnsSwitcher'

export default function DnsSwitcher() {
  const [selectedDNS, setSelectedDNS] = useState('Cloudflare')
  const [loading, setLoading] = useState(false)
  const [currentDNS, setCurrentDNS] = useState('1.1.1.1')

  const handleSwitch = async (name: string, primary: string) => {
    setLoading(true)
    await switchDNS(name)
    setSelectedDNS(name)
    setCurrentDNS(primary)
    setLoading(false)
  }

  const handleFastest = () => {
    const fastest = getFastestDNS()
    handleSwitch(fastest.name, fastest.primary)
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">مبدل DNS</h3>
        </div>
        <button
          onClick={handleFastest}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition"
        >
          <Zap className="w-4 h-4" />
          الأسرع
        </button>
      </div>

      <div className="bg-gray-900/50 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-400 mb-1">DNS الحالي:</p>
        <p className="text-lg font-mono text-green-400">{currentDNS}</p>
      </div>

      <div className="space-y-3">
        {DNS_SERVERS.map((dns) => (
          <button
            key={dns.name}
            onClick={() => handleSwitch(dns.name, dns.primary)}
            disabled={loading}
            className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition disabled:opacity-50"
          >
            <div className="text-right">
              <p className="text-white font-medium">{dns.name}</p>
              <p className="text-sm text-gray-400">{dns.primary}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{dns.latency}ms</span>
              {selectedDNS === dns.name && (
                <Check className="w-5 h-5 text-green-400" />
              )}
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-6">
          <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
        </div>
      )}
    </div>
  )
}
