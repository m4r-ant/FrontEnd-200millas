export type Price = number; // en soles, ej: 69.9

export interface OptionItem {
  id: string;
  name: string;
  image?: string;     // ruta pública /public/FILE.png
  priceDelta?: Price; // puede ser 0 o undefined
}

export interface OptionGroup {
  id: string;
  title: string;      // ej: "Elige tu bebida"
  required: boolean;
  min: number;        
  max: number;        
  multiple: boolean;  // true si max>1
  items: OptionItem[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image?: string;
  price: Price;
  optionGroups: OptionGroup[];
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export interface MenuData {
  categories: Category[];
}
