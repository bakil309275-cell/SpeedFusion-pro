export interface SpeedTestResult {
  download: number
  upload: number
  ping: number
  timestamp: number
}

export async function runSpeedTest(): Promise<SpeedTestResult> {
  // محاكاة اختبار السرعة
  const startTime = performance.now()
  
  // محاكاة تحميل بيانات
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const endTime = performance.now()
  const ping = Math.round(endTime - startTime)
  
  return {
    download: Math.floor(Math.random() * 90) + 10, // 10-100 Mbps
    upload: Math.floor(Math.random() * 40) + 5,    // 5-45 Mbps
    ping: Math.floor(Math.random() * 40) + 10,     // 10-50 ms
    timestamp: Date.now()
  }
}

export function getSpeedQuality(speed: number): 'weak' | 'good' | 'excellent' {
  if (speed < 15) return 'weak'
  if (speed < 40) return 'good'
  return 'excellent'
}
