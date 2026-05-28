import { supabase } from './supabase'

export async function uploadImage(
  file: File
) {

  const fileName = `${Date.now()}-${file.name}`

  const { error } = await supabase
    .storage
    .from('journal-images')
    .upload(fileName, file)

  if (error) {
    console.error(error)
    return null
  }

  const {
    data: { publicUrl },
  } = supabase
    .storage
    .from('journal-images')
    .getPublicUrl(fileName)

  return publicUrl
}