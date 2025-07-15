"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { BookOpen, ArrowRight, Users, Clock, Calculator, Atom, FlaskRoundIcon as Flask, Leaf } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface Subject {
  id: string
  name: string
  description: string
  grade_id: string
  topic_count?: number
  estimated_hours?: number
}

interface Grade {
  id: string
  name: string
  description: string
}

export default function SubjectsPage() {
  const params = useParams()
  const gradeId = params.gradeId as string

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [grade, setGrade] = useState<Grade | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (gradeId) {
      fetchSubjects()
    }
  }, [gradeId])

  // Function to get the appropriate icon for each subject
  const getSubjectIcon = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case "mathematics":
        return Calculator
      case "physics":
        return Atom
      case "physical sciences":
        return Flask
      case "life sciences":
        return Leaf
      default:
        return BookOpen
    }
  }

  // Function to get the appropriate color scheme for each subject
  const getSubjectColorScheme = (subjectName: string) => {
    switch (subjectName.toLowerCase()) {
      case "mathematics":
        return "bg-blue-100 text-blue-600"
      case "physics":
        return "bg-red-100 text-red-600"
      case "physical sciences":
        return "bg-green-100 text-green-600"
      case "life sciences":
        return "bg-purple-100 text-purple-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        // Use mock data when Supabase is not configured
        const mockGrade = {
          id: gradeId,
          name: `Grade ${gradeId === "1" ? "10" : gradeId === "2" ? "11" : "12"}`,
          description: "Mock grade description",
        }

        // Replace the mockSubjects array with real curriculum data including Physics
        const curriculumData = {
          "1": {
            // Grade 10
            subjects: [
              {
                id: "1",
                name: "Mathematics",
                description:
                  "Comprehensive mathematics curriculum covering algebraic expressions, equations, functions, number patterns, finance, geometry, trigonometry, and statistics",
                grade_id: gradeId,
                topic_count: 8,
                estimated_hours: 45,
                topics: [
                  "Algebraic Expressions",
                  "Equations and Inequalities",
                  "Functions and Graphs",
                  "Number Patterns",
                  "Finance",
                  "Geometry",
                  "Trigonometry",
                  "Statistics",
                ],
              },
              {
                id: "2",
                name: "Physics",
                description:
                  "Fundamental physics concepts covering mechanics, motion, forces, waves, sound, light, and basic principles of physical phenomena",
                grade_id: gradeId,
                topic_count: 3,
                estimated_hours: 25,
                topics: ["Mechanics", "Waves, Sound, and Light", "Skills for Science"],
              },
              {
                id: "3",
                name: "Physical Sciences",
                description:
                  "Chemistry fundamentals covering matter classification, atomic structure, chemical bonding, reactions, and laboratory skills",
                grade_id: gradeId,
                topic_count: 4,
                estimated_hours: 30,
                topics: ["Classification of Matter", "Atomic Structure", "Chemical Bonding", "Chemical Reactions"],
              },
              {
                id: "4",
                name: "Life Sciences",
                description:
                  "Biology covering biochemistry, cell biology, cell division, plant and animal tissues, biodiversity, classification, and ecology",
                grade_id: gradeId,
                topic_count: 6,
                estimated_hours: 38,
                topics: [
                  "The Chemistry of Life",
                  "Cells: The Basic Units of Life",
                  "Cell Division: Mitosis",
                  "Plant and Animal Tissues",
                  "Biodiversity and Classification",
                  "Ecology",
                ],
              },
            ],
          },
          "2": {
            // Grade 11
            subjects: [
              {
                id: "5",
                name: "Mathematics",
                description:
                  "Advanced mathematics including algebraic expressions, functions, number patterns, finance, trigonometry, analytical geometry, and statistics",
                grade_id: gradeId,
                topic_count: 7,
                estimated_hours: 40,
                topics: [
                  "Algebraic Expressions and Equations",
                  "Functions and Graphs",
                  "Number Patterns",
                  "Finance",
                  "Trigonometry",
                  "Analytical Geometry",
                  "Statistics",
                ],
              },
              {
                id: "6",
                name: "Physics",
                description:
                  "Advanced physics covering mechanics, vectors, scalars, waves, sound, electricity, magnetism, and electromagnetic phenomena",
                grade_id: gradeId,
                topic_count: 3,
                estimated_hours: 28,
                topics: ["Mechanics", "Waves and Sound", "Electricity and Magnetism"],
              },
              {
                id: "7",
                name: "Physical Sciences",
                description:
                  "Advanced chemistry covering molecular shapes, intermolecular forces, energy changes in reactions, and reaction rates",
                grade_id: gradeId,
                topic_count: 2,
                estimated_hours: 22,
                topics: ["Chemical Bonding", "Chemical Reactions"],
              },
              {
                id: "8",
                name: "Life Sciences",
                description:
                  "Advanced biology covering biodiversity of microorganisms, plants, animals, environmental impact, photosynthesis, and respiration",
                grade_id: gradeId,
                topic_count: 5,
                estimated_hours: 33,
                topics: [
                  "Biodiversity of Microorganisms",
                  "Biodiversity of Plants",
                  "Biodiversity of Animals",
                  "Human Impact on the Environment",
                  "Photosynthesis and Respiration",
                ],
              },
            ],
          },
          "3": {
            // Grade 12
            subjects: [
              {
                id: "9",
                name: "Mathematics",
                description:
                  "Final year mathematics including sequences, series, advanced functions, finance, trigonometry, analytical geometry, calculus, and probability",
                grade_id: gradeId,
                topic_count: 7,
                estimated_hours: 48,
                topics: [
                  "Sequences and Series",
                  "Functions and Graphs",
                  "Finance",
                  "Trigonometry",
                  "Analytical Geometry",
                  "Calculus",
                  "Probability",
                ],
              },
              {
                id: "10",
                name: "Physics",
                description:
                  "Advanced physics covering momentum, impulse, work, energy, power, electric circuits, and electromagnetic induction",
                grade_id: gradeId,
                topic_count: 2,
                estimated_hours: 25,
                topics: ["Mechanics", "Electrodynamics"],
              },
              {
                id: "11",
                name: "Physical Sciences",
                description:
                  "Advanced chemistry covering chemical equilibrium, acids and bases, pH calculations, and organic chemistry",
                grade_id: gradeId,
                topic_count: 3,
                estimated_hours: 30,
                topics: ["Chemical Equilibrium", "Acids and Bases", "Organic Chemistry"],
              },
              {
                id: "12",
                name: "Life Sciences",
                description:
                  "Advanced biology covering DNA, meiosis, human reproduction, genetics, inheritance, and evolution",
                grade_id: gradeId,
                topic_count: 5,
                estimated_hours: 35,
                topics: ["DNA: Code of Life", "Meiosis", "Human Reproduction", "Genetics and Inheritance", "Evolution"],
              },
            ],
          },
        }

        const mockSubjects = curriculumData[gradeId]?.subjects || []

        setGrade(mockGrade)
        setSubjects(mockSubjects)
        setLoading(false)
        return
      }

      // Fetch grade info
      const { data: gradeData, error: gradeError } = await supabase
        .from("grades")
        .select("id, name, description")
        .eq("id", gradeId)
        .single()

      if (gradeError) throw gradeError
      setGrade(gradeData)

      // Fetch subjects with topic counts
      const { data: subjectsData, error: subjectsError } = await supabase
        .from("subjects")
        .select(`
          id,
          name,
          description,
          grade_id,
          topics (count)
        `)
        .eq("grade_id", gradeId)
        .order("name")

      if (subjectsError) throw subjectsError

      // Transform data to include topic counts
      const subjectsWithCounts =
        subjectsData?.map((subject) => ({
          ...subject,
          topic_count: subject.topics?.[0]?.count || 0,
          estimated_hours: Math.floor(Math.random() * 40) + 20, // Placeholder calculation
        })) || []

      setSubjects(subjectsWithCounts)
    } catch (err) {
      console.error("Error fetching subjects:", err)
      setError("Failed to load subjects. Please try again.")
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
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
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Error Loading Subjects</h3>
          <p className="text-gray-600 text-lg mb-6">{error}</p>
          <button
            onClick={fetchSubjects}
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
        {/* Header Section */}
        <div className="mb-12">
          <nav className="text-sm breadcrumbs mb-6">
            <Link href="/grades" className="text-blue-600 hover:text-blue-800 transition-colors">
              All Grades
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600">{grade?.name} Subjects</span>
          </nav>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{grade?.name} Subjects</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose a subject to explore topics and learning materials designed for your grade level
            </p>
          </div>
        </div>

        {/* Subjects Grid */}
        {subjects.length > 0 ? (
          <div className="grid gap-8 md:gap-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {subjects.map((subject) => {
                const IconComponent = getSubjectIcon(subject.name)
                const colorScheme = getSubjectColorScheme(subject.name)

                return (
                  <div key={subject.id} className="group">
                    <Link
                      href={`/subjects/${subject.id}/topics`}
                      className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
                    >
                      <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                          <div
                            className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${colorScheme}`}
                          >
                            <IconComponent className="h-8 w-8" />
                          </div>
                          <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                          {subject.name}
                        </h3>

                        <p className="text-gray-600 mb-6 text-base leading-relaxed line-clamp-3">
                          {subject.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="font-medium">{subject.topic_count} topics</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="font-medium">{subject.estimated_hours}h</span>
                          </div>
                        </div>
                      </div>

                      <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Subjects Available</h3>
            <p className="text-gray-600 text-lg">Subjects will appear here once they are added to {grade?.name}.</p>
          </div>
        )}
      </div>
    </div>
  )
}
