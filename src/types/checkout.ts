export type Period = 'monthly' | 'annually'

export interface Plan {
  id: number
  storeId: string
  title: string
  description: string
  fullPrice: number
  discountAmmount: number | null
  discountPercentage: number | null
  periodLabel: string
  period: Period
  discountCouponCode: string | null
  order: number
  installments: number
  acceptsCoupon: boolean
}

export interface Coupon {
  id: number
  code: string
  discount: number
}

export interface SubscriptionRequest {
  storeId: string
  cardCpf: string
  CVV: string
  expirationDate: string
  holder: string
  number: string
  installments: number
  couponCode: string | null
  userId: number
}

export interface Subscription {
  cardCpf: string
  method: 'credit_card'
  installments: number
  period: Period
  number: string
  price: number
  userId: number
}