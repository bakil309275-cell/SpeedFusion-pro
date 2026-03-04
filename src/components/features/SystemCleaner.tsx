'use client'

import { useState } from 'react'
import { Trash2, HardDrive, Database, RefreshCw, CheckCircle } from 'lucide-react'

export default function SystemCleaner() {
  const [cleaning, setCleaning] = useState(false)
  const [cleaned, setCleaned] = useState(false)
  const [stats, setStats] = useState({
    cache: '156 MB',
    cookies: '2.3 MB',
    temp: '89 MB',
    total: '247.3 MB'
  })

  const cleanSystem = () => {
    setCleaning(true)
    setTimeout(() => {
      setCleaned(true)
      setCleaning(false)
      setStats({
        cache: '0 MB',
        cookies: '0 MB',
        temp: '0 MB',
        total: '0 MB'
      })
      setTimeout(() => setCleaned(false), 3000)
    }, 2000)
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-6">
        <HardDrive className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">منظف النظام</h3>
      </div>

      <div className="bg-gray-900/50 rounded-xl p-4 space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-400">ذاكرة التخزين المؤقت</span>
          <span className="text-white">{stats.cache}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">الملفات المؤقتة</span>
          <span className="text-white">{stats.temp}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">الكوكيز</span>
          <span className="text-white">{stats.cookies}</span>
        </div>
        <div className="border-t border-gray-700 pt-3 mt-3">
          <div className="flex justify-between font-bold">
            <span className="text-gray-300">الإجمالي</span>
            <span className="text-blue-400">{stats.total}</span>
          </div>
        </div>
      </div>

      <button
        onClick={cleanSystem}
        disabled={cleaning || cleaned}
        className={`
          w-full py-4 rounded-xl font-bold transition-all
          flex items-center justify-center gap-2
          ${cleaned 
            ? 'bg-green-600 text-white' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
          }
          disabled:opacity-50
        `}
      >
        {cleaning ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            جاري التنظيف...
          </>
        ) : cleaned ? (
          <>
            <CheckCircle className="w-5 h-5" />
            تم التنظيف بنجاح
          </>
        ) : (
          <>
            <Trash2 className="w-5 h-5" />
            تنظيف النظام
          </>
        )}
      </button>
    </div>
  )
}
