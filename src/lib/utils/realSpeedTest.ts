export async function runRealSpeedTest() {
  const ping = await measurePing();
  const download = await measureDownload();
  const upload = await measureUpload();
  
  return { ping, download, upload };
}

async function measurePing(): Promise<number> {
  const start = performance.now();
  await fetch('/api/ping');
  return performance.now() - start;
}

async function measureDownload(): Promise<number> {
  const start = performance.now();
  const response = await fetch('/api/test-file?size=10mb');
  const data = await response.arrayBuffer();
  const duration = (performance.now() - start) / 1000;
  const megabits = (data.byteLength * 8) / (1024 * 1024);
  return parseFloat((megabits / duration).toFixed(2));
}

async function measureUpload(): Promise<number> {
  const payload = new Uint8Array(5 * 1024 * 1024);
  const start = performance.now();
  await fetch('/api/upload', { method: 'POST', body: payload });
  const duration = (performance.now() - start) / 1000;
  const megabits = (payload.length * 8) / (1024 * 1024);
  return parseFloat((megabits / duration).toFixed(2));
}
