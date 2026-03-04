'use client'

import { useState, useEffect } from 'react'
import { Wifi, Signal, SignalLow, SignalMedium, Activity, RefreshCw } from 'lucide-react'
import { getNetworkInfo } from '@/lib/utils/networkInfo'

export default function WifiAnalyzer() {
  const [scanning, setScanning] = useState(false)
  const [networks, setNetworks] = useState<any[]>([])

  const scanNetworks = () => {
    setScanning(true)
    setTimeout(() => {
      setNetworks([
        { ssid: 'MyHomeWiFi', strength: 85, channel: 6, security: 'WPA2', frequency: '5GHz' },
        { ssid: 'Neighbor_Net', strength: 45, channel: 1, security: 'WPA2', frequency: '2.4GHz' },
        { ssid: 'Public WiFi', strength: 20, channel: 11, security: 'Open', frequency: '2.4GHz' },
        { ssid: 'Office_Network', strength: 60, channel: 36, security: 'WPA3', frequency: '5GHz' },
      ])
      setScanning(false)
    }, 2000)
  }

  useEffect(() => {
    scanNetworks()
  }, [])

  const getSignalIcon = (strength: number) => {
    if (strength > 70) return <Signal className="w-4 h-4 text-green-400" />
    if (strength > 40) return <SignalMedium className="w-4 h-4 text-yellow-400" />
    return <SignalLow className="w-4 h-4 text-red-400" />
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wifi className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">محلل Wi-Fi</h3>
        </div>
        <button
          onClick={scanNetworks}
          disabled={scanning}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
        >
          <RefreshCw className={`w-5 h-5 text-white ${scanning ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {scanning ? (
        <div className="text-center py-12">
          <Activity className="w-8 h-8 text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">جاري مسح الشبكات...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {networks.map((net, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-3">
                {getSignalIcon(net.strength)}
                <div>
                  <p className="text-white font-medium">{net.ssid}</p>
                  <p className="text-xs text-gray-400">
                    القناة {net.channel} • {net.frequency} • {net.security}
                  </p>
                </div>
              </div>
              <span className="text-sm text-blue-400">{net.strength}%</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-purple-500/10 rounded-lg">
        <p className="text-sm text-purple-400">
          💡 نصيحة: القناة 6 مزدحمة. جرب استخدام القناة 1 أو 11
        </p>
      </div>
    </div>
  )
}
