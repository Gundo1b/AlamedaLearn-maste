"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, ArrowRight, Play, Clock, Star } from "lucide-react"

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([])

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase.from("courses").select("*").limit(3)
      if (data) {
        setFeaturedCourses(data)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Alameda Lab Logo - Matching Header Design */}
          <div className="mb-8">
            <div className="inline-flex flex-col items-center">
              {/* Logo Icon */}
              <div className="relative w-32 h-32 mb-4">
                {/* Main A shape - top rounded part */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-teal-500 rounded-t-full"></div>

                {/* White decorative dots */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 translate-x-2 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 -translate-x-3 w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 translate-x-4 w-1 h-1 bg-white rounded-full"></div>

                {/* Lab coat/shirt icon in center */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-4 bg-white rounded-t-lg"></div>
                <div className="absolute top-11 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-white rounded-b-lg"></div>

                {/* Bottom split parts of A */}
                <div className="absolute bottom-0 left-2 w-10 h-8 bg-teal-500 rounded-b-2xl transform -rotate-12"></div>
                <div className="absolute bottom-0 right-2 w-10 h-8 bg-teal-500 rounded-b-2xl transform rotate-12"></div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-teal-600">Alameda Lab</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your comprehensive educational platform for grades 10-12. Master Mathematics, Physics, Physical Sciences,
            and Life Sciences with expert-led video lessons.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
              <Link href="/grades">
                Start Learning <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>


      {/* Featured Courses */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our most popular courses designed to help you excel in your studies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={course.image || "/placeholder.svg"}
                    alt={course.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                      <Play className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl">{course.name}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                    <Link href={`/courses/${course.id}`}>Start Course</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl mb-8 text-teal-100">
            Join thousands of students who are already excelling with Alameda Lab
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/register">Create Account</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-teal-600"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
