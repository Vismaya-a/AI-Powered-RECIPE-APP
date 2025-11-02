// import { useState, useEffect } from 'react';
// import { Button } from '../components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
// import { Input } from '../components/ui/input';
// import { Label } from '../components/ui/label';
// import { Badge } from '../components/ui/badge';
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from '../components/ui/dialog';
// import { Plus, Trash2, Package } from 'lucide-react';
// import { toast } from 'sonner';
// import { api } from '../utils/api';

// interface PantryItem {
//     id: number;
//     ingredient_name: string;
//     quantity: string;
//     unit?: string;
//     category?: string;
//     expiry_date?: string;
//     created_at: string;
//     updated_at: string;
// }

// interface PantryItemCreate {
//     ingredient_name: string;
//     quantity: string;
//     unit?: string;
//     category?: string;
//     expiry_date?: string;
// }

// export default function Pantry() {
//     const [items, setItems] = useState<PantryItem[]>([]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [newItem, setNewItem] = useState<PantryItemCreate>({
//         ingredient_name: '',
//         quantity: '',
//         unit: '',
//         category: '',
//         expiry_date: ''
//     });

//     // Load pantry items from backend
//     useEffect(() => {
//         fetchPantryItems();
//     }, []);

//     const fetchPantryItems = async () => {
//         try {
//             setIsLoading(true);
//             console.log('Fetching pantry items from backend...');
//             const pantryItems = await api.get<PantryItem[]>('/kitchen/items');
//             console.log('Received pantry items:', pantryItems);
//             setItems(pantryItems);
//         } catch (error: any) {
//             console.error('Failed to fetch pantry items:', error);
//             toast.error('Failed to load pantry items');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleAddItem = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             console.log('Adding new item:', newItem);
//             const addedItem = await api.post<PantryItem>('/kitchen/items', newItem);
//             console.log('Added item response:', addedItem);
//             setItems(prev => [...prev, addedItem]);
//             setNewItem({ ingredient_name: '', quantity: '', unit: '', category: '', expiry_date: '' });
//             setIsOpen(false);
//             toast.success('Item added to pantry');
//         } catch (error: any) {
//             console.error('Failed to add item:', error);
//             toast.error('Failed to add item to pantry');
//         }
//     };

//     const handleDeleteItem = async (id: number) => {
//         try {
//             console.log('Deleting item:', id);
//             await api.delete(`/kitchen/items/${id}`);
//             setItems(prev => prev.filter(item => item.id !== id));
//             toast.success('Item removed from pantry');
//         } catch (error: any) {
//             console.error('Failed to delete item:', error);
//             toast.error('Failed to remove item from pantry');
//         }
//     };

//     const categories = ['Vegetables', 'Protein', 'Grains', 'Dairy', 'Oils', 'Spices', 'Fruits', 'Herbs', 'Beverages', 'Condiments', 'Other'];
//     const units = ['pieces', 'grams', 'kg', 'ml', 'liters', 'cups', 'tablespoons', 'teaspoons', 'ounces', 'pounds', 'bunch', 'pinch', 'can', 'jar', 'packet'];

//     const formatDate = (dateString: string) => {
//         try {
//             return new Date(dateString).toLocaleDateString();
//         } catch {
//             return 'Unknown date';
//         }
//     };

//     const displayQuantity = (item: PantryItem) => {
//         if (item.unit) {
//             return `${item.quantity} ${item.unit}`;
//         }
//         return item.quantity;
//     };

//     if (isLoading) {
//         return (
//             <div className="container py-8">
//                 <div className="flex items-center justify-between mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold mb-2">My Pantry</h1>
//                         <p className="text-muted-foreground">Loading your ingredients...</p>
//                     </div>
//                     <Button variant="hero" size="lg" disabled>
//                         <Plus className="mr-2 h-5 w-5" />
//                         Add Item
//                     </Button>
//                 </div>
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                     {[1, 2, 3].map(i => (
//                         <Card key={i} className="animate-pulse">
//                             <CardHeader className="pb-3">
//                                 <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
//                                 <div className="h-3 bg-muted rounded w-1/2"></div>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="h-6 bg-muted rounded w-20"></div>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="container py-8">
//             <div className="flex items-center justify-between mb-8">
//                 <div>
//                     <h1 className="text-3xl font-bold mb-2">My Pantry</h1>
//                     <p className="text-muted-foreground">
//                         {items.length === 0
//                             ? "Add your first ingredient to get started"
//                             : `You have ${items.length} item${items.length !== 1 ? 's' : ''} in your pantry`
//                         }
//                     </p>
//                 </div>
//                 <Dialog open={isOpen} onOpenChange={setIsOpen}>
//                     <DialogTrigger asChild>
//                         <Button variant="hero" size="lg">
//                             <Plus className="mr-2 h-5 w-5" />
//                             Add Item
//                         </Button>
//                     </DialogTrigger>
//                     <DialogContent className="max-w-md">
//                         <DialogHeader>
//                             <DialogTitle>Add Pantry Item</DialogTitle>
//                             <DialogDescription>Add a new ingredient to your pantry</DialogDescription>
//                         </DialogHeader>
//                         <form onSubmit={handleAddItem} className="space-y-4">
//                             <div className="space-y-2">
//                                 <Label htmlFor="ingredient">Ingredient Name *</Label>
//                                 <Input
//                                     id="ingredient"
//                                     value={newItem.ingredient_name}
//                                     onChange={(e) => setNewItem({ ...newItem, ingredient_name: e.target.value })}
//                                     placeholder="e.g., Tomatoes, Chicken, Rice"
//                                     required
//                                 />
//                             </div>

//                             <div className="grid grid-cols-2 gap-3">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="quantity">Quantity *</Label>
//                                     <Input
//                                         id="quantity"
//                                         type="number"
//                                         value={newItem.quantity}
//                                         onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
//                                         placeholder="e.g., 5"
//                                         required
//                                         min="0"
//                                         step="0.1"
//                                     />
//                                 </div>
//                                 <div className="space-y-2">
//                                     <Label htmlFor="unit">Unit</Label>
//                                     <select
//                                         id="unit"
//                                         className="w-full rounded-lg border border-input bg-background px-3 py-2"
//                                         value={newItem.unit}
//                                         onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
//                                     >
//                                         <option value="">Select unit</option>
//                                         {units.map(unit => (
//                                             <option key={unit} value={unit}>{unit}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="category">Category</Label>
//                                 <select
//                                     id="category"
//                                     className="w-full rounded-lg border border-input bg-background px-3 py-2"
//                                     value={newItem.category}
//                                     onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
//                                 >
//                                     <option value="">Select a category (optional)</option>
//                                     {categories.map(cat => (
//                                         <option key={cat} value={cat}>{cat}</option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="expiry">Expiry Date</Label>
//                                 <Input
//                                     id="expiry"
//                                     type="date"
//                                     value={newItem.expiry_date}
//                                     onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
//                                 />
//                             </div>

//                             <Button type="submit" className="w-full">Add to Pantry</Button>
//                         </form>
//                     </DialogContent>
//                 </Dialog>
//             </div>

//             {items.length === 0 ? (
//                 <Card className="text-center py-12">
//                     <CardContent>
//                         <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
//                         <h3 className="text-xl font-semibold mb-2">Your pantry is empty</h3>
//                         <p className="text-muted-foreground mb-4">Start adding ingredients to get recipe suggestions</p>
//                         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//                             <DialogTrigger asChild>
//                                 <Button variant="hero">
//                                     <Plus className="mr-2 h-5 w-5" />
//                                     Add Your First Item
//                                 </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-md">
//                                 <DialogHeader>
//                                     <DialogTitle>Add Pantry Item</DialogTitle>
//                                     <DialogDescription>Add a new ingredient to your pantry</DialogDescription>
//                                 </DialogHeader>
//                                 <form onSubmit={handleAddItem} className="space-y-4">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="ingredient">Ingredient Name *</Label>
//                                         <Input
//                                             id="ingredient"
//                                             value={newItem.ingredient_name}
//                                             onChange={(e) => setNewItem({ ...newItem, ingredient_name: e.target.value })}
//                                             placeholder="e.g., Tomatoes, Chicken, Rice"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-3">
//                                         <div className="space-y-2">
//                                             <Label htmlFor="quantity">Quantity *</Label>
//                                             <Input
//                                                 id="quantity"
//                                                 type="number"
//                                                 value={newItem.quantity}
//                                                 onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
//                                                 placeholder="e.g., 5"
//                                                 required
//                                                 min="0"
//                                                 step="0.1"
//                                             />
//                                         </div>
//                                         <div className="space-y-2">
//                                             <Label htmlFor="unit">Unit</Label>
//                                             <select
//                                                 id="unit"
//                                                 className="w-full rounded-lg border border-input bg-background px-3 py-2"
//                                                 value={newItem.unit}
//                                                 onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
//                                             >
//                                                 <option value="">Select unit</option>
//                                                 {units.map(unit => (
//                                                     <option key={unit} value={unit}>{unit}</option>
//                                                 ))}
//                                             </select>
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="category">Category</Label>
//                                         <select
//                                             id="category"
//                                             className="w-full rounded-lg border border-input bg-background px-3 py-2"
//                                             value={newItem.category}
//                                             onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
//                                         >
//                                             <option value="">Select a category (optional)</option>
//                                             {categories.map(cat => (
//                                                 <option key={cat} value={cat}>{cat}</option>
//                                             ))}
//                                         </select>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <Label htmlFor="expiry">Expiry Date</Label>
//                                         <Input
//                                             id="expiry"
//                                             type="date"
//                                             value={newItem.expiry_date}
//                                             onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
//                                         />
//                                     </div>

//                                     <Button type="submit" className="w-full">Add to Pantry</Button>
//                                 </form>
//                             </DialogContent>
//                         </Dialog>
//                     </CardContent>
//                 </Card>
//             ) : (
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//                     {items.map((item) => (
//                         <Card key={item.id} className="transition-all hover:shadow-soft">
//                             <CardHeader className="pb-3">
//                                 <div className="flex items-start justify-between">
//                                     <div className="flex-1">
//                                         <CardTitle className="text-lg">{item.ingredient_name}</CardTitle>
//                                         <CardDescription>{displayQuantity(item)}</CardDescription>
//                                         {item.expiry_date && (
//                                             <p className="text-xs text-muted-foreground mt-1">
//                                                 Expires: {formatDate(item.expiry_date)}
//                                             </p>
//                                         )}
//                                     </div>
//                                     <Button
//                                         variant="ghost"
//                                         size="icon"
//                                         onClick={() => handleDeleteItem(item.id)}
//                                         className="text-destructive hover:text-destructive hover:bg-destructive/10"
//                                     >
//                                         <Trash2 className="h-4 w-4" />
//                                     </Button>
//                                 </div>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="flex flex-wrap gap-2">
//                                     {item.category && (
//                                         <Badge variant="secondary">{item.category}</Badge>
//                                     )}
//                                     {item.unit && (
//                                         <Badge variant="outline">{item.unit}</Badge>
//                                     )}
//                                     <Badge variant="outline" className="text-xs">
//                                         Added: {formatDate(item.created_at)}
//                                     </Badge>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </div>
//             )}

//             {/* Debug info - remove in production */}
//             {import.meta.env.DEV && (
//                 <div className="mt-8 p-4 bg-muted rounded-lg">
//                     <h3 className="font-semibold mb-2">Debug Info:</h3>
//                     <p>Items count: {items.length}</p>
//                     <Button
//                         onClick={() => console.log('Current items:', items)}
//                         variant="outline"
//                         size="sm"
//                         className="mt-2"
//                     >
//                         Log Items to Console
//                     </Button>
//                 </div>
//             )}
//         </div>
//     );
// }
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../components/ui/dialog';
import { Plus, Trash2, Package, Download, Upload, Edit, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../utils/api';

interface PantryItem {
    id: number;
    ingredient_name: string;
    quantity: string;
    unit?: string;
    category?: string;
    expiry_date?: string;
    created_at: string;
    updated_at: string;
}

interface PantryItemCreate {
    ingredient_name: string;
    quantity: string;
    unit?: string;
    category?: string;
    expiry_date?: string;
}

interface BulkItem extends PantryItemCreate {
    id: number; // Temporary ID for React keys
}

export default function Pantry() {
    const [items, setItems] = useState<PantryItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isBulkAddOpen, setIsBulkAddOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingItems, setEditingItems] = useState<PantryItem[]>([]);
    const [newItem, setNewItem] = useState<PantryItemCreate>({
        ingredient_name: '',
        quantity: '',
        unit: '',
        category: '',
        expiry_date: ''
    });
    const [bulkItems, setBulkItems] = useState<BulkItem[]>([
        { id: 1, ingredient_name: '', quantity: '', unit: '', category: '' }
    ]);

    // Load pantry items from backend
    useEffect(() => {
        fetchPantryItems();
    }, []);

    const fetchPantryItems = async () => {
        try {
            setIsLoading(true);
            const pantryItems = await api.get<PantryItem[]>('/kitchen/items');
            setItems(pantryItems);
        } catch (error: any) {
            console.error('Failed to fetch pantry items:', error);
            toast.error('Failed to load pantry items');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const addedItem = await api.post<PantryItem>('/kitchen/items', newItem);
            setItems(prev => [...prev, addedItem]);
            setNewItem({ ingredient_name: '', quantity: '', unit: '', category: '', expiry_date: '' });
            setIsOpen(false);
            toast.success('Item added to pantry');
        } catch (error: any) {
            console.error('Failed to add item:', error);
            toast.error('Failed to add item to pantry');
        }
    };

    const handleDeleteItem = async (id: number) => {
        try {
            await api.delete(`/kitchen/items/${id}`);
            setItems(prev => prev.filter(item => item.id !== id));
            toast.success('Item removed from pantry');
        } catch (error: any) {
            console.error('Failed to delete item:', error);
            toast.error('Failed to remove item from pantry');
        }
    };

    // Bulk Add functionality with individual fields
    const addBulkField = () => {
        if (bulkItems.length >= 10) {
            toast.error('Maximum 10 items allowed at once');
            return;
        }
        setBulkItems(prev => [
            ...prev,
            { id: Date.now(), ingredient_name: '', quantity: '', unit: '', category: '' }
        ]);
    };

    const removeBulkField = (id: number) => {
        if (bulkItems.length === 1) {
            // Don't remove the last field, just clear it
            setBulkItems([{ id: 1, ingredient_name: '', quantity: '', unit: '', category: '' }]);
            return;
        }
        setBulkItems(prev => prev.filter(item => item.id !== id));
    };

    const updateBulkField = (id: number, field: keyof BulkItem, value: string) => {
        setBulkItems(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const handleBulkAdd = async () => {
        const validItems = bulkItems.filter(item =>
            item.ingredient_name.trim() && item.quantity.trim()
        );

        if (validItems.length === 0) {
            toast.error('Please add at least one item with ingredient name and quantity');
            return;
        }

        try {
            const addedItems = await api.post<PantryItem[]>('/kitchen/items/bulk-add', {
                items: validItems
            });

            setItems(prev => [...prev, ...addedItems]);
            setBulkItems([{ id: 1, ingredient_name: '', quantity: '', unit: '', category: '' }]);
            setIsBulkAddOpen(false);
            toast.success(`Added ${addedItems.length} items to pantry`);
        } catch (error: any) {
            console.error('Failed to bulk add items:', error);
            toast.error('Failed to add items to pantry');
        }
    };

    // Bulk Update functionality
    const startBulkEdit = () => {
        setEditingItems([...items]);
        setIsEditing(true);
    };

    const cancelBulkEdit = () => {
        setEditingItems([]);
        setIsEditing(false);
    };

    const handleBulkUpdate = async () => {
        try {
            const itemsToUpdate = editingItems.map(item => ({
                ingredient_name: item.ingredient_name,
                quantity: item.quantity,
                unit: item.unit,
                category: item.category,
                expiry_date: item.expiry_date
            }));

            const updatedItems = await api.put<PantryItem[]>('/kitchen/items/bulk', {
                items: itemsToUpdate
            });

            setItems(updatedItems);
            setIsEditing(false);
            setEditingItems([]);
            toast.success('Pantry updated successfully');
        } catch (error: any) {
            console.error('Failed to update items:', error);
            toast.error('Failed to update pantry items');
        }
    };

    const updateEditingItem = (index: number, field: keyof PantryItem, value: string) => {
        const updated = [...editingItems];
        updated[index] = { ...updated[index], [field]: value };
        setEditingItems(updated);
    };

    const removeEditingItem = (index: number) => {
        const updated = editingItems.filter((_, i) => i !== index);
        setEditingItems(updated);
    };

    // Export functionality
    const exportPantry = () => {
        const exportData = items.map(item =>
            `${item.ingredient_name}, ${item.quantity}${item.unit ? ' ' + item.unit : ''}${item.category ? ', ' + item.category : ''}`
        ).join('\n');

        const blob = new Blob([exportData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pantry-export.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Pantry exported successfully');
    };

    const categories = ['Vegetables', 'Protein', 'Grains', 'Dairy', 'Oils', 'Spices', 'Fruits', 'Herbs', 'Beverages', 'Condiments', 'Other'];
    const units = ['pieces', 'grams', 'kg', 'ml', 'liters', 'cups', 'tablespoons', 'teaspoons', 'ounces', 'pounds', 'bunch', 'pinch', 'can', 'jar', 'packet'];

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return 'Unknown date';
        }
    };

    const displayQuantity = (item: PantryItem) => {
        if (item.unit) {
            return `${item.quantity} ${item.unit}`;
        }
        return item.quantity;
    };

    const validBulkItemsCount = bulkItems.filter(item =>
        item.ingredient_name.trim() && item.quantity.trim()
    ).length;

    if (isLoading) {
        return (
            <div className="container py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">My Pantry</h1>
                        <p className="text-muted-foreground">Loading your ingredients...</p>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map(i => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="pb-3">
                                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-6 bg-muted rounded w-20"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Pantry</h1>
                    <p className="text-muted-foreground">
                        {items.length === 0
                            ? "Add your first ingredient to get started"
                            : `You have ${items.length} item${items.length !== 1 ? 's' : ''} in your pantry`
                        }
                    </p>
                </div>
                <div className="flex gap-2">
                    {items.length > 0 && (
                        <>
                            <Button variant="outline" onClick={exportPantry}>
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                            {!isEditing ? (
                                <Button variant="outline" onClick={startBulkEdit}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit All
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={cancelBulkEdit}>
                                        <X className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>
                                    <Button variant="hero" onClick={handleBulkUpdate}>
                                        <Check className="mr-2 h-4 w-4" />
                                        Save All
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                    <Dialog open={isBulkAddOpen} onOpenChange={setIsBulkAddOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Upload className="mr-2 h-4 w-4" />
                                Bulk Add
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Bulk Add Items</DialogTitle>
                                <DialogDescription>
                                    Add multiple items at once (max 10). Fill in the details for each item.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                {bulkItems.map((item, index) => (
                                    <Card key={item.id} className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <h4 className="font-semibold">Item {index + 1}</h4>
                                            {bulkItems.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeBulkField(item.id)}
                                                    className="text-destructive h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div className="space-y-2">
                                                <Label>Ingredient Name *</Label>
                                                <Input
                                                    value={item.ingredient_name}
                                                    onChange={(e) => updateBulkField(item.id, 'ingredient_name', e.target.value)}
                                                    placeholder="e.g., Tomatoes"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Quantity *</Label>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateBulkField(item.id, 'quantity', e.target.value)}
                                                    placeholder="e.g., 5"
                                                    required
                                                    min="0"
                                                    step="0.1"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Unit</Label>
                                                <select
                                                    className="w-full rounded-lg border border-input bg-background px-3 py-2"
                                                    value={item.unit || ''}
                                                    onChange={(e) => updateBulkField(item.id, 'unit', e.target.value)}
                                                >
                                                    <option value="">Select unit</option>
                                                    {units.map(unit => (
                                                        <option key={unit} value={unit}>{unit}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Category</Label>
                                                <select
                                                    className="w-full rounded-lg border border-input bg-background px-3 py-2"
                                                    value={item.category || ''}
                                                    onChange={(e) => updateBulkField(item.id, 'category', e.target.value)}
                                                >
                                                    <option value="">Select category</option>
                                                    {categories.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                <div className="flex gap-2">
                                    {bulkItems.length < 10 && (
                                        <Button variant="outline" onClick={addBulkField}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Another Item
                                        </Button>
                                    )}
                                    <div className="flex-1 text-right">
                                        <span className="text-sm text-muted-foreground">
                                            {validBulkItemsCount} valid item{validBulkItemsCount !== 1 ? 's' : ''} ready to add
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleBulkAdd}
                                    className="w-full"
                                    disabled={validBulkItemsCount === 0}
                                >
                                    Add {validBulkItemsCount} Item{validBulkItemsCount !== 1 ? 's' : ''} to Pantry
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="hero" size="lg">
                                <Plus className="mr-2 h-5 w-5" />
                                Add Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Add Pantry Item</DialogTitle>
                                <DialogDescription>Add a new ingredient to your pantry</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ingredient">Ingredient Name *</Label>
                                    <Input
                                        id="ingredient"
                                        value={newItem.ingredient_name}
                                        onChange={(e) => setNewItem({ ...newItem, ingredient_name: e.target.value })}
                                        placeholder="e.g., Tomatoes, Chicken, Rice"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="quantity">Quantity *</Label>
                                        <Input
                                            id="quantity"
                                            type="number"
                                            value={newItem.quantity}
                                            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                            placeholder="e.g., 5"
                                            required
                                            min="0"
                                            step="0.1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="unit">Unit</Label>
                                        <select
                                            id="unit"
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2"
                                            value={newItem.unit}
                                            onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                        >
                                            <option value="">Select unit</option>
                                            {units.map(unit => (
                                                <option key={unit} value={unit}>{unit}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2"
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        <option value="">Select a category (optional)</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input
                                        id="expiry"
                                        type="date"
                                        value={newItem.expiry_date}
                                        onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })}
                                    />
                                </div>

                                <Button type="submit" className="w-full">Add to Pantry</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {items.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Your pantry is empty</h3>
                        <p className="text-muted-foreground mb-4">Start adding ingredients to get recipe suggestions</p>
                        <div className="flex gap-2 justify-center">
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="hero">
                                        <Plus className="mr-2 h-5 w-5" />
                                        Add Item
                                    </Button>
                                </DialogTrigger>
                            </Dialog>
                            <Dialog open={isBulkAddOpen} onOpenChange={setIsBulkAddOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Bulk Add
                                    </Button>
                                </DialogTrigger>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            ) : isEditing ? (
                // Bulk Edit Mode
                <div className="space-y-4">
                    {editingItems.map((item, index) => (
                        <Card key={item.id} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                                <div>
                                    <Label>Ingredient</Label>
                                    <Input
                                        value={item.ingredient_name}
                                        onChange={(e) => updateEditingItem(index, 'ingredient_name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateEditingItem(index, 'quantity', e.target.value)}
                                        min="0"
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label>Unit</Label>
                                    <select
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2"
                                        value={item.unit || ''}
                                        onChange={(e) => updateEditingItem(index, 'unit', e.target.value)}
                                    >
                                        <option value="">Select unit</option>
                                        {units.map(unit => (
                                            <option key={unit} value={unit}>{unit}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label>Category</Label>
                                    <select
                                        className="w-full rounded-lg border border-input bg-background px-3 py-2"
                                        value={item.category || ''}
                                        onChange={(e) => updateEditingItem(index, 'category', e.target.value)}
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeEditingItem(index)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                // Normal View Mode
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <Card key={item.id} className="transition-all hover:shadow-soft">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{item.ingredient_name}</CardTitle>
                                        <CardDescription>{displayQuantity(item)}</CardDescription>
                                        {item.expiry_date && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Expires: {formatDate(item.expiry_date)}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {item.category && (
                                        <Badge variant="secondary">{item.category}</Badge>
                                    )}
                                    {item.unit && (
                                        <Badge variant="outline">{item.unit}</Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs">
                                        Added: {formatDate(item.created_at)}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}