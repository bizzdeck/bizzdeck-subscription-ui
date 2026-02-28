"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Home, Download } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const PRIMARY_COLOR = "#164B53"

export default function PaymentResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(true)
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    if (!searchParams) return
    const status = searchParams.get("status")
    const paymentId = searchParams.get("paymentId")
    const subscriptionId = searchParams.get("subscriptionId")
    const error = searchParams.get("error")

    setIsSuccess(status === "success")
    setPaymentDetails({
      paymentId,
      subscriptionId,
      error
    })
  }, [searchParams])

  const handleDownloadInvoice = () => {
    // TODO: Implement invoice download
    alert("Invoice download feature coming soon!")
  }

  const handleGoHome = () => {
    router.push("/restaurants")
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)" }}
    >
      <div className="w-full max-w-md">
        {isSuccess ? (
          // Success State
          <div className="animate-in fade-in duration-500">
            {/* Success Icon Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                {/* Animated background circle */}
                <div 
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{ background: `${PRIMARY_COLOR}20` }}
                ></div>
                
                {/* Checkmark icon */}
                <CheckCircle 
                  className="absolute inset-0 w-24 h-24 animate-bounce"
                  style={{ color: PRIMARY_COLOR }}
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Success Card */}
            <Card className="p-8 shadow-xl mb-6">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Payment Successful! 🎉
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                  Your subscription is now active
                </p>

                {/* Details Box */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Subscription Status</span>
                      <span 
                        className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                        style={{ background: PRIMARY_COLOR }}
                      >
                        Active
                      </span>
                    </div>
                    
                    {paymentDetails?.paymentId && (
                      <div className="flex justify-between items-center pb-3 border-b border-green-200">
                        <span className="text-gray-600">Payment ID</span>
                        <span className="text-sm font-mono text-gray-900">{paymentDetails.paymentId}</span>
                      </div>
                    )}

                    {paymentDetails?.subscriptionId && (
                      <div>
                        <span className="text-gray-600">Subscription ID</span>
                        <p className="text-sm font-mono text-gray-900 break-all mt-1">
                          {paymentDetails.subscriptionId}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features Unlocked */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Now Unlocked:</h3>
                  <ul className="space-y-2 text-left text-sm">
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
                      All premium features activated
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
                      24/7 dedicated support
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
                      Monthly subscription active
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-4 h-4" style={{ color: PRIMARY_COLOR }} />
                      Access to all tools and analytics
                    </li>
                  </ul>
                </div>

                {/* Next Steps */}
                <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
                  <p className="text-sm text-gray-600">
                    A confirmation email has been sent to your registered email address. You can now access all premium features in your dashboard.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full h-11 text-base font-semibold text-white transition-all duration-200"
                    style={{ background: PRIMARY_COLOR }}
                    onClick={handleGoHome}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 4px 12px ${PRIMARY_COLOR}40`
                      e.currentTarget.style.transform = "translateY(-2px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none"
                      e.currentTarget.style.transform = "translateY(0)"
                    }}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-11 text-base font-semibold transition-all duration-200"
                    style={{
                      color: PRIMARY_COLOR,
                      borderColor: PRIMARY_COLOR,
                      background: "transparent"
                    }}
                    onClick={handleDownloadInvoice}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                </div>
              </div>
            </Card>

            {/* Trust Message */}
            <p className="text-center text-sm text-gray-500">
              If you have any questions, please contact our{" "}
              <span style={{ color: PRIMARY_COLOR }} className="font-semibold cursor-pointer hover:underline">
                support team
              </span>
            </p>
          </div>
        ) : (
          // Failure State
          <div className="animate-in fade-in duration-500">
            {/* Failure Icon Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24">
                {/* Animated background circle */}
                <div 
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{ background: "#ef444420" }}
                ></div>
                
                {/* X icon */}
                <XCircle 
                  className="absolute inset-0 w-24 h-24 animate-bounce text-red-500"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Failure Card */}
            <Card className="p-8 shadow-xl mb-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Payment Failed
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  We couldn't process your payment
                </p>

                {/* Error Details */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-red-900 mb-2">Error Details:</h3>
                  <p className="text-sm text-red-700">
                    {paymentDetails?.error || "An error occurred while processing your payment. Please try again."}
                  </p>
                </div>

                {/* Common Solutions */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-gray-900 mb-3">What you can do:</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      Check your internet connection
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      Verify your payment details are correct
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      Try using a different payment method
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      Contact your card issuer if the problem persists
                    </li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full h-11 text-base font-semibold text-white transition-all duration-200"
                    style={{ background: PRIMARY_COLOR }}
                    onClick={() => window.history.back()}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 4px 12px ${PRIMARY_COLOR}40`
                      e.currentTarget.style.transform = "translateY(-2px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none"
                      e.currentTarget.style.transform = "translateY(0)"
                    }}
                  >
                    Try Again
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-11 text-base font-semibold transition-all duration-200"
                    style={{
                      color: PRIMARY_COLOR,
                      borderColor: PRIMARY_COLOR,
                      background: "transparent"
                    }}
                    onClick={handleGoHome}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to Home
                  </Button>
                </div>
              </div>
            </Card>

            {/* Support Message */}
            <p className="text-center text-sm text-gray-500">
              Still having issues? Contact our{" "}
              <span style={{ color: PRIMARY_COLOR }} className="font-semibold cursor-pointer hover:underline">
                24/7 support team
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
