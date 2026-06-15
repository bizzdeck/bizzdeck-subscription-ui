"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Zap, Crown, Rocket, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { PLANS, getAllPlans, Plan } from "@/lib/plans"
import { useAuth } from "../authContext"

const PRIMARY_COLOR = "#164B53"

export default function PlansPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth();

  const router = useRouter()

  useEffect(() => {
    if (!user) {
      sessionStorage.clear();
      router.push("/");
    }
    const restaurantId = sessionStorage.getItem("selectedRestaurant")
    setSelectedRestaurant(restaurantId)

    // TODO: Replace with your API call to fetch plans
    // const response = await fetch(`/api/plans?restaurantId=${restaurantId}`)
    // const data = await response.json()
    // setPlans(data)

    // Simulate API call
    setTimeout(() => {
      setPlans(getAllPlans())
      setIsLoading(false)
    }, 500)
  }, [])

  const handleSelectPlan = (planId: string) => {
    sessionStorage.setItem("selectedPlan", planId)
    router.push(`/payment?restaurantId=${selectedRestaurant}&plan=${planId}`)
  }

  const getPlanIcon = (index: number) => {
    const icons = [
      <Zap key="lite" className="w-6 h-6" />,
      <Crown key="plus" className="w-6 h-6" />,
      <Rocket key="pro" className="w-6 h-6" />
    ]
    return icons[index] || icons[0]
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-4 animate-spin mx-auto mb-4" style={{ borderTopColor: PRIMARY_COLOR }}></div>
          <p className="text-gray-600 font-medium">Loading plans...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)" }}>
      {/* Header */}
      <header style={{ background: PRIMARY_COLOR }} className="text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6 text-white hover:bg-white/20 transition-colors"
            onClick={() => router.push("/restaurants")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Restaurants
          </Button>
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Choose Your Perfect Plan</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Select a plan that fits your restaurant's needs. Scale as you grow.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={plan.id} className="relative group">
              {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center z-10">
                  <span 
                    className="inline-block px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                    style={{ background: PRIMARY_COLOR, marginTop: "-17px" }}
                  >
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              <Card 
                className={`h-full overflow-hidden transition-all duration-300 transform ${
                  plan.popular 
                    ? "shadow-2xl scale-105" 
                    : "shadow-lg hover:shadow-xl hover:scale-102"
                }`}
                style={{
                  border: plan.popular ? `2px solid ${PRIMARY_COLOR}` : "1px solid #e0e0e0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                {/* Header */}
                <div 
                  style={{ background: plan.popular ? PRIMARY_COLOR : "linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)" }}
                  className={`p-8 text-center ${plan.popular ? "text-white" : ""}`}
                >
                  <div className="flex justify-center mb-4">
                    <div 
                      className="p-3 rounded-full"
                      style={{ background: plan.popular ? "rgba(255,255,255,0.2)" : "#f0f0f0" }}
                    >
                      <div style={{ color: plan.popular ? "white" : PRIMARY_COLOR }}>
                        {getPlanIcon(index)}
                      </div>
                    </div>
                  </div>
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                      ₹{plan.price}
                      <span className={`text-xs font-medium ml-1 ${plan.popular ? "text-white/80" : "text-gray-600"}`}>+gst</span>
                    </span>
                    <span className={plan.popular ? "text-white/80" : "text-gray-600"}>
                      /{plan.interval}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex-grow flex flex-col">
                  {/* Features */}
                  <div className="mb-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check 
                            className="w-5 h-5 flex-shrink-0 mt-0.5 font-bold"
                            style={{ color: PRIMARY_COLOR }}
                          />
                          <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 mb-8"></div>

                  {/* Additional Info */}
                  <div className="text-xs text-gray-500 space-y-2 mb-8">
                    <p>✓ Cancel anytime</p>
                    <p>✓ 7-day money back guarantee</p>
                    <p>✓ No hidden charges</p>
                  </div>
                </div>

                {/* Footer Button */}
                <div className="px-8 pb-8">
                  <Button
                    className="w-full h-12 text-base font-semibold transition-all duration-200"
                    style={{
                      background: plan.popular ? PRIMARY_COLOR : "white",
                      color: plan.popular ? "white" : PRIMARY_COLOR,
                      border: plan.popular ? "none" : `2px solid ${PRIMARY_COLOR}`,
                      boxShadow: plan.popular ? `0 4px 15px ${PRIMARY_COLOR}33` : "none"
                    }}
                    onMouseEnter={(e) => {
                      if (!plan.popular) {
                        e.currentTarget.style.background = PRIMARY_COLOR
                        e.currentTarget.style.color = "white"
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!plan.popular) {
                        e.currentTarget.style.background = "white"
                        e.currentTarget.style.color = PRIMARY_COLOR
                      }
                    }}
                    onClick={() => handleSelectPlan(plan.planAccessName)}
                  >
                    {plan.popular ? "Start Now" : "Select Plan"}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>500+</div>
            <p className="text-gray-600">Active Restaurants</p>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>4.9★</div>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>24/7</div>
            <p className="text-gray-600">Customer Support</p>
          </div>
        </div>
      </main>
    </div>
  )
}
