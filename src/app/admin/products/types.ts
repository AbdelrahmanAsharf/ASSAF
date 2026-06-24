// app/admin/products/types.ts

export type Product = {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  oldPrice: number;
  stock: number;
  size: string | null;
  gender: string | null;
  imageUrl: string;
  category: { nameAr: string } | null;
  subCategory: { nameAr: string } | null;
  subSubCategory: { nameAr: string } | null;
};

export type Category = { id: string; nameAr: string };

export type SubCategory = {
  id: string;
  nameAr: string;
  category: { nameAr: string };
};

export type SubSubCategory = {
  id: string;
  nameAr: string;
  subCategory: { nameAr: string };
};

export interface ProductsClientProps {
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
  subSubCategories: SubSubCategory[];
}