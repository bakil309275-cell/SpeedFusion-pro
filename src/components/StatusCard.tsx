import { LucideIcon } from 'lucide-react';
export default function StatusCard({ title, value, unit, icon: Icon, colorClass }: any) {
  return (
    <div className='glass p-6 rounded-[32px] relative group hover:neon-blue transition-all duration-500 overflow-hidden'>
      <div className={bsolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 }></div>
      <div className='flex justify-between items-start relative z-10'>
        <div>
          <p className='text-slate-500 text-sm font-medium mb-1'>{title}</p>
          <h3 className='text-3xl font-bold tracking-tight'>
            <span className='animate-pulse'>{value}</span>
            <span className='text-lg ml-1 text-slate-400 font-normal'>{unit}</span>
          </h3>
        </div>
        <div className={p-3 rounded-2xl bg-white/5 }><Icon size={24} /></div>
      </div>
    </div>
  ); }
