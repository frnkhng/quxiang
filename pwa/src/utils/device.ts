export interface DeviceInfo {
  os: 'ios' | 'android' | 'desktop'
  browser: 'safari' | 'chrome' | 'firefox' | 'other'
  isInAppBrowser: boolean
  inAppName: 'line' | 'wechat' | 'facebook' | 'instagram' | 'other' | null
  isStandalone: boolean
  canInstall: boolean
}

export function detectDevice(): DeviceInfo {
  const ua = navigator.userAgent
  const platform = navigator.platform || ''
  
  // Check for in-app browsers
  const isLineApp = /Line/i.test(ua)
  const isWeChatApp = /MicroMessenger/i.test(ua)
  const isFacebookApp = /FBAN|FBAV/i.test(ua)
  const isInstagramApp = /Instagram/i.test(ua)
  const isInAppBrowser = isLineApp || isWeChatApp || isFacebookApp || isInstagramApp
  
  let inAppName: DeviceInfo['inAppName'] = null
  if (isLineApp) inAppName = 'line'
  else if (isWeChatApp) inAppName = 'wechat'
  else if (isFacebookApp) inAppName = 'facebook'
  else if (isInstagramApp) inAppName = 'instagram'
  else if (isInAppBrowser) inAppName = 'other'
  
  // Platform detection
  const isIOS = /iPhone|iPad|iPod/.test(ua) || 
                (/Mac/.test(platform) && 'ontouchend' in document)
  const isAndroid = /Android/.test(ua)
  
  // Browser detection
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua)
  const isChrome = /Chrome/.test(ua) || /CriOS/.test(ua)
  const isFirefox = /Firefox/.test(ua)
  
  let browser: DeviceInfo['browser'] = 'other'
  if (isSafari) browser = 'safari'
  else if (isChrome) browser = 'chrome'
  else if (isFirefox) browser = 'firefox'
  
  // Check if already in standalone mode (PWA installed)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true
  
  // Determine OS
  let os: DeviceInfo['os'] = 'desktop'
  if (isIOS) os = 'ios'
  else if (isAndroid) os = 'android'
  
  // Check if can install (Android Chrome supports beforeinstallprompt)
  const canInstall = isAndroid && isChrome && !isInAppBrowser
  
  return {
    os,
    browser,
    isInAppBrowser,
    inAppName,
    isStandalone,
    canInstall
  }
}

export function saveReferralData(storeId: string, source: string = 'qr_scan') {
  try {
    localStorage.setItem('ref_source', source)
    localStorage.setItem('ref_store', storeId)
    localStorage.setItem('scan_timestamp', Date.now().toString())
  } catch (e) {
    console.error('Failed to save referral data:', e)
  }
}

export function getReferralData() {
  try {
    return {
      source: localStorage.getItem('ref_source'),
      storeId: localStorage.getItem('ref_store'),
      timestamp: localStorage.getItem('scan_timestamp')
    }
  } catch (e) {
    return { source: null, storeId: null, timestamp: null }
  }
}

export function isFirstLaunch(): boolean {
  try {
    const launched = localStorage.getItem('app_launched')
    if (!launched) {
      localStorage.setItem('app_launched', 'true')
      return true
    }
    return false
  } catch (e) {
    return false
  }
}
