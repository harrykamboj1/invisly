"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WATCHLIST_TABLE_HEADER } from "@/lib/constants";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { cn, getChangeColorClass } from "@/lib/utils";
import WatchlistButton from "./WatchListButton";
import { useState } from "react";
import type { MouseEvent } from "react";
import { addToAlerts } from "@/lib/actions/alerts.actions";
import { toast } from "sonner";

interface WatchlistTableProps {
  watchlist: {
    symbol: string;
    company: string;
    priceFormatted?: string;
    changePercent: number;
    changeFormatted?: string;
    marketCap?: string;
    peRatio?: string;
  }[];
}

export function WatchlistTable({ watchlist }: WatchlistTableProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [alertName, setAlertName] = useState<string>("");
  const [condition, setCondition] = useState<"gt" | "lt">("gt");
  const [threshold, setThreshold] = useState<number | 0>(0);
  const [symbol, setSymbol] = useState<string | "">("");
  const [companyName, setCompanyName] = useState("");

  const openAlertBox = (e: MouseEvent<HTMLButtonElement>, item: any) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(true);
    setAlertName(item.company + " Alert");
    setThreshold(item.currentPrice);
    setSymbol(item.symbol);
    setCompanyName(item.company);
  };

  const createAlert = async () => {
    try {
      const response = await addToAlerts({
        alertName,
        stockIdentifier: symbol,
        alertType: "",
        alertCondition: condition,
        alertValue: threshold,
        companyName: companyName,
      });
      if (response.success) {
        toast.success(alertName + " Created Successfully");
      }
    } catch (e) {
      console.error("error while saving alert", e);
      toast.error("Something went wrong");
    } finally {
      setOpen(false);
      setAlertName("");
      setCondition("gt");
      setCompanyName("");
      setThreshold(0);
    }
  };

  return (
    <>
      <Table className="scrollbar-hide-default watchlist-table">
        <TableHeader>
          <TableRow className="table-header-row">
            {WATCHLIST_TABLE_HEADER.map((label) => (
              <TableHead className="table-header" key={label}>
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchlist.map((item, index) => (
            <TableRow
              key={item.symbol + index}
              className="table-row"
              onClick={() =>
                router.push(`/stocks/${encodeURIComponent(item.symbol)}`)
              }
            >
              <TableCell className="pl-4 table-cell">{item.company}</TableCell>
              <TableCell className="table-cell">{item.symbol}</TableCell>
              <TableCell className="table-cell">
                {item.priceFormatted || "—"}
              </TableCell>
              <TableCell
                className={cn(
                  "table-cell",
                  getChangeColorClass(item.changePercent)
                )}
              >
                {item.changeFormatted || "—"}
              </TableCell>
              <TableCell className="table-cell">
                {item.marketCap || "—"}
              </TableCell>
              <TableCell className="table-cell">
                {item.peRatio || "—"}
              </TableCell>
              <TableCell>
                <Button
                  className="add-alert"
                  onClick={(e: React.MouseEvent) => openAlertBox(e, item)}
                >
                  Add Alert
                </Button>
              </TableCell>
              <TableCell>
                <WatchlistButton
                  symbol={item.symbol}
                  company={item.company}
                  isInWatchlist={true}
                  showTrashIcon={true}
                  type="icon"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create Price Alert</DialogTitle>
            <DialogDescription>
              Create a price alert to be notified when the stock crosses your
              threshold.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Alert Name
              </label>
              <input
                className="w-full rounded-lg border px-4 py-3 bg-zinc-900 placeholder:text-zinc-500"
                value={alertName}
                onChange={(e) => setAlertName(e.target.value)}
                placeholder="e.g. Apple Inc Alert"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Stock Identifier
              </label>
              <input
                className="w-full rounded-lg border px-4 py-3 bg-zinc-800 text-zinc-200"
                value={symbol ?? ""}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Condition
              </label>
              <select
                className="w-full rounded-lg border px-4 py-3 bg-zinc-900"
                value={condition}
                onChange={(e) => setCondition(e.target.value as "gt" | "lt")}
              >
                <option value="gt">Greater than (&gt;)</option>
                <option value="lt">Less than (&lt;)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Threshold value
              </label>
              <div className="flex items-center rounded-lg border overflow-hidden bg-zinc-900">
                <span className="px-4 text-zinc-300">Rs.</span>
                <input
                  type="number"
                  className="w-full rounded-none border-0 px-2 py-3 bg-transparent text-zinc-200"
                  value={threshold ?? ""}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                className="w-full rounded-xl py-4 bg-yellow-400 text-black"
                type="submit"
                onClick={() => createAlert()}
              >
                Create Alert
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
