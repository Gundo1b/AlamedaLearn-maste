"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { BookOpen, ArrowRight, Video, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Topic {
  id: string
  name: string
  description: string
  subject_id: string
  video_count?: number
  duration?: string
}

interface Subject {
  id: string
  name: string
  description: string
  grades: {
    id: string
    name: string
  }
}

// Mock data for development/preview
const mockSubjects: Record<string, Subject> = {
  "1": {
    id: "1",
    name: "Mathematics",
    description: "Comprehensive mathematics curriculum covering algebra, geometry, and calculus",
    grades: { id: "10", name: "Grade 10" },
  },
  "2": {
    id: "2",
    name: "Physical Sciences",
    description: "Physics and chemistry concepts for high school students",
    grades: { id: "10", name: "Grade 10" },
  },
  "3": {
    id: "3",
    name: "Life Sciences",
    description: "Biology and life science topics including cells, genetics, and ecology",
    grades: { id: "10", name: "Grade 10" },
  },
}

const mockTopics: Record<string, Topic[]> = {
  "1": [
    // Mathematics topics
    {
      id: "1",
      name: "Algebraic Expressions",
      description:
        "Understanding the real number system, rational and irrational numbers, rounding off and estimating surds, products and factorisation, and simplifying algebraic fractions.",
      subject_id: "1",
      video_count: 5,
      duration: "2.5 hours",
    },
    {
      id: "2",
      name: "Equations and Inequalities",
      description:
        "Solving linear equations, quadratic equations, inequalities, and word problems involving equations.",
      subject_id: "1",
      video_count: 4,
      duration: "3.2 hours",
    },
    {
      id: "3",
      name: "Functions and Graphs",
      description:
        "Introduction to functions, linear functions, quadratic functions, and hyperbolic and exponential functions.",
      subject_id: "1",
      video_count: 4,
      duration: "2.8 hours",
    },
    {
      id: "4",
      name: "Number Patterns",
      description: "Identifying patterns, arithmetic sequences, and geometric sequences.",
      subject_id: "1",
      video_count: 3,
      duration: "1.9 hours",
    },
    {
      id: "5",
      name: "Finance",
      description: "Simple interest and compound interest calculations and applications.",
      subject_id: "1",
      video_count: 2,
      duration: "1.5 hours",
    },
    {
      id: "6",
      name: "Geometry",
      description: "Basic geometric figures, properties of triangles and quadrilaterals, circles and angles.",
      subject_id: "1",
      video_count: 3,
      duration: "2.1 hours",
    },
    {
      id: "7",
      name: "Trigonometry",
      description: "Introduction to trigonometric ratios, solving right-angled triangles, and trigonometric graphs.",
      subject_id: "1",
      video_count: 3,
      duration: "2.4 hours",
    },
    {
      id: "8",
      name: "Statistics",
      description: "Collecting and organizing data, measures of central tendency, and representing data graphically.",
      subject_id: "1",
      video_count: 3,
      duration: "1.8 hours",
    },
  ],
  "2": [
    // Physical Sciences topics
    {
      id: "9",
      name: "Skills for Science",
      description: "Scientific method and laboratory safety, measurement and units.",
      subject_id: "2",
      video_count: 2,
      duration: "1.3 hours",
    },
    {
      id: "10",
      name: "Classification of Matter",
      description: "States of matter, elements, compounds, and mixtures.",
      subject_id: "2",
      video_count: 2,
      duration: "1.6 hours",
    },
    {
      id: "11",
      name: "Atomic Structure",
      description: "Structure of the atom, periodic table and electron configuration.",
      subject_id: "2",
      video_count: 2,
      duration: "2.1 hours",
    },
    {
      id: "12",
      name: "Chemical Bonding",
      description: "Ionic and covalent bonds, metallic bonding.",
      subject_id: "2",
      video_count: 2,
      duration: "1.9 hours",
    },
    {
      id: "13",
      name: "Chemical Reactions",
      description: "Types of chemical reactions, balancing chemical equations.",
      subject_id: "2",
      video_count: 2,
      duration: "2.2 hours",
    },
    {
      id: "14",
      name: "Mechanics",
      description: "Motion in one dimension, Newton's laws of motion.",
      subject_id: "2",
      video_count: 2,
      duration: "2.5 hours",
    },
    {
      id: "15",
      name: "Waves, Sound, and Light",
      description: "Properties of waves, sound waves, light and optics.",
      subject_id: "2",
      video_count: 3,
      duration: "2.8 hours",
    },
  ],
  "3": [
    // Life Sciences topics
    {
      id: "16",
      name: "The Chemistry of Life",
      description: "Introduction to biochemistry, carbohydrates, proteins, and lipids.",
      subject_id: "3",
      video_count: 2,
      duration: "1.7 hours",
    },
    {
      id: "17",
      name: "Cells: The Basic Units of Life",
      description: "Cell structure and function, cell membrane and transport.",
      subject_id: "3",
      video_count: 2,
      duration: "2.1 hours",
    },
    {
      id: "18",
      name: "Cell Division: Mitosis",
      description: "Phases of mitosis, importance of cell division.",
      subject_id: "3",
      video_count: 2,
      duration: "1.8 hours",
    },
    {
      id: "19",
      name: "Plant and Animal Tissues",
      description: "Types of plant tissues, types of animal tissues.",
      subject_id: "3",
      video_count: 2,
      duration: "1.9 hours",
    },
    {
      id: "20",
      name: "Biodiversity and Classification",
      description: "Importance of biodiversity, classification systems.",
      subject_id: "3",
      video_count: 2,
      duration: "1.6 hours",
    },
    {
      id: "21",
      name: "Ecology",
      description: "Ecosystems and biomes, energy flow and nutrient cycles.",
      subject_id: "3",
      video_count: 2,
      duration: "2.3 hours",
    },
  ],
}

export default function TopicsPage() {
  const params = useParams()
  const subjectId = params.subjectId as string

  const [topics, setTopics] = useState<Topic[]>([])
  const [subject, setSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    if (subjectId) {
      fetchTopics()
    }
  }, [subjectId])

  const fetchTopics = async () => {
    try {
      setLoading(true)
      setError(null)

      // Try to fetch from Supabase first
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select(`
          id,
          name,
          description,
          grades (
            id,
            name
          )
        `)
        .eq("id", subjectId)
        .single()

      if (subjectError) throw subjectError

      const { data: topicsData, error: topicsError } = await supabase
        .from("topics")
        .select("id, name, description, subject_id")
        .eq("subject_id", subjectId)
        .order("name")

      if (topicsError) throw topicsError

      // If successful, use real data
      setSubject(subjectData)

      const topicsWithCounts = await Promise.all(
        (topicsData || []).map(async (topic) => {
          const { count } = await supabase
            .from("videos")
            .select("*", { count: "exact", head: true })
            .eq("topic_id", topic.id)

          return {
            ...topic,
            video_count: count || 0,
            duration: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)} hours`,
          }
        }),
      )

      setTopics(topicsWithCounts)
      setUsingMockData(false)
    } catch (err) {
      console.error("Error fetching from Supabase, using mock data:", err)

      // Fallback to mock data
      const mockSubject = mockSubjects[subjectId]
      const mockTopicsList = mockTopics[subjectId] || []

      if (mockSubject) {
        setSubject(mockSubject)
        setTopics(mockTopicsList)
        setUsingMockData(true)
        setError(null)
      } else {
        setError("Subject not found. Please check the URL and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse mb-12">
            <div className="h-4 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="h-16 w-16 bg-gray-300 rounded-xl mb-6"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-6"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <BookOpen className="h-10 w-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Error Loading Topics</h3>
          <p className="text-gray-600 text-lg mb-6">{error}</p>
          <button
            onClick={fetchTopics}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mock Data Notice */}
        {usingMockData && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Preview Mode:</strong> Showing sample curriculum data. Connect to Supabase to see live content.
            </p>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-12">
          <nav className="text-sm breadcrumbs mb-6">
            <Link href="/courses" className="text-blue-600 hover:text-blue-800 transition-colors">
              All Courses
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link
              href={`/grades/${subject?.grades?.id}/subjects`}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              {subject?.grades?.name} Subjects
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{subject?.name} Topics</span>
          </nav>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{subject?.name} Topics</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore comprehensive {subject?.name.toLowerCase()} topics with video lessons and learning materials
            </p>
          </div>
        </div>

        {/* Topics Grid */}
        {topics.length > 0 ? (
          <div className="grid gap-8 md:gap-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topics.map((topic, index) => (
                <div key={topic.id} className="group">
                  <Link
                    href={`/topics/${topic.id}/videos`}
                    className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${
                            index % 3 === 0
                              ? "bg-blue-100 text-blue-600"
                              : index % 3 === 1
                                ? "bg-green-100 text-green-600"
                                : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          <BookOpen className="h-8 w-8" />
                        </div>
                        <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {topic.name}
                      </h3>

                      <p className="text-gray-600 mb-6 text-base leading-relaxed line-clamp-3">{topic.description}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-500">
                          <Video className="h-4 w-4 mr-2" />
                          <span className="font-medium">{topic.video_count} videos</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="font-medium">{topic.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Topics Available</h3>
            <p className="text-gray-600 text-lg">Topics for {subject?.name} will appear here once they are added.</p>
          </div>
        )}
      </div>
    </div>
  )
}
