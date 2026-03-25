import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();
  
  // تحميل ملف 10MB لقياس السرعة الحقيقية
  const response = await fetch('https://speed.hetzner.de/10MB.bin');
  const data = await response.arrayBuffer();
  
  const endTime = Date.now();
  const durationSeconds = (endTime - startTime) / 1000;
  const megabytes = data.byteLength / (1024 * 1024);
  const megabits = megabytes * 8;
  const downloadSpeed = parseFloat((megabits / durationSeconds).toFixed(2));
  
  // قياس Ping
  const pingStart = Date.now();
  await fetch('https://www.google.com');
  const ping = Date.now() - pingStart;
  
  return NextResponse.json({
    download: downloadSpeed,
    ping: ping,
    timestamp: Date.now(),
    real: true
  });
}
