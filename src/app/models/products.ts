export interface Product {
  productId?: string;
  name: string;
  quantity: number;
  newQuantity?: number;
  totalQuantity?: number;
  addedDate: Date;
  purchasePrice?: number;
  sellingPrice?: number;
}
