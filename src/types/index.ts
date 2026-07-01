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
  fulfillment: string; // "pickup" | "delivery"
  pickup_date: string;
  pickup_time: string;
  location: string; // pickup location (empty for delivery)
  delivery_address: string; // delivery address (empty for pickup)
  delivery_fee: number;
  payment_method: string;
  notes: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
}
