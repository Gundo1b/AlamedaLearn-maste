"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertCircle,
  Upload,
  Video,
  Play,
  Edit,
  Trash2,
  Eye,
  Search,
  Clock,
  Users,
  BarChart3,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface VideoData {
  id: string
  title: string
  description: string
  duration: string
  thumbnail: string
  status: "processing" | "ready" | "failed"
  views: number
  uploadDate: string
  subject: string
  grade: string
  topic: string
  fileSize: string
}

export default function VideoUploadDashboard() {
  const [user] = useState({ role: "admin" })
  const [videos, setVideos] = useState<VideoData[]>([
    {
      id: "1",
      title: "Introduction to Algebra",
      description: "Basic algebraic concepts and operations",
      duration: "15:30",
      thumbnail: "/placeholder.svg?height=120&width=200",
      status: "ready",
      views: 1250,
      uploadDate: "2024-01-15",
      subject: "Mathematics",
      grade: "Grade 10",
      topic: "Algebraic Expressions",
      fileSize: "245 MB",
    },
    {
      id: "2",
      title: "Chemical Bonding Basics",
      description: "Understanding ionic and covalent bonds",
      duration: "22:45",
      thumbnail: "/placeholder.svg?height=120&width=200",
      status: "processing",
      views: 0,
      uploadDate: "2024-01-20",
      subject: "Physical Sciences",
      grade: "Grade 11",
      topic: "Chemical Bonding",
      fileSize: "380 MB",
    },
    {
      id: "3",
      title: "Cell Division Process",
      description: "Mitosis and meiosis explained",
      duration: "18:20",
      thumbnail: "/placeholder.svg?height=120&width=200",
      status: "failed",
      views: 0,
      uploadDate: "2024-01-18",
      subject: "Life Sciences",
      grade: "Grade 12",
      topic: "Cell Division",
      fileSize: "290 MB",
    },
  ])

  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    subject: "",
    grade: "",
    topic: "",
    file: null as File | null,
  })

  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSubject, setFilterSubject] = useState("all")

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadForm.file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          // Add new video to list
          const newVideo: VideoData = {
            id: Date.now().toString(),
            title: uploadForm.title,
            description: uploadForm.description,
            duration: "0:00",
            thumbnail: "/placeholder.svg?height=120&width=200",
            status: "processing",
            views: 0,
            uploadDate: new Date().toISOString().split("T")[0],
            subject: uploadForm.subject,
            grade: uploadForm.grade,
            topic: uploadForm.topic,
            fileSize: `${Math.round(uploadForm.file!.size / (1024 * 1024))} MB`,
          }
          setVideos((prev) => [newVideo, ...prev])
          setUploadForm({ title: "", description: "", subject: "", grade: "", topic: "", file: null })
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadForm({ ...uploadForm, file })
    }
  }

  const handleDeleteVideo = (id: string) => {
    if (confirm("Are you sure you want to delete this video?")) {
      setVideos((prev) => prev.filter((video) => video.id !== id))
    }
  }

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || video.status === filterStatus
    const matchesSubject = filterSubject === "all" || video.subject === filterSubject
    return matchesSearch && matchesStatus && matchesSubject
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "processing":
        return <Loader className="h-4 w-4 text-yellow-500 animate-spin" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>
      case "processing":
        return <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return null
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Access denied. Admin privileges required.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Video Upload Dashboard</h1>
          <p className="text-muted-foreground">Manage and upload educational videos</p>
        </div>
        <Badge variant="destructive" className="flex items-center gap-1">
          <Video className="h-3 w-3" />
          Admin Dashboard
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-teal-500" />
              <div>
                <p className="text-2xl font-bold">{videos.length}</p>
                <p className="text-sm text-muted-foreground">Total Videos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{videos.filter((v) => v.status === "ready").length}</p>
                <p className="text-sm text-muted-foreground">Ready</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Loader className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{videos.filter((v) => v.status === "processing").length}</p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{videos.reduce((sum, v) => sum + v.views, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Video</TabsTrigger>
          <TabsTrigger value="manage">Manage Videos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload New Video
              </CardTitle>
              <CardDescription>Upload educational videos for students</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Video Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter video title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={uploadForm.subject}
                      onValueChange={(value) => setUploadForm({ ...uploadForm, subject: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Physical Sciences">Physical Sciences</SelectItem>
                        <SelectItem value="Life Sciences">Life Sciences</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select
                      value={uploadForm.grade}
                      onValueChange={(value) => setUploadForm({ ...uploadForm, grade: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grade 10">Grade 10</SelectItem>
                        <SelectItem value="Grade 11">Grade 11</SelectItem>
                        <SelectItem value="Grade 12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      placeholder="Enter topic"
                      value={uploadForm.topic}
                      onChange={(e) => setUploadForm({ ...uploadForm, topic: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter video description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="video-file">Video File</Label>
                  <Input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    required
                  />
                  {uploadForm.file && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {uploadForm.file.name} ({Math.round(uploadForm.file.size / (1024 * 1024))} MB)
                    </p>
                  )}
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Uploading...</span>
                      <span className="text-sm font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <Button type="submit" disabled={isUploading} className="w-full">
                  {isUploading ? "Uploading..." : "Upload Video"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Tab */}
        <TabsContent value="manage" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search videos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Physical Sciences">Physical Sciences</SelectItem>
                    <SelectItem value="Life Sciences">Life Sciences</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Videos List */}
          <div className="grid gap-4">
            {filteredVideos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-8 w-8 text-white bg-black/50 rounded-full p-1" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{video.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{video.description}</p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline">{video.subject}</Badge>
                            <Badge variant="outline">{video.grade}</Badge>
                            <Badge variant="outline">{video.topic}</Badge>
                            {getStatusBadge(video.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {video.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {video.uploadDate}
                            </span>
                            <span>{video.fileSize}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusIcon(video.status)}
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteVideo(video.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Upload Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Videos this month</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total storage used</span>
                    <span className="font-semibold">2.4 GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average video length</span>
                    <span className="font-semibold">18:45</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total views</span>
                    <span className="font-semibold">{videos.reduce((sum, v) => sum + v.views, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average views per video</span>
                    <span className="font-semibold">
                      {Math.round(videos.reduce((sum, v) => sum + v.views, 0) / videos.length)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Most popular subject</span>
                    <span className="font-semibold">Mathematics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
