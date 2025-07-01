export interface UserCartSummary {
  userId: string;
  totalAmount: number;
  carts: {
    cartId: string;
    total: number;
  }[];
} 