import { getSystemStats, optimizeSystem } from '@/lib/optimizer';
import About from '@/components/About';
import { useState, useEffect } from 'react';

export default function Home() {
  const [stats, setStats] = useState({ ram: '--', cpu: '--', status: 'جاري الفحص...' });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(getSystemStats());
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className='min-h-screen p-4 flex flex-col items-center justify-center'>
      <div className='glass p-8 rounded-[50px] w-full max-w-md text-center'>
        <h1 className='text-4xl font-black mb-2 tracking-tighter'>SPEED<span className='text-blue-500'>FUSION</span></h1>
        <div className='grid grid-cols-2 gap-4 my-8'>
          <div className='p-4 bg-white/5 rounded-3xl'>
            <p className='text-[10px] text-slate-400 uppercase'>RAM Usage</p>
            <p className='text-2xl font-bold text-blue-400'>{stats.ram}</p>
          </div>
          <div className='p-4 bg-white/5 rounded-3xl'>
            <p className='text-[10px] text-slate-400 uppercase'>CPU Temp</p>
            <p className='text-2xl font-bold text-emerald-400'>{stats.cpu}</p>
          </div>
        </div>
        <button className='w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20'>
          تحسين النظام الآن
        </button>
      </div>
      <About />
    </main>
  ); }
