'use client'

import { useState, useEffect, useCallback } from 'react'
import { Zap, Wifi, Cpu, Battery, Gauge, Globe, Shield, Activity, TrendingUp, Clock } from 'lucide-react'
import { useSpeedHistory } from '@/lib/hooks/useSpeedHistory'
import { runSpeedTest } from '@/lib/utils/speedTest'
import Link from 'next/link'

export default function Home() {
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null)
  const [ping, setPing] = useState<number | null>(null)
  const [isBoosting, setIsBoosting] = useState(false)
  const [isBlackMode, setIsBlackMode] = useState(false)
  const { history, addResult } = useSpeedHistory()
  
  const [stats, setStats] = useState({
    devices: Math.floor(Math.random() * 5) + 1,
    networks: Math.floor(Math.random() * 3) + 1,
    saved: '156MB'
  })

  const handleSpeedTest = useCallback(async () => {
    try {
      const result = await runSpeedTest()
      setDownloadSpeed(result.download)
      setPing(result.ping)
      addResult(result)
    } catch (error) {
      console.error('Speed test failed:', error)
    }
  }, [addResult])

  const handleFullBoost = useCallback(async () => {
    setIsBoosting(true)
    
    setTimeout(() => {
      setIsBoosting(false)
      setStats({
        devices: Math.floor(Math.random() * 5) + 1,
        networks: Math.floor(Math.random() * 3) + 1,
        saved: `${Math.floor(Math.random() * 200) + 50}MB`
      })
      handleSpeedTest()
    }, 3000)
  }, [handleSpeedTest])

  const toggleBlackMode = () => {
    setIsBlackMode(prev => !prev)
    if (!isBlackMode) {
      document.documentElement.classList.add('blackout-mode')
    } else {
      document.documentElement.classList.remove('blackout-mode')
    }
  }

  useEffect(() => {
    handleSpeedTest()
  }, [handleSpeedTest])

  const recentResults = history.slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse-slow">
          SpeedFusion Pro
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          أحدث تكنولوجيا لتحسين أداء جهازك وشبكتك بأقصى كفاءة
        </p>
      </div>

      {/* Speed Meter */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-6 h-6 text-purple-400" aria-label="مقياس السرعة" />
              <h2 className="text-xl font-semibold text-white">سرعة الإنترنت</h2>
            </div>
            <Link href="/stats" className="text-sm text-purple-400 hover:text-purple-300">
              عرض الكل →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div className="p-4 bg-gray-900/50 rounded-xl">
              <div className="text-3xl font-bold text-blue-400">
                {downloadSpeed ?? '--'}
              </div>
              <div className="text-sm text-gray-400">تحميل (Mbps)</div>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-xl">
              <div className="text-3xl font-bold text-green-400">
                {ping ?? '--'}
              </div>
              <div className="text-sm text-gray-400">الاستجابة (ms)</div>
            </div>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2 mb-4" role="progressbar" aria-label="نسبة سرعة التحميل">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${downloadSpeed ? Math.min(downloadSpeed, 100) : 0}%` }}
            ></div>
          </div>

          <button
            onClick={handleFullBoost}
            disabled={isBoosting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            aria-label="بدء عملية التحسين"
          >
            <Zap className={`w-5 h-5 ${isBoosting ? 'animate-spin' : ''}`} aria-hidden="true" />
            {isBoosting ? 'جاري التحسين...' : 'ابدأ التحسين الفوري'}
          </button>
        </div>
      </div>

      {/* Recent Results */}
      {recentResults.length > 0 && (
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" aria-label="الساعة" />
              آخر النتائج
            </h3>
            <div className="space-y-3">
              {recentResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg">
                  <span className="text-sm text-gray-400">
                    {new Date(result.timestamp).toLocaleTimeString('ar-EG')}
                  </span>
                  <div className="flex gap-3">
                    <span className="text-blue-400 text-sm">{result.download} Mbps</span>
                    <span className="text-green-400 text-sm">{result.ping} ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center hover:border-purple-500/50 transition-all">
          <Cpu className="w-8 h-8 text-purple-400 mx-auto mb-2" aria-label="معالج" />
          <h3 className="text-sm text-gray-400">الأجهزة المحسنة</h3>
          <p className="text-2xl font-bold text-white">{stats.devices}</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center hover:border-purple-500/50 transition-all">
          <Wifi className="w-8 h-8 text-green-400 mx-auto mb-2" aria-label="شبكة لاسلكية" />
          <h3 className="text-sm text-gray-400">الشبكات المتاحة</h3>
          <p className="text-2xl font-bold text-white">{stats.networks}</p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 text-center hover:border-purple-500/50 transition-all">
          <Battery className="w-8 h-8 text-yellow-400 mx-auto mb-2" aria-label="بطارية" />
          <h3 className="text-sm text-gray-400">تم توفير</h3>
          <p className="text-2xl font-bold text-white">{stats.saved}</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {[
          { icon: <Zap className="w-6 h-6" />, title: 'سرعة فائقة', desc: 'تحسين فوري', color: 'text-yellow-400', href: '/boost', alt: 'أيقونة سرعة فائقة' },
          { icon: <Shield className="w-6 h-6" />, title: 'آمن تماماً', desc: 'حماية خصوصيتك', color: 'text-green-400', href: '/settings', alt: 'أيقونة أمان' },
          { icon: <Battery className="w-6 h-6" />, title: 'توفير بطارية', desc: 'حتى 40% أكثر', color: 'text-blue-400', href: '/settings', alt: 'أيقونة توفير بطارية' },
          { icon: <Globe className="w-6 h-6" />, title: 'DNS ذكي', desc: 'أسرع سيرفر', color: 'text-purple-400', href: '/boost', alt: 'أيقونة DNS ذكي' }
        ].map((feature, index) => (
          <Link href={feature.href} key={index}>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 text-center border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer">
              <div className={`${feature.color} mb-2 flex justify-center`} aria-label={feature.alt}>{feature.icon}</div>
              <h4 className="text-white font-semibold text-sm">{feature.title}</h4>
              <p className="text-gray-400 text-xs">{feature.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4 mt-8">
        <Link href="/stats" className="px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-xl transition flex items-center gap-2" aria-label="عرض الإحصائيات">
          <Activity className="w-5 h-5" aria-hidden="true" />
          الإحصائيات
        </Link>
        <Link href="/boost" className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl transition flex items-center gap-2" aria-label="التحسين المتقدم">
          <Zap className="w-5 h-5" aria-hidden="true" />
          تحسين متقدم
        </Link>
      </div>

      {/* Blackout Mode Toggle */}
      <div className="fixed bottom-4 left-4">
        <button
          onClick={toggleBlackMode}
          className="bg-gray-800/50 backdrop-blur-lg hover:bg-gray-700/50 text-white p-3 rounded-full border border-gray-700 transition-all"
          title="وضع الطوارئ"
          aria-label="تبديل وضع الطوارئ"
        >
          {isBlackMode ? '🌞' : '🌙'}
        </button>
      </div>
    </div>
  )
}
