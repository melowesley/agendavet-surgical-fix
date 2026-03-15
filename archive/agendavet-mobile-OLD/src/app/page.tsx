import { MobileLayout } from '@/components/mobile-layout'
import { DashboardMobile } from '@/components/dashboard-mobile'

export default function Home() {
  return (
    <MobileLayout title="Dashboard">
      <DashboardMobile />
    </MobileLayout>
  )
}
