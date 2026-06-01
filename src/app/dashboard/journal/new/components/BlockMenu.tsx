import type { BlockType } from '../types'

interface Props {
  onSelect: (type: BlockType) => void
}

export default function BlockMenu({
  onSelect,
}: Props) {
  return (
    <div className="block-menu">
      <button onClick={() => onSelect('paragraph')}>
        Paragraph — Normal text

      </button>

      <button onClick={() => onSelect('heading1')}>
        Heading 1 — Page section
      </button>

      <button onClick={() => onSelect('heading2')}>
        Heading 2 — Sub section
      </button>

      <button onClick={() => onSelect('quote')}>
        Quote — Highlighted quote
      </button>

      <button onClick={() => onSelect('checklist')}>
       Checklist — Task list
      </button>

    <button
  onClick={() =>
    onSelect('callout')
  }
>
  Callout — Important note
</button>

<button
  onClick={() =>
    onSelect('divider')
  }
>
  Divider — Section break
</button>
<button
  onClick={() =>
    onSelect('callout')
  }
>
  Callout
</button>

<button
  onClick={() =>
    onSelect('divider')
  }
>
  Divider
</button>
    </div>
  )
}