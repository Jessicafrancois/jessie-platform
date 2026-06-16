'use client'

type EntrySettingsProps = {
saveDraftAction: () => void
publishEntryAction: () => void
}

export default function EntrySettings({
saveDraftAction,
publishEntryAction,
}: EntrySettingsProps) {
return ( <aside className="entry-settings"> <h3>Entry Settings</h3>

  <div className="setting-group">
    <label>Cover Image</label>

    <input
      type="file"
      accept="image/*"
    />
  </div>

  <div className="settings-actions">
    <button
      type="button"
      className="secondary-button"
      onClick={saveDraftAction}
    >
      Save Draft
    </button>

    <button
      type="button"
      className="primary-button"
      onClick={publishEntryAction}
    >
      Publish Entry
    </button>
  </div>
</aside>

)
}
