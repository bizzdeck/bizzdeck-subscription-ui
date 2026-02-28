"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Store, LogOut, Building2 } from "lucide-react"
import { Restaurant, useAuth } from "../authContext"
import { useRouter } from "next/navigation"

const PRIMARY_COLOR = "#164B53"

export default function RestaurantsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurant] = useState<Restaurant[]>(user?.restaurants as Restaurant[] ?? [])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }
    
    // Simulate loading
    setTimeout(() => {
      setRestaurant(user?.restaurants as Restaurant[] ?? [])
      setIsLoading(false)
    }, 300)
  }, [user, router])

  const handleSelectRestaurant = (restaurantId: string) => {
    sessionStorage.setItem("selectedRestaurant", restaurantId)
    router.push("/plans?restaurantId=" + restaurantId)
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-4 animate-spin mx-auto mb-4" style={{ borderTopColor: PRIMARY_COLOR }}></div>
          <p className="text-gray-600 font-medium">Loading restaurants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)" }}>
      {/* Header */}
      <header style={{ background: PRIMARY_COLOR }} className="text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
              <p className="text-white/80">{user?.name || "User"}</p>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Select Your Restaurant</h2>
            <p className="text-white/80">Choose a restaurant to view and manage subscription plans</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {restaurants.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Restaurants Found</h3>
            <p className="text-gray-600 mb-6">You don't have any restaurants registered yet.</p>
            <Button
              style={{ background: PRIMARY_COLOR, color: "white" }}
              onClick={handleLogout}
            >
              Go Back
            </Button>
          </Card>
        ) : (
          <div>
            <div className="mb-8">
              <p className="text-gray-600 text-sm">
                {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} registered
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {restaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer group"
                  onClick={() => handleSelectRestaurant(restaurant.id as string)}
                >
                  {/* Card Header */}
                  <div 
                    className="h-2"
                    style={{ background: PRIMARY_COLOR }}
                  ></div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div 
                          className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                          style={{ background: `${PRIMARY_COLOR}15` }}
                        >
                          <Store className="w-7 h-7" style={{ color: PRIMARY_COLOR }} />
                        </div>

                        {/* Info */}
                        <div className="flex-grow">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {restaurant.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{restaurant.location}</p>
                          
                          {/* FSSAI Info */}
                          <div className="flex items-center gap-2 mt-2">
                            <span 
                              className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                              style={{ background: PRIMARY_COLOR }}
                            >
                              FSSAI {restaurant.fssaiExpiryDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight 
                        className="w-5 h-5 transition-all duration-300 flex-shrink-0 group-hover:translate-x-1"
                        style={{ color: PRIMARY_COLOR }}
                      />
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full mt-4 h-10 font-semibold transition-all duration-200"
                      style={{
                        background: PRIMARY_COLOR,
                        color: "white"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 4px 12px ${PRIMARY_COLOR}40`
                        e.currentTarget.style.transform = "translateY(-2px)"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none"
                        e.currentTarget.style.transform = "translateY(0)"
                      }}
                    >
                      View Plans
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Info Section */}
        {restaurants.length > 0 && (
          <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
                {restaurants.length}
              </div>
              <p className="text-gray-600">Restaurants</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>3</div>
              <p className="text-gray-600">Plan Options</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>24/7</div>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
