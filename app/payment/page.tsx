"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Check } from "lucide-react"
import { useAuth } from "../authContext"
import { useRouter } from "next/navigation"
import { Plan, getPlanByAccessName } from "@/lib/plans"
import { postFetch } from "@/lib/apiService"

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [planDetails, setPlanDetails] = useState<Plan | null>(null)
  const { user } = useAuth();
  const router = useRouter()
  
  const PRIMARY_COLOR = "#164B53"

  useEffect(() => {
    if (!user) {
      sessionStorage.clear();
      router.push("/");
    }
  }, [user, router])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const planAccessName = searchParams.get("plan")
    const restaurantId = searchParams.get("restaurantId")
    
    setSelectedPlan(planAccessName)
    setSelectedRestaurant(restaurantId ? parseInt(restaurantId) : null)
    
    // Get plan details using the planAccessName
    if (planAccessName) {
      const plan = getPlanByAccessName(planAccessName)
      if (plan) {
        setPlanDetails(plan)
      }
    }
  }, [])

  // Helper to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Failed to load Razorpay SDK.');
      setIsProcessing(false);
      return;
    }


    // Fetch subscription_id from backend using plan_id
    let subscriptionId = '';
    try {
      const payload = {
        plan: planDetails?.planAccessName,
        restaurantId: selectedRestaurant
      }

      const response = await postFetch(
        'https://api.bizzdeck.com/v1/payment/subscription',
        {
          payload,
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        }
      )

      if (!response.success) {
        throw new Error(response.error || 'Could not create subscription');
      }

      if (!response.data?.data?.subscriptionId) {
        throw new Error('Missing subscription ID in response');
      }

      subscriptionId = response.data.data.subscriptionId;
    } catch (err) {
      alert('Failed to create subscription.');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: 'rzp_test_SKOnITDPocKsEh', // Replace with your Razorpay key id
      name: 'BizzDeck',
      description: `${planDetails?.name || 'Professional'} Plan - Monthly`,
      subscription_id: subscriptionId, // Use subscription_id from backend
      handler: function (response:any) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        // Redirect or update UI as needed
      },
      prefill: {
        name: user?.name || '',
        email: '',
        contact: user?.phoneNumber || '',
      },
      notes: {
        plan: selectedPlan || '',
        restaurant: selectedRestaurant?.toString() || '',
      },
      theme: {
        color: PRIMARY_COLOR,
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', function () {
      alert('Oops, something went wrong. Payment failed.');
      setIsProcessing(false);
    });
    rzp.open();
    setIsProcessing(false);
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      {/* Header */}
      <header style={{ background: PRIMARY_COLOR }} className="text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            className="mb-4 text-white hover:bg-white/20"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold">Complete Your Purchase</h1>
          <p className="text-white/80 mt-1">Secure payment with Razorpay</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left: Illustration */}
          <div className="flex items-start justify-center">
            <Card className="p-8 w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2" style={{ borderColor: PRIMARY_COLOR }}>
              <div className="flex flex-col items-center justify-center h-full min-h-96">
                {/* SVG Illustration */}
                <svg className="w-full max-w-xs mb-6 mx-auto" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Payment Card */}
                  <rect x="50" y="80" width="200" height="120" rx="8" fill={PRIMARY_COLOR} opacity="0.1" stroke={PRIMARY_COLOR} strokeWidth="2"/>
                  <circle cx="70" cy="110" r="8" fill={PRIMARY_COLOR}/>
                  <line x1="55" y1="155" x2="245" y2="155" stroke={PRIMARY_COLOR} strokeWidth="1.5" strokeDasharray="5,5" opacity="0.5"/>
                  
                  {/* Security Checkmark */}
                  <circle cx="240" cy="60" r="25" fill={PRIMARY_COLOR} opacity="0.2" stroke={PRIMARY_COLOR} strokeWidth="2"/>
                  <path d="M230 60 L235 65 L250 50" stroke={PRIMARY_COLOR} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  
                  {/* Money Bag */}
                  <circle cx="100" cy="240" r="20" fill={PRIMARY_COLOR} opacity="0.15" stroke={PRIMARY_COLOR} strokeWidth="1.5"/>
                  <path d="M95 225 Q95 220 100 220 Q105 220 105 225 L105 245 Q105 250 100 250 Q95 250 95 245 Z" fill={PRIMARY_COLOR} opacity="0.3" stroke={PRIMARY_COLOR} strokeWidth="1.5"/>
                  <line x1="95" y1="225" x2="105" y2="225" stroke={PRIMARY_COLOR} strokeWidth="1.5"/>
                  
                  {/* Checkmark List */}
                  <circle cx="180" cy="220" r="5" fill={PRIMARY_COLOR}/>
                  <line x1="190" y1="215" x2="240" y2="215" stroke={PRIMARY_COLOR} strokeWidth="2" opacity="0.6"/>
                  <circle cx="180" cy="245" r="5" fill={PRIMARY_COLOR}/>
                  <line x1="190" y1="240" x2="240" y2="240" stroke={PRIMARY_COLOR} strokeWidth="2" opacity="0.6"/>
                </svg>

                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: PRIMARY_COLOR }}>
                    Unlock Premium Features
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    Get instant access to advanced tools and dedicated support for your business
                  </p>
                  
                  {/* Benefits */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
                      <span className="text-gray-700">Instant Access</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
                      <span className="text-gray-700">24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
                      <span className="text-gray-700">Money Back</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
                      <span className="text-gray-700">No Hidden Fees</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-6">
            {/* Plan Details Card */}
            <Card className="overflow-hidden border-2" style={{ borderColor: PRIMARY_COLOR }}>
              <div style={{ background: PRIMARY_COLOR }} className="text-white p-6">
                <h3 className="text-2xl font-bold">{planDetails?.name || "Professional Plan"}</h3>
                <p className="text-white/80 mt-1">Monthly Subscription</p>
              </div>

              <div className="p-8">
                {/* Price */}
                <div className="mb-8">
                  <p className="text-gray-600 text-sm font-semibold mb-2">Amount Due</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold" style={{ color: PRIMARY_COLOR }}>
                      ₹{planDetails?.price || 2499}
                    </span>
                    <span className="text-gray-600 text-lg">/month</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">Automatic renewal after 30 days</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8 border-t border-gray-200 pt-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Plan Includes:</h4>
                  <ul className="space-y-3">
                    {planDetails?.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: PRIMARY_COLOR }} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Order Details */}
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg mb-8 border border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-semibold text-gray-900">{planDetails?.name || "Professional"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Billing Cycle</span>
                    <span className="font-semibold text-gray-900">Monthly</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Next Billing</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>
                      ₹{planDetails?.price || 2499}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-12 text-base font-semibold text-white"
                  style={{ 
                    background: PRIMARY_COLOR,
                    opacity: isProcessing ? 0.6 : 1
                  }}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span> Processing Payment...
                    </span>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By clicking "Proceed to Checkout", you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </Card>

            {/* Money Back Guarantee */}
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>✓ 7-Day Money Back Guarantee</strong><br/>
                Cancel anytime if you're not satisfied
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
