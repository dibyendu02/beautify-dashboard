import { MerchantAuthProvider } from '@/hooks/useMerchantAuth'

export default function MerchantRegisterLayout({
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