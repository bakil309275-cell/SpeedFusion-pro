import { NextResponse } from 'next/server'

export async function GET() {
  // محاكاة اختبار سرعة أكثر واقعية
  const startTime = Date.now()
  
  // محاكاة تحميل بيانات بحجم 5MB
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const endTime = Date.now()
  const ping = endTime - startTime
  
  // سرعة عشوائية لكن بواقعية أكثر
  const download = Math.floor(Math.random() * (95 - 20) + 20) // 20-95 Mbps
  const upload = Math.floor(download * 0.4) // 40% من سرعة التحميل
  
  return NextResponse.json({
    success: true,
    data: {
      download,
      upload,
      ping,
      timestamp: Date.now(),
      server: 'Nexus Boost Server'
    }
  })
}

export async function POST(request: Request) {
  try {
    const { type } = await request.json()
    
    if (type === 'jitter') {
      // اختبار jitter (تقلبات الشبكة)
      const pings = []
      for (let i = 0; i < 5; i++) {
        const start = Date.now()
        await new Promise(resolve => setTimeout(resolve, 100))
        pings.push(Date.now() - start)
      }
      const avg = pings.reduce((a, b) => a + b, 0) / pings.length
      const jitter = Math.max(...pings) - Math.min(...pings)
      
      return NextResponse.json({
        success: true,
        data: { avg, jitter, pings }
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'تم استلام البيانات'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'خطأ في معالجة الطلب' },
      { status: 400 }
    )
  }
}
