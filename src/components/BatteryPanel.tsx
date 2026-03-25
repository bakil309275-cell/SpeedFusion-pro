import { Battery, Zap, ShieldCheck } from 'lucide-react';
export default function BatteryPanel() {
  return (
    <div className='glass p-8 rounded-[40px] mt-8 relative overflow-hidden group'>
      <div className='absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform'>
        <Battery size={120} className='text-emerald-500' />
      </div>
      <div className='relative z-10'>
        <h3 className='text-2xl font-bold mb-6 flex items-center gap-3'>
          <Zap className='text-yellow-400' /> تحليل حالة الطاقة
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-4'>
            <div className='flex justify-between text-sm'><span className='text-slate-400'>صحة البطارية</span><span className='text-emerald-400'>ممتازة (92%)</span></div>
            <div className='w-full bg-white/5 h-2 rounded-full overflow-hidden'><div className='bg-emerald-500 h-full w-[92%] shadow-[0_0_10px_#10b981]'></div></div>
            <div className='flex justify-between text-sm'><span className='text-slate-400'>الوقت المتبقي التقديري</span><span className='text-blue-400'>5 ساعات و 20 دقيقة</span></div>
          </div>
          <div className='glass bg-emerald-500/5 border-emerald-500/10 p-4 rounded-2xl flex items-start gap-4'>
            <ShieldCheck className='text-emerald-400 shrink-0' size={24} />
            <p className='text-sm text-slate-300 leading-relaxed'>نظام الحماية نشط: يتم الآن تحسين استهلاك التطبيقات في الخلفية لإطالة عمر الشحن بنسبة 15%.</p>
          </div>
        </div>
      </div>
    </div>
  ); }
