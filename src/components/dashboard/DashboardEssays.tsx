import { getPublishedEssays } from '@/lib/essays'

export default async function DashboardEssays() {
const essays = await getPublishedEssays()

return ( <div className="dashboard-module glass-card"> <p>Recent Essays</p>


  <h2>Latest Writing</h2>

  <div className="essay-list">
    {essays.map((essay: any) => (
      <a
        key={essay.slug}
        href={`/journal/${essay.slug}`}
        className="essay-link"
      >
        {essay.title}
      </a>
    ))}
  </div>
</div>


)
}
