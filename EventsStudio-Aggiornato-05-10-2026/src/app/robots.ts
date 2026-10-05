import type { MetadataRoute } from 'next';
import { siteOrigin, indexable } from '@/lib/seo';
export default function robots():MetadataRoute.Robots {return indexable()?{rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:`${siteOrigin()}/sitemap.xml`}:{rules:{userAgent:'*',disallow:'/'}};}
