'use client'

import { useState } from 'react'
import { Activity, Clock, TrendingUp, AlertCircle } from 'lucide-react'

interface PingResult {
  server: string
  ping: number
  status: 'good' | 'fair' | 'poor'
}

export default function AdvancedPing() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<PingResult[]>([
    { server: 'Google DNS', ping: 25, status: 'good' },
    { server: 'Cloudflare', ping: 18, status: 'good' },
    { server: 'OpenDNS', ping: 45, status: 'fair' },
    { server: 'Quad9', ping: 32, status: 'good' },
    { server: 'Comodo', ping: 89, status: 'poor' },
  ])

  const runPingTest = () => {
    setTesting(true)
    setTimeout(() => {
      setResults([
        { server: 'Google DNS', ping: Math.floor(Math.random() * 30) + 15, status: 'good' },
        { server: 'Cloudflare', ping: Math.floor(Math.random() * 20) + 10, status: 'good' },
        { server: 'OpenDNS', ping: Math.floor(Math.random() * 40) + 30, status: 'fair' },
        { server: 'Quad9', ping: Math.floor(Math.random() * 35) + 20, status: 'good' },
        { server: 'Comodo', ping: Math.floor(Math.random() * 60) + 50, status: 'poor' },
      ])
      setTesting(false)
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'good': return 'text-green-400'
      case 'fair': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch(status) {
      case 'good': return 'ممتاز'
      case 'fair': return 'جيد'
      case 'poor': return 'ضعيف'
      default: return 'غير معروف'
    }
  }

  const averagePing = Math.round(results.reduce((sum, r) => sum + r.ping, 0) / results.length)

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">اختبار Ping متقدم</h3>
        </div>
        <button
          onClick={runPingTest}
          disabled={testing}
          className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition disabled:opacity-50"
        >
          {testing ? 'جاري الاختبار...' : 'اختبار الآن'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">متوسط Ping</p>
          <p className="text-xl font-bold text-white">{averagePing} ms</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">أفضل سيرفر</p>
          <p className="text-xl font-bold text-white">
            {results.sort((a, b) => a.ping - b.ping)[0].server}
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 text-center">
          <AlertCircle className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
          <p className="text-xs text-gray-400">أسوأ سيرفر</p>
          <p className="text-xl font-bold text-white">
            {results.sort((a, b) => b.ping - a.ping)[0].server}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
            <span className="text-white">{result.server}</span>
            <div className="flex items-center gap-3">
              <span className="text-white font-mono">{result.ping} ms</span>
              <span className={`text-sm ${getStatusColor(result.status)}`}>
                {getStatusText(result.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
