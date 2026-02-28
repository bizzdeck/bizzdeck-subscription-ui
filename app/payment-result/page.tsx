import { Suspense } from "react"
import { Spinner } from "@/components/ui/spinner"
import PaymentResultContent from "./PaymentResultContent"

function PaymentResultLoading() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)" }}
    >
      <Spinner />
    </div>
  )
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PaymentResultLoading />}>
      <PaymentResultContent />
    </Suspense>
  )
}
