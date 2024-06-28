'use client'

import { useToast } from '@/components/ui/use-toast'
import { LocalStorageKeys } from '@/configs/localstorageKeys'
import { createCheckoutSessionRequest } from '@/services/products/createCheckoutSessionRequest'
import { getStripeJs } from '@/services/stripe'
import { StatusCode } from '@/shared/types/types/StatusCode'
import localstorageFunctions from '@/utils/localstorageFunctions'
import { useUser } from './useUser'

export function useCheckoutSession() {
  const { user } = useUser()
  const { toast } = useToast()
  const priceId = localstorageFunctions.Get<string>(LocalStorageKeys.PRICE_ID)

  async function getCheckoutSession() {
    if (!priceId) return
    localstorageFunctions.Remove(LocalStorageKeys.PRICE_ID)

    if (user?.isSubscriber && priceId) {
      toast({
        title: 'Assinatura',
        description:
          'Voce já tem uma assinatura ativa. Desative-a para prosseguir com uma nova. Não se preocupe, seus projectos não serão afetados no processo.',
      })
      return
    }

    const response = await createCheckoutSessionRequest({
      priceId,
    })

    if (response.status !== StatusCode.CREATED) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })

      return
    }

    if (response.status === StatusCode.CREATED && response.data) {
      const stripe = await getStripeJs()

      if (!stripe) {
        toast({
          title: 'Erro',
          description:
            'Houve um errro ao carregar o checkout! Tente novamente mais tarde',
          variant: 'destructive',
        })

        return
      }

      await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      })
    }
  }

  if (priceId) {
    getCheckoutSession()
  }
}
