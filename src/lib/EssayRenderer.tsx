import './essay-blocks.css'

export default function EssayRenderer({
  blocks,
}: any) {

  return (
    <>

      {blocks?.map(
        (
          block: any,
          index: number
        ) => {

          switch (block.type) {

            case 'paragraph':

              return (
                <p
                  key={index}
                  className="essay-paragraph"
                >
                  {block.content}
                </p>
              )

            case 'quote':

              return (
                <blockquote
                  key={index}
                  className="essay-quote"
                >
                  “{block.content}”
                </blockquote>
              )

            case 'ambient-quote':

              return (
                <section
                  key={index}
                  className="essay-ambient-quote"
                >

                  <blockquote>
                    “{block.content}”
                  </blockquote>

                </section>
              )

            case 'image':

              return (
                <div
                  key={index}
                  className="essay-image-wrap"
                >

                  <img
                    src={block.content}
                    alt=""
                    className="essay-image"
                  />

                </div>
              )

            case 'fullscreen-image':

              return (
                <section
                  key={index}
                  className="essay-fullscreen-image"
                >

                  <img
                    src={block.content}
                    alt=""
                  />

                </section>
              )

            case 'split':

              return (
                <section
                  key={index}
                  className="essay-split"
                >

                  <div className="essay-split-copy">

                    <p>
                      {block.content}
                    </p>

                  </div>

                  {block.image && (

                    <div className="essay-split-image">

                      <img
                        src={block.image}
                        alt=""
                      />

                    </div>

                  )}

                </section>
              )

            case 'gallery':

              return (
                <section
                  key={index}
                  className="essay-gallery"
                >

                  {block.images?.map(
                    (
                      image: string,
                      i: number
                    ) => (

                      <div
                        key={i}
                        className="essay-gallery-item"
                      >

                        <img
                          src={image}
                          alt=""
                        />

                      </div>

                    )
                  )}

                </section>
              )

            case 'timeline':

              return (
                <section
                  key={index}
                  className="essay-timeline"
                >

                  {block.items?.map(
                    (
                      item: any,
                      i: number
                    ) => (

                      <div
                        key={i}
                        className="essay-timeline-item"
                      >

                        <div className="essay-timeline-year">
                          {item.year}
                        </div>

                        <div>

                          <h3 className="essay-timeline-title">
                            {item.title}
                          </h3>

                          <p className="essay-timeline-description">
                            {item.description}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </section>
              )

            default:
              return null
          }
        }
      )}

    </>
  )
}