export interface DNSServer {
  name: string
  primary: string
  secondary: string
  provider: string
  latency?: number
}

export const DNS_SERVERS: DNSServer[] = [
  {
    name: 'Cloudflare',
    primary: '1.1.1.1',
    secondary: '1.0.0.1',
    provider: 'Cloudflare Inc.',
    latency: 10
  },
  {
    name: 'Google',
    primary: '8.8.8.8',
    secondary: '8.8.4.4',
    provider: 'Google LLC',
    latency: 15
  },
  {
    name: 'OpenDNS',
    primary: '208.67.222.222',
    secondary: '208.67.220.220',
    provider: 'Cisco',
    latency: 25
  },
  {
    name: 'Quad9',
    primary: '9.9.9.9',
    secondary: '149.112.112.112',
    provider: 'Quad9',
    latency: 20
  }
]

export async function switchDNS(dnsName: string): Promise<boolean> {
  console.log(`Switching to DNS: ${dnsName}`)
  // محاكاة تبديل DNS
  await new Promise(resolve => setTimeout(resolve, 1000))
  return true
}

export function getFastestDNS(): DNSServer {
  return [...DNS_SERVERS].sort((a, b) => (a.latency || 999) - (b.latency || 999))[0]
}
