'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { storeCategories, Category } from '@/lib/categories-store'

interface CategoryNavigationProps {
  currentCategory?: string
  onCategorySelect?: (category: Category) => void
}

export default function CategoryNavigation({ currentCategory, onCategorySelect }: CategoryNavigationProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleCategoryClick = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category)
    }
  }

  const renderCategory = (category: Category, level: number = 0) => {
    const isExpanded = expandedCategories.includes(category.id)
    const hasChildren = category.children && category.children.length > 0
    const isActive = currentCategory === category.slug

    return (
      <div key={category.id} className="relative">
        <div
          className={`flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-colors ${
            isActive 
              ? 'bg-primary-100 text-primary-700 font-medium' 
              : 'hover:bg-gray-100 text-gray-700'
          }`}
          style={{ paddingLeft: `${12 + level * 16}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleCategory(category.id)
            } else {
              handleCategoryClick(category)
            }
          }}
        >
          <div className="flex items-center space-x-2">
            {category.icon && <span className="text-lg">{category.icon}</span>}
            <span className="text-sm">{category.name}</span>
          </div>
          
          {hasChildren && (
            <div className="text-gray-400">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-4">
            {category.children!.map(child => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorias</h3>
      <div className="space-y-1">
        {storeCategories.map(category => renderCategory(category))}
      </div>
    </div>
  )
}
