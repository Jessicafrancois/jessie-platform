'use client'

import { PageBlock } from '@/lib/blocks/types'
import HeroBlock from '@/components/blocks/render/HeroBlock'
import RichTextBlock from '@/components/blocks/render/RichTextBlock'
import ImageBlock from '@/components/blocks/render/ImageBlock'
import GalleryBlock from '@/components/blocks/render/GalleryBlock'
import QuoteBlock from '@/components/blocks/render/QuoteBlock'
import ButtonBlock from '@/components/blocks/render/ButtonBlock'
import SpacerBlock from '@/components/blocks/render/SpacerBlock'
import DividerBlock from '@/components/blocks/render/DividerBlock'

// New blocks
import ColumnsBlock from '@/components/blocks/render/ColumnsBlock'
import TestimonialGridBlock from '@/components/blocks/render/TestimonialGridBlock'
import StatsRowBlock from '@/components/blocks/render/StatsRowBlock'
import VideoEmbedBlock from '@/components/blocks/render/VideoEmbedBlock'
import FAQBlock from '@/components/blocks/render/FAQBlock'
import LogoStripBlock from '@/components/blocks/render/LogoStripBlock'
import TeamGridBlock from '@/components/blocks/render/TeamGridBlock'

// World Slider / Projects / Journal Feed fetch live data server-side in the
// PUBLIC BlockRenderer. The editor preview shows a placeholder instead of
// re-querying Supabase from the client on every keystroke — the published
// page is always the source of truth for what visitors actually see.
function DynamicBlockPreview({ label }: { label: string }) {
  return (
    <div className="bb-dynamic-placeholder">
      <span>{label}</span>
      <p>Live data renders here on the published page.</p>
    </div>
  )
}

export default function PreviewCanvas({
  blocks, selectedId, onSelectAction,
}: {
  blocks: PageBlock[]
  selectedId: string | null
  onSelectAction: (id: string) => void
}) {
  return (
    <div className="bb-canvas">
      <p className="bb-panel-label">Preview</p>
      <div className="bb-canvas-frame">
        {blocks.length === 0 && <div className="bb-canvas-empty">This page has no blocks yet.</div>}

        {blocks.map(block => (
          <div
            key={block.id}
            className={`bb-canvas-block ${block.id === selectedId ? 'is-selected' : ''}`}
            onClick={() => onSelectAction(block.id)}
          >
            {block.type === 'hero'         && <HeroBlock content={block.content as any} />}
            {block.type === 'richtext'     && <RichTextBlock content={block.content as any} />}
            {block.type === 'image'        && <ImageBlock content={block.content as any} />}
            {block.type === 'gallery'      && <GalleryBlock content={block.content as any} />}
            {block.type === 'quote'        && <QuoteBlock content={block.content as any} />}
            {block.type === 'button'       && <ButtonBlock content={block.content as any} />}
            {block.type === 'world_slider' && <DynamicBlockPreview label="World Slider" />}
            {block.type === 'projects'     && <DynamicBlockPreview label="Projects" />}
            {block.type === 'journal_feed' && <DynamicBlockPreview label="Journal Feed" />}
            {block.type === 'spacer'       && <SpacerBlock content={block.content as any} />}
            {block.type === 'divider'      && <DividerBlock content={block.content as any} />}
            {block.type === 'columns'       && (<DynamicBlockPreview label="Columns" />
)}
{block.type === 'moodboard_embed' && (
  <DynamicBlockPreview label="Moodboard" />
)}

{block.type === 'testimonial_grid' && (
  <DynamicBlockPreview label="Testimonials" />
)}

{block.type === 'stats_row' && (
  <DynamicBlockPreview label="Stats Row" />
)}

{block.type === 'contact_form' && (
  <DynamicBlockPreview label="Contact Form" />
)}

{block.type === 'video_embed' && (
  <DynamicBlockPreview label="Video Embed" />
)}

{block.type === 'faq' && (
  <DynamicBlockPreview label="FAQ" />
)}

{block.type === 'logo_strip' && (
  <DynamicBlockPreview label="Logo Strip" />
)}

{block.type === 'team_grid' && (
  <DynamicBlockPreview label="Team Grid" />
)}

{block.type === 'columns'          && <ColumnsBlock         content={block.content as any} />}
{block.type === 'testimonial_grid' && <TestimonialGridBlock content={block.content as any} />}
{block.type === 'stats_row'        && <StatsRowBlock        content={block.content as any} />}
{block.type === 'video_embed'      && <VideoEmbedBlock      content={block.content as any} />}
{block.type === 'faq'              && <FAQBlock             content={block.content as any} />}
{block.type === 'logo_strip'       && <LogoStripBlock       content={block.content as any} />}
{block.type === 'team_grid'        && <TeamGridBlock        content={block.content as any} />}
{block.type === 'moodboard_embed'  && <DynamicBlockPreview label="Moodboard Embed" />}
{block.type === 'contact_form'     && <DynamicBlockPreview label="Contact Form" />}
          </div>
        ))}
      </div>
    </div>
  )
}