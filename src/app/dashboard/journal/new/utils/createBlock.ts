import type {
  Block,
  BlockType,
} from '../types'

export function createBlock(
  type: BlockType
): Block {
  return {
    id: crypto.randomUUID(),
    type,
    content: '',
  }
}