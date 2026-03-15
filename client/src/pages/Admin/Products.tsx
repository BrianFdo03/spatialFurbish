import { useEffect, useState } from "react";
import { productAPI, categoryAPI, uploadAPI } from "@/services/api";
import { ModelViewer } from "@/components/ui/ModelViewer";
import { Layout } from "@/components/Dashboard/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";

export function ProductsPage() {
  // 1. STATE MANAGEMENT
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const [uploadingModel, setUploadingModel] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [] as string[],
    productModel: "", // For 3D model
  });

  // Filter state
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStock, setFilterStock] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 2. FETCH DATA (useEffect)
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (err: any) {
      console.error("Failed to load categories", err);
    }
  };

  // 3. DELETE HANDLER
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await productAPI.delete(id);
      // Refresh the list after successful deletion
      loadProducts();
    } catch (err) {
      alert("Error deleting product");
    }
  };

  // Helper to format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Filter products based on selected filters and search query
  const filteredProducts = products.filter((product) => {
    // Search filter
    const searchMatch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const categoryMatch =
      filterCategory === "all" || product.category === filterCategory;

    // Stock filter
    const stockMatch =
      filterStock === "all" ||
      (filterStock === "low" && product.stock < 50) ||
      (filterStock === "high" && product.stock >= 50);

    return searchMatch && categoryMatch && stockMatch;
  });

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle Product Model upload
  const handleProductModelUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingModel(true);
      const response = await uploadAPI.uploadProductModel(file);

      setFormData((prev) => ({
        ...prev,
        productModel: response.modelUrl,
      }));
    } catch (err) {
      alert("Failed to upload image");
      console.error(err);
    } finally {
      setUploadingModel(false);
    }
  };

  // Remove uploaded image
  const handleRemoveProductModel = () => {
    setFormData((prev) => ({
      ...prev,
      productModel: "",
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      setUploadingImages(true);
      const fileArray = Array.from(files); // Converting FileList → File[]
      const response = await uploadAPI.uploadImages(fileArray);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...response.imageUrls],
      }));
    } catch (err) {
      alert("Failed to upload image");
      console.error(err);
    } finally {
      setUploadingImages(false);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle cancel - reset form and close dialog
  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      images: [],
      productModel: "",
    });
    setEditingProduct(null);
    setOpen(false);
  };

  // Handle edit - populate form with product data
  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category || "", // Category is now a string
      stock: product.stock.toString(),
      images: product.images || [], // Take first image
      productModel: product.productModel || "", // For 3D model
    });
    setOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        images: formData.images, // Backend expects array
        productModel: formData.productModel ? formData.productModel : "",
      };

      if (editingProduct) {
        // Update existing product
        await productAPI.update(editingProduct._id, productData);
      } else {
        // Create new product
        await productAPI.create(productData);
      }

      // Reset form and close dialog
      handleCancel();

      // Refresh products list
      loadProducts();
    } catch (err) {
      alert("Error creating product: " + (err as Error).message);
    }
  };

  return (
    <Layout
      title="Products"
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#788F76] hover:bg-[#667c64] text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] bg-white text-stone-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-stone-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription className="text-stone-500">
                {editingProduct
                  ? "Update the product details below."
                  : "Add a new item to your inventory. Click save when you're done."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-stone-700">
                      Product Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Couch Sofa"
                      className="bg-stone-50 border-stone-200 focus-visible:ring-[#788F76]"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category" className="text-stone-700">
                      Category
                    </Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="bg-stone-50 border border-stone-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#788F76]"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat: any) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price" className="text-stone-700">
                      Price
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="bg-stone-50 border-stone-200 focus-visible:ring-[#788F76]"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock" className="text-stone-700">
                      Stock Quantity
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="bg-stone-50 border-stone-200 focus-visible:ring-[#788F76]"
                      required
                    />
                  </div>
                </div>

                {/* Product Model Upload */}
                <div className="grid gap-2">
                  <Label htmlFor="productModel" className="text-stone-700">
                    Product Model
                  </Label>
                  <div className="flex items-center gap-4">
                    {/* {formData.productModel ? (
                      <div className="relative w-20 h-20 rounded-md overflow-hidden border border-stone-200 group">
                        <img
                          src={formData.productModel}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveProductModel}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-stone-100 rounded-md flex items-center justify-center border border-dashed border-stone-300">
                        <ImageIcon className="w-6 h-6 text-stone-400" />
                      </div>
                    )} */}
                    {formData.productModel ? (
                      <div className="relative w-32 h-32 border rounded-md overflow-hidden group">
                        <ModelViewer url={formData.productModel} />

                        <button
                          type="button"
                          onClick={handleRemoveProductModel}
                          className="absolute top-1 right-1 bg-black/50 p-1 rounded"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-stone-100 rounded-md flex items-center justify-center border border-dashed text-slate-500 font-semibold">
                        3D Model
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        id="productModel"
                        type="file"
                        accept=".glb,.gltf,.obj,.fbx"
                        onChange={handleProductModelUpload}
                        disabled={uploadingModel}
                        className="bg-stone-50 border-stone-200 focus-visible:ring-[#788F76]"
                      />
                      {uploadingModel && (
                        <p className="text-xs text-stone-500 mt-1">
                          Uploading...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {/* Image Upload */}
                <div className="grid gap-2">
                  <Label htmlFor="images" className="text-stone-700">
                    Product Images
                  </Label>
                  <div className="flex flex-wrap gap-4">
                    {formData.images.map((img, index) => (
                      <div
                        key={index}
                        className="relative w-20 h-20 rounded-md overflow-hidden border border-stone-200 group"
                      >
                        <img
                          src={img}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                    <div className="w-20 h-20 bg-stone-100 rounded-md flex items-center justify-center border border-dashed border-stone-300">
                      <ImageIcon className="w-6 h-6 text-stone-400" />
                    </div>

                    <div className="flex-1">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                        className="bg-stone-50 border-stone-200 focus-visible:ring-[#788F76]"
                      />
                      {uploadingImages && (
                        <p className="text-xs text-stone-500 mt-1">
                          Uploading...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-stone-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Product details..."
                    className="bg-stone-50 border-stone-200 focus-visible:ring-[#788F76] resize-none h-24"
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploadingImages || uploadingModel}
                  className="bg-[#788F76] hover:bg-[#667c64] text-white"
                >
                  {uploadingImages || uploadingModel
                    ? "Uploading..."
                    : editingProduct
                      ? "Update Product"
                      : "Save Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Search and Filter Section */}
      <div className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-stone-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border-none rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-stone-200 text-stone-700"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-600" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm text-stone-600 focus:outline-none focus:ring-1 focus:ring-[#788F76]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Filter */}
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm text-stone-600 focus:outline-none focus:ring-1 focus:ring-[#788F76]"
        >
          <option value="all">All Stock</option>
          <option value="low">Low Stock (&lt; 50)</option>
          <option value="high">High Stock (≥ 50)</option>
        </select>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          {/* 4. LOADING STATE UI */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-stone-500">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-md m-4">
              Error: {error}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50">
                <TableRow>
                  <TableHead className="font-medium text-stone-600">
                    Product
                  </TableHead>
                  <TableHead className="font-medium text-stone-600">
                    Category
                  </TableHead>
                  <TableHead className="font-medium text-stone-600">
                    Price
                  </TableHead>
                  <TableHead className="font-medium text-stone-600">
                    Stock
                  </TableHead>
                  <TableHead className="font-medium text-stone-600 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* 5. DYNAMIC DATA MAPPING */}
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-stone-500"
                    >
                      {products.length === 0
                        ? "No products found."
                        : "No products match the selected filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow
                      key={product._id}
                      className="hover:bg-stone-50/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-stone-100 rounded-md flex items-center justify-center text-stone-400 text-xs overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              "Img"
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">
                              {product.name}
                            </p>
                            {/* Using description as subtext since ID is internal */}
                            <p className="text-xs text-stone-500 truncate max-w-[150px]">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      {/* Display category name directly since it's a string */}
                      <TableCell className="text-stone-600">
                        {product.category || "General"}
                      </TableCell>
                      <TableCell className="font-medium text-stone-800">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell>
                        {/* Logic for stock badges, defaulting to 0 if missing */}
                        {(() => {
                          const stock = product.stock || 0;
                          let colorClass = "bg-stone-100 text-stone-700";

                          if (stock < 50) {
                            colorClass =
                              "bg-red-100 text-red-700 hover:bg-red-100";
                          } else if (stock < 75) {
                            colorClass =
                              "bg-orange-100 text-orange-700 hover:bg-orange-100";
                          } else if (stock < 100) {
                            colorClass =
                              "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
                          } else {
                            colorClass =
                              "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
                          }

                          return (
                            <Badge
                              className={`shadow-none border-none font-medium ${colorClass}`}
                            >
                              {stock} in stock
                            </Badge>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product)}
                          className="h-8 w-8 text-stone-400 hover:text-stone-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          // 6. DELETE TRIGGER
                          onClick={() => handleDelete(product._id)}
                          className="h-8 w-8 text-stone-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
