export interface ProductImage {
  thumbnail: string;
  mobile: string;
  tablet: string;
  desktop: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: ProductImage;
}

export interface CartItem extends Product {
  quantity: number;
}
