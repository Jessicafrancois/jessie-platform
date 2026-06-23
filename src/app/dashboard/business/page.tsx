import { Metadata } from 'next'
import BusinessShell from '@/components/Business/BusinessShell'
import './business.css'

export const metadata: Metadata = {
  title: 'Business · Dashboard',
}

export default function BusinessPage() {
  return <BusinessShell />
}