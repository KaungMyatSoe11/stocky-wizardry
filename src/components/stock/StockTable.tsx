import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpCircle, ArrowDownCircle, Edit, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { StockItem } from "@/pages/Stock";

type StockTableProps = {
  items: StockItem[];
  onAdjustStock: (id: string, variantIndex: number, adjustment: number) => void;
};

const StockTable = ({ items, onAdjustStock }: StockTableProps) => {
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<{ itemId: string; variantIndex: number; quantity: string } | null>(null);
  const [editedValues, setEditedValues] = useState({
    name: "",
    description: "",
    price: "",
    variants: [] as { size: string; color: string; quantity: number }[],
  });

  const handleEditClick = (item: StockItem) => {
    setEditingItem(item);
    setEditedValues({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      variants: [...item.variants],
    });
  };

  const handleSaveEdit = () => {
    // This is where you would typically save the changes to your backend
    toast({
      title: "Changes Saved",
      description: "Item has been updated successfully.",
    });
    setEditingItem(null);
  };

  const handleAdjustQuantity = (itemId: string, variantIndex: number) => {
    if (adjustQuantity?.quantity) {
      const quantity = parseInt(adjustQuantity.quantity);
      if (isNaN(quantity)) {
        toast({
          title: "Invalid Quantity",
          description: "Please enter a valid number.",
          variant: "destructive",
        });
        return;
      }
      onAdjustStock(itemId, variantIndex, quantity);
      setAdjustQuantity(null);
    }
  };

  const updateVariant = (index: number, field: keyof typeof editedValues.variants[0], value: string) => {
    const newVariants = [...editedValues.variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: field === "quantity" ? Number(value) : value,
    };
    setEditedValues({ ...editedValues, variants: newVariants });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
              <TableCell>
                <div className="space-y-2">
                  {item.variants.map((variant, index) => (
                    <div key={index} className="flex items-center justify-between gap-2 text-sm">
                      <span>
                        {variant.size && variant.color
                          ? `${variant.size} - ${variant.color}`
                          : variant.size || variant.color || "Default"}
                      </span>
                      <span className="font-medium">Qty: {variant.quantity}</span>
                      <div className="flex gap-1">
                        {adjustQuantity?.itemId === item.id && adjustQuantity?.variantIndex === index ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={adjustQuantity.quantity}
                              onChange={(e) => setAdjustQuantity({ ...adjustQuantity, quantity: e.target.value })}
                              className="w-20 h-8"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAdjustQuantity(item.id, index)}
                            >
                              Apply
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => setAdjustQuantity({ itemId: item.id, variantIndex: index, quantity: "" })}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => setAdjustQuantity({ itemId: item.id, variantIndex: index, quantity: "" })}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(item)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No items found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={editingItem !== null} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editedValues.name}
                onChange={(e) => setEditedValues({ ...editedValues, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editedValues.description}
                onChange={(e) => setEditedValues({ ...editedValues, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={editedValues.price}
                onChange={(e) => setEditedValues({ ...editedValues, price: e.target.value })}
              />
            </div>
            <div className="space-y-4">
              <Label>Variants</Label>
              {editedValues.variants.map((variant, index) => (
                <div key={index} className="flex gap-4">
                  <div className="space-y-2 flex-1">
                    <Label>Size</Label>
                    <Input
                      value={variant.size}
                      onChange={(e) => updateVariant(index, "size", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label>Color</Label>
                    <Input
                      value={variant.color}
                      onChange={(e) => updateVariant(index, "color", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={variant.quantity}
                      onChange={(e) => updateVariant(index, "quantity", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockTable;