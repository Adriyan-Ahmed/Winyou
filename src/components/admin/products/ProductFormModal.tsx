"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import Field from "@/components/ui/Field";
import inputCls from "@/components/ui/inputCls";

interface DescriptionItem {
  title: string;
  content: string;
}

export interface ProductFormData {
  name: string;
  description: DescriptionItem[];
  productImage: string[];
  price: number | "";
  quantity: number | "";
  isFreeShipping: boolean;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  initialData?: ProductFormData | null;
  mode: "create" | "edit";
}

const emptyForm: ProductFormData = {
  name: "",
  description: [{ title: "", content: "" }],
  productImage: [""],
  price: "",
  quantity: "",
  isFreeShipping: false,
};

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setForm(initialData || emptyForm);
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || Number(form.price) <= 0)
      e.price = "Valid price is required";
    if (form.quantity === "" || Number(form.quantity) < 0)
      e.quantity = "Valid quantity is required";
    const validImages = form.productImage.filter((img) => img.trim());
    if (!validImages.length)
      e.productImage = "At least one image URL is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        productImage: form.productImage.filter((img) => img.trim()),
        description: form.description.filter((d) => d.title || d.content),
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-800 shadow-2xl"
        style={{ background: "#0d0d18" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-gray-800 z-10"
          style={{ background: "#0d0d18" }}
        >
          <h2 className="text-base font-bold text-gray-100">
            {mode === "create" ? "Add New Product" : "Edit Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Name */}
          <Field label="Product Name" error={errors.name} required>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Premium Cotton T-Shirt"
              className={inputCls(errors.name)}
            />
          </Field>

          {/* Price + Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (৳)" error={errors.price} required>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                placeholder="0"
                className={inputCls(errors.price)}
              />
            </Field>
            <Field label="Stock Quantity" error={errors.quantity} required>
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                placeholder="0"
                className={inputCls(errors.quantity)}
              />
            </Field>
          </div>

          {/* Free Shipping */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={form.isFreeShipping}
                onChange={(e) =>
                  setForm({ ...form, isFreeShipping: e.target.checked })
                }
              />
              <div
                className={`w-10 h-5 rounded-full transition-colors ${
                  form.isFreeShipping ? "bg-indigo-500" : "bg-gray-700"
                }`}
              />
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${
                  form.isFreeShipping ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-gray-300">Free Shipping</span>
          </label>

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Product Images <span className="text-red-400">*</span>
              </label>
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, productImage: [...form.productImage, ""] })
                }
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add URL
              </button>
            </div>
            {errors.productImage && (
              <p className="text-xs text-red-400 mb-2">{errors.productImage}</p>
            )}
            <div className="space-y-2">
              {form.productImage.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl border border-gray-700 bg-gray-900/50">
                    <ImageIcon className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                    <input
                      value={img}
                      onChange={(e) => {
                        const imgs = [...form.productImage];
                        imgs[i] = e.target.value;
                        setForm({ ...form, productImage: imgs });
                      }}
                      placeholder={`Image URL ${i + 1}`}
                      className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none"
                    />
                  </div>
                  {form.productImage.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const imgs = form.productImage.filter(
                          (_, idx) => idx !== i,
                        );
                        setForm({ ...form, productImage: imgs });
                      }}
                      className="p-2 rounded-xl text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Description Sections
              </label>
            </div>
            <div className="space-y-3">
              {form.description.map((desc, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-gray-800 space-y-2"
                  style={{ background: "#0a0a14" }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      value={desc.title}
                      onChange={(e) => {
                        const d = [...form.description];
                        d[i] = { ...d[i], title: e.target.value };
                        setForm({ ...form, description: d });
                      }}
                      placeholder="Section title (e.g. Features)"
                      className={inputCls()}
                    />
                    {form.description.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const d = form.description.filter(
                            (_, idx) => idx !== i,
                          );
                          setForm({ ...form, description: d });
                        }}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={desc.content}
                    onChange={(e) => {
                      const d = [...form.description];
                      d[i] = { ...d[i], content: e.target.value };
                      setForm({ ...form, description: d });
                    }}
                    placeholder="Section content..."
                    rows={3}
                    className={`${inputCls()} resize-none`}
                  />
                </div>
              ))}
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    description: [
                      ...form.description,
                      { title: "", content: "" },
                    ],
                  })
                }
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Section
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-700 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 0 20px rgba(99,102,241,0.3)",
              }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Create Product"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
