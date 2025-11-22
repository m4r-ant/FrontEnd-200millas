import {
  Category,
  MenuData,
  OptionGroup,
  OptionItem,
  Price,
  Product,
} from "./menu-types";

// Simple slugify function to create IDs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

const KNOWN_CATEGORIES = [
  "Cyber Marino", "Promos Fast", "Express", "Promociones", "Sopas Power",
  "Bowls Del Tigre", "Leche de Tigre", "Ceviches", "Fritazo", "Mostrimar",
  "Box Marino", "Dúos Marinos", "Tríos Marinos", "Dobles", "Rondas Marinas",
  "Mega Marino", "Familiares",
];

function resolveImage(file?: string): string | undefined {
  if (!file) return undefined;
  const path = file.trim().replace(/^\/+/, "");
  // Assumes all images are in the root of /public
  return `/${path}`;
}

function parseMoney(s: string): Price | null {
  const moneyRegex = /S\/\.?\s*([0-9]+(?:[.,][0-9]{1,2})?)/i;
  const match = s.match(moneyRegex);
  if (!match) return null;
  return Number(match[1].replace(",", "."));
}

function parseGroupHeader(line: string): Omit<OptionGroup, "id" | "items"> {
  const headerRegex = /^(.*?)(?:\s*\((.*?)\))?:?$/i;
  const match = line.match(headerRegex);
  
  const title = (match?.[1] || line).trim().replace(/:$/, '');
  const rule = match?.[2]?.toLowerCase() || "";

  let required = false;
  let min = 0;
  let max = 1;

  if (rule.includes('requerido') || rule.includes('requerida')) {
    required = true;
    const numMatch = rule.match(/(\d+)/);
    const num = numMatch ? parseInt(numMatch[1], 10) : 1;
    min = num;
    max = num;
  } else if (rule.includes('opcional')) {
    required = false;
    min = 0;
    const numMatch = rule.match(/(\d+)/);
    // If optional X, max is X. If just optional without number, it can be many
    max = numMatch ? parseInt(numMatch[1], 10) : Infinity;
  } else if (title.startsWith('¿Deseas agregar')) {
    // A common pattern is just a question without rules, implying multiple optional choices
    required = false;
    min = 0;
    max = Infinity;
  }
  
  return {
    title,
    required,
    min,
    max,
    multiple: max > 1,
  };
}

export function parseMenuFromText(txt: string): MenuData {
  const lines = txt.split(/\r?\n/);
  const categories: Category[] = [];
  let currentCategory: Category | null = null;
  let currentProduct: Product | null = null;
  let currentOptionGroup: OptionGroup | null = null;
  let lastOptionItem: OptionItem | null = null;
  let isInsideModalDetails = false;

  function flushProduct() {
    if (currentProduct) {
      if (!currentCategory) {
        currentCategory = { id: "general", name: "General", products: [] };
        categories.push(currentCategory);
      }
      currentCategory.products.push(currentProduct);
    }
    currentProduct = null;
    currentOptionGroup = null;
    lastOptionItem = null;
    isInsideModalDetails = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    if (line.includes('Opciones dentro del modal de detalles del producto')) {
      isInsideModalDetails = true;
      continue;
    }

    const isCategory = KNOWN_CATEGORIES.find(c => c.toLowerCase() === line.toLowerCase());
    if (isCategory) {
      flushProduct();
      currentCategory = { id: slugify(isCategory), name: isCategory, products: [] };
      categories.push(currentCategory);
      continue;
    }

    // Product detection (3 lines)
    const nextLine1 = lines[i + 1]?.trim();
    const nextLine2 = lines[i + 2]?.trim();
    const price = nextLine2 ? parseMoney(nextLine2) : null;

    if (nextLine1 !== undefined && price !== null && !isCategory) {
      flushProduct();

      const titleMatch = line.match(/^(.*?)(?:\s*\(imagen:\s*([^)]+)\))?$/);
      const title = titleMatch?.[1]?.trim() || line;
      const imageFile = titleMatch?.[2];
      const description = nextLine1;

      currentProduct = {
        id: slugify(`${title}-${i}`),
        title,
        description,
        image: resolveImage(imageFile),
        price,
        optionGroups: [],
      };
      i += 2; // Skip description and price lines
      continue;
    }
    
    if (currentProduct && isInsideModalDetails) {
      const isGroupHeader = !line.startsWith('-') && isNaN(parseMoney(line) || NaN) && !line.match(/^\+/);
      
      if (isGroupHeader) {
        const groupHeaderData = parseGroupHeader(line);
        // Do not create empty option groups
        if (groupHeaderData.title) {
          currentOptionGroup = {
            id: slugify(`${groupHeaderData.title}-${i}`),
            ...groupHeaderData,
            items: [],
          };
          currentProduct.optionGroups.push(currentOptionGroup);
          lastOptionItem = null;
        }
        continue;
      }
      
      if (currentOptionGroup && line.startsWith('-')) {
        const itemMatch = line.match(/-\s*(.*?)(?:\s*\(imagen:\s*([^)]+)\))?/);
        const name = itemMatch?.[1]?.trim();
        if (name) {
          const imageFile = itemMatch?.[2];
          lastOptionItem = {
            id: slugify(`${name}-${i}`),
            name,
            image: resolveImage(imageFile),
          };
          currentOptionGroup.items.push(lastOptionItem);
        }
        continue;
      }
      
      const deltaPrice = parseMoney(line);
      if (lastOptionItem && deltaPrice !== null && line.startsWith('+')) {
        lastOptionItem.priceDelta = deltaPrice;
        lastOptionItem = null;
      }
    }
  }
  flushProduct();

  return { categories };
}
