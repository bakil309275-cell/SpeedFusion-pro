'use client'

import { useState, useEffect } from 'react'
import { Activity, Clock, TrendingUp, Download, Upload } from 'lucide-react'
import { useSpeedHistory } from '@/lib/hooks/useSpeedHistory'

export default function StatsPage() {
  const { history, clearHistory } = useSpeedHistory()
  const [totalTests, setTotalTests] = useState(0)
  const [avgSpeed, setAvgSpeed] = useState(0)

  useEffect(() => {
    setTotalTests(history.length)
    if (history.length > 0) {
      const avg = history.reduce((sum, item) => sum + item.download, 0) / history.length
      setAvgSpeed(Math.round(avg * 10) / 10)
    }
  }, [history])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        الإحصائيات المتقدمة
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
          <Activity className="w-8 h-8 mb-3" />
          <p className="text-sm opacity-90">إجمالي الاختبارات</p>
          <p className="text-3xl font-bold">{totalTests}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl p-6 text-white">
          <TrendingUp className="w-8 h-8 mb-3" />
          <p className="text-sm opacity-90">متوسط السرعة</p>
          <p className="text-3xl font-bold">{avgSpeed} Mbps</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 text-white">
          <Clock className="w-8 h-8 mb-3" />
          <p className="text-sm opacity-90">آخر اختبار</p>
          <p className="text-3xl font-bold">
            {history.length > 0 
              ? new Date(history[0].timestamp).toLocaleTimeString('ar-EG')
              : '--:--'
            }
          </p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">سجل السرعة</h2>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition"
            >
              مسح السجل
            </button>
          )}
        </div>
        
        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {new Date(item.timestamp).toLocaleDateString('ar-EG')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleTimeString('ar-EG')}
                  </p>
                </div>
                <div className="flex gap-4">
                  <span className="text-blue-400 flex items-center gap-1">
                    <Download className="w-4 h-4" /> {item.download}
                  </span>
                  <span className="text-green-400 flex items-center gap-1">
                    <Upload className="w-4 h-4" /> {item.upload}
                  </span>
                  <span className="text-yellow-400 flex items-center gap-1">
                    <Activity className="w-4 h-4" /> {item.ping}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            لا يوجد سجل بعد. قم بإجراء اختبار سرعة أولاً
          </p>
        )}
      </div>
    </div>
  )
}
