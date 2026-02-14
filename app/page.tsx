"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useRouter } from 'next/navigation';
import { useAuth } from "./authContext"

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [msg91AccessToken, setMsg91AccessToken] = useState("")
  const router = useRouter();
  const { login } = useAuth();

  const sendOtp = async () => {
    (window as any).sendOtp(
      `91${phoneNumber}`, // mandatory
      (data: any) => {
        console.log('OTP sent successfully.', data)
        setOtpSent(true)
      },
      (error: any) => console.log('Error occurred')
    );
  };

  const verifyOtp = async () => {
    (window as any).verifyOtp(
      otp, // OTP value
      (data: any) => {
        console.log('OTP verified: ', data)
        setIsLoading(false)
        setMsg91AccessToken(data.message)
      },
      (error: any) => console.log(error),
    );
  };

  const fetchUserDetails = async () => {
    const response = await fetch('https://api.bizzdeck.com/v1/users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phoneNumber: '+91' + phoneNumber,
        token: msg91AccessToken
      })
    })
    const userDetails = await response.json()
    console.log("userDetails", userDetails);
    login(userDetails.data);
    router.push("/restaurants")
  }

  useEffect(() => {
    if (msg91AccessToken) {
      console.log("msg91AccessToken", msg91AccessToken);
      fetchUserDetails();
    }
  }, [msg91AccessToken]);




  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to BizzDeck</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={otpSent}
            />
          </div>

          {otpSent && (
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          )}

          {!otpSent ? (
            <Button className="w-full" onClick={sendOtp} disabled={!phoneNumber || isLoading}>
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          ) : (
            <div className="space-y-3">
              <Button className="w-full" onClick={verifyOtp} disabled={!otp || isLoading}>
                {isLoading ? "Verifying..." : "Verify & Login"}
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setOtpSent(false)
                  setOtp("")
                }}
              >
                Change Number
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
