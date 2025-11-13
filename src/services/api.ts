import type { Plan, Coupon, SubscriptionRequest, Subscription } from '../types/checkout'
//LEMBRAR - Separar base url em arquivo .env
const API_BASE_URL = 'http://localhost:3000'

export async function getPlans(): Promise<Plan[]> {
  const res = await fetch(`${API_BASE_URL}/plans`)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return res.json() as Promise<Plan[]>
}

export async function getCoupons(): Promise<Coupon[]> {
  const res = await fetch(`${API_BASE_URL}/coupons`)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return res.json() as Promise<Coupon[]>
}

export async function validateCoupon(code: string): Promise<{ valid: boolean; discount?: number }> {
  const res = await fetch(`${API_BASE_URL}/coupon/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return res.json() as Promise<{ valid: boolean; discount?: number }>
}

export async function postSubscription(req: SubscriptionRequest): Promise<Subscription> {
  const res = await fetch(`${API_BASE_URL}/subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return res.json() as Promise<Subscription>
}

export async function getSubscription(userId: number): Promise<Subscription> {
  const res = await fetch(`${API_BASE_URL}/subscriptions/${userId}`)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status}: ${text}`)
  }
  return res.json() as Promise<Subscription>
}