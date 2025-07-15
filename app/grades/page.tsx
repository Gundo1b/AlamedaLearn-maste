"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GraduationCap, Users, BookOpen, ArrowRight } from "lucide-react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

interface Grade {
  id: string
  name: string
  description: string
  subject_count?: number
  student_count?: number
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchGrades()
  }, [])

  const fetchGrades = async () => {
    try {
      setLoading(true)
      setError(null)


      // Fetch grades with subject counts
      const { data: gradesData, error: gradesError } = await supabase
        .from("grades")
        .select(`
        id,
        name,
        description,
        subjects (count)
      `)
        .order("name")

      if (gradesError) throw gradesError

      // Transform data to include subject counts
      const gradesWithCounts =
        gradesData?.map((grade) => ({
          ...grade,
          subject_count: grade.subjects?.[0]?.count || 0,
          student_count: 0, // Placeholder until we have real user data
        })) || []

      setGrades(gradesWithCounts)
    } catch (err) {
      console.error("Error fetching grades:", err)
      setError("Failed to load grades. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
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
            <GraduationCap className="h-10 w-10 text-red-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Error Loading Grades</h3>
          <p className="text-gray-600 text-lg mb-6">{error}</p>
          <button
            onClick={fetchGrades}
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Grade</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select your grade level to access curriculum-aligned content and comprehensive learning materials
          </p>
        </div>

        {/* Grades Grid */}
        {grades.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {grades.map((grade, index) => (
              <div key={grade.id} className="group">
                <Link
                  href={`/grades/${grade.id}/subjects`}
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
                        <GraduationCap className="h-8 w-8" />
                      </div>
                      <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {grade.name}
                    </h3>

                    <p className="text-gray-600 mb-6 text-base leading-relaxed line-clamp-3">{grade.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span className="font-medium">{grade.subject_count} subjects</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="font-medium">{grade.student_count}+ students</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <GraduationCap className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Grades Available</h3>
            <p className="text-gray-600 text-lg">Grades will appear here once they are added to the system.</p>
          </div>
        )}
      </div>
    </div>
  )
}
