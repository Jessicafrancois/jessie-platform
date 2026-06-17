// src/lib/loadFonts.ts

import { supabase } from './supabase'

export async function loadFont(
  fontFile: string
) {
  const {
    data: { publicUrl },
  } = supabase
    .storage
    .from('fonts')
    .getPublicUrl(fontFile)

  const fontName =
    fontFile.replace(
      /\.(ttf|otf|woff|woff2)$/i,
      ''
    )

  if (
    !document.querySelector(
      `[data-font="${fontName}"]`
    )
  ) {

    const style =
      document.createElement('style')

    style.setAttribute(
      'data-font',
      fontName
    )

    style.innerHTML = `
      @font-face {
        font-family: '${fontName}';
        src: url('${publicUrl}');
      }
    `

    document.head.appendChild(
      style
    )
  }

  return fontName
}