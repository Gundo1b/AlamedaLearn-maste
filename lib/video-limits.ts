"use client"

export interface UserVideoData {
  playsRemaining: number
  totalPlays: number
  lastReset: string
  isSubscribed: boolean
  subscriptionExpiry?: string
}

export const FREE_VIDEO_LIMIT = 10

export function getUserVideoData(): UserVideoData {
  if (typeof window === "undefined") {
    return {
      playsRemaining: FREE_VIDEO_LIMIT,
      totalPlays: 0,
      lastReset: new Date().toISOString(),
      isSubscribed: false,
    }
  }

  const stored = localStorage.getItem("alameda_video_data")
  if (!stored) {
    const defaultData: UserVideoData = {
      playsRemaining: FREE_VIDEO_LIMIT,
      totalPlays: 0,
      lastReset: new Date().toISOString(),
      isSubscribed: false,
    }
    localStorage.setItem("alameda_video_data", JSON.stringify(defaultData))
    return defaultData
  }

  return JSON.parse(stored)
}

export function updateVideoData(data: Partial<UserVideoData>): UserVideoData {
  const current = getUserVideoData()
  const updated = { ...current, ...data }
  localStorage.setItem("alameda_video_data", JSON.stringify(updated))
  return updated
}

export function consumeVideoPlay(): { success: boolean; playsRemaining: number; isSubscribed: boolean } {
  const data = getUserVideoData()

  if (data.isSubscribed) {
    return { success: true, playsRemaining: -1, isSubscribed: true }
  }

  if (data.playsRemaining <= 0) {
    return { success: false, playsRemaining: 0, isSubscribed: false }
  }

  const updated = updateVideoData({
    playsRemaining: data.playsRemaining - 1,
    totalPlays: data.totalPlays + 1,
  })

  return { success: true, playsRemaining: updated.playsRemaining, isSubscribed: false }
}

export function resetVideoPlays(): UserVideoData {
  return updateVideoData({
    playsRemaining: FREE_VIDEO_LIMIT,
    totalPlays: 0,
    lastReset: new Date().toISOString(),
  })
}

export { getUserVideoData as getVideoData }
