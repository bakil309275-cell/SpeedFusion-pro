export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration)
          
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  showUpdateNotification()
                }
              })
            }
          })
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error)
        })
    })
  }
}

function showUpdateNotification() {
  if (confirm('تحديث جديد متاح. هل تريد تحديث التطبيق الآن؟')) {
    window.location.reload()
  }
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister()
      })
      .catch(error => {
        console.error('Service Worker unregistration failed:', error)
      })
  }
}
