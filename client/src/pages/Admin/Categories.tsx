import { useEffect, useState } from "react";
import { categoryAPI } from '@/services/api';
import { Layout } from "@/components/Dashboard/Layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Pencil, Trash2, Plus, Search, Loader2 } from "lucide-react";

export function CategoriesPage() {
  // 1. STATE MANAGEMENT
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 2. FETCH DATA (useEffect)
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE HANDLER
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await categoryAPI.delete(id);
      // Refresh the list after successful deletion
      loadCategories();
    } catch (err) {
      alert('Error deleting category');
    }
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => {
    const searchMatch = searchQuery === '' ||
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return searchMatch;
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle cancel - reset form and close dialog
  const handleCancel = () => {
    setFormData({
      name: '',
      description: ''
    });
    setEditingCategory(null);
    setOpen(false);
  };

  // Handle edit - populate form with category data
  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const categoryData = {
        name: formData.name,
        description: formData.description
      };

      if (editingCategory) {
        // Update existing category
        await categoryAPI.update(editingCategory._id, categoryData);
      } else {
        // Create new category
        await categoryAPI.create(categoryData);
      }

      // Reset form and close dialog
      setFormData({
        name: '',
        description: ''
      });
      setEditingCategory(null);
      setOpen(false);

      // Refresh categories list
      loadCategories();
    } catch (err) {
      alert('Error saving category: ' + (err as Error).message);
    }
  };

  return (
    <Layout
      title="Categories"
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#788F76] hover:bg-[#667c64] text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white text-stone-800">
            <DialogHeader>
              <DialogTitle className="text-xl font-serif text-stone-900">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
              <DialogDescription className="text-stone-500">
                {editingCategory
                  ? 'Update the category details below.'
                  : 'Create a new product category here. Click save when you\'re done.'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Name Input */}
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-stone-700">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Exfoliators"
                    className="bg-stone-50 border-stone-200 focus-visible:ring-[#788F76]"
                    required
                  />
                </div>

                {/* Description Input */}
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-stone-700">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the category..."
                    className="bg-stone-50 border-stone-200 focus-visible:ring-[#788F76] resize-none h-24"
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCancel} className="border-stone-200 text-stone-600 hover:bg-stone-50">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#788F76] hover:bg-[#667c64] text-white">
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Search Section */}
      <div className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-stone-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border-none rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-stone-200 text-stone-700"
          />
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          {/* 4. LOADING STATE UI */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-stone-500">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Loading categories...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-md m-4">
              Error: {error}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-stone-50">
                <TableRow>
                  <TableHead className="font-medium text-stone-600">Name</TableHead>
                  <TableHead className="font-medium text-stone-600">Description</TableHead>
                  <TableHead className="font-medium text-stone-600 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* 5. DYNAMIC DATA MAPPING */}
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-stone-500">
                      {categories.length === 0 ? 'No categories found.' : 'No categories match the search query.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category._id} className="hover:bg-stone-50/50">
                      <TableCell className="font-semibold text-stone-800">{category.name}</TableCell>
                      <TableCell className="text-stone-600">{category.description}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                          className="h-8 w-8 text-stone-400 hover:text-stone-600"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          // 6. DELETE TRIGGER
                          onClick={() => handleDelete(category._id)}
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