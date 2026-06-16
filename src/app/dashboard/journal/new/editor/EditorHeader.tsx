'use client'

type EditorHeaderProps = {
  title: string

  setTitleAction: (value: string) => void
  excerpt: string

  setExcerptAction: (value: string) => void
  wordCount: number

  readingTime: number

  progress: number

  status: string
}

export default function EditorHeader({
  
  title,
  setTitleAction,

  excerpt,
  setExcerptAction,
  
  wordCount,
  
  readingTime,
  
  progress,
  
  status,
  
}: EditorHeaderProps) {

  return (

    
<div className="editor-document-header">
  <div
    className="writing-progress-bar"

    style={{
      width:
        `${progress}%`
    }}
  />


      <div className="editor-stats-card">

  <div className="stat-item">
    <span className="stat-label">
      Words
    </span>

    <span className="stat-value">
      {wordCount}
    </span>
  </div>

  <div className="stat-item">
    <span className="stat-label">
      Read Time
    </span>

    <span className="stat-value">
      {readingTime} min
    </span>
  </div>

  <div className="stat-item">
    <span className="stat-label">
      Status
    </span>

    <span className="stat-value">
      {status}
    </span>
  </div>

</div>

      <input
        type="text"
        placeholder="Untitled Entry"
        className="editor-title"

        value={title}

        onChange={(e) =>
          setTitleAction(
            e.target.value
          )
        }
      />




    <div className="writing-progress">
      </div>

      <textarea
        placeholder="Write a short introduction..."
        className="editor-excerpt"

        value={excerpt}

        onChange={(e) =>
          setExcerptAction(
            e.target.value
          )
        }
      />


    </div>

  )

}
