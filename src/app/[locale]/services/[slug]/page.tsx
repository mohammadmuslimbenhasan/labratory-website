'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Link, useRouter } from '@/i18n/routing';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronRight, Clock, Shield, Star, FileText,
  ShoppingCart, ArrowLeft, Eye, FlaskConical,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ServiceDetailPage() {
  const t = useTranslations('services');
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [service, setService] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/services/${slug}`)
      .then(r => r.json())
      .then(data => { if (data.success) setService(data.data); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-12 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">服务未找到</h1>
          <Link href="/services"><Button variant="outline"><ArrowLeft className="h-4 w-4" />返回服务列表</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const category = service.category as Record<string, string> | null;
  const materials = (service.materials as Array<{ material: { nameZh: string; slug: string } }>) || [];
  const standards = (service.standards as Array<{ standard: { code: string; nameZh: string } }>) || [];
  const industries = (service.industries as Array<{ industry: { nameZh: string } }>) || [];
  const labServices = (service.labServices as Array<{ lab: { nameZh: string; slug: string; city?: string; rating?: number } }>) || [];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600">首页</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/services" className="hover:text-blue-600">检测服务</Link>
            <ChevronRight className="h-3 w-3" />
            {category && (
              <>
                <span className="hover:text-blue-600">{category.nameZh}</span>
                <ChevronRight className="h-3 w-3" />
              </>
            )}
            <span className="text-gray-900">{service.nameZh as string}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {service.isHot && <Badge variant="danger">热门</Badge>}
                {service.isFeatured && <Badge variant="info">推荐</Badge>}
                {category && <Badge variant="outline">{category.nameZh}</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.nameZh as string}</h1>
              {service.nameEn && <p className="text-gray-500">{service.nameEn as string}</p>}
            </div>

            <Card padding="lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('detail.overview')}</h2>
              <p className="text-gray-600 leading-relaxed">{service.shortDescZh as string}</p>
              {service.fullDescZh && <p className="text-gray-600 leading-relaxed mt-3">{service.fullDescZh as string}</p>}
            </Card>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card padding="md">
                <div className="flex items-center gap-2 mb-2"><Clock className="h-5 w-5 text-blue-600" /><h3 className="font-semibold text-gray-900">{t('detail.turnaround')}</h3></div>
                <p className="text-gray-600">{service.turnaroundDays ? `${service.turnaroundDays} 个工作日` : (service.turnaroundDesc as string || '咨询确认')}</p>
              </Card>
              <Card padding="md">
                <div className="flex items-center gap-2 mb-2"><Eye className="h-5 w-5 text-blue-600" /><h3 className="font-semibold text-gray-900">浏览量</h3></div>
                <p className="text-gray-600">{String(service.viewCount || 0)} 次浏览 · {String(service.orderCount || 0)} 次下单</p>
              </Card>
            </div>

            {standards.length > 0 && (
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('detail.standards')}</h2>
                <div className="flex flex-wrap gap-2">
                  {standards.map(s => <Badge key={s.standard.code} variant="outline">{s.standard.code} {s.standard.nameZh}</Badge>)}
                </div>
              </Card>
            )}

            {materials.length > 0 && (
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('detail.materials')}</h2>
                <div className="flex flex-wrap gap-2">
                  {materials.map(m => <Badge key={m.material.slug} variant="info">{m.material.nameZh}</Badge>)}
                </div>
              </Card>
            )}

            {industries.length > 0 && (
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('detail.industries')}</h2>
                <div className="flex flex-wrap gap-2">
                  {industries.map(ind => <Badge key={ind.industry.nameZh} variant="default">{ind.industry.nameZh}</Badge>)}
                </div>
              </Card>
            )}

            {service.sampleRequirement && (
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('detail.sampleReq')}</h2>
                <p className="text-gray-600 leading-relaxed">{service.sampleRequirement as string}</p>
              </Card>
            )}

            {service.deliverables && (
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('detail.deliverables')}</h2>
                <p className="text-gray-600 leading-relaxed">{service.deliverables as string}</p>
              </Card>
            )}

            {labServices.length > 0 && (
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">提供此服务的实验室</h2>
                <div className="space-y-3">
                  {labServices.map(ls => (
                    <Link key={ls.lab.slug} href={`/labs/${ls.lab.slug}`} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{ls.lab.nameZh}</p>
                        {ls.lab.city && <p className="text-sm text-gray-500">{ls.lab.city}</p>}
                      </div>
                      {ls.lab.rating && <div className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 text-yellow-500" />{String(ls.lab.rating)}</div>}
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card padding="lg" className="sticky top-24">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">{t('detail.pricing')}</p>
                  {service.priceMin ? (
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(Number(service.priceMin))}
                      {service.priceMax && Number(service.priceMax) !== Number(service.priceMin) && (
                        <span className="text-lg text-gray-400"> - {formatCurrency(Number(service.priceMax))}</span>
                      )}
                    </p>
                  ) : (
                    <p className="text-xl font-bold text-gray-900">询价服务</p>
                  )}
                </div>

                {service.turnaroundDays && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{service.turnaroundDays} 个工作日</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>CMA/CNAS 认可报告</span>
                </div>

                <div className="space-y-2 pt-2">
                  <Button fullWidth size="lg" onClick={() => router.push(`/rfq/new?service=${slug}`)}>
                    <ShoppingCart className="h-4 w-4" />{t('orderNow')}
                  </Button>
                  <Button fullWidth size="lg" variant="outline" onClick={() => router.push(`/rfq/new?service=${slug}`)}>
                    <FileText className="h-4 w-4" />{t('detail.requestQuote')}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
