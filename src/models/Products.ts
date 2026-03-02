import mongoose, { Document, Model } from "mongoose";

export interface IProductDescription {
  title?: string;
  content?: string;
}

export interface IProduct extends Document {
  name: string;
  description: IProductDescription[];
  productImage: string[];
  price: number;
  quantity: number;
  isFreeShipping: boolean;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const productDescriptionSchema = new mongoose.Schema(
  {
    title: { type: String },
    content: { type: String },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: [productDescriptionSchema], default: [] },
    productImage: {
      type: [String],
      required: [true, "Product image is required"],
      default: [],
    },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    isFreeShipping: { type: Boolean, default: false },
    uploadedBy: { type: String, default: "admin" },
  },
  { timestamps: true },
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;
