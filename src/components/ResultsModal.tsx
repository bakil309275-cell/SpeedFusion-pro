'use client';

interface ResultsProps {
  data: { freedSpace: string; speedBoost: string };
  onClose: () => void;
}

export default function ResultsModal({ data, onClose }: ResultsProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
        <h2 className="text-2xl font-bold text-emerald-400 mb-4">اكتمل التحسين!</h2>
        <div className="space-y-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">مساحة محررة</p>
            <p className="text-2xl font-mono text-white">{data.freedSpace}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl">
            <p className="text-slate-400 text-sm">زيادة الأداء</p>
            <p className="text-2xl font-mono text-white">{data.speedBoost}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-bold transition-colors"
        >
          حسنا
        </button>
      </div>
    </div>
  );
}
