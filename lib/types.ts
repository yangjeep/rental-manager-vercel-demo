export type Listing = {
  id: string;
  title: string;
  slug: string;
  price: number;
  city: string;
  bedrooms: number;
  status: "Available" | "Rented" | "Pending";
  imageUrl?: string;
  description?: string;
  address?: string;
};
