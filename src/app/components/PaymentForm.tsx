'use client'

import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { apiService } from '../lib/api'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  bookingId: string
  amount: number
  onSuccess?: (paymentIntent: any) => void
  onError?: (error: string) => void
}

function PaymentForm({ bookingId, amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    try {
      // Create payment intent on your backend
      const { payment, clientSecret } = await apiService.createPayment({
        bookingId,
        provider: 'stripe'
      })

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
        onError?.(stripeError.message || 'Payment failed')
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm on backend
        await apiService.confirmPayment(payment.id, {
          paymentMethodId: paymentIntent.payment_method
        })
        
        onSuccess?.(paymentIntent)
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Payment error'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="p-4 border border-gray-300 rounded-md bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': { color: '#aab7c4' },
              },
            },
          }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Total: </span>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          {loading ? 'Processing...' : Pay utf8{amount.toFixed(2)}}
        </button>
      </div>
    </form>
  )
}

export default function PaymentWrapper(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  )
}
