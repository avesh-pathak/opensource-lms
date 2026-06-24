import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth-context'

interface CheckoutButtonProps {
  amount: number
  currency?: string
  buttonText?: string
}

export default function CheckoutButton({
  amount,
  currency = 'INR',
  buttonText = 'Buy Now',
}: CheckoutButtonProps) {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to continue')
      return
    }

    setIsLoading(true)

    try {
      const res = await loadRazorpayScript()

      if (!res) {
        toast.error('Razorpay SDK failed to load')
        return
      }

      // 1. Create Order
      const orderRes = await fetch('/api/payments/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency }),
      })
      const orderData = await orderRes.json()

      if (!orderRes.ok) throw new Error(orderData.error)

      // 2. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC variable or fetch from server if preferred
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Platform Name',
        description: 'Transaction Description',
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.id,
              amount: amount,
              currency: currency,
            }),
          })

          const verifyData = await verifyRes.json()

          if (verifyData.success) {
            toast.success('Payment Successful!')
          } else {
            toast.error('Payment Verification Failed')
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#3399cc',
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={isLoading}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {buttonText} {amount > 0 && `(₹${amount})`}
    </Button>
  )
}
