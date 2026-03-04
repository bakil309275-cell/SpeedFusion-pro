'use client'

import { useState, useEffect } from 'react'
import { Battery, BatteryCharging, BatteryWarning, Zap } from 'lucide-react'

export default function BatterySaver() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null)
  const [isCharging, setIsCharging] = useState(false)
  const [isSaverActive, setIsSaverActive] = useState(false)

  useEffect(() => {
    // محاكاة قراءة البطارية
    setBatteryLevel(Math.floor(Math.random() * 100))
    setIsCharging(Math.random() > 0.7)
  }, [])

  const toggleSaver = () => {
    setIsSaverActive(!isSaverActive)
    if (!isSaverActive) {
      document.body.classList.add('battery-saver')
    } else {
      document.body.classList.remove('battery-saver')
    }
  }

  const getBatteryIcon = () => {
    if (isCharging) return <BatteryCharging className="w-6 h-6 text-green-400" />
    if (batteryLevel && batteryLevel < 20) return <BatteryWarning className="w-6 h-6 text-red-400" />
    return <Battery className="w-6 h-6 text-blue-400" />
  }

  const getBatteryColor = () => {
    if (isCharging) return 'text-green-400'
    if (batteryLevel && batteryLevel < 20) return 'text-red-400'
    if (batteryLevel && batteryLevel < 50) return 'text-yellow-400'
    return 'text-blue-400'
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getBatteryIcon()}
          <h3 className="text-lg font-semibold text-white">توفير البطارية</h3>
        </div>
        <button
          onClick={toggleSaver}
          className={`
            relative inline-flex h-8 w-14 items-center rounded-full transition-colors
            ${isSaverActive ? 'bg-purple-600' : 'bg-gray-600'}
          `}
        >
          <span
            className={`
              inline-block h-6 w-6 transform rounded-full bg-white transition-transform
              ${isSaverActive ? 'translate-x-7' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">نسبة البطارية</span>
          <span className={`font-bold ${getBatteryColor()}`}>
            {batteryLevel ?? '--'}%
          </span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`rounded-full h-2 transition-all duration-500 ${
              isCharging ? 'bg-green-500' : batteryLevel && batteryLevel < 20 ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${batteryLevel ?? 0}%` }}
          />
        </div>

        <div className="flex items-center gap-2 mt-4 p-3 bg-purple-500/10 rounded-lg">
          <Zap className="w-4 h-4 text-purple-400" />
          <p className="text-sm text-gray-300">
            {isSaverActive 
              ? 'وضع توفير البطارية نشط - تم تقليل استهلاك الطاقة'
              : 'تفعيل وضع توفير البطارية لزيادة عمر البطارية'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
