import type { Metadata } from 'next';
import GlassHero from '@/components/glass-hero';

export const metadata: Metadata = {
  title: 'Sanampalli PavanKalyan — Personal Portfolio',
  description: 'Hi, I\'m Sanampalli PavanKalyan, a Full-Stack Python Web Developer. Personally designed interactive editorial portfolio showcasing engineering and creative product work.',
};

export default function Home() {
  return <GlassHero />;
}
