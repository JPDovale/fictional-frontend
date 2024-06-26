import { useQuery } from '@tanstack/react-query'
import { usePersonsAttributes } from './usePersonsAttributes'
import { AttributeType } from '@/services/persons/getPersonAttributeRequest'
import { useToast } from '@/components/ui/use-toast'
import { getPersonsRequest } from '@/services/persons/getPersonsRequest'
import { StatusCode } from '@/shared/types/types/StatusCode'
import { createPersonAttributeRequest } from '@/services/persons/createPersonAttributeRequest'
import { useMapper } from '../useMapper'
import { attributesTypeMapper } from '@/configs/mappers/persons/attributesType'

interface UsePersonsProps {
  projectId?: string
}

export interface CreateAttributeForPersonProps {
  personId: string
  type: AttributeType
}
export function usePersons({ projectId }: UsePersonsProps) {
  const { toast } = useToast()
  const { refetchAttributes } = usePersonsAttributes({ projectId })

  const mapperAttributesType = useMapper(attributesTypeMapper)

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`projects:${projectId}:persons`],
    queryFn: async () => {
      if (!projectId) {
        return {
          persons: [],
        }
      }

      const response = await getPersonsRequest({
        projectId,
      })

      if (response.status !== StatusCode.OK) {
        toast({
          title: response.title,
          description: response.message,
          variant: 'destructive',
        })
      }

      if (response.status === StatusCode.OK && response.data) {
        return {
          persons: response.data.persons,
        }
      }

      return {
        persons: [],
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  async function createAttributeForPerson({
    personId,
    type,
  }: CreateAttributeForPersonProps) {
    if (!projectId) return

    const response = await createPersonAttributeRequest({
      projectId,
      personId,
      type,
    })

    if (response.status !== StatusCode.CREATED) {
      toast({
        title: response.title,
        description: response.message,
        variant: 'destructive',
      })
    }

    if (response.status === StatusCode.CREATED) {
      toast({
        title: 'Atributo criado',
        description: `${mapperAttributesType.getTranslation(type)} criado(a) com sucesso!`,
      })

      refetchAttributes()
    }
  }

  return {
    persons: data?.persons ?? [],
    isLoading,
    refetchPersons: refetch,
    createAttributeForPerson,
  }
}
