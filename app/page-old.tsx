"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useRouter } from 'next/navigation';
import { useAuth } from "./authContext"
import { Phone, Lock, ArrowRight, CheckCircle } from "lucide-react"
import { postFetch } from "@/lib/apiService"

const PRIMARY_COLOR = "#164B53"

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [msg91AccessToken, setMsg91AccessToken] = useState("")
  const [error, setError] = useState("")
  const router = useRouter();
  const { login } = useAuth();

  const sendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number")
      return
    }
    setError("")
    setIsLoading(true);
    (window as any).sendOtp(
      `91${phoneNumber}`, // mandatory
      (data: any) => {
        console.log('OTP sent successfully.', data)
        setOtpSent(true)
        setIsLoading(false)
      },
      (error: any) => {
        console.log('Error occurred', error)
        setError("Failed to send OTP. Please try again.")
        setIsLoading(false)
      }
    );
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP")
      return
    }
    setError("")
    setIsLoading(true);
    (window as any).verifyOtp(
      otp, // OTP value
      (data: any) => {
        console.log('OTP verified: ', data)
        setMsg91AccessToken(data.message)
        setIsLoading(false)
      },
      (error: any) => {
        console.log(error)
        setError("Invalid OTP. Please try again.")
        setIsLoading(false)
      },
    );
  };

  const fetchUserDetails = async () => {
    try {
      const response = await postFetch(
        'https://api.bizzdeck.com/v1/users/signin',
        {
          payload: {
            phoneNumber: '+91' + phoneNumber,
            token: msg91AccessToken
          }
        }
      )

      if (!response.success) {
        setError("Failed to sign in. Please try again.")
        setIsLoading(false)
        return
      }

      console.log("userDetails", response.data);
      setIsLoading(false)
      login(response.data.data);
      router.push("/restaurants")
    } catch (err) {
      setError("Failed to sign in. Please try again.")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (msg91AccessToken) {
      console.log("msg91AccessToken", msg91AccessToken);
      fetchUserDetails();
    }
  }, [msg91AccessToken]);

  const handleKeyPress = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter') {
      callback()
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)" }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: `${PRIMARY_COLOR}15` }}
          >
            <Lock className="w-8 h-8" style={{ color: PRIMARY_COLOR }} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to BizzDeck</h1>
          <p className="text-gray-600">Sign in to manage your restaurant subscriptions</p>
        </div>

        {/* Main Card */}
        <Card className="p-8 shadow-xl">
          <div className="space-y-6">
            {/* Phone Number Field */}
            <div className="space-y-3">
              <Label htmlFor="phone" className="text-sm font-semibold text-gray-900">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10 digit number"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setPhoneNumber(value)
                    setError("")
                  }}
                  onKeyPress={(e) => !otpSent && handleKeyPress(e, sendOtp)}
                  disabled={otpSent}
                  className="pl-10 h-11 border-2 border-gray-200 focus:border-blue-500"
                  style={{
                    borderColor: otpSent ? "#e5e7eb" : undefined,
                    opacity: otpSent ? 0.6 : 1
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">Enter your 10-digit mobile number</p>
            </div>

            {/* OTP Field */}
            {otpSent && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <Label htmlFor="otp" className="text-sm font-semibold text-gray-900">
                  Enter OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="0000"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                    setOtp(value)
                    setError("")
                  }}
                  onKeyPress={(e) => handleKeyPress(e, verifyOtp)}
                  className="h-11 border-2 border-gray-200 focus:border-blue-500 text-center tracking-widest"
                />
                <p className="text-xs text-gray-500">6-digit code sent to +91{phoneNumber}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-in fade-in duration-300">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Buttons */}
            {!otpSent ? (
              <Button 
                className="w-full h-11 text-base font-semibold text-white transition-all duration-200"
                style={{ background: PRIMARY_COLOR }}
                onClick={sendOtp} 
                disabled={!phoneNumber || isLoading}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 12px ${PRIMARY_COLOR}40`
                  e.currentTarget.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span> Sending OTP...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Send OTP
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <Button 
                  className="w-full h-11 text-base font-semibold text-white transition-all duration-200"
                  style={{ background: PRIMARY_COLOR }}
                  onClick={verifyOtp} 
                  disabled={!otp || isLoading}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 4px 12px ${PRIMARY_COLOR}40`
                    e.currentTarget.style.transform = "translateY(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span> Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Verify & Login
                      <CheckCircle className="w-4 h-4" />
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-11 text-base font-semibold transition-all duration-200"
                  style={{
                    color: PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                    background: "transparent"
                  }}
                  onClick={() => {
                    setOtpSent(false)
                    setOtp("")
                    setError("")
                  }}
                >
                  Change Number
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <span style={{ color: PRIMARY_COLOR }} className="font-semibold cursor-pointer hover:underline">
                Terms of Service
              </span>
              {" "}and{" "}
              <span style={{ color: PRIMARY_COLOR }} className="font-semibold cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p>
          </div>
        </Card>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-sm">
            <div className="text-xl font-bold mb-1" style={{ color: PRIMARY_COLOR }}>🔒</div>
            <p className="text-gray-600 text-xs">Secure</p>
          </div>
          <div className="text-sm">
            <div className="text-xl font-bold mb-1" style={{ color: PRIMARY_COLOR }}>✓</div>
            <p className="text-gray-600 text-xs">Verified</p>
          </div>
          <div className="text-sm">
            <div className="text-xl font-bold mb-1" style={{ color: PRIMARY_COLOR }}>⚡</div>
            <p className="text-gray-600 text-xs">Instant</p>
          </div>
        </div>
      </div>
    </div>
  )
}
