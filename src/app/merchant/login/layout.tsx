import { MerchantAuthProvider } from '@/hooks/useMerchantAuth'

export default function MerchantLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MerchantAuthProvider>
      {children}
    </MerchantAuthProvider>
  )
}