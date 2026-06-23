import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import './dashboard.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard-shell">
      <DashboardSidebar />
      <div className="dashboard-page">
        {children}
      </div>
    </div>
  )
}
