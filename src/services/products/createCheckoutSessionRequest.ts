import { connection } from '../fcapi/axios'

interface CreateCheckoutSessionReq {
  priceId: string
}

interface CreateCheckoutSessionRes {
  sessionId: string
}

export async function createCheckoutSessionRequest(
  props: CreateCheckoutSessionReq,
) {
  return connection.post<CreateCheckoutSessionRes>(`/products/checkout`, props)
}
