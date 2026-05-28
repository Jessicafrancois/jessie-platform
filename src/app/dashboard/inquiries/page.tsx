import '../dashboard.css'

import { supabase }
from '../../../lib/supabase'

export default async function InquiriesPage() {

  const {
    data: inquiries,
  } = await supabase
    .from('inquiries')
    .select('*')
    .order(
      'created_at',
      { ascending: false }
    )

  return (

    <main className="dashboard-inquiries">

      <h1>
        Client Inquiries
      </h1>

      <div className="inquiry-list">

        {inquiries?.map((item) => (

          <div
            key={item.id}
            className="inquiry-card"
          >

            <h2>
              {item.name}
            </h2>

            <p>
              {item.email}
            </p>

            <p>
              {item.type}
            </p>

            <div>
              {item.message}
            </div>

          </div>

        ))}

        {!inquiries?.length && (

          <p>
            No inquiries yet.
          </p>

        )}

      </div>

    </main>
  )
}