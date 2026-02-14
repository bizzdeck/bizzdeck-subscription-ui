"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

type Plan = {
  id: string
  name: string
  price: number
  interval: string
  features: string[]
  popular?: boolean
}

export default function PlansPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null)
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const restaurantId = sessionStorage.getItem("selectedRestaurant")
    setSelectedRestaurant(restaurantId)

    // TODO: Replace with your API call to fetch plans
    // const response = await fetch(`/api/plans?restaurantId=${restaurantId}`)
    // const data = await response.json()
    // setPlans(data)

    // Simulate API call
    setTimeout(() => {
      setPlans([
        {
          id: "1",
          name: "BizzDeck Lite",
          price: 999,
          interval: "month",
          features: ["Insights: Profitability Checker", "Account Manager: 15-minute virtual session (once a month) - Complementary", "Menu Reversal: Tool access for self-use"],
        },
        {
          id: "2",
          name: "Professional",
          price: 2499,
          interval: "month",
          features: ["Insights: Profitability Checker", "Consultations: 1 strategy call/week (30 mins each)", "Menu Reversal: Self-access + Guidance", "Growth Strategy: Tailored best practices based on your cuisine, location, and goals"],
          popular: true,
        },
        {
          id: "3",
          name: "Enterprise",
          price: 3499,
          interval: "month",
          features: [
            "Insights: Profitability Checker",
            "Consultations: 1 strategy call/week (30 mins each)",
            "Menu Reversal: Self-access + Guidance",
            "Growth Strategy: Tailored best practices based on your cuisine, location, and goals",
            "Aggregator Support: Swiggy & Zomato account manager coordination (1 call/month each)",
          ],
        },
      ])
      setIsLoading(false)
    }, 500)
  }, [])

  const handleSelectPlan = (planId: string) => {
    sessionStorage.setItem("selectedPlan", planId)
    router.push("/payment?planId=" + planId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading plans...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">Choose Your Plan</h1>
          <p className="text-muted-foreground mt-1">Select the perfect plan for your restaurant</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} style={{minHeight: "400px", display: "flex", flexDirection: "column", justifyContent: "space-between"}} className={`p-6 relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
              <div>
                {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              </div>

              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSelectPlan(plan.id)}
              >
                Select Plan
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
