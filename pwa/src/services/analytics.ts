import apiClient from './api/client'
import type { DeviceInfo } from '@/utils/device'

export interface AnalyticsEvent {
  event: string
  data?: Record<string, any>
  timestamp?: Date
}

class AnalyticsService {
  private queue: AnalyticsEvent[] = []
  private isOnline = navigator.onLine

  constructor() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.flushQueue()
    })
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  async track(event: string, data?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      data,
      timestamp: new Date()
    }

    if (this.isOnline) {
      try {
        await this.send(analyticsEvent)
      } catch (error) {
        this.queue.push(analyticsEvent)
      }
    } else {
      this.queue.push(analyticsEvent)
    }
  }

  private async send(event: AnalyticsEvent) {
    try {
      await apiClient.post('/analytics/track', event)
    } catch (error) {
      console.error('Analytics tracking failed:', error)
      throw error
    }
  }

  private async flushQueue() {
    while (this.queue.length > 0 && this.isOnline) {
      const event = this.queue.shift()
      if (event) {
        try {
          await this.send(event)
        } catch (error) {
          this.queue.unshift(event)
          break
        }
      }
    }
  }

  trackQRScan(storeId: string, device: DeviceInfo) {
    this.track('qr_scanned', {
      storeId,
      os: device.os,
      browser: device.browser,
      isInAppBrowser: device.isInAppBrowser,
      inAppName: device.inAppName
    })
  }

  trackInstallPageView(os: string, browser: string) {
    this.track('install_page_viewed', { os, browser })
  }

  trackInstallPromptShown(os: string) {
    this.track('install_prompt_shown', { os })
  }

  trackInstallAccepted(os: string) {
    this.track('install_accepted', { os })
  }

  trackInstallCompleted(os: string, duration?: number) {
    this.track('install_completed', { os, duration })
  }

  trackFirstLaunch(source: string, device: DeviceInfo) {
    this.track('first_launch', {
      source,
      os: device.os,
      browser: device.browser
    })
  }

  trackLoginCompleted(role: string, method: string) {
    this.track('login_completed', { role, method })
  }
}

export const analytics = new AnalyticsService()
