'use client'

export default function RecentActivity() {

  const activity = [

    {
      type: 'Entry',
      action: 'Edited',
      title: 'The Psychology of Curiosity',
    },

    {
      type: 'Project',
      action: 'Updated',
      title: 'Roadwise',
    },

    {
      type: 'Asset',
      action: 'Uploaded',
      title: 'Muse Moodboard',
    },

  ]

  return (

    <div className="recent-activity glass-card">

      <p className="dashboard-label">
        Recent Activity
      </p>

      <h2>
        Latest Changes
      </h2>

      <div className="activity-list">

        {activity.map((item, index) => (

          <div
            key={index}
            className="activity-item"
          >

            <span className="activity-type">
              {item.type}
            </span>

            <div>

              <strong>
                {item.action}
              </strong>

              <p>
                {item.title}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  )
}