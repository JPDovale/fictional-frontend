import { connectionSSR } from '../fcapi/axiosSSR'

interface Price {
  id: string
  amount: number
}

interface GetPricesRes {
  prices: Price[]
}

export async function getPricesRequest() {
  return connectionSSR.get<GetPricesRes>('/products/prices')
}
