import { Gauge } from 'lucide-react'

interface SpeedMeterProps {
  download: number | null
  upload?: number | null
  ping: number | null
}

export default function SpeedMeter({ download, upload, ping }: SpeedMeterProps) {
  const getQualityColor = (speed: number | null) => {
    if (!speed) return 'text-gray-400'
    if (speed < 10) return 'text-red-400'
    if (speed < 30) return 'text-yellow-400'
    return 'text-green-400'
  }

  const getQualityText = (speed: number | null) => {
    if (!speed) return 'غير معروف'
    if (speed < 10) return 'ضعيف'
    if (speed < 30) return 'جيد'
    return 'ممتاز'
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-6 h-6 text-purple-400" />
        <h2 className="text-xl font-semibold text-white">اختبار السرعة</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className={`text-4xl font-bold ${getQualityColor(download)}`}>
            {download ?? '--'}
          </div>
          <div className="text-sm text-gray-400">تحميل (Mbps)</div>
          <div className={`text-xs mt-1 ${getQualityColor(download)}`}>
            {getQualityText(download)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-400">
            {ping ?? '--'}
          </div>
          <div className="text-sm text-gray-400">الاستجابة (ms)</div>
          <div className={`text-xs mt-1 ${ping && ping < 50 ? 'text-green-400' : ping && ping < 100 ? 'text-yellow-400' : 'text-red-400'}`}>
            {ping && ping < 50 ? 'ممتاز' : ping && ping < 100 ? 'جيد' : 'ضعيف'}
          </div>
        </div>
      </div>

      {upload !== undefined && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">رفع</span>
            <span className="text-white font-bold">{upload ?? '--'} Mbps</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${upload ? Math.min(upload, 100) : 0}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}
