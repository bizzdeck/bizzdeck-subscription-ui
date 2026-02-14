"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [name, setName] = useState("")

  useEffect(() => {
    const planId = sessionStorage.getItem("selectedPlan")
    setSelectedPlan(planId)
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
    let subscription_id = '';
    try {
      const subRes = await fetch('/api/create-razorpay-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: selectedPlan })
      });
      const subData = await subRes.json();
      if (!subRes.ok || !subData.subscription_id) {
        throw new Error(subData.error || 'Could not create subscription');
      }
      subscription_id = subData.subscription_id;
    } catch (err) {
      alert('Failed to create subscription.');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: 'RAZORPAY_KEY_ID', // Replace with your Razorpay key id
      name: 'BizzDeck',
      description: 'Professional Plan - Monthly',
      subscription_id: subscription_id, // Use subscription_id from backend
      handler: function (response:any) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        // Redirect or update UI as needed
      },
      prefill: {
        name: name,
        email: '', // Optionally add user email
        contact: '', // Optionally add user phone
      },
      notes: {
        plan: 'Professional',
      },
      theme: {
        color: '#6366f1',
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Payment Details</h1>
          <p className="text-muted-foreground mt-1">Complete your purchase securely</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">

          <div>
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium text-foreground">Professional</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Billing</span>
                  <span className="font-medium text-foreground">Monthly</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-foreground">$79</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">per month</p>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handlePayment}
              >
                {isProcessing ? "Processing..." : "Complete Payment"}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Your payment information is secure and encrypted
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
