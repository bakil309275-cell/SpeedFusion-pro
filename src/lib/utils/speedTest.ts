export async function runSpeedTest() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        download: Math.floor(Math.random() * 100) + 20,
        ping: Math.floor(Math.random() * 50) + 10
      });
    }, 1500);
  });
}
