export default function Navigation() {
  return (
    <nav className="bg-gray-900 text-white p-3">
      <div className="container mx-auto flex justify-between">
        <a href="/" className="hover:text-purple-300">الرئيسية</a>
        <a href="/speed-test" className="hover:text-purple-300">اختبار السرعة</a>
        <a href="/optimize" className="hover:text-purple-300">تحسين الأداء</a>
      </div>
    </nav>
  );
}
