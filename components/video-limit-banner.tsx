"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Play, Crown } from "lucide-react"
import { getUserVideoData } from "@/lib/video-limits"
import SubscriptionModal from "./subscription-modal"

export default function VideoLimitBanner() {
  const [videoData, setVideoData] = useState(getUserVideoData())
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)

  useEffect(() => {
    const data = getUserVideoData()
    setVideoData(data)
  }, [])

  if (videoData.isSubscribed) {
    return (
      <Alert className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <Crown className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-yellow-800 font-medium">Premium Member - Unlimited Access</span>
        </AlertDescription>
      </Alert>
    )
  }

  if (videoData.playsRemaining === 0) {
    return (
      <>
        <Alert className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <Play className="h-4 w-4 text-red-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-red-800">No free videos left. Subscribe for unlimited access!</span>
            <Button
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={() => setShowSubscriptionModal(true)}
            >
              Subscribe
            </Button>
          </AlertDescription>
        </Alert>

        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          playsRemaining={videoData.playsRemaining}
          onSubscriptionSuccess={() => {
            setVideoData(getUserVideoData())
          }}
        />
      </>
    )
  }

  return (
    <>
      <Alert className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
        <Play className="h-4 w-4 text-blue-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-blue-800">
            {videoData.playsRemaining} free video{videoData.playsRemaining !== 1 ? "s" : ""} remaining
          </span>
          <Button
            size="sm"
            variant="outline"
            className="border-teal-200 text-teal-700 hover:bg-teal-50"
            onClick={() => setShowSubscriptionModal(true)}
          >
            Upgrade
          </Button>
        </AlertDescription>
      </Alert>

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        playsRemaining={videoData.playsRemaining}
        onSubscriptionSuccess={() => {
          setVideoData(getUserVideoData())
        }}
      />
    </>
  )
}
