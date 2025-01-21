import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { StockItem, StockVariant } from "@/pages/Stock";

type AddStockFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<StockItem, "id" | "createdAt">) => void;
  existingItems: StockItem[];
};

const AddStockForm = ({ open, onClose, onSubmit, existingItems }: AddStockFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [variants, setVariants] = useState<Omit<StockVariant, "id">[]>([
    { size: "", color: "", quantity: 0 },
  ]);

  const checkDuplicateVariant = (name: string, newVariant: Omit<StockVariant, "id">) => {
    const existingItem = existingItems.find(item => item.name.toLowerCase() === name.toLowerCase());
    if (!existingItem) return false;

    return existingItem.variants.some(variant => 
      variant.size?.toLowerCase() === newVariant.size?.toLowerCase() &&
      variant.color?.toLowerCase() === newVariant.color?.toLowerCase()
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate variants
    const hasDuplicates = variants.some(variant => 
      checkDuplicateVariant(formData.name, variant)
    );

    if (hasDuplicates) {
      toast({
        title: "Duplicate Variant",
        description: "This product variant already exists in the inventory.",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      name: formData.name,
      price: Number(formData.price),
      description: formData.description,
      variants: variants.map(variant => ({
        size: variant.size,
        color: variant.color,
        quantity: Number(variant.quantity),
      })),
    });
    
    setFormData({ name: "", price: "", description: "" });
    setVariants([{ size: "", color: "", quantity: 0 }]);
  };

  const addVariant = () => {
    setVariants([...variants, { size: "", color: "", quantity: 0 }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index: number, field: keyof StockVariant, value: string) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: field === "quantity" ? Number(value) : value,
    };
    setVariants(newVariants);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Stock Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Variants</Label>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Plus className="h-4 w-4 mr-2" /> Add Variant
              </Button>
            </div>
            {variants.map((variant, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="space-y-2 flex-1">
                  <Label>Size</Label>
                  <Input
                    value={variant.size}
                    onChange={(e) => updateVariant(index, "size", e.target.value)}
                    placeholder="Size"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>Color</Label>
                  <Input
                    value={variant.color}
                    onChange={(e) => updateVariant(index, "color", e.target.value)}
                    placeholder="Color"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="0"
                    value={variant.quantity}
                    onChange={(e) => updateVariant(index, "quantity", e.target.value)}
                    required
                  />
                </div>
                {variants.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-8"
                    onClick={() => removeVariant(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockForm;