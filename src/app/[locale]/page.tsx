'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  FlaskConical, Search, ArrowRight, Shield, Zap, Eye, Lock,
  Microscope, Building2, FileText, Star, ChevronRight,
  Users, BarChart3, CheckCircle2, Sparkles,
} from 'lucide-react';

// Demo data for the homepage
const hotServices = [
  { id: '1', slug: 'tensile-test', nameZh: '拉伸试验', category: '力学性能', price: 800, turnaround: 5, isHot: true },
  { id: '2', slug: 'hardness-test', nameZh: '硬度测试', category: '力学性能', price: 500, turnaround: 3, isHot: true },
  { id: '3', slug: 'chemical-composition', nameZh: '化学成分分析', category: '化学分析', price: 1200, turnaround: 7, isHot: false },
  { id: '4', slug: 'fatigue-test', nameZh: '疲劳试验', category: '力学性能', price: 3000, turnaround: 15, isHot: true },
  { id: '5', slug: 'corrosion-test', nameZh: '腐蚀试验', category: '环境模拟', price: 2000, turnaround: 20, isHot: false },
  { id: '6', slug: 'metallographic', nameZh: '金相分析', category: '微观分析', price: 600, turnaround: 3, isHot: false },
];

const categories = [
  { icon: '🔬', name: '力学性能测试', count: 45 },
  { icon: '🧪', name: '化学成分分析', count: 32 },
  { icon: '🌡️', name: '环境模拟试验', count: 28 },
  { icon: '📐', name: '尺寸计量检测', count: 20 },
  { icon: '⚡', name: '电子电气测试', count: 35 },
  { icon: '🛡️', name: '可靠性测试', count: 18 },
  { icon: '🔩', name: '无损检测', count: 22 },
  { icon: '🧬', name: '材料微观分析', count: 15 },
];

const stats = [
  { value: '2000+', label: '检测项目' },
  { value: '150+', label: '合作实验室' },
  { value: '10000+', label: '服务客户' },
  { value: '50000+', label: '检测报告' },
];

export default function HomePage() {
  const t = useTranslations('home');
  const tServices = useTranslations('services');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg lg:text-xl text-blue-100 mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && searchQuery) router.push(`/services?q=${encodeURIComponent(searchQuery)}`); }}
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
                />
              </div>
              <button onClick={() => { if (searchQuery) router.push(`/services?q=${encodeURIComponent(searchQuery)}`); }} className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold transition-colors shadow-lg">
                {tCommon('search')}
              </button>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-2">
              {['拉伸试验', '硬度测试', '化学成分', 'GB/T 228', '盐雾试验'].map((tag) => (
                <span key={tag} onClick={() => router.push(`/services?q=${encodeURIComponent(tag)}`)} className="px-3 py-1.5 bg-white/10 rounded-full text-sm hover:bg-white/20 cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-12">{t('features.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: t('features.professional.title'), desc: t('features.professional.desc'), color: 'text-blue-600 bg-blue-100' },
              { icon: Zap, title: t('features.fast.title'), desc: t('features.fast.desc'), color: 'text-orange-600 bg-orange-100' },
              { icon: Eye, title: t('features.transparent.title'), desc: t('features.transparent.desc'), color: 'text-green-600 bg-green-100' },
              { icon: Lock, title: t('features.secure.title'), desc: t('features.secure.desc'), color: 'text-purple-600 bg-purple-100' },
            ].map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">服务分类</h2>
            <Link href="/services" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              {tCommon('viewAll')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href="/services"
                className="flex flex-col items-center p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all bg-white"
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-sm font-medium text-gray-800 text-center">{cat.name}</span>
                <span className="text-xs text-gray-400 mt-1">{cat.count}项</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Services */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">{t('hotServices')}</h2>
            <Link href="/services" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              {tCommon('viewAll')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{service.category}</span>
                    {service.isHot && (
                      <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full ml-2">热门</span>
                    )}
                  </div>
                  <FlaskConical className="h-5 w-5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{service.nameZh}</h3>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-lg font-bold text-blue-600">¥{service.price}</span>
                    <span className="text-xs text-gray-400 ml-1">起</span>
                  </div>
                  <span className="text-xs text-gray-500">{service.turnaround}个工作日</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendation CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6" />
                <span className="text-sm font-medium text-indigo-200">AI 智能推荐</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">不确定需要什么检测？</h2>
              <p className="text-indigo-100 mb-6">
                描述您的材料、产品或需求，AI将为您推荐最合适的检测方案和服务。
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="例如：我需要测试不锈钢管道的耐腐蚀性能..."
                  className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">
                  AI 推荐
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RFQ CTA */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <FileText className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">定制检测需求</h3>
              <p className="text-gray-500 mb-6">
                提交您的特殊检测需求，我们将为您匹配最合适的实验室和方案，提供专业报价。
              </p>
              <Link
                href="/rfq/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                提交需求 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <Building2 className="h-8 w-8 text-emerald-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">实验室合作</h3>
              <p className="text-gray-500 mb-6">
                加入我们的实验室合作网络，获取更多检测订单，扩大实验室业务。
              </p>
              <Link
                href="/labs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                了解更多 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Labs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">{t('partners')}</h2>
            <Link href="/labs" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              {tCommon('viewAll')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: '国家材料检测中心', city: '北京', specialties: ['力学性能', '化学分析'], rating: 4.9 },
              { name: '华东检验认证中心', city: '上海', specialties: ['环境试验', '可靠性'], rating: 4.8 },
              { name: '中南材料研究院', city: '长沙', specialties: ['金属材料', '焊接检验'], rating: 4.7 },
              { name: '西北质量检测所', city: '西安', specialties: ['无损检测', '计量校准'], rating: 4.8 },
            ].map((lab) => (
              <div key={lab.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{lab.name}</h4>
                <p className="text-xs text-gray-500 mb-3">{lab.city}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {lab.specialties.map((s) => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium text-gray-900">{lab.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
