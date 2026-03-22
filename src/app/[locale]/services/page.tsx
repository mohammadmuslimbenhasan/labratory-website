'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Link } from '@/i18n/routing';
import {
  Search, SlidersHorizontal, Clock, Star, X,
  Beaker, Shield, Zap, ArrowUpDown, Grid3X3, List,
} from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { ServiceCardSkeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface Service {
  id: string;
  slug: string;
  nameZh: string;
  nameEn: string;
  shortDescZh: string | null;
  shortDescEn: string | null;
  priceMin: number | null;
  priceMax: number | null;
  turnaroundDays: number;
  orderCount: number;
  viewCount: number;
  category: { nameZh: string };
  materials: Array<{ material: { nameZh: string } }>;
  standards: Array<{ standard: { code: string } }>;
}

interface FilterOption {
  id: string;
  name: string;
  count?: number;
}

export default function ServicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<FilterOption[]>([]);
  const [materials, setMaterials] = useState<FilterOption[]>([]);
  const [industries, setIndustries] = useState<FilterOption[]>([]);
  const [standards, setStandards] = useState<FilterOption[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Get filters from URL
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedMaterial = searchParams.get('material') || '';
  const selectedIndustry = searchParams.get('industry') || '';
  const selectedStandard = searchParams.get('standard') || '';
  const sortBy = searchParams.get('sort') || 'popular';

  // Fetch filter options
  useEffect(() => {
    fetchFilters();
  }, []);

  // Fetch services when filters change
  useEffect(() => {
    fetchServices();
  }, [searchQuery, selectedCategory, selectedMaterial, selectedIndustry, selectedStandard, sortBy, page]);

  const fetchFilters = async () => {
    setFiltersLoading(true);
    try {
      const [catRes, matRes, indRes, stdRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/materials'),
        fetch('/api/industries'),
        fetch('/api/standards'),
      ]);

      const [catData, matData, indData, stdData] = await Promise.all([
        catRes.json(),
        matRes.json(),
        indRes.json(),
        stdRes.json(),
      ]);

      if (catData.success) setCategories([{ id: '', name: '全部分类', count: 0 }, ...catData.data]);
      if (matData.success) setMaterials(matData.data);
      if (indData.success) setIndustries(indData.data);
      if (stdData.success) setStandards(stdData.data);
    } catch (error) {
      console.error('Filters fetch error:', error);
    }
    setFiltersLoading(false);
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '12',
        ...(searchQuery && { query: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedMaterial && { material: selectedMaterial }),
        ...(selectedIndustry && { industry: selectedIndustry }),
        ...(selectedStandard && { standard: selectedStandard }),
        ...(sortBy && { sortBy }),
      });

      const res = await fetch(`/api/services?${params}`);
      const data = await res.json();

      if (data.success) {
        setServices(data.data || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error('Services fetch error:', error);
    }
    setLoading(false);
  };

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1'); // Reset to page 1
    router.push(`/services?${params.toString()}`);
    setPage(1);
  }, [searchParams, router]);

  const clearFilters = () => {
    router.push('/services');
    setPage(1);
  };

  const activeFiltersCount = [selectedCategory, selectedMaterial, selectedIndustry, selectedStandard, searchQuery].filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">专业检测服务</h1>
            <p className="text-lg text-blue-100 mb-6">覆盖多行业、多领域的权威第三方检测服务</p>
            
            <div className="flex gap-3">
              <div className="flex-1 relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="搜索服务名称、标准、关键词..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white text-gray-900"
                  value={searchQuery}
                  onChange={(e) => updateFilter('q', e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span className="hidden sm:inline">筛选</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-4 space-y-4">
                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">已选条件</h3>
                      <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        清空
                      </button>
                    </div>
                    <div className="space-y-2">
                      {searchQuery && (
                        <Badge variant="default" className="flex items-center gap-1">
                          搜索: {searchQuery}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('q', '')} />
                        </Badge>
                      )}
                      {selectedCategory && (
                        <Badge variant="default" className="flex items-center gap-1">
                          {categories.find(c => c.id === selectedCategory)?.name}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter('category', '')} />
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Category Filter */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">服务分类</h3>
                  {filtersLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-100 animate-pulse rounded" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => updateFilter('category', cat.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedCategory === cat.id
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span>{cat.name}</span>
                          {cat.count !== undefined && <span className="text-gray-400 ml-1">({cat.count})</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Material Filter */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">材料类型</h3>
                  {filtersLoading ? (
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-100 animate-pulse rounded" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {materials.slice(0, 6).map(mat => (
                        <button
                          key={mat.id}
                          onClick={() => updateFilter('material', mat.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedMaterial === mat.id
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {mat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Industry Filter */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">应用行业</h3>
                  {filtersLoading ? (
                    <div className="space-y-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-8 bg-gray-100 animate-pulse rounded" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {industries.slice(0, 6).map(ind => (
                        <button
                          key={ind.id}
                          onClick={() => updateFilter('industry', ind.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedIndustry === ind.id
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {ind.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Services Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  找到 <span className="font-semibold text-gray-900">{services.length}</span> 项服务
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="popular">热门推荐</option>
                    <option value="price-asc">价格从低到高</option>
                    <option value="price-desc">价格从高到低</option>
                    <option value="rating">评分最高</option>
                    <option value="newest">最新上架</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Grid3X3 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Services List */}
              {loading ? (
                <div className={`grid ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
                  {[...Array(6)].map((_, i) => (
                    <ServiceCardSkeleton key={i} />
                  ))}
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <Beaker className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">未找到相关服务</h3>
                  <p className="text-gray-600 mb-4">试试调整筛选条件或搜索关键词</p>
                  <button onClick={clearFilters} className="text-blue-600 hover:text-blue-700 font-medium">
                    清空筛选条件
                  </button>
                </div>
              ) : (
                <div className={`grid ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
                  {services.map(service => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                        <Beaker className="h-16 w-16 text-blue-300 group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {service.nameZh}
                          </h3>
                          <Badge variant="info" className="text-xs">
                            {service.category.nameZh}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {service.shortDescZh || '专业检测服务'}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            {service.priceMin && service.priceMax ? (
                              <>
                                <span className="text-2xl font-bold text-blue-600">
                                  ¥{service.priceMin.toLocaleString()}
                                </span>
                                {service.priceMin !== service.priceMax && (
                                  <span className="text-gray-500 ml-1">起</span>
                                )}
                              </>
                            ) : (
                              <span className="text-lg font-semibold text-blue-600">议价</span>
                            )}
                          </div>
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.turnaroundDays}天
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                          {service.viewCount} 次浏览 · {service.orderCount} 次下单
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {!loading && services.length > 0 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => {
                      setPage(p);
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('page', p.toString());
                      router.push(`/services?${params.toString()}`);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
