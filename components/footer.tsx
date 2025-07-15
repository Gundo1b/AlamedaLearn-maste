import Link from "next/link"
import { Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="gradient-bg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {/* Alameda Lab Logo - Matching Homepage Design */}
              <div className="relative w-12 h-12 flex-shrink-0">
                {/* Main A shape - top rounded part */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-9 h-7 bg-white rounded-t-full"></div>

                {/* White decorative dots - now teal on white background */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 translate-x-1 w-1 h-1 bg-teal-500 rounded-full"></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 -translate-x-1 w-0.5 h-0.5 bg-teal-500 rounded-full"></div>
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 translate-x-1.5 w-0.5 h-0.5 bg-teal-500 rounded-full"></div>

                {/* Lab coat/shirt icon in center - now teal */}
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-1.5 bg-teal-500 rounded-t-sm"></div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-teal-500 rounded-b-sm"></div>

                {/* Bottom split parts of A */}
                <div className="absolute bottom-0 left-1 w-3.5 h-3 bg-white rounded-b-xl transform -rotate-12"></div>
                <div className="absolute bottom-0 right-1 w-3.5 h-3 bg-white rounded-b-xl transform rotate-12"></div>
              </div>
              <span className="text-xl font-bold">Alameda Lab</span>
            </div>
            <p className="text-cyan-100 mb-4 max-w-md">
              Comprehensive educational platform for grades 10-12. Excel in Mathematics, Physical Sciences, and Life
              Sciences with Alameda Lab's structured curriculum and expert guidance.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-cyan-100">
                <Mail className="h-4 w-4 mr-2" />
                admin@AlamedaLab.onmicrosoft.com
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-cyan-100 hover:text-white transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/grades" className="text-cyan-100 hover:text-white transition-colors">
                  Grades
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-cyan-100 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-cyan-100 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin/content" className="text-cyan-100 hover:text-white transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Subjects</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/subjects/1/topics" className="text-cyan-100 hover:text-white transition-colors">
                  Mathematics
                </Link>
              </li>
              <li>
                <Link href="/subjects/2/topics" className="text-cyan-100 hover:text-white transition-colors">
                  Physical Sciences
                </Link>
              </li>
              <li>
                <Link href="/subjects/3/topics" className="text-cyan-100 hover:text-white transition-colors">
                  Life Sciences
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cyan-100 text-sm">© 2024 Alameda Lab. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-cyan-100 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-cyan-100 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
