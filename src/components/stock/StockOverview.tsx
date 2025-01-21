import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, DollarSign, AlertTriangle } from "lucide-react";
import type { StockItem } from "@/pages/Stock";

type StockOverviewProps = {
  items: StockItem[];
};

const StockOverview = ({ items }: StockOverviewProps) => {
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => {
    const totalQuantity = item.variants.reduce((qty, variant) => qty + variant.quantity, 0);
    return sum + item.price * totalQuantity;
  }, 0);
  const lowStockItems = items.filter((item) => 
    item.variants.some((variant) => variant.quantity < 10)
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <Package2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalItems}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalValue.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockItems}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockOverview;