"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import Image from "next/image"
import { Minus, Plus, InfoIcon, XIcon, BellIcon, ChevronDown } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { CartItemWithOptions, SelectedOptionsByGroup } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import type { OptionConfig } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: CartItemWithOptions) => void
  menuItem: {
    id: string
    name: string
    description: string
    price: number
    image: string
    configuracionOpciones?: OptionConfig[]
  }
}

type SelectedOptions = Record<string, Record<string, number>>


export function ProductDetailModal({ isOpen, onClose, menuItem, onAddToCart }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})
  const [imageLoading, setImageLoading] = useState(true)
  const [activeAccordionItem, setActiveAccordionItem] = useState<string | undefined>()
  // Control open sections to allow auto-closing when a group is completed
  const [openItems, setOpenItems] = useState<string[]>([])
  const [maxWarning, setMaxWarning] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isMultiplierBannerVisible, setIsMultiplierBannerVisible] = useState(true)
  const toastRef = useRef<HTMLDivElement | null>(null)

  const optionGroups = useMemo(() => menuItem.configuracionOpciones || [], [menuItem.configuracionOpciones])

  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setSelectedOptions({})
      setImageLoading(true)
      setActiveAccordionItem(undefined)
      // open all sections on open
      setOpenItems((menuItem.configuracionOpciones || []).map(g => g.id))
      setMaxWarning(null)
      setIsMultiplierBannerVisible(true)
    }
  }, [isOpen])

  useEffect(() => {
    if (maxWarning) {
      const timer = setTimeout(() => {
        setMaxWarning(null)
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [maxWarning]);

  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => {
        setValidationError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [validationError])

  useEffect(() => {
    if (quantity > 1) {
      setIsMultiplierBannerVisible(true)
    }
  }, [quantity])

  const totalPrice = useMemo(() => {
    let optionsPrice = 0
    for (const groupId in selectedOptions) {
      const group = optionGroups.find((g) => g.id === groupId)
      if (group) {
        for (const optionId in selectedOptions[groupId]) {
          const option = group.options.find((o) => o.id === optionId)
          if (option) {
            optionsPrice += option.price * selectedOptions[groupId][optionId]
          }
        }
      }
    }
    return (menuItem.price + optionsPrice) * quantity
  }, [selectedOptions, quantity, menuItem.price, optionGroups])
  
  const getGroupSelectedCount = (groupId: string) => {
    const group = optionGroups.find(g => g.id === groupId)
    if (!group) return 0
    if (group.type === 'radio') return selectedOptions[groupId] ? 1 : 0
    const opts = selectedOptions[groupId] || {}
    return Object.values(opts).reduce((a, b) => a + b, 0)
  }

  const handleOptionClick = (groupId: string, optionId: string) => {
    const group = optionGroups.find(g => g.id === groupId)
    if (!group) return

    setSelectedOptions((prev) => {
      const newOptions = { ...prev }

      if (group.type === 'radio') {
        // Allow deselecting radio options
        if (newOptions[groupId]?.[optionId]) {
          delete newOptions[groupId]
        } else {
          newOptions[groupId] = { [optionId]: 1 }
          // Auto-close radio groups when a choice is made (except for adicionales, which are unlimited)
          if (group.id !== 'adicionales') {
            setOpenItems((items) => items.filter((id) => id !== groupId))
          }
        }
        return newOptions
      }

      const newGroupOptions = { ...(newOptions[groupId] || {}) }
      const maxSelections = group.maxSelections ?? Infinity
      const currentTotal = Object.values(newGroupOptions).reduce(
        (a: number, b: number) => a + (b as number),
        0
      )

      if (newGroupOptions[optionId]) {
        // Deselect option: remove it entirely
        delete newGroupOptions[optionId]
      } else {
        // New option: ensure we don't exceed the max total units
        if (currentTotal >= maxSelections) {
          setMaxWarning(`Máximo ${maxSelections} productos`)
          return prev
        }
        newGroupOptions[optionId] = 1
      }

      newOptions[groupId] = newGroupOptions
      // If after toggle we reach the max (considering quantities), auto-close this section
      const sum = Object.values(newGroupOptions).reduce(
        (a: number, b: number) => a + (b as number),
        0
      )
      if (sum >= maxSelections && group.id !== 'adicionales') {
        setOpenItems((items) => items.filter((id) => id !== groupId))
      }
      return newOptions
    });
  };

  const incrementOption = (groupId: string, optionId: string) => {
    const group = optionGroups.find(g => g.id === groupId)
    if (!group || group.type === 'radio') return
    setSelectedOptions((prev) => {
      const newOptions = { ...prev }
      const groupOptions = { ...(newOptions[groupId] || {}) }
      const maxSelections = group.maxSelections ?? Infinity
      const totalSelected = Object.values(groupOptions).reduce((a, b) => a + b, 0)
      if (totalSelected >= maxSelections) { setMaxWarning(`Máximo ${maxSelections} productos`); return prev }
      groupOptions[optionId] = (groupOptions[optionId] || 0) + 1
      newOptions[groupId] = groupOptions
      const newTotal = Object.values(groupOptions).reduce((a, b) => a + b, 0)
      if (newTotal >= maxSelections && group.id !== 'adicionales') {
        setOpenItems((items) => items.filter((id) => id !== groupId))
      }
      return newOptions
    })
  }

  const decrementOption = (groupId: string, optionId: string) => {
    const group = optionGroups.find(g => g.id === groupId)
    if (!group || group.type === 'radio') return
    setSelectedOptions((prev) => {
      const newOptions = { ...prev }
      const groupOptions = { ...(newOptions[groupId] || {}) }
      const current = groupOptions[optionId] || 0
      if (current <= 1) {
        delete groupOptions[optionId]
      } else {
        groupOptions[optionId] = current - 1
      }
      newOptions[groupId] = groupOptions
      return newOptions
    })
  }

  const handleAddToCartClick = () => {
    for (const group of optionGroups) {
      if (group.required) {
        // Para grupos requeridos validamos por UNIDADES totales seleccionadas,
        // no solo por cantidad de tipos distintos (especialmente importante en bebidas).
        const selections = getGroupSelectedCount(group.id);
        const min = group.maxSelections ?? 1;
        if (selections < min) {
          setValidationError(`Por favor, selecciona ${min} opción(es) para "${group.name}"`)
          return;
        }
      }
    }

    const finalSelectedOptions: SelectedOptionsByGroup = {}

    for (const groupId in selectedOptions) {
      const group = optionGroups.find(g => g.id === groupId);
      if (group) {
        finalSelectedOptions[groupId] = [];
        for (const optionId in selectedOptions[groupId]) {
          const option = group.options.find(o => o.id === optionId);
          if (option) {
            finalSelectedOptions[groupId].push({
              optionId: option.id,
              name: option.name,
              price: option.price,
              quantity: selectedOptions[groupId][optionId]
            });
          }
        }
      }
    }

    const cartItem: CartItemWithOptions = {
      id: `${menuItem.id}-${JSON.stringify(selectedOptions)}`,
      menuItemId: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      price: totalPrice / quantity,
      image: menuItem.image,
      quantity,
      basePrice: menuItem.price,
      selectedOptions: finalSelectedOptions,
    }
    onAddToCart(cartItem)
    onClose()
  }

  if (!menuItem) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogOverlay className="bg-black/80" />
      {maxWarning && (
        <div
          key={maxWarning}
          ref={toastRef}
          className="fixed top-11 right-3 z-[2147483600] bg-[#318EF0] text-white px-3 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-h-[56px] pointer-events-auto"
          onPointerDownCapture={(e) => e.stopPropagation()}
          onMouseDownCapture={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-6 w-6 rounded-full bg-white/15 grid place-items-center">
            <InfoIcon className="h-4 w-4" />
          </div>
          <span className="flex-grow text-center text-sm md:text-base font-semibold whitespace-nowrap leading-tight">{maxWarning}</span>
          <button
            type="button"
            className="text-white/90 hover:text-white cursor-pointer"
            onPointerDownCapture={(e) => e.stopPropagation()}
            onMouseDownCapture={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              setMaxWarning(null)
            }}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      )}
      {validationError && (
        <div
          key={validationError}
          ref={toastRef}
          className="fixed top-11 right-3 z-[2147483600] bg-[#DC2626] text-white px-3 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-h-[56px] pointer-events-auto"
          onPointerDownCapture={(e) => e.stopPropagation()}
          onMouseDownCapture={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-6 w-6 rounded-full bg-white/15 grid place-items-center">
            <InfoIcon className="h-4 w-4" />
          </div>
          <span className="flex-grow text-center text-sm md:text-base font-semibold whitespace-nowrap leading-tight">
            {validationError}
          </span>
          <button
            type="button"
            className="text-white/90 hover:text-white cursor-pointer"
            onPointerDownCapture={(e) => e.stopPropagation()}
            onMouseDownCapture={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              setValidationError(null)
            }}
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      )}
      <DialogContent
        showCloseButton={false}
        aria-describedby="product-modal-description"
        className="w-[85vw] max-w-none h-[85vh] bg-[#FDFDFD] rounded-2xl p-0 border-none"
        onPointerDownOutside={(e) => {
          const target = e.target as Node
          if (toastRef.current && toastRef.current.contains(target)) {
            e.preventDefault()
          }
        }}
        onInteractOutside={(e) => {
          const target = e.target as Node
          if (toastRef.current && toastRef.current.contains(target)) {
            e.preventDefault()
          }
        }}
      >
        <DialogClose asChild>
          <button
            className="absolute -top-2 -right-20 z-50 flex h-12 w-12 items-center justify-center rounded-lg text-white opacity-90 transition-opacity hover:opacity-100 cursor-pointer"
            aria-label="Cerrar modal"
            style={{ cursor: 'pointer' }}
          >
            <svg
              className="h-10 w-10 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </DialogClose>
        <div className="relative flex h-full min-h-0">
            {/* --- Columna Izquierda: Imagen (Estática) --- */}
            <div className="relative w-[600px] shrink-0 h-full">
              {imageLoading && <Skeleton className="absolute inset-0 rounded-l-2xl" />}
              <Image
                src={menuItem.image}
                alt={menuItem.name}
                fill
                className={`rounded-l-2xl object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setImageLoading(false)}
                sizes="(max-width: 768px) 50vw, 600px"
              />
            </div>

            {/* --- Columna Derecha: Detalles (con Scroll interno) --- */}
            <div className="flex-1 min-h-0 grid grid-rows-[auto_1fr_auto] h-full overflow-hidden">
              {/* Fila 1: Título y Precio (Altura automática) */}
              <div className="p-5 pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-4">
                    <DialogTitle asChild>
                      <h2 className="text-3xl font-extrabold tracking-tight text-[#212121] font-secondary">{menuItem.name}</h2>
                    </DialogTitle>
                    <DialogDescription asChild>
                      <p id="product-modal-description" className="text-sm text-gray-500 mt-1">{menuItem.description}</p>
                    </DialogDescription>
                  </div>
                  <p className="text-xl font-bold text-[#1000a3] font-primaryTitle">
                    {formatCurrency(menuItem.price)}
                  </p>
                </div>
              </div>

              {/* Fila 2: Opciones (Scrollable) */}
              <div className="min-h-0 overflow-y-auto px-5 pr-3 space-y-4">
                <Accordion type="multiple" className="w-full" value={openItems} onValueChange={(v:any)=>setOpenItems(v)}>
                  {optionGroups.map((group, index) => {
                    const selectedCount = getGroupSelectedCount(group.id)
                    const maxSel = group.maxSelections || 1
                    const isCompleted = group.required && selectedCount >= maxSel
                    const optionalCompleted = !group.required && maxSel === 1 && selectedCount >= maxSel

                    const selectedOptionNames =
                      selectedCount > 0
                        ? group.options
                            .filter(opt => selectedOptions[group.id]?.[opt.id])
                            .map(opt => {
                              const qty = selectedOptions[group.id]?.[opt.id] || 1
                              // For radio groups quantity is always 1, so we only show the name
                              return group.type === 'radio' ? opt.name : `${opt.name} (x${qty})`
                            })
                            .join(', ')
                        : null

                    const displayName =
                      group.name.startsWith("Elige tu bebida")
                        ? (maxSel > 1 ? "Elige tus bebidas" : "Elige tu bebida")
                        : group.name

                    const isRiceGrid =
                      group.id === "presentacion-arroz" ||
                      (group.id === "presentacion" && menuItem.name.startsWith("Leche de Tigre"))
                    const isAjiLikeGrid =
                      group.type === "radio" &&
                      !isRiceGrid &&
                      group.options.length <= 2

                    return (
                    <AccordionItem key={group.id} value={group.id} className={`${index>0 ? 'border-t' : ''}`}>
                      <AccordionTrigger className="group font-semibold text-[15px] md:text-[16px] hover:no-underline py-3 [&>svg]:hidden">
                        <div className="flex w-full items-center justify-between">
                          <div className="flex flex-col items-start text-left">
                            <span>{displayName}</span>
                            {selectedOptionNames && (
                              <p className="text-xs text-gray-500 font-normal mt-1 truncate max-w-xs">
                                {selectedOptionNames}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3" style={{ minWidth: '130px' }}>
                            <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300 ease-in-out text-[#1000a3] group-data-[state=open]:rotate-180" />
                            {group.required ? (
                              <span className={`text-[11px] md:text-xs font-semibold px-2 py-0.5 rounded-md border ${isCompleted ? 'bg-green-100 text-green-800 border-green-200' : 'bg-[#FFEBEB] text-[#D40E0E] border-[#F8C1C1]'}`}>
                                {isCompleted ? 'Completado' : 'Requerido'} ({maxSel})
                              </span>
                            ) : (
                              <span
                                className={`text-[11px] md:text-xs font-semibold px-3 py-1 rounded-full border ${
                                  optionalCompleted
                                    ? 'bg-gray-100 text-gray-700 border-gray-300'
                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                }`}
                              >
                                {group.id === 'adicionales'
                                  ? 'Opcional'
                                  : optionalCompleted
                                  ? 'Completado'
                                  : maxSel === 1
                                  ? 'Opcional (1)'
                                  : 'Opcional'}
                              </span>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-0 pb-2">
                        {group.type === 'radio' ? (
                          <ul className={`grid gap-3 ${isRiceGrid ? 'rice-grid' : isAjiLikeGrid ? 'aji-grid' : 'grid-cols-3'}`}>
                            {(displayName.startsWith("Elige tu bebida") || displayName.startsWith("Elige tus bebidas")
                              ? [...group.options].sort((a, b) => a.price - b.price)
                              : group.options
                            ).map((option) => {
                              const isSelected = !!selectedOptions[group.id]?.[option.id]
                              const isFree = option.price === 0
                              const isException =
                                group.id === "presentacion" ||
                                group.id === "aji" ||
                                group.id === "presentacion-arroz"

                              return (
                                <li
                                  key={option.id}
                                  className={`rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                                    isSelected
                                      ? "border-[#9F99DA] bg-[#9F99DA]"
                                      : "border-gray-200 bg-white hover:border-gray-300"
                                  }`}
                                  onClick={() => handleOptionClick(group.id, option.id)}
                                >
                                  <div className="relative w-full aspect-[3/4]">
                                    {option.image && (
                                      <Image src={option.image} alt={option.name} fill className="object-cover" />
                                    )}
                                  </div>
                                  <div className="px-2 py-2 text-center">
                                    <p
                                      className={`font-semibold text-xs ${
                                        isSelected ? "text-white" : "text-gray-800"
                                      }`}
                                    >
                                      {option.name}
                                    </p>
                                    {!isFree && (
                                      <p
                                        className={`text-[11px] mt-0.5 ${
                                          isSelected ? "text-white/80" : "text-gray-600"
                                        }`}
                                      >
                                        + {formatCurrency(option.price)}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        ) : (
                          <ul className="space-y-3">
                            {(displayName.startsWith("Elige tu bebida") || displayName.startsWith("Elige tus bebidas")
                              ? [...group.options].sort((a, b) => a.price - b.price)
                              : group.options
                            ).map((option) => {
                              const isSelected = !!selectedOptions[group.id]?.[option.id]
                              const isFree = option.price === 0
                              const isException = group.id === 'presentacion' || group.id === 'aji' || group.id === 'presentacion-arroz';
                              const qty = selectedOptions[group.id]?.[option.id] || 0
                              const isSingleChoice = (group.maxSelections || Infinity) === 1
                              return (
                                <li
                                  key={option.id}
                                  className={`rounded-xl ${isSingleChoice ? 'min-h-[80px]' : 'min-h-[104px]'} overflow-hidden flex items-stretch cursor-pointer border-2 transition-colors ${isSelected ? 'bg-[#9F99DA] border-[#9F99DA]' : 'bg-white border-gray-200'}`}
                                  onClick={() => handleOptionClick(group.id, option.id)}
                                >
                                  {option.image && (
                                    <div className="relative w-28 h-[104px] flex-shrink-0">
                                      <Image src={option.image} alt={option.name} fill className="object-cover" />
                                      {isFree && (
                                        <span className="absolute top-2 left-2 transform -rotate-[10deg] bg-[#1000a3] text-white text-[11px] font-black px-2.5 py-1 rounded-md shadow-lg shadow-indigo-500/40">
                                          INCLUIDO
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  <div className="flex grow items-center justify-between p-3">
                                    <div className="flex flex-col">
                                      <p className={`font-semibold text-sm md:text-base ${isSelected ? 'text-white' : ''}`}>{option.name}</p>
                                      {!isFree && (
                                        <p className={`text-xs md:text-sm ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>+ {formatCurrency(option.price)}</p>
                                      )}
                                    </div>
                                    {!isSingleChoice && (
                                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                        {isSelected && (
                                          <button
                                            type="button"
                                            className="h-10 w-10 rounded-full flex items-center justify-center cursor-pointer bg-[#1000a3] text-white"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              decrementOption(group.id, option.id)
                                            }}
                                          >
                                            <Minus className="h-6 w-6" strokeWidth={3} />
                                          </button>
                                        )}
                                        {isSelected && (
                                          <span className={`min-w-[20px] text-lg font-bold text-center ${isSelected ? 'text-white' : 'text-gray-900'}`}>{qty}</span>
                                        )}
                                        {(!isFree || isSelected) && (
                                          <button
                                            type="button"
                                            className="h-10 w-10 rounded-full flex items-center justify-center cursor-pointer bg-[#1000a3] text-white"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              incrementOption(group.id, option.id)
                                            }}
                                          >
                                            <Plus className="h-6 w-6" strokeWidth={3} />
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </li>
                              )})}
                          </ul>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  )})}
                </Accordion>
              </div>

              <div className="relative p-5 border-t border-gray-200 bg-white rounded-br-2xl">
                {/* Yellow info when quantity > 1, positioned over the footer */}
                {quantity > 1 && isMultiplierBannerVisible && (
                  <div className="absolute bottom-full left-0 right-0 z-10 bg-[#FAB515] text-black font-semibold px-6 py-2.5 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <BellIcon className="h-6 w-6" />
                      <span>Se multiplicará por {quantity} todas las opciones que elija, incluyendo adicionales.</span>
                    </div>
                    <button onClick={() => setIsMultiplierBannerVisible(false)} className="cursor-pointer">
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
                <div className="flex justify-between items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-bold text-gray-800 whitespace-nowrap">
                      Precio base: {formatCurrency(menuItem.price)}
                    </span>
                    {totalPrice - menuItem.price * quantity > 0 && (
                      <span className="text-sm font-bold text-gray-600 whitespace-nowrap">
                        Extras: {formatCurrency((totalPrice - menuItem.price * quantity))}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 rounded-full bg-gray-100 p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="h-10 w-10 flex items-center justify-center rounded-full transition-colors text-[#1000a3] disabled:text-gray-400 disabled:cursor-not-allowed enabled:hover:bg-gray-200"
                      >
                        <Minus className="h-5 w-5" strokeWidth={3.5} />
                      </button>
                      <span className="text-xl font-extrabold w-10 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="h-10 w-10 flex items-center justify-center rounded-full transition-colors text-[#1000a3] hover:bg-gray-200"
                      >
                        <Plus className="h-5 w-5" strokeWidth={3.5} />
                      </button>
                    </div>
                    <Button
                      className="bg-[#1000a3] text-white font-bold text-lg h-12 flex-grow cursor-pointer rounded-full"
                      onClick={handleAddToCartClick}
                    >
                      Agregar ({formatCurrency(totalPrice)})
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}