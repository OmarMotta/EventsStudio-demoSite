import type { MetadataRoute } from 'next';
import { routes } from '@/lib/collections';
import { siteOrigin, indexable } from '@/lib/seo';
export default function sitemap():MetadataRoute.Sitemap { const origin=siteOrigin();return origin&&indexable()?routes.map(path=>({url:`${origin}${path}`})):[]; }
