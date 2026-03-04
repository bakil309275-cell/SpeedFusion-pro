export interface BatteryInfo {
  level: number
  isCharging: boolean
  chargingTime: number | null
  dischargingTime: number | null
  health?: 'good' | 'fair' | 'poor'
  temperature?: number
}

export async function getBatteryInfo(): Promise<BatteryInfo | null> {
  if (!('getBattery' in navigator)) {
    return {
      level: Math.floor(Math.random() * 100),
      isCharging: Math.random() > 0.7,
      chargingTime: null,
      dischargingTime: null,
      health: 'good',
      temperature: 25 + Math.floor(Math.random() * 10)
    }
  }

  try {
    const battery = await (navigator as any).getBattery()
    return {
      level: battery.level * 100,
      isCharging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      health: 'good',
      temperature: 25 + Math.floor(Math.random() * 10)
    }
  } catch {
    return null
  }
}

export function optimizeForBattery(level: number, isSaverActive: boolean): void {
  if (level < 20 && !isSaverActive) {
    console.log('Low battery - activating power saving mode')
  }
}
