'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Select from '@/components/Select'
import CategoryNavigation from '@/components/CategoryNavigation'
import ProductFilters from '@/components/ProductFilters'
import Pagination from '@/components/Pagination'
import { Search, ShoppingCart, Star, Filter, Grid, List, SortAsc, SortDesc } from 'lucide-react'
import Image from 'next/image'
import { mapCsvCategoryToStoreCategory } from '@/lib/categories-store'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  weight?: string
  dimensions?: string
  sku: string
  brand?: string
  isActive: boolean
}

interface CartItem {
  product: Product
  quantity: number
}

interface FilterState {
  priceRange: [number, number]
  brands: string[]
  categories: string[]
  inStock: boolean
  rating: number
}

export default function LojaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    brands: [],
    categories: [],
    inStock: false,
    rating: 0
  })
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
        setCart([])
      }
    }
  }, [])

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Carregar produtos
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/loja/produtos')
        const data = await response.json()
        const productsData = data.products || []
        
        // Mapear categorias do CSV para categorias da loja
        const mappedProducts = productsData.map((product: Product) => ({
          ...product,
          category: mapCsvCategoryToStoreCategory(product.category)
        }))
        
        setProducts(mappedProducts)
        setFilteredProducts(mappedProducts)
        
        // Extrair categorias e marcas únicas
        const uniqueCategories = [...new Set(mappedProducts.map((p: Product) => p.category))]
        const uniqueBrands = [...new Set(mappedProducts.map((p: Product) => p.brand).filter(Boolean))]
        
        setCategories(uniqueCategories)
        setBrands(uniqueBrands)
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Filtrar e ordenar produtos
  useEffect(() => {
    let filtered = products

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Filtros avançados
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      )
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        product.brand && filters.brands.includes(product.brand)
      )
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      )
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0)
    }

    if (filters.rating > 0) {
      // Simular avaliação baseada no preço (produtos mais caros = melhor avaliação)
      filtered = filtered.filter(product => {
        const simulatedRating = Math.min(5, Math.max(1, Math.floor(product.price / 20)))
        return simulatedRating >= filters.rating
      })
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        case 'rating':
          const ratingA = Math.min(5, Math.max(1, Math.floor(a.price / 20)))
          const ratingB = Math.min(5, Math.max(1, Math.floor(b.price / 20)))
          return ratingB - ratingA
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset para primeira página quando filtros mudam
  }, [products, searchTerm, selectedCategory, sortBy, filters])

  // Adicionar ao carrinho
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Garantir que o produto tem todas as propriedades necessárias
        const cartProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.images || [],
          brand: product.brand || ''
        }
        return [...prev, { product: cartProduct, quantity: 1 }]
      }
    })
  }

  // Remover do carrinho
  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId))
  }

  // Atualizar quantidade
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  // Calcular total do carrinho
  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Calcular produtos paginados
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Ir para checkout
  const goToCheckout = () => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/loja/checkout')
      return
    }
    router.push('/loja/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">A carregar produtos...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Loja Elastiquality
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubra os melhores produtos com qualidade garantida e entrega rápida em Portugal
          </p>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Pesquisar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </Button>

              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-w-[200px]"
              >
                <option value="name">Ordenar por nome</option>
                <option value="price-low">Preço: menor para maior</option>
                <option value="price-high">Preço: maior para menor</option>
                <option value="rating">Melhor avaliados</option>
                <option value="newest">Mais recentes</option>
              </Select>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredProducts.length} produto(s) encontrado(s)
              {totalPages > 1 && (
                <span className="ml-2 text-sm text-gray-500">
                  (Página {currentPage} de {totalPages})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Layout Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar com Categorias e Filtros */}
          <div className="lg:col-span-1 space-y-6">
            <CategoryNavigation 
              currentCategory={selectedCategory}
              onCategorySelect={(category) => setSelectedCategory(category.slug)}
            />
            
            {showFilters && (
              <ProductFilters
                onFiltersChange={setFilters}
                brands={brands}
                categories={categories}
              />
            )}
          </div>

          {/* Lista de Produtos */}
          <div className="lg:col-span-3">

        {/* Carrinho Flutuante */}
        {cartItemsCount > 0 && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={goToCheckout}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Carrinho ({cartItemsCount})</span>
              <span className="bg-white text-primary-600 px-2 py-1 rounded-full text-sm font-semibold">
                €{cartTotal.toFixed(2)}
              </span>
            </button>
          </div>
        )}

            {/* Lista de Produtos */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros ou termo de busca
                </p>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => {
                  const simulatedRating = Math.min(5, Math.max(1, Math.floor(product.price / 20)))
                  
                  return (
                    <div
                      key={product.id}
                      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'} relative`}>
                        <Image
                          src={product.images[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Esgotado
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {product.name}
                          </h3>
                          {product.brand && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {product.brand}
                            </span>
                          )}
                        </div>
                        
                        {/* Avaliação */}
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < simulatedRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">({simulatedRating})</span>
                        </div>
                        
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1">
                            <span className="text-2xl font-bold text-primary-600">
                              €{product.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.stock > 0 ? `${product.stock} em stock` : 'Esgotado'}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => addToCart(product)}
                              disabled={product.stock === 0}
                              className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Adicionar
                            </button>
                            <button
                              onClick={() => router.push(`/loja/${product.id}`)}
                              className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Ver Detalhes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredProducts.length}
                    itemsPerPage={itemsPerPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
