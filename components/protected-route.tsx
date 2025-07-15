"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole = null }: ProtectedRouteProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [requiredRole])

  const checkAuth = async () => {
    try {
      // Mock auth check for now
      const mockUser = { email: "admin@example.com", role: "admin" }
      setUser(mockUser)

      if (!mockUser) {
        setAuthorized(false)
        setLoading(false)
        return
      }

      // Check role if required
      if (requiredRole) {
        const userRole = mockUser.role || "student"
        setAuthorized(userRole === requiredRole)
      } else {
        setAuthorized(true)
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setAuthorized(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <Alert className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>You must be logged in to access this page.</AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <Alert variant="destructive" className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Access denied.{" "}
              {requiredRole
                ? `${requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)} privileges required.`
                : "Insufficient permissions."}
            </AlertDescription>
          </Alert>
          <Button variant="outline" asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
