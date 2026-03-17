import { useEffect, useState } from "react";
import { textureAPI, uploadAPI } from "@/services/api";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function TexturesPage() {
  // 1. STATE MANAGEMENT
  const [textures, setTextures] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editingTexture, setEditingTexture] = useState<any | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    texture: "", // Single texture for now to keep it simple
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

  // 2. FETCH DATA (useEffect)
  useEffect(() => {
    loadTextures();
  }, []);

  const loadTextures = async () => {
    try {
      setLoading(true);
      const response = await textureAPI.getAll();
      setTextures(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to load textures", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE HANDLER
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this texture?"))
      return;

    try {
      await textureAPI.delete(id);
      // Refresh the list after successful deletion
      loadTextures();
    } catch (err) {
      alert("Error deleting texture");
    }
  };

  // Filter textures based on selected filters and search query
  const filteredTextures = textures.filter((texture) => {
    // Search filter
    const searchMatch =
      searchQuery === "" ||
      texture.name.toLowerCase().includes(searchQuery.toLowerCase());

    return searchMatch;
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

  // Handle texture upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await uploadAPI.uploadTexture(file);

      setFormData((prev) => ({
        ...prev,
        texture: response.textureUrl,
      }));
    } catch (err) {
      alert("Failed to upload texture");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // Remove uploaded texture
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      texture: "",
    }));
  };

  // Handle cancel - reset form and close dialog
  const handleCancel = () => {
    setFormData({
      name: "",
      texture: "",
    });
    setEditingTexture(null);
    setOpen(false);
  };

  // Handle edit - populate form with texture data
  const handleEdit = (texture: any) => {
    setEditingTexture(texture);
    setFormData({
      name: texture.name,
      texture: texture.texture || "", // Take first texture
    });
    setOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const textureData = {
        name: formData.name,
        texture: formData.texture ? formData.texture : "",
      };

      if (editingTexture) {
        // Update existing texture
        await textureAPI.update(editingTexture._id, textureData);
      } else {
        // Create new texture
        await textureAPI.create(textureData);
      }

      // Reset form and close dialog
      handleCancel();

      // Refresh textures list
      loadTextures();
    } catch (err) {
      alert("Error creating texture: " + (err as Error).message);
    }
  };

  return (
    <Layout
      title="Textures"
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#788F76] hover:bg-[#667c64] text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Texture
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] bg-white text-stone-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-stone-900">
                {editingTexture ? "Edit Texture" : "Add New Texture"}
              </DialogTitle>
              <DialogDescription className="text-stone-500">
                {editingTexture
                  ? "Update the texture details below."
                  : "Add a new texture to your inventory. Click save when you're done."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-stone-700">
                      Texture Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Velvet Fabric"
                      className="bg-stone-50 border-stone-200 focus-visible:ring-[#788F76]"
                      required
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div className="grid gap-2">
                  <Label htmlFor="texture" className="text-stone-700">
                    Texture Image
                  </Label>
                  <div className="flex items-center gap-4">
                    {formData.texture ? (
                      <div className="relative w-20 h-20 rounded-md overflow-hidden border border-stone-200 group">
                        <img
                          src={formData.texture}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 bg-stone-100 rounded-md flex items-center justify-center border border-dashed border-stone-300">
                        <ImageIcon className="w-6 h-6 text-stone-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        id="texture"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="bg-stone-50 border-stone-200 focus-visible:ring-[#788F76]"
                      />
                      {uploading && (
                        <p className="text-xs text-stone-500 mt-1">
                          Uploading...
                        </p>
                      )}
                    </div>
                  </div>
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
                  disabled={uploading}
                  className="bg-[#788F76] hover:bg-[#667c64] text-white"
                >
                  {uploading
                    ? "Uploading..."
                    : editingTexture
                      ? "Update Texture"
                      : "Save Texture"}
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
            placeholder="Search Textures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border-none rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-stone-200 text-stone-700"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-600" />
          {/* <select
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
          </select> */}
        </div>

        {/* Stock Filter */}
        {/* <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-sm text-stone-600 focus:outline-none focus:ring-1 focus:ring-[#788F76]"
        >
          <option value="all">All Stock</option>
          <option value="low">Low Stock (&lt; 50)</option>
          <option value="high">High Stock (≥ 50)</option>
        </select> */}
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          {/* 4. LOADING STATE UI */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-stone-500">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Loading Textures...</p>
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
                    ID
                  </TableHead>
                  <TableHead className="font-medium text-stone-600">
                    Texture
                  </TableHead>
                  <TableHead className="font-medium text-stone-600 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* 5. DYNAMIC DATA MAPPING */}
                {filteredTextures.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-stone-500"
                    >
                      {textures.length === 0
                        ? "No textures found."
                        : "No textures match the selected filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTextures.map((texture) => (
                    <TableRow
                      key={texture._id}
                      className="hover:bg-stone-50/50"
                    >
                      <TableCell className="text-stone-600">
                        {texture.textureId.toString().padStart(3, "0")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-stone-100 rounded-md flex items-center justify-center text-stone-400 text-xs overflow-hidden">
                            {texture.texture && texture.texture.length > 0 ? (
                              <img
                                src={texture.texture}
                                alt={texture.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              "Img"
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">
                              {texture.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(texture)}
                          className="h-8 w-8 text-stone-400 hover:text-stone-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          // 6. DELETE TRIGGER
                          onClick={() => handleDelete(texture._id)}
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
