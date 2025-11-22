"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { ProductDetailModal } from "@/components/ProductDetailModal"
import { useCart } from "@/lib/cart-context"
import { ProductCard } from "@/components/product-card"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { MenuData, Category, Product } from "@/lib/menu-types"
import type { CartItemWithOptions } from "@/lib/cart-context"

// This is the type the old modal expects
interface MenuItemForModal {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  configuracionOpciones?: any[];
}

interface MenuPageClientProps {
  menuData: MenuData;
}

export default function MenuPageClient({ menuData }: MenuPageClientProps) {
  const { addItem } = useCart()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<MenuItemForModal | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const allProducts = useMemo(() => menuData.categories.flatMap(c => c.products), [menuData]);

  const filteredItems = useMemo(() => {
    let items = allProducts;
    
    if (selectedCategory) {
      const category = menuData.categories.find(c => c.id === selectedCategory);
      items = category ? category.products : [];
    }

    if (searchQuery) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return items;
  }, [allProducts, selectedCategory, searchQuery, menuData.categories]);

  const handleItemClick = (product: Product) => {
    // Adapt the Product data to the MenuItemForModal structure
    const menuItemForModal: MenuItemForModal = {
      id: product.id,
      name: product.title,
      description: product.description,
      price: product.price,
      image: product.image || "/placeholder.jpg",
      configuracionOpciones: product.optionGroups.map(group => ({
        id: group.id,
        name: group.title,
        type: group.multiple ? 'checkbox' : 'radio',
        required: group.required,
        maxSelections: group.max > 1 ? group.max : 1,
        options: group.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.priceDelta || 0,
          image: item.image,
        })),
      })),
    };
    setSelectedItem(menuItemForModal);
    setIsModalOpen(true);
  }

  const handleAddToCart = (item: CartItemWithOptions) => {
    addItem(item);
    setIsModalOpen(false);
    setSelectedItem(null);
  }
  
  const orderedCategories = menuData.categories.sort((a, b) => {
      const order = ["Promos Fast", "Express", "Promociones", "Sopas Power", "Bowls Del Tigre", "Leche de Tigre", "Ceviches", "Fritazo", "Mostrimar", "Box Marino", "Dúos Marinos", "Tríos Marinos", "Dobles", "Rondas Marinas", "Mega Marino", "Familiares"];
      return order.indexOf(a.name) - order.indexOf(b.name);
  });

  const activeCategoryName = selectedCategory ? menuData.categories.find(c => c.id === selectedCategory)?.name : "Mostrar todo";
  
  const firstRow = ["Mostrar todo", ...orderedCategories.slice(0, 7).map(c => c.name)];
  const secondRow = orderedCategories.slice(7).map(c => c.name);

  return (
    <>
      <section className="relative h-[300px] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
        <Image src="/somosceviche2.png" alt="Somos Ceviche" fill className="object-cover" priority />
      </section>

      <main className="max-w-7xl mx-auto px-4 py-4">
        <div className="mt-10 mb-8 text-center">
          <h2 className="text-3xl font-display font-bold text-[#1000a3]">Explora nuestra carta</h2>
        </div>
        
        <section className="py-6 px-6 mb-0">
          {/* Chip logic and rendering would go here, adapted to use menuData.categories */}
        </section>

        <div className="mt-2 mb-8 text-center">
          <h3 className="text-[#1000a3] font-display font-bold text-[20px]">{activeCategoryName}</h3>
        </div>

        <section className="pb-12">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <ProductCard 
                  key={item.id} 
                  menuItem={{
                    id: item.id,
                    name: item.title,
                    description: item.description,
                    price: item.price,
                    image: item.image || "/placeholder.jpg",
                    available: true,
                    category: ''
                  }} 
                  onSelect={() => handleItemClick(item)} 
                />
              ))}
            </div>
        </section>
      </main>

      {selectedItem && (
        <ProductDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
          onAddToCart={handleAddToCart}
          menuItem={selectedItem}
        />
      )}
    </>
  )
}
