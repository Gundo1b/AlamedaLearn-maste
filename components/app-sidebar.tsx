"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  Home,
  GraduationCap,
  LogIn,
  UserPlus,
  User,
  Settings,
  ChevronRight,
  Shield,
  Upload,
  Users,
  BarChart3,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

// Mock data for now to avoid build issues
const mockGrades = [
  { id: "1", name: "Grade 10" },
  { id: "2", name: "Grade 11" },
  { id: "3", name: "Grade 12" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [grades] = useState(mockGrades)
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState("student")

  const isActive = (path: string) => pathname === path
  const isAdmin = userRole === "admin"

  // Main navigation items
  const mainNavItems = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "All Grades",
      url: "/grades",
      icon: GraduationCap,
    },
  ]

  // Admin-only navigation items
  const adminNavItems = [
    {
      title: "Content Management",
      url: "/admin/content",
      icon: Upload,
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
  ]

  // Account items
  const accountItems = user
    ? [
        {
          title: "Profile",
          url: "/profile",
          icon: User,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
      ]
    : [
        {
          title: "Login",
          url: "/login",
          icon: LogIn,
        },
        {
          title: "Register",
          url: "/register",
          icon: UserPlus,
        },
      ]

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <BookOpen className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Alameda Learn</span>
            <span className="truncate text-xs text-muted-foreground">Educational Platform</span>
          </div>
          {user && (
            <Badge variant={isAdmin ? "destructive" : "outline"} className="text-xs">
              {userRole}
            </Badge>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        {isAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Panel
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Grades Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Grade Levels</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {grades.slice(0, 6).map((grade) => (
                <SidebarMenuItem key={grade.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/grades/${grade.id}/subjects`}>
                      <GraduationCap />
                      <span>{grade.name}</span>
                      <ChevronRight className="ml-auto transition-transform" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {grades.length > 6 && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/grades">
                      <span className="text-muted-foreground">View all grades...</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton>
                <User />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.email}</span>
                  <span className="truncate text-xs capitalize">{userRole}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          {accountItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
