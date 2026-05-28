type Props = {
  left: React.ReactNode
  right: React.ReactNode
}

export default function EditorialGrid({
  left,
  right,
}: Props) {
  return (
    <section className="cinematic-section reveal">

      <div className="cinematic-container">

        <div className="editorial-grid">

          <div>
            {left}
          </div>

          <div>
            {right}
          </div>

        </div>

      </div>

    </section>
  )
}