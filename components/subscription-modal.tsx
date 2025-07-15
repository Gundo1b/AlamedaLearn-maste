"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Check, Play } from "lucide-react"
import { updateVideoData } from "@/lib/video-limits"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  playsRemaining: number
  onSubscriptionSuccess: () => void
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  playsRemaining,
  onSubscriptionSuccess,
}: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")
  const [loading, setLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState<"plans" | "payment" | "success">("plans")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const plans = {
    monthly: {
      price: 99,
      period: "month",
      savings: null,
      features: ["Unlimited video access", "All subjects & grades", "Mobile & desktop access", "Progress tracking"],
    },
    yearly: {
      price: 999,
      period: "year",
      savings: 189,
      features: [
        "Unlimited video access",
        "All subjects & grades",
        "Mobile & desktop access",
        "Progress tracking",
        "Priority support",
        "Offline downloads",
      ],
    },
  }

  const handleSubscribe = async () => {
    setLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Update user subscription status
    const expiryDate = new Date()
    if (selectedPlan === "monthly") {
      expiryDate.setMonth(expiryDate.getMonth() + 1)
    } else {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1)
    }

    updateVideoData({
      isSubscribed: true,
      subscriptionExpiry: expiryDate.toISOString(),
      playsRemaining: -1, // Unlimited
    })

    setLoading(false)
    setPaymentStep("success")
  }

  const handleSuccess = () => {
    onSubscriptionSuccess()
    onClose()
    setPaymentStep("plans")
  }

  if (paymentStep === "success") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto">
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Premium!</h2>
            <p className="text-gray-600 mb-6">
              Your subscription is now active. Enjoy unlimited access to all video content!
            </p>
            <Button onClick={handleSuccess} className="w-full bg-teal-600 hover:bg-teal-700">
              Start Learning
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (paymentStep === "payment") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-teal-600" />
              Payment Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-teal-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{selectedPlan === "monthly" ? "Monthly" : "Yearly"} Plan</span>
                <span className="text-xl font-bold text-teal-600">R{plans[selectedPlan].price}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Billed {selectedPlan === "monthly" ? "monthly" : "annually"}</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setPaymentStep("plans")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubscribe} disabled={loading} className="flex-1 bg-teal-600 hover:bg-teal-700">
                {loading ? "Processing..." : `Pay R${plans[selectedPlan].price}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {playsRemaining === 0 ? "No Videos Left" : `${playsRemaining} Videos Remaining`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {playsRemaining === 0 ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Play className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-gray-600 mb-4">
                You've used all your free video plays. Subscribe to continue learning!
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">
                You have <span className="font-bold text-teal-600">{playsRemaining}</span> free video plays left.
                Subscribe for unlimited access!
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Monthly Plan */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPlan === "monthly" ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">Monthly Plan</h3>
                  <p className="text-gray-600 text-sm">Perfect for trying out</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-teal-600">R99</div>
                  <div className="text-sm text-gray-500">/month</div>
                </div>
              </div>
              <div className="space-y-1">
                {plans.monthly.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Yearly Plan */}
            <div
              className={`border-2 rounded-lg p-4 cursor-pointer transition-colors relative ${
                selectedPlan === "yearly" ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => setSelectedPlan("yearly")}
            >
              <Badge className="absolute -top-2 left-4 bg-green-500 hover:bg-green-500">Save R189</Badge>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">Yearly Plan</h3>
                  <p className="text-gray-600 text-sm">Best value for students</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-teal-600">R999</div>
                  <div className="text-sm text-gray-500">/year</div>
                  <div className="text-xs text-green-600">R83/month</div>
                </div>
              </div>
              <div className="space-y-1">
                {plans.yearly.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={() => setPaymentStep("payment")} className="w-full bg-teal-600 hover:bg-teal-700">
            Subscribe to {selectedPlan === "monthly" ? "Monthly" : "Yearly"} Plan
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">Secure payment • Cancel anytime • 7-day money-back guarantee</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
