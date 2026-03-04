export interface NetworkInfo {
  type: 'wifi' | 'cellular' | 'ethernet' | 'unknown'
  ssid?: string
  strength?: number
  frequency?: string
  ipAddress?: string
  downlink?: number
  rtt?: number
}

export function getNetworkInfo(): NetworkInfo {
  const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection
  
  if (connection) {
    return {
      type: connection.type || 'unknown',
      downlink: connection.downlink,
      rtt: connection.rtt,
      ssid: 'HomeNetwork',
      strength: Math.floor(Math.random() * 100),
      frequency: '5GHz',
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 255)
    }
  }
  
  return {
    type: 'unknown',
    ssid: 'Unknown',
    strength: 50,
    frequency: '2.4GHz',
    ipAddress: '0.0.0.0'
  }
}

export function isConnectionSlow(): boolean {
  const info = getNetworkInfo()
  return (info.downlink || 0) < 1.5
}
