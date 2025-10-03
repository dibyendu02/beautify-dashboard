import { MerchantAuthProvider } from '@/hooks/useMerchantAuth'

export default function MerchantPasswordResetLayout({
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