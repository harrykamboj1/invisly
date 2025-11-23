"use client";
import React, { useState } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
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
import { Button } from "./ui/button";
import {
  removeAlertFromList,
  updateFromWatchlist,
} from "@/lib/actions/alerts.actions";
import { toast } from "sonner";

const AlertList = ({ alertList }: { alertList: any }) => {
  const [open, setOpen] = useState(false);
  const [seqNum, setSeqNum] = useState(0);
  const [data, setData] = useState<AlertData>({});
  if (alertList.length == 0) {
    return (
      <div>
        <h1>No alerts found</h1>
      </div>
    );
  }

  const openDeleteAlert = (seqNum: any) => {
    setSeqNum(seqNum);
    setOpen(true);
  };
  const deleteAlert = async () => {
    try {
      const response = await removeAlertFromList({ seqNum });
      if (response.success) {
        toast.success("Alert Deleted Successfully");
      }
    } catch (e) {
      console.error("Exception in deleteAlert :: " + e);
    } finally {
      setSeqNum(0);
      setOpen(false);
    }
  };
  //   const updateAlert = async () => {
  //     try {
  //       const response = await updateFromWatchlist({ seqNum });
  //       if (response.success) {
  //         toast.success("Alert updated Successfully");
  //       }
  //     } catch (e) {
  //       console.error("Exception in updateAlert :: " + e);
  //     } finally {
  //       setSeqNum(0);
  //       setOpen(false);
  //     }
  //   };
  return (
    <>
      {alertList.map((item: any, index: number) => (
        <Card
          key={item.seqNum ?? index}
          className="bg-gray-700 border-gray-700 my-3"
        >
          <CardHeader className="">
            <CardTitle className="text-yellow-500 text-xl font-semibold">
              {item.alertName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">{item.companyName}</p>
                <p className="text-white text-lg font-bold mt-1">
                  Rs.{item.currentPrice ?? item.alertValue}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">{item.symbol}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm ">Alert at:</p>
                  <p
                    className={`text-md font-semibold ${
                      item.alertCondition === "gt"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    Price {item.alertCondition === "gt" ? ">" : "<"} $
                    {item.alertValue}
                  </p>
                </div>
                <div className="flex gap-3 pt-5">
                  {/* <Pencil className="cursor-pointer text-gray-400 hover:text-blue-500 w-5 h-5" /> */}
                  <Trash2
                    onClick={() => openDeleteAlert(item.seqNum)}
                    className="cursor-pointer text-gray-400 hover:text-red-500 w-5 h-5"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-red-500">
              Are you sure you want to delete Alert?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              alert and future notifications.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose>
              {" "}
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            <Button
              type="submit"
              onClick={() => deleteAlert()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AlertList;
