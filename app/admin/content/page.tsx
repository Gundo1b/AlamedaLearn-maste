"use client"

import type React from "react"
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Upload,
  BookOpen,
  Database,
  Download,
  Video,
  Play,
  FileVideo,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function AdminContentPage() {
  const [user] = useState({ role: "admin" }) // Mock user
  const [grades, setGrades] = useState<{ id: string; name: string; description: string }[]>([])
  const [subjects] = useState<{ id: string; name: string; description: string }[]>([])
  const [topics] = useState<{ id: string; name: string; description: string }[]>([])
  const [videos, setVideos] = useState<{ id: string; title: string; topic_id: string }[]>([])
  const [courses, setCourses] = useState<{ id: string; name: string; description: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form states
  const [gradeForm, setGradeForm] = useState({ name: "", description: "" })
  const [courseForm, setCourseForm] = useState({ name: "", description: "" })
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    url: "",
    topic_id: "",
    file: null as File | null,
  })

  useEffect(() => {
    fetchGrades()
    fetchCourses()
    fetchVideos()
  }, [])

  const fetchGrades = async () => {
    const { data, error } = await supabase.from("grades").select("*")
    if (data) {
      setGrades(data)
    }
  }

  const fetchCourses = async () => {
    const { data, error } = await supabase.from("courses").select("*")
    if (data) {
      setCourses(data)
    }
  }

  const fetchVideos = async () => {
    const { data, error } = await supabase.from("videos").select("*")
    if (data) {
      setVideos(data)
    }
  }

  const handleCreateGrade = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.from("grades").insert([gradeForm]).select()

      if (error) {
        throw error
      }

      setSuccess("Grade created successfully!")
      setGradeForm({ name: "", description: "" })
      fetchGrades()
    } catch (error) {
      setError("Failed to create grade")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.from("courses").insert([courseForm]).select()

      if (error) {
        throw error
      }

      setSuccess("Course created successfully!")
      setCourseForm({ name: "", description: "" })
      fetchCourses()
    } catch (error) {
      setError("Failed to create course")
    } finally {
      setLoading(false)
    }
  }

  const handleVideoUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let videoUrl = videoForm.url

      if (videoForm.file) {
        const file = videoForm.file
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const fileName = `${Date.now()}-${sanitizedFileName}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("videos")
          .upload(fileName, file)

        if (uploadError) {
          throw uploadError
        }
        videoUrl = uploadData.path
      }

      if (!videoUrl) {
        throw new Error("No video file or URL provided")
      }

      const { data: videoData, error: dbError } = await supabase
        .from("videos")
        .insert([
          {
            title: videoForm.title,
            description: videoForm.description,
            url: videoUrl,
            topic_id: videoForm.topic_id,
          },
        ])
        .select()

      if (dbError) {
        throw dbError
      }

      setSuccess("Video uploaded successfully!")
      setVideoForm({ title: "", description: "", url: "", topic_id: "", file: null })
      fetchVideos()
    } catch (error) {
      setError("Failed to upload video")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoForm({ ...videoForm, file })
    }
  }

  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const { error } = await supabase.from(table).delete().eq("id", id)
      if (error) {
        throw error
      }
      setSuccess("Item deleted successfully!")
      if (table === "grades") fetchGrades()
      if (table === "courses") fetchCourses()
      if (table === "videos") fetchVideos()
    } catch (error) {
      setError("Failed to delete item")
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Access denied. Admin privileges required to view this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground">Manage grades, subjects, topics, and videos</p>
        </div>
        <Badge variant="destructive" className="flex items-center gap-1">
          <Upload className="h-3 w-3" />
          Admin Access
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}


      {/* Content Management Tabs */}
      <Tabs defaultValue="grades" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Grade
                </CardTitle>
                <CardDescription>Create a new grade level</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateGrade} className="space-y-4">
                  <div>
                    <Label htmlFor="grade-name">Grade Name</Label>
                    <Input
                      id="grade-name"
                      placeholder="e.g., Grade 1, Grade 2"
                      value={gradeForm.name}
                      onChange={(e) => setGradeForm({ ...gradeForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="grade-description">Description</Label>
                    <Textarea
                      id="grade-description"
                      placeholder="Grade description..."
                      value={gradeForm.description}
                      onChange={(e) => setGradeForm({ ...gradeForm, description: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Creating..." : "Create Grade"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Existing Grades ({grades.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {grades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{grade.name}</p>
                        {grade.description && <p className="text-sm text-muted-foreground">{grade.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("grades", grade.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Course
                </CardTitle>
                <CardDescription>Create a new course</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <div>
                    <Label htmlFor="course-name">Course Name</Label>
                    <Input
                      id="course-name"
                      placeholder="e.g., Mathematics, Physics"
                      value={courseForm.name}
                      onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="course-description">Description</Label>
                    <Textarea
                      id="course-description"
                      placeholder="Course description..."
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Creating..." : "Create Course"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Existing Courses ({courses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{course.name}</p>
                        {course.description && <p className="text-sm text-muted-foreground">{course.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete("courses", course.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Subjects management will be available here.</p>
          </div>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Topics management will be available here.</p>
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload New Video
                </CardTitle>
                <CardDescription>Upload educational videos for topics</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVideoUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="video-title">Video Title</Label>
                    <Input
                      id="video-title"
                      placeholder="e.g., Introduction to Algebra"
                      value={videoForm.title}
                      onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="video-description">Description</Label>
                    <Textarea
                      id="video-description"
                      placeholder="Video description..."
                      value={videoForm.description}
                      onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="video-url">Video URL (Optional)</Label>
                    <Input
                      id="video-url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={videoForm.url}
                      onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="video-file">Upload Video File</Label>
                    <Input
                      id="video-file"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {videoForm.file && (
                      <p className="text-sm text-muted-foreground mt-1">Selected: {videoForm.file.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="topic-select">Topic</Label>
                    <Input
                      id="topic-select"
                      placeholder="Select or enter topic ID"
                      value={videoForm.topic_id}
                      onChange={(e) => setVideoForm({ ...videoForm, topic_id: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Uploading..." : "Upload Video"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Existing Videos ({videos.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {videos.length > 0 ? (
                    videos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileVideo className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{video.title}</p>
                            <p className="text-sm text-muted-foreground">Topic ID: {video.topic_id}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/videos/${video.id}`} passHref>
                            <Button size="sm" variant="outline">
                              <Play className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete("videos", video.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileVideo className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No videos uploaded yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
