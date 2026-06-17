import { supabase } from '@/lib/supabase'
import '../cms.css'
import './archive.css'
import ArchiveActions from './ArchiveActions'

export const revalidate = 0

export default async function ArchivePage() {
const { data: archived } = await supabase
.from('entries')
.select(`       id,
      title,
      slug,
      intro,
      type,
      published_at,
      updated_at,
      image
    `)
.eq('status', 'archived')
.order('updated_at', {
ascending: false,
})

return ( <main className="cms-page archive-page"> <div className="cms-header"> <div> <h1>Archive</h1>

      <p>
        Entries removed from the public site.
        Restore or delete permanently.
      </p>
    </div>

    <span className="archive-count">
      {archived?.length || 0} archived
    </span>
  </div>

  <div className="archive-list">
    {!archived || archived.length === 0 ? (
      <div className="archive-empty">
        <h3>Nothing archived yet.</h3>

        <p>
          Entries you archive from the
          publishing dashboard appear here.
        </p>
      </div>
    ) : (
      archived.map((entry) => (
        <div
          key={entry.id}
          className="archive-entry"
        >
          <div className="archive-entry-info">
            <div className="archive-entry-meta">
              <span className="archive-entry-type">
                {entry.type || 'Essay'}
              </span>

              {entry.published_at && (
                <span>
                  Published{' '}
                  {new Date(
                    entry.published_at
                  ).toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}
                </span>
              )}
            </div>

            <h3 className="archive-entry-title">
              {entry.title}
            </h3>

            {entry.intro && (
              <p className="archive-entry-excerpt">
                {entry.intro}
              </p>
            )}
          </div>

          <ArchiveActions
            entryId={entry.id}
            entryTitle={entry.title}
          />
        </div>
      ))
    )}
  </div>
</main>


)
}
