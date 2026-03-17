'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Link } from '@/i18n/routing';
import {
  Search, SlidersHorizontal, Clock, Star, ChevronDown,
  Beaker, Shield, Zap, ArrowUpDown, Grid3X3, List,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { ServiceCardSkeleton } from '@/components/ui/skeleton';

const categories = [
  { id: 'all', name: '全部分类', count: 128 },
  { id: 'mechanical', name: '力学性能测试', count: 32 },
  { id: 'chemical', name: '化学成分分析', count: 28 },
  { id: 'environmental', name: '环境可靠性测试', count: 24 },
  { id: 'electrical', name: '电气安全测试', count: 18 },
  { id: 'ndt', name: '无损检测', count: 15 },
  { id: 'food', name: '食品安全检测', count: 11 },
];

const materials = [
  { id: 'metal', name: '金属材料' },
  { id: 'polymer', name: '高分子材料' },
  { id: 'ceramic', name: '陶瓷材料' },
  { id: 'composite', name: '复合材料' },
  { id: 'electronic', name: '电子元器件' },
  { id: 'food', name: '食品原料' },
];

const industries = [
  { id: 'auto', name: '汽车工业' },
  { id: 'aerospace', name: '航空航天' },
  { id: 'electronics', name: '电子电器' },
  { id: 'medical', name: '医疗器械' },
  { id: 'construction', name: '建筑建材' },
  { id: 'food', name: '食品饮料' },
];

const standards = [
  { id: 'gb', name: 'GB 国标' },
  { id: 'iso', name: 'ISO 国际标准' },
  { id: 'astm', name: 'ASTM 美标' },
  { id: 'din', name: 'DIN 德标' },
  { id: 'jis', name: 'JIS 日标' },
];

const services = [
  {
    id: 1,
    slug: 'tensile-testing',
    name: '拉伸强度测试',
    category: '力学性能测试',
    description: '依据GB/T 228.1标准，测定金属材料在拉伸载荷下的力学性能，包括屈服强度、抗拉强度、断后伸长率等指标。',
    price: 800,
    priceUnit: '元/组',
    turnaround: '3-5个工作日',
    rating: 4.9,
    orderCount: 2340,
    standards: ['GB/T 228.1', 'ISO 6892-1'],
    materials: ['金属材料'],
    image: '/images/services/tensile.jpg',
    hot: true,
  },
  {
    id: 2,
    slug: 'salt-spray-testing',
    name: '盐雾腐蚀试验',
    category: '环境可靠性测试',
    description: '模拟海洋大气环境对产品的腐蚀作用，评估产品或材料耐腐蚀性能。支持中性盐雾、醋酸盐雾、铜加速醋酸盐雾等多种试验方法。',
    price: 1200,
    priceUnit: '元/批次',
    turnaround: '5-15个工作日',
    rating: 4.8,
    orderCount: 1856,
    standards: ['GB/T 10125', 'ISO 9227'],
    materials: ['金属材料', '涂层'],
    image: '/images/services/salt-spray.jpg',
    hot: true,
  },
  {
    id: 3,
    slug: 'hardness-testing',
    name: '硬度测试',
    category: '力学性能测试',
    description: '提供洛氏硬度、布氏硬度、维氏硬度、里氏硬度等多种硬度测试方法，满足不同材料和应用场景的测试需求。',
    price: 300,
    priceUnit: '元/点',
    turnaround: '1-3个工作日',
    rating: 4.9,
    orderCount: 3120,
    standards: ['GB/T 230.1', 'GB/T 231.1'],
    materials: ['金属材料'],
    image: '/images/services/hardness.jpg',
    hot: false,
  },
  {
    id: 4,
    slug: 'chemical-composition',
    name: '化学成分分析',
    category: '化学成分分析',
    description: '采用光谱分析、ICP、XRF等先进设备，精确测定金属材料的化学成分含量，出具权威检测报告。',
    price: 600,
    priceUnit: '元/样',
    turnaround: '2-4个工作日',
    rating: 4.7,
    orderCount: 2780,
    standards: ['GB/T 4336', 'ASTM E1086'],
    materials: ['金属材料'],
    image: '/images/services/chemical.jpg',
    hot: false,
  },
  {
    id: 5,
    slug: 'fatigue-testing',
    name: '疲劳寿命测试',
    category: '力学性能测试',
    description: '通过高频疲劳试验机对材料或零部件施加循环载荷，测定其疲劳极限和S-N曲线，评估产品使用寿命。',
    price: 3500,
    priceUnit: '元/组',
    turnaround: '7-20个工作日',
    rating: 4.8,
    orderCount: 890,
    standards: ['GB/T 3075', 'ISO 1099'],
    materials: ['金属材料', '复合材料'],
    image: '/images/services/fatigue.jpg',
    hot: false,
  },
  {
    id: 6,
    slug: 'food-safety-testing',
    name: '食品安全检测',
    category: '食品安全检测',
    description: '提供农药残留、重金属、微生物、添加剂等全方位食品安全检测服务，出具CMA认证检测报告，助力食品企业合规经营。',
    price: 1500,
    priceUnit: '元/项',
    turnaround: '5-7个工作日',
    rating: 4.9,
    orderCount: 1560,
    standards: ['GB 2762', 'GB 2763'],
    materials: ['食品原料'],
    image: '/images/services/food.jpg',
    hot: true,
  },
  {
    id: 7,
    slug: 'impact-testing',
    name: '冲击韧性测试',
    category: '力学性能测试',
    description: '采用摆锤式冲击试验机进行夏比冲击试验，测定材料在冲击载荷下的韧性指标，评估材料抗冲击断裂能力。',
    price: 500,
    priceUnit: '元/组',
    turnaround: '2-4个工作日',
    rating: 4.7,
    orderCount: 1980,
    standards: ['GB/T 229', 'ISO 148-1'],
    materials: ['金属材料'],
    image: '/images/services/impact.jpg',
    hot: false,
  },
  {
    id: 8,
    slug: 'rohs-testing',
    name: 'RoHS有害物质检测',
    category: '化学成分分析',
    description: '依据EU RoHS指令，检测电子电气产品中铅、汞、镉、六价铬、多溴联苯、多溴二苯醚等有害物质含量。',
    price: 2000,
    priceUnit: '元/样',
    turnaround: '5-7个工作日',
    rating: 4.8,
    orderCount: 2150,
    standards: ['IEC 62321', 'EU 2011/65/EU'],
    materials: ['电子元器件'],
    image: '/images/services/rohs.jpg',
    hot: true,
  },
];

const sortOptions = [
  { value: 'popular', label: '综合排序' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'rating', label: '评分最高' },
  { value: 'fastest', label: '交期最短' },
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [apiServices, setApiServices] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchServices = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (sortBy === 'price-asc') { params.set('sort', 'price'); params.set('order', 'asc'); }
    else if (sortBy === 'price-desc') { params.set('sort', 'price'); params.set('order', 'desc'); }
    else if (sortBy === 'popular') { params.set('sort', 'popular'); }
    params.set('page', String(currentPage));
    params.set('pageSize', '12');

    fetch(`/api/services?${params}`)
      .then(r => r.json())
      .then(data => {
        if (data.data && data.data.length > 0) {
          setApiServices(data.data);
          setTotalPages(data.totalPages || 1);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchQuery, selectedCategory, sortBy, currentPage]);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);
    const cat = params.get('category');
    if (cat) setSelectedCategory(cat);
  }, []);

  const toggleFilter = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedMaterials.length +
    selectedIndustries.length +
    selectedStandards.length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">检测服务</h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            涵盖力学、化学、环境、电气等多领域专业检测，一站式满足您的质量检测需求
          </p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索检测服务、标准号、材料类型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="text-blue-200 text-sm">热门搜索：</span>
            {['拉伸测试', '盐雾试验', 'RoHS检测', '硬度测试', '食品安全'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex gap-8">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                筛选条件
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">服务分类</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex justify-between items-center ${
                        selectedCategory === cat.id
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-gray-400">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">材料类型</h4>
                <div className="space-y-2">
                  {materials.map((mat) => (
                    <label key={mat.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(mat.id)}
                        onChange={() => toggleFilter(selectedMaterials, setSelectedMaterials, mat.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {mat.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">应用行业</h4>
                <div className="space-y-2">
                  {industries.map((ind) => (
                    <label key={ind.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedIndustries.includes(ind.id)}
                        onChange={() => toggleFilter(selectedIndustries, setSelectedIndustries, ind.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {ind.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Standards */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">检测标准</h4>
                <div className="space-y-2">
                  {standards.map((std) => (
                    <label key={std.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedStandards.includes(std.id)}
                        onChange={() => toggleFilter(selectedStandards, setSelectedStandards, std.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      {std.name}
                    </label>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedMaterials([]);
                    setSelectedIndustries([]);
                    setSelectedStandards([]);
                  }}
                  className="w-full py-2 text-sm text-gray-500 hover:text-red-500 transition"
                >
                  清除所有筛选 ({activeFilterCount})
                </button>
              )}
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg"
          >
            <SlidersHorizontal className="w-5 h-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Mobile Filter Drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-lg">筛选条件</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Same filter content as sidebar */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">服务分类</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                          selectedCategory === cat.id
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">材料类型</h4>
                  <div className="space-y-2">
                    {materials.map((mat) => (
                      <label key={mat.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMaterials.includes(mat.id)}
                          onChange={() => toggleFilter(selectedMaterials, setSelectedMaterials, mat.id)}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        {mat.name}
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg mt-4"
                >
                  确认筛选
                </button>
              </div>
            </div>
          )}

          {/* Service Cards */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-sm text-gray-500">
                共找到 <span className="font-semibold text-gray-900">{services.length}</span> 项检测服务
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grid View */}
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition group ${
                    viewMode === 'list' ? 'flex gap-6 p-6' : 'block'
                  }`}
                >
                  {/* Card Image Placeholder */}
                  <div className={`bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative ${
                    viewMode === 'list' ? 'w-48 h-36 rounded-lg flex-shrink-0' : 'h-48 rounded-t-xl'
                  }`}>
                    <Beaker className="w-12 h-12 text-blue-300" />
                    {service.hot && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        热门
                      </span>
                    )}
                  </div>

                  <div className={viewMode === 'list' ? 'flex-1 min-w-0' : 'p-5'}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-1 text-yellow-500 flex-shrink-0">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{service.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{service.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {service.standards.map((std) => (
                        <span key={std} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {std}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{service.turnaround}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-600">&yen;{service.price}</span>
                        <span className="text-xs text-gray-400 ml-1">{service.priceUnit}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-2">已服务 {service.orderCount} 次</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <button className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition disabled:opacity-50" disabled>
                <ChevronLeft className="w-5 h-5" />
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                    page === 1
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <span className="px-2 text-gray-400">...</span>
              <button className="w-10 h-10 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition">
                12
              </button>
              <button className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
