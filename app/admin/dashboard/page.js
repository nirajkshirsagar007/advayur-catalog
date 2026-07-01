"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState(null);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    description: "",
    benefits: ["", "", "", ""],
    price: 0,
    slug: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setAuthenticated(true);
        fetchProducts();
      } else {
        setAuthenticated(false);
        router.push("/admin/login");
      }
    } catch (err) {
      setAuthenticated(false);
      router.push("/admin/login");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        showFeedback("Failed to load products", true);
      }
    } catch (err) {
      showFeedback("Failed to load products", true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
      router.push("/admin/login");
    } catch (err) {
      showFeedback("Logout failed", true);
    }
  };

  const showFeedback = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage({ text: "", isError: false }), 4000);
  };

  const saveProductsList = async (newList) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newList),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProducts(newList);
        showFeedback("Changes saved successfully!");
        return true;
      } else {
        showFeedback(data.error || "Failed to save changes", true);
        return false;
      }
    } catch (err) {
      showFeedback("Failed to connect to server", true);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const updated = products.map((p) =>
      p.id === editingProduct.id ? editingProduct : p
    );
    const success = await saveProductsList(updated);
    if (success) {
      setEditingProduct(null);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // Auto generate ID or slug if empty
    const id = newProduct.id.trim() || String(Date.now());
    const slug = newProduct.slug.trim() || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    const productToAdd = {
      ...newProduct,
      id,
      slug,
      price: Number(newProduct.price),
      benefits: newProduct.benefits.filter(b => b.trim() !== "")
    };

    const updated = [...products, productToAdd];
    const success = await saveProductsList(updated);
    if (success) {
      setShowAddForm(false);
      setNewProduct({
        id: "",
        name: "",
        description: "",
        benefits: ["", "", "", ""],
        price: 0,
        slug: "",
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const updated = products.filter((p) => p.id !== productId);
    await saveProductsList(updated);
  };

  const handleEditBenefitChange = (index, value) => {
    const updatedBenefits = [...editingProduct.benefits];
    updatedBenefits[index] = value;
    setEditingProduct({ ...editingProduct, benefits: updatedBenefits });
  };

  const handleAddBenefitChange = (index, value) => {
    const updatedBenefits = [...newProduct.benefits];
    updatedBenefits[index] = value;
    setNewProduct({ ...newProduct, benefits: updatedBenefits });
  };

  if (authenticated === null || loading) {
    return (
      <div className="bg-amber-50 min-h-screen flex items-center justify-center font-sans">
        <div className="text-emerald-950 font-semibold tracking-widest text-sm animate-pulse uppercase">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen py-12 font-sans text-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-emerald-950/10 pb-8 mb-8">
          <div className="flex items-center gap-4">
            <Logo className="w-12 h-12 text-emerald-800" showText={false} />
            <div>
              <h1 className="font-serif text-3xl font-bold">Admin Control Center</h1>
              <p className="text-xs text-emerald-950/60 font-semibold uppercase tracking-wider mt-1">Manage Catalog &amp; Prices</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs py-2.5 px-5 rounded-full tracking-wider uppercase transition-colors cursor-pointer"
            >
              {showAddForm ? "View Catalog" : "+ Add Product"}
            </button>
            <button
              onClick={handleLogout}
              className="border border-emerald-950/20 hover:bg-emerald-950/5 text-emerald-950 font-semibold text-xs py-2.5 px-5 rounded-full tracking-wider uppercase transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Floating Notification */}
        {message.text && (
          <div className={`fixed bottom-8 right-8 z-50 p-4 rounded-xl shadow-lg border text-sm font-semibold transition-all duration-300 ${
            message.isError 
              ? "bg-red-50 text-red-900 border-red-200" 
              : "bg-green-50 text-green-900 border-green-200"
          }`}>
            {message.text}
          </div>
        )}

        {/* Edit Modal / Panel */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-amber-50 rounded-3xl p-8 max-w-2xl w-full border border-emerald-950/10 shadow-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="font-serif text-2xl font-bold mb-6">Edit Product: {editingProduct.name}</h2>
              <form onSubmit={handleSaveEdit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-950/70">Product Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 rounded-xl border border-emerald-950/10 bg-white"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-950/70">Price (₹)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2.5 rounded-xl border border-emerald-950/10 bg-white"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-950/70">Description</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-950/10 bg-white"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-950/70">Key Benefits</label>
                  <div className="space-y-2">
                    {editingProduct.benefits.map((benefit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`Benefit ${idx + 1}`}
                        className="w-full px-4 py-2.5 rounded-xl border border-emerald-950/10 bg-white"
                        value={benefit}
                        onChange={(e) => handleEditBenefitChange(idx, e.target.value)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-emerald-950/10 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="border border-emerald-950/20 hover:bg-emerald-950/5 text-emerald-950 font-bold text-xs py-3 px-6 rounded-full tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 px-6 rounded-full tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Product Form */}
        {showAddForm ? (
          <div className="glass-card rounded-3xl p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6 text-center">Add New Ayurvedic Formulation</h2>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-950/70">Product ID (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 5"
                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-950/10 bg-white/50"
                    value={newProduct.id}
                    onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-950/70">Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Shatavari Hormonal Balance"
                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-950/10 bg-white/50"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-950/70">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 750"
                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-950/10 bg-white/50"
                    value={newProduct.price === 0 ? "" : newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-950/70">URL Slug (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. shatavari-hormonal-balance"
                    className="w-full px-4 py-2.5 rounded-xl border border-emerald-950/10 bg-white/50"
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-950/70">Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the therapeutic properties, ingredients, and applications of this remedy..."
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-950/10 bg-white/50"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2 text-emerald-950/70">Proven Benefits (Up to 4)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {newProduct.benefits.map((benefit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`Benefit ${idx + 1}`}
                      className="w-full px-4 py-2.5 rounded-xl border border-emerald-950/10 bg-white/50"
                      value={benefit}
                      onChange={(e) => handleAddBenefitChange(idx, e.target.value)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-emerald-950/10 justify-center">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="border border-emerald-950/20 hover:bg-emerald-950/5 text-emerald-950 font-bold text-xs py-3 px-6 rounded-full tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 px-6 rounded-full tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Products List Table/Cards */
          <div className="glass-card rounded-3xl p-6 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-emerald-950/10 text-xs font-bold uppercase tracking-widest text-emerald-950/60">
                  <th className="py-4 px-4">Product details</th>
                  <th className="py-4 px-4 text-right">Price</th>
                  <th className="py-4 px-4">Slug</th>
                  <th className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-950/5 text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-emerald-950/5 transition-colors">
                    <td className="py-4 px-4 max-w-sm">
                      <div className="font-serif text-base font-semibold text-emerald-950">{product.name}</div>
                      <div className="text-xs text-emerald-950/60 line-clamp-1 mt-0.5">{product.description}</div>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-emerald-950 font-mono">
                      ₹{product.price}
                    </td>
                    <td className="py-4 px-4 text-xs font-semibold text-emerald-900/60 font-mono">
                      {product.slug}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-xs font-bold text-emerald-800 hover:text-emerald-900 transition-colors tracking-wider uppercase cursor-pointer"
                        >
                          Edit
                        </button>
                        <span className="text-emerald-950/20">|</span>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-xs font-bold text-red-700 hover:text-red-900 transition-colors tracking-wider uppercase cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
