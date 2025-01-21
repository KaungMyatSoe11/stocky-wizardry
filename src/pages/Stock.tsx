import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddStockForm from "@/components/stock/AddStockForm";
import StockOverview from "@/components/stock/StockOverview";
import StockTable from "@/components/stock/StockTable";
import { useToast } from "@/hooks/use-toast";

export type StockVariant = {
  size?: string;
  color?: string;
  quantity: number;
};

export type StockItem = {
  id: string;
  name: string;
  price: number;
  description: string;
  variants: StockVariant[];
  createdAt: Date;
};

const Stock = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const { toast } = useToast();

  const handleAddStock = (item: Omit<StockItem, "id" | "createdAt">) => {
    const newItem: StockItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setStockItems((prev) => [...prev, newItem]);
    setShowAddForm(false);
    toast({
      title: "Stock Added",
      description: `${item.name} has been added to inventory.`,
    });
  };

  const handleAdjustStock = (id: string, variantIndex: number, adjustment: number) => {
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedVariants = [...item.variants];
          const newQuantity = updatedVariants[variantIndex].quantity + adjustment;
          
          if (newQuantity < 0) {
            toast({
              title: "Error",
              description: "Stock cannot be negative",
              variant: "destructive",
            });
            return item;
          }
          
          updatedVariants[variantIndex] = {
            ...updatedVariants[variantIndex],
            quantity: newQuantity,
          };
          
          return { ...item, variants: updatedVariants };
        }
        return item;
      })
    );
  };

  const filteredItems = stockItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Stock Management</h1>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Stock
          </Button>
        </div>

        <StockOverview items={stockItems} />

        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search stock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <StockTable items={filteredItems} onAdjustStock={handleAdjustStock} />
      </div>

      <AddStockForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddStock}
        existingItems={stockItems}
      />
    </div>
  );
};

export default Stock;