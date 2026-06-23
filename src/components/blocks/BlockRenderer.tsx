import { PageBlock } from '@/lib/blocks/types'
import HeroBlock from './render/HeroBlock'
import RichTextBlock from './render/RichTextBlock'
import ImageBlock from './render/ImageBlock'
import GalleryBlock from './render/GalleryBlock'
import QuoteBlock from './render/QuoteBlock'
import ButtonBlock from './render/ButtonBlock'
import WorldSliderBlock from './render/WorldSliderBlock'
import ProjectsBlock from './render/ProjectsBlock'
import JournalFeedBlock from './render/JournalFeedBlock'
import SpacerBlock from './render/SpacerBlock'
import DividerBlock from './render/DividerBlock'

// Add to imports:
import ColumnsBlock         from './render/ColumnsBlock'
import MoodboardEmbedBlock  from './render/MoodboardEmbedBlock'
import TestimonialGridBlock from './render/TestimonialGridBlock'
import StatsRowBlock        from './render/StatsRowBlock'
import ContactFormBlock     from './render/ContactFormBlock'
import VideoEmbedBlock      from './render/VideoEmbedBlock'
import FAQBlock             from './render/FAQBlock'
import LogoStripBlock       from './render/LogoStripBlock'
import TeamGridBlock        from './render/TeamGridBlock'

export default async function BlockRenderer({ block }: { block: PageBlock }) {
  switch (block.type) {
    case 'hero':          return <HeroBlock content={block.content as any} />
    case 'richtext':      return <RichTextBlock content={block.content as any} />
    case 'image':         return <ImageBlock content={block.content as any} />
    case 'gallery':       return <GalleryBlock content={block.content as any} />
    case 'quote':         return <QuoteBlock content={block.content as any} />
    case 'button':        return <ButtonBlock content={block.content as any} />
    case 'world_slider':  return <WorldSliderBlock content={block.content as any} />
    case 'projects':      return <ProjectsBlock content={block.content as any} />
    case 'journal_feed':  return <JournalFeedBlock content={block.content as any} />
    case 'spacer':        return <SpacerBlock content={block.content as any} />
    case 'divider':       return <DividerBlock content={block.content as any} />
    case 'columns':          return <ColumnsBlock         content={block.content as any} />
    case 'moodboard_embed':  return <MoodboardEmbedBlock  content={block.content as any} />
    case 'testimonial_grid': return <TestimonialGridBlock content={block.content as any} />
    case 'stats_row':        return <StatsRowBlock        content={block.content as any} />
    case 'contact_form':     return <ContactFormBlock     content={block.content as any} />
    case 'video_embed':      return <VideoEmbedBlock      content={block.content as any} />
    case 'faq':              return <FAQBlock             content={block.content as any} />
    case 'logo_strip':       return <LogoStripBlock       content={block.content as any} />
    case 'team_grid':        return <TeamGridBlock        content={block.content as any} />
    default:               return null
  }
}