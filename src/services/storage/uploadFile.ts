import { StatusCode } from '@/shared/types/types/StatusCode'
import { getUploadUrlRequest } from '../projects/getUploadUrlRequest'
import axios from 'axios'

export async function uploadFile(file: File) {
  const response = await getUploadUrlRequest({
    filename: file.name,
    contentType: file.type,
  })

  if (response.status !== StatusCode.CREATED) {
    return {
      title: response.title,
      description: response.message,
      variant: 'destructive',
    }
  }

  let uploadUrl: string | null = null
  let imageName: string = ''

  if (response.status === StatusCode.CREATED && response.data) {
    uploadUrl = response.data.uploadUrl
    imageName = response.data.name
  }

  if (!uploadUrl) {
    return {
      title: 'Erro no upload da imagem',
      description: 'Tente novamente, se o erro persistir contate o suporte!',
      variant: 'destructive',
    }
  }

  try {
    const responseS3 = await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    })

    if (responseS3.status !== StatusCode.OK) {
      return {
        title: 'Erro ao enviar a imagem',
        description: 'Tente novamente, se o erro persistir contate o suporte!',
        variant: 'destructive',
      }
    }
  } catch (error) {
    return {
      title: 'Erro ao enviar a imagem',
      description: 'Tente novamente, se o erro persistir contate o suporte!',
      variant: 'destructive',
    }
  }

  return imageName
}
