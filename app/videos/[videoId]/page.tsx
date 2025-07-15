"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"

export default function VideoPage({ params }: { params: { videoId: string } }) {
  const [video, setVideo] = useState<any>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideo = async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("id", params.videoId)
        .single()

      if (error || !data) {
        return notFound()
      }

      setVideo(data)

      if (data.url.startsWith("http")) {
        setVideoUrl(data.url)
      } else {
        const { data: publicUrlData } = supabase.storage.from("videos").getPublicUrl(data.url)
        setVideoUrl(publicUrlData.publicUrl)
      }
      setLoading(false)
    }

    fetchVideo()
  }, [params.videoId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!video) {
    return notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <p className="mb-4">{video.description}</p>
      {videoUrl && (
        <video controls src={videoUrl} className="w-full">
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}
