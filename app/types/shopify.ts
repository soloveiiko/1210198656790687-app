export interface ProductVariant {
  price: string;
  sku: string;
  inventoryQuantity: number;
}

export interface ProductNode {
  id: string;
  title: string;
  description: string;
  variants: {
    edges: {
      node: ProductVariant;
    }[];
  };
}

export interface ProductEdge {
  node: ProductNode;
}

export interface ProductData {
  products: {
    edges: ProductEdge[];
  };
}
