import { PreloadProvider } from '@/services/PreloadProvider'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <PreloadProvider>{children}</PreloadProvider>
}
