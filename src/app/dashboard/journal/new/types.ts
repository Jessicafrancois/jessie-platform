
export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'quote'
  | 'checklist'
  | 'callout'
  | 'divider'

export interface Block {
  id: string
  type: BlockType
  content: string
  checked?: boolean
}
