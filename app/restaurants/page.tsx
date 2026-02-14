"use client"

import { use, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { ChevronRight, Store } from "lucide-react"
import { Restaurant, useAuth } from "../authContext"
import { useRouter } from "next/navigation"


export default function RestaurantsPage() {
  // TODO: Replace with your API call to fetch restaurants
  const {user} = useAuth();
  const router = useRouter();

  const [restaurants, setRestaurant] = useState<Restaurant[]>(user?.restaurants as Restaurant[] ?? [])
  

  const handleSelectRestaurant = (restaurantId: string) => {
    // Store selected restaurant in sessionStorage or pass via URL
    sessionStorage.setItem("selectedRestaurant", restaurantId)
    router.push("/plans?restaurantId=" + restaurantId)
  }

  useEffect(() => {
    
    // if (!user || !user?.restaurants) {
      console.log("User", user);
      setRestaurant([
        {
          id: '123',
          name: 'Sample Restaurant',
          location: 'Sample Location',
          fssaiExpiryDate: null,
          fssaiAboutToExpire: false
        },{
          id: '456',
          name: 'Demo Restaurant',
          location: 'Demo Location',
          fssaiExpiryDate: '2024-12-31',
          fssaiAboutToExpire: true
        },
        {
          id: '789',
          name: 'Test Restaurant',
          location: 'Test Location',
          fssaiExpiryDate: '2025-06-30',
          fssaiAboutToExpire: false
        }
      ])
    // }
  }, [user])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">My Restaurants</h1>
          <p className="text-muted-foreground mt-1">Select a restaurant to view available plans</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid gap-4">
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className="p-6 hover:border-primary transition-colors cursor-pointer"
              onClick={() => handleSelectRestaurant(restaurant.id as string)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Store className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground">{restaurant.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">{restaurant.fssaiExpiryDate} Cuisine</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
