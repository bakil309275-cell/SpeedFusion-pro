'use client'

import { useState } from 'react'
import { Zap, CheckCircle, AlertCircle } from 'lucide-react'

interface BoostButtonProps {
  onClick: () => Promise<void> | void
  size?: 'small' | 'medium' | 'large'
}

export default function BoostButton({ onClick, size = 'medium' }: BoostButtonProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)

  const sizeClasses = {
    small: 'py-2 px-4 text-sm',
    medium: 'py-4 px-6 text-base',
    large: 'py-6 px-8 text-lg'
  }

  const handleClick = async () => {
    setLoading(true)
    setSuccess(false)
    setError(false)
    
    try {
      await onClick()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(true)
      setTimeout(() => setError(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        w-full relative overflow-hidden rounded-xl font-bold
        transition-all transform hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${success ? 'bg-green-600' : error ? 'bg-red-600' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'}
      `}
    >
      <span className="flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Zap className="w-5 h-5 animate-spin" />
            جاري التحسين...
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-5 h-5" />
            تم التحسين بنجاح
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-5 h-5" />
            فشل التحسين
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            تحسين الآن
          </>
        )}
      </span>
    </button>
  )
}
