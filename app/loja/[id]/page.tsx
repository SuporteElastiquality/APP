'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import RelatedProducts from '@/components/RelatedProducts'
import CategoryNavigation from '@/components/CategoryNavigation'
import ProductFilters from '@/components/ProductFilters'
import { ArrowLeft, ShoppingCart, Star, Package, Truck, Filter } from 'lucide-react'
import Image from 'next/image'

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

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [brands, setBrands] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    brands: [] as string[],
    categories: [] as string[],
    inStock: false,
    rating: 0
  })

  // Carregar carrinho do localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Carregar marcas e categorias para filtros
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const response = await fetch('/api/loja/produtos')
        const data = await response.json()
        const products = data.products || []
        
        const uniqueBrands = Array.from(new Set(products.map((p: any) => p.brand).filter(Boolean))) as string[]
        const uniqueCategories = Array.from(new Set(products.map((p: any) => p.category).filter(Boolean))) as string[]
        
        setBrands(uniqueBrands)
        setCategories(uniqueCategories)
      } catch (error) {
        console.error('Erro ao carregar dados dos filtros:', error)
      }
    }
    loadFilterData()
  }, [])

  // Carregar produto
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch(`/api/loja/produtos/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data.product)
        } else {
          router.push('/loja')
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error)
        router.push('/loja')
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [params.id, router])

  // Adicionar ao carrinho
  const addToCart = async (productToAdd?: Product) => {
    if (!session) {
      router.push('/auth/signin?callbackUrl=/loja')
      return
    }

    const productToUse = productToAdd || product
    if (!productToUse) return

    setAddingToCart(true)
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Adicionar ao carrinho local
      const newCart = [...cart]
      const existingItem = newCart.find(item => item.product.id === productToUse.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        // Garantir que o produto tem todas as propriedades necessárias
        const cartProduct = {
          id: productToUse.id,
          name: productToUse.name,
          price: productToUse.price,
          images: productToUse.images || [],
          brand: productToUse.brand || ''
        }
        
        newCart.push({
          product: cartProduct,
          quantity: quantity
        })
      }
      
      setCart(newCart)
      localStorage.setItem('cart', JSON.stringify(newCart))
      
      // Debug: verificar o que foi salvo
      console.log('Carrinho salvo:', newCart)
      console.log('localStorage cart:', localStorage.getItem('cart'))
      
      // Mostrar notificação de sucesso
      alert('Produto adicionado ao carrinho!')
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      alert('Erro ao adicionar ao carrinho')
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">A carregar produto...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
          <Button onClick={() => router.push('/loja')}>
            Voltar à loja
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => router.push('/loja')}
            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à loja</span>
          </button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar com Filtros */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>{showFilters ? 'Ocultar' : 'Mostrar'}</span>
                </Button>
              </div>
              
              {showFilters && (
                <div className="space-y-6">
                  <CategoryNavigation 
                    currentCategory={product?.category}
                    onCategorySelect={(category) => {
                      // Navegar para a categoria na loja
                      router.push(`/loja?category=${category.slug}`)
                    }}
                  />
                  
                  <ProductFilters
                    onFiltersChange={setFilters}
                    brands={brands}
                    categories={categories}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Galeria de Imagens */}
              <div className="space-y-4">
                <div className="aspect-square relative bg-white rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={product.images[selectedImage] || '/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-semibold">
                        Esgotado
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Miniaturas */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square relative rounded-lg overflow-hidden border-2 ${
                          selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Informações do Produto */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {product.name}
                    </h1>
                    {product.brand && (
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {product.brand}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <Star className="w-5 h-5 text-gray-300" />
                      <span className="text-sm text-gray-600 ml-2">(4.0)</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Stock: {product.stock} unidades
                    </div>
                  </div>

                  <div className="text-4xl font-bold text-primary-600 mb-6">
                    €{product.price.toFixed(2)}
                  </div>
                </div>

                {/* Descrição */}
                {product.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                    <div className="prose prose-sm max-w-none text-gray-600">
                      <p className="whitespace-pre-line">{product.description}</p>
                    </div>
                  </div>
                )}

                {/* Especificações */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.weight && (
                    <div className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Peso: {product.weight}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex items-center space-x-2">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">Dimensões: {product.dimensions}</span>
                    </div>
                  )}
                </div>

                {/* Adicionar ao Carrinho */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="text-sm font-medium text-gray-700">Quantidade:</label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0 || addingToCart}
                      className="flex-1 flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        {addingToCart ? 'A adicionar...' : product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Informações de Entrega */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Entrega gratuita em Portugal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        {product && (
          <RelatedProducts
            currentProductId={product.id}
            currentCategory={product.category}
            currentBrand={product.brand}
            onAddToCart={addToCart}
          />
        )}
      </main>
      
      <Footer />
    </div>
  )
}