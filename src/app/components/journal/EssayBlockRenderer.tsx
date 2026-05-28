import EssayQuote from './EssayQuote'

type Block = {
  type: string

  content?: string

  image?: string
}

type Props = {
  blocks: Block[]
}

export default function EssayBlockRenderer({
  blocks,
}: Props) {

  return (
    <>
      {blocks.map((block, index) => {

        switch (block.type) {

          case 'paragraph':

            return (

              <section
                key={index}
                className="cinematic-section cinematic-container"
              >

                <div
                  className="constraint-sm"
                  style={{
                    margin: '0 auto',
                  }}
                >

                  <p
                    className="editorial-copy"
                    style={{
                      fontSize: '1.08rem',

                      lineHeight: '2',
                    }}
                  >
                    {block.content}
                  </p>

                </div>

              </section>

            )

          case 'quote':

            return (
              <EssayQuote
                key={index}
                quote={block.content || ''}
              />
            )

          case 'image':

            return (

              <section
                key={index}
                className="cinematic-section"
              >

                <div className="fullscreen-media">

                  <img
                    src={block.image}
                    alt=""
                  />

                </div>

              </section>

            )

          default:
            return null

        }

      })}
    </>
  )
}