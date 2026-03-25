import { useState } from 'react';
import { Rocket, CheckCircle2, BarChart3 } from 'lucide-react';
import { optimizeSystem } from '@/lib/optimizer';

export default function OptimizeButton() {
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState<any>(null);

  const handleStart = async () => {
    setStatus('scanning');
    const result = await optimizeSystem(setProgress);
    setReport(result);
    setStatus('done');
  };

  return (
    <div className='flex flex-col items-center gap-8'>
      {status === 'idle' && (
        <button onClick={handleStart} className='group relative p-1'>
          <div className='absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity'></div>
          <div className='relative bg-blue-600 hover:bg-blue-500 px-12 py-6 rounded-[32px] font-black text-xl flex items-center gap-4 transition-all active:scale-95 shadow-2xl'>
            <Rocket className='group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform' />
            ابدأ الفحص الشامل
          </div>
        </button>
      )}

      {status === 'scanning' && (
        <div className='w-full max-w-md space-y-4'>
          <div className='flex justify-between text-sm font-bold'><span className='text-blue-400'>جاري تحسين النظام...</span><span>{progress}%</span></div>
          <div className='h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10'>
            <div style={{ width: progress + '%' }} className='h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]'></div>
          </div>
        </div>
      )}

      {status === 'done' && report && (
        <div className='glass p-8 rounded-[40px] border-emerald-500/20 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-2xl'>
          <div className='flex items-center gap-4 mb-6'>
            <div className='bg-emerald-500/20 p-3 rounded-2xl'><CheckCircle2 className='text-emerald-400' size={32} /></div>
            <div className='text-right'>
              <h2 className='text-2xl font-bold'>اكتملت المهمة بنجاح!</h2>
              <p className='text-slate-400 text-sm'>تم تحسين استقرار النظام وتوفير مساحة إضافية</p>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='glass bg-white/5 p-6 rounded-3xl text-right'>
              <p className='text-slate-500 text-xs mb-1'>المساحة المحررة</p>
              <p className='text-2xl font-black text-blue-400'>{report.freedSpace}</p>
            </div>
            <div className='glass bg-white/5 p-6 rounded-3xl text-right'>
              <p className='text-slate-500 text-xs mb-1'>تعزيز الأداء</p>
              <p className='text-2xl font-black text-emerald-400'>+{report.speedBoost}</p>
            </div>
          </div>
          <button onClick={() => setStatus('idle')} className='mt-8 text-slate-500 hover:text-white text-sm transition font-medium'>إغلاق التقرير والعودة</button>
        </div>
      )}
    </div>
  );
}
