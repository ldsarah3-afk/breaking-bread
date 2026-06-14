export interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  qty: number;
}

export interface OrderPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pickup_date: string;
  payment_method: string;
  notes: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
}
