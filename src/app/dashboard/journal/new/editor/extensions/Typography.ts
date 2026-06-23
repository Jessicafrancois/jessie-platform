import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {

  interface Commands<ReturnType> {

    typography: {

      setFontSize: (
        size: string
      ) => ReturnType

      setFontFamily: (
        family: string
      ) => ReturnType

      setFontWeight: (
        weight: string
      ) => ReturnType

    }

  }

}

export const Typography =
  Extension.create({

    name: 'typography',

    addCommands() {

      return {

        setFontSize:
          (size: string) =>
          ({ commands }) =>
            commands.setMark(
              'textStyle',
              { fontSize: size },
            ),

        setFontFamily:
          (family: string) =>
          ({ commands }) =>
            commands.setMark(
              'textStyle',
              { fontFamily: family },
            ),

        setFontWeight:
          (weight: string) =>
          ({ commands }) =>
            commands.setMark(
              'textStyle',
              { fontWeight: weight },
            ),

      }

    },

    addGlobalAttributes() {

      return [

        {

          types: [
            'textStyle',
          ],

          attributes: {

            fontSize: {

              default: null,

              renderHTML: attrs => {

                if (!attrs.fontSize)
                  return {}

                return {
                  style:
                    `font-size:${attrs.fontSize}`,
                }

              },

            },

            fontFamily: {

              default: null,

              renderHTML: attrs => {

                if (!attrs.fontFamily)
                  return {}

                return {
                  style:
                    `font-family:${attrs.fontFamily}`,
                }

              },

            },

            fontWeight: {

              default: null,

              renderHTML: attrs => {

                if (!attrs.fontWeight)
                  return {}

                return {
                  style:
                    `font-weight:${attrs.fontWeight}`,
                }

              },

            },

          },

        },

      ]

    },

  })
