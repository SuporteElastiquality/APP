'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Star, ShoppingCart } from 'lucide-react'
import Button from '@/components/Button'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  brand?: string
  stock: number
  category: string
}

interface RelatedProductsProps {
  currentProductId: string
  currentCategory: string
  currentBrand?: string
  onAddToCart: (product: Product) => void
}

export default function RelatedProducts({ 
  currentProductId, 
  currentCategory, 
  currentBrand, 
  onAddToCart 
}: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        const response = await fetch('/api/loja/produtos')
        const data = await response.json()
        const allProducts = data.products || []
        
        // Filtrar produtos relacionados (mesma categoria ou marca, excluindo o produto atual)
        let related = allProducts.filter((product: Product) => 
          product.id !== currentProductId && 
          (product.category === currentCategory || product.brand === currentBrand)
        )
        
        // Se não houver produtos da mesma categoria/marca, buscar produtos aleatórios
        if (related.length === 0) {
          related = allProducts
            .filter((product: Product) => product.id !== currentProductId)
            .sort(() => Math.random() - 0.5)
        }
        
        // Limitar a 6 produtos e ordenar por relevância
        related = related
          .sort((a: Product, b: Product) => {
            // Priorizar mesma categoria e marca
            const aScore = (a.category === currentCategory ? 2 : 0) + (a.brand === currentBrand ? 1 : 0)
            const bScore = (b.category === currentCategory ? 2 : 0) + (b.brand === currentBrand ? 1 : 0)
            return bScore - aScore
          })
          .slice(0, 6)
        
        setRelatedProducts(related)
      } catch (error) {
        console.error('Erro ao carregar produtos relacionados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRelatedProducts()
  }, [currentProductId, currentCategory, currentBrand])

  if (loading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h3>
      <p className="text-gray-600 mb-8">
        Outros produtos que podem interessar-lhe
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProducts.map((product) => {
          const simulatedRating = Math.min(5, Math.max(1, Math.floor(product.price / 20)))
          
          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div 
                className="aspect-square relative cursor-pointer"
                onClick={() => router.push(`/loja/${product.id}`)}
              >
                <Image
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Esgotado
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors cursor-pointer"
                      onClick={() => router.push(`/loja/${product.id}`)}>
                    {product.name}
                  </h4>
                  {product.brand && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded ml-2 flex-shrink-0">
                      {product.brand}
                    </span>
                  )}
                </div>
                
                {/* Avaliação */}
                <div className="flex items-center space-x-1 mb-3">
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
                
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xl font-bold text-primary-600">
                    €{product.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {product.stock > 0 ? `${product.stock} em stock` : 'Esgotado'}
                  </div>
                </div>
                
                <Button
                  onClick={() => onAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full flex items-center justify-center space-x-2"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {product.stock === 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
                  </span>
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
