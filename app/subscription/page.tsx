"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Check,
  Star,
  Play,
  BookOpen,
  Users,
  Download,
  Shield,
  Headphones,
  Smartphone,
  Award,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { getVideoData } from "@/lib/video-limits"
import SubscriptionModal from "@/components/subscription-modal"

export default function SubscriptionPage() {
  const [videoData, setVideoData] = useState({ playsRemaining: 10, isSubscribed: false, subscriptionExpiry: null })
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly")

  useEffect(() => {
    setVideoData(getVideoData())
  }, [])

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "forever",
      description: "Perfect for getting started",
      popular: false,
      features: ["10 video plays", "Access to all subjects", "Basic progress tracking", "Mobile & desktop access"],
      limitations: ["Limited video access", "No offline downloads", "Basic support only"],
    },
    {
      id: "monthly",
      name: "Monthly",
      price: 99,
      period: "month",
      description: "Great for short-term study goals",
      popular: false,
      features: [
        "Unlimited video access",
        "All subjects & grades (10-12)",
        "Advanced progress tracking",
        "Mobile & desktop access",
        "Priority email support",
        "Study notes & resources",
        "Quiz & assessment tools",
      ],
      limitations: [],
    },
    {
      id: "yearly",
      name: "Yearly",
      price: 999,
      originalPrice: 1188,
      period: "year",
      description: "Best value for serious students",
      popular: true,
      savings: 189,
      features: [
        "Everything in Monthly",
        "Offline video downloads",
        "Priority support (24/7)",
        "Exclusive study materials",
        "Live Q&A sessions",
        "Certificate of completion",
        "Early access to new content",
        "Study group access",
      ],
      limitations: [],
    },
  ]

  const testimonials = [
    {
      name: "Thabo Mthembu",
      grade: "Grade 12",
      subject: "Mathematics",
      rating: 5,
      comment: "Alameda Lab helped me improve my maths from 45% to 78%! The explanations are so clear.",
      avatar: "👨🏿‍🎓",
    },
    {
      name: "Nomsa Dlamini",
      grade: "Grade 11",
      subject: "Physical Sciences",
      rating: 5,
      comment: "The physics videos made complex concepts easy to understand. Highly recommend!",
      avatar: "👩🏿‍🎓",
    },
    {
      name: "Kyle Johnson",
      grade: "Grade 10",
      subject: "Life Sciences",
      rating: 5,
      comment: "Amazing platform! The biology content is comprehensive and well-structured.",
      avatar: "👨🏼‍🎓",
    },
  ]

  const stats = [
    { icon: Users, value: "12,000+", label: "Active Students" },
    { icon: BookOpen, value: "500+", label: "Video Lessons" },
    { icon: Award, value: "94%", label: "Pass Rate" },
    { icon: Star, value: "4.9/5", label: "Student Rating" },
  ]

  const handleSubscribe = (planId: string) => {
    if (planId === "free") return
    setSelectedPlan(planId as "monthly" | "yearly")
    setShowModal(true)
  }

  const handleSubscriptionSuccess = () => {
    setVideoData(getVideoData())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-100">
            {videoData.isSubscribed ? "Premium Member" : `${videoData.playsRemaining} free videos remaining`}
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your <span className="text-teal-600">Learning Plan</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Unlock your potential with unlimited access to expert-led video lessons for Grades 10-12. Master
            Mathematics, Physical Sciences, and Life Sciences.
          </p>

          {videoData.isSubscribed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
              <div className="flex items-center gap-2 text-green-800">
                <Check className="h-5 w-5" />
                <span className="font-medium">You're subscribed! Enjoy unlimited access.</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full mb-3">
                  <stat.icon className="h-6 w-6 text-teal-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your learning journey. All plans include access to our complete
              curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular ? "border-2 border-teal-500 shadow-lg scale-105" : "border border-gray-200"
                } ${videoData.isSubscribed && plan.id !== "free" ? "opacity-75" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-teal-500 hover:bg-teal-500">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>

                  <div className="py-4">
                    {plan.price === 0 ? (
                      <div className="text-4xl font-bold text-gray-900">Free</div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-4xl font-bold text-teal-600">
                          R{plan.price}
                          <span className="text-lg text-gray-500 font-normal">/{plan.period}</span>
                        </div>
                        {plan.originalPrice && (
                          <div className="text-sm text-gray-500">
                            <span className="line-through">R{plan.originalPrice}</span>
                            <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                              Save R{plan.savings}
                            </Badge>
                          </div>
                        )}
                        {plan.id === "yearly" && (
                          <div className="text-sm text-green-600 font-medium">Only R83/month</div>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 font-medium">Limitations:</p>
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded-full bg-gray-200 flex-shrink-0" />
                            <span className="text-sm text-gray-500">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="pt-4">
                    {plan.id === "free" ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : videoData.isSubscribed ? (
                      <Button variant="outline" className="w-full" disabled>
                        Already Subscribed
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        className={`w-full ${
                          plan.popular ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-900 hover:bg-gray-800"
                        }`}
                      >
                        {plan.id === "monthly" ? "Subscribe Monthly" : "Subscribe Yearly"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to help South African students excel in their studies with comprehensive
              resources and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Play,
                title: "Expert Video Lessons",
                description:
                  "High-quality video content created by experienced South African educators following the CAPS curriculum.",
              },
              {
                icon: Smartphone,
                title: "Mobile & Desktop Access",
                description: "Learn anywhere, anytime on your phone, tablet, or computer with our responsive platform.",
              },
              {
                icon: Download,
                title: "Offline Downloads",
                description:
                  "Download videos for offline viewing - perfect for areas with limited internet connectivity.",
              },
              {
                icon: Clock,
                title: "Progress Tracking",
                description: "Monitor your learning progress with detailed analytics and completion tracking.",
              },
              {
                icon: Headphones,
                title: "24/7 Support",
                description: "Get help when you need it with our dedicated student support team.",
              },
              {
                icon: Shield,
                title: "Secure & Safe",
                description: "Your data is protected with enterprise-grade security and privacy measures.",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full mb-4">
                  <feature.icon className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-gray-600">Real feedback from students who've improved their grades with Alameda Lab</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">
                        {testimonial.grade} • {testimonial.subject}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Can I cancel my subscription anytime?",
                answer:
                  "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
              },
              {
                question: "Do you offer student discounts?",
                answer:
                  "We offer competitive pricing designed for South African students. Contact us for information about bulk discounts for schools.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit and debit cards. Payments are processed securely in South African Rands (ZAR).",
              },
              {
                question: "Can I download videos for offline viewing?",
                answer: "Yes, premium subscribers can download videos for offline viewing on mobile devices.",
              },
              {
                question: "Is the content aligned with the South African curriculum?",
                answer: "All our content is specifically designed to align with the CAPS curriculum for Grades 10-12.",
              },
            ].map((faq, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Excel in Your Studies?</h2>
          <p className="text-xl mb-8 text-teal-100">
            Join thousands of South African students who are already improving their grades with Alameda Lab
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!videoData.isSubscribed && (
              <Button
                onClick={() => handleSubscribe("yearly")}
                size="lg"
                variant="secondary"
                className="bg-white text-teal-600 hover:bg-gray-100"
              >
                Start Your Subscription
              </Button>
            )}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-teal-600"
            >
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
          <p className="text-sm text-teal-200 mt-4">7-day money-back guarantee • No setup fees • Cancel anytime</p>
        </div>
      </section>

      <SubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        playsRemaining={videoData.playsRemaining}
        onSubscriptionSuccess={handleSubscriptionSuccess}
      />
    </div>
  )
}
