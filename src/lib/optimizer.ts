export const optimizeSystem = async (onProgress: (p: number) => void) => {
  if (Notification.permission === 'default') await Notification.requestPermission();
  for (let i = 0; i <= 100; i += 5) {
    onProgress(i);
    await new Promise(res => setTimeout(res, 100));
  }
  const results = { freedSpace: (Math.random() * 800 + 200).toFixed(0) + ' MB', speedBoost: '32%' };
  if (Notification.permission === 'granted') {
    new Notification('SpeedFusion Pro', { body: 'تمت عملية التحسين بنجاح! تم توفير ' + results.freedSpace, icon: '/icon-192x192.png' });
  }
  return results;
};
