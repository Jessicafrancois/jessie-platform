type DashboardHeaderProps = {
  title: string
  subtitle?: string
}

export default function DashboardHeader({
  title,
  subtitle,
}: DashboardHeaderProps) {

  return (

    <div className="dashboard-header">

     <DashboardHeader
  title="Worlds"
  subtitle="Build characters, lore, locations, organizations, and timelines."
/>

    </div>

  )

}