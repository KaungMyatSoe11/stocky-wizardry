import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import type { StockItem } from "@/pages/Stock";

type StockTableProps = {
  items: StockItem[];
  onAdjustStock: (id: string, variantIndex: number, adjustment: number) => void;
};

const StockTable = ({ items, onAdjustStock }: StockTableProps) => {
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
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onAdjustStock(item.id, index, -1)}
                        >
                          <ArrowDownCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onAdjustStock(item.id, index, 1)}
                        >
                          <ArrowUpCircle className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {/* Additional actions can be added here */}
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
    </div>
  );
};

export default StockTable;