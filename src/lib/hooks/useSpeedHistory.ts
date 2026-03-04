import { useState, useEffect } from 'react'
import { SpeedTestResult } from '@/lib/utils/speedTest'

export function useSpeedHistory() {
  const [history, setHistory] = useState<SpeedTestResult[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('speedHistory')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const addResult = (result: SpeedTestResult) => {
    const newHistory = [result, ...history].slice(0, 20) // احتفظ بآخر 20 نتيجة
    setHistory(newHistory)
    localStorage.setItem('speedHistory', JSON.stringify(newHistory))
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('speedHistory')
  }

  return { history, addResult, clearHistory }
}
