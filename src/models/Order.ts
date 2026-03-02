import mongoose, { Document, Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  isFreeShipping: boolean;
}

export type DeliveryZone = "in_dhaka" | "out_dhaka";
export type OrderStatus =
  | "pending"
  | "follow_up"
  | "confirmed"
  | "cancelled"
  | "returned";

export interface IOrder extends Document {
  customerName: string;
  phoneNumber: string;
  address: string;
  deliveryZone: DeliveryZone;
  items: IOrderItem[];
  subtotal: number;
  shippingCharge: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    isFreeShipping: { type: Boolean, default: false },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema<IOrder>(
  {
    customerName: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      match: [
        /^(\+880|880|0)?1[3-9]\d{8}$/,
        "Invalid Bangladeshi phone number",
      ],
    },
    address: { type: String, required: true, trim: true },
    deliveryZone: {
      type: String,
      enum: ["in_dhaka", "out_dhaka"],
      required: true,
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shippingCharge: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "follow_up", "confirmed", "cancelled", "returned"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", orderSchema);

export default Order;
