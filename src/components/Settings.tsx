import { X } from 'lucide-react';
export default function Settings({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm'>
      <div className='glass w-full max-w-md p-6 rounded-[32px] animate-in fade-in zoom-in duration-200'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold'>إعدادات الفحص</h2>
          <button onClick={onClose} className='p-2 hover:bg-white/10 rounded-full transition'><X size={20} /></button>
        </div>
        <div className='space-y-4'>
          {['تنظيف الذاكرة المؤقتة', 'تحسين سجل النظام', 'إيقاف تطبيقات الخلفية', 'تحسين استهلاك البطارية'].map((task) => (
            <label key={task} className='flex items-center justify-between p-4 glass rounded-2xl cursor-pointer hover:bg-white/5'>
              <span>{task}</span>
              <input type='checkbox' defaultChecked className='w-5 h-5 accent-blue-500' />
            </label>
          ))}
        </div>
        <button onClick={onClose} className='w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold transition'>حفظ التفضيلات</button>
      </div>
    </div>
  ); }
