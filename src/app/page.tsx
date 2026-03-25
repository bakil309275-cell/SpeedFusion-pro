import BatteryPanel from '@/components/BatteryPanel';
import { useState } from 'react';
import StatusCard from '@/components/StatusCard';
import OptimizeButton from '@/components/OptimizeButton';
import Settings from '@/components/Settings';
import { Rocket, Wifi, Database, Activity, Settings as SettingsIcon } from 'lucide-react';

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <main className='min-h-screen bg-[#020617] text-white p-6 md:p-12 relative overflow-hidden'>
      <div className='absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full'></div>
      <div className='max-w-5xl mx-auto flex justify-between items-center mb-16 relative z-10'>
        <div>
          <h1 className='text-5xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent'>SpeedFusion Pro</h1>
          <p className='text-slate-500 font-medium mt-2'>الجيل القادم من أدوات تحسين الأداء</p>
        </div>
        <button onClick={() => setIsSettingsOpen(true)} className='p-4 glass rounded-2xl hover:neon-blue transition-all duration-300'>
          <SettingsIcon size={24} className='text-blue-400' />
        </button>
      </div>
      <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10'>
        <StatusCard title='الإنترنت' value='95' unit='Mbps' icon={Wifi} colorClass='text-emerald-400' />
        <StatusCard title='الذاكرة' value='1.2' unit='GB' icon={Database} colorClass='text-blue-400' />
        <StatusCard title='النظام' value='98' unit='%' icon={Activity} colorClass='text-purple-400' />
      </div>
      <div className='max-w-5xl mx-auto mt-20 text-center relative z-10'>
        <div className='glass p-16 rounded-[48px] border-white/5 shadow-2xl'>
          <OptimizeButton />
          <BatteryPanel />
        </div>
      </div>
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </main>
  ); }

