"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintInvoiceButton() {
  return (
    <Button variant="outline-on-dark" size="sm" onClick={() => window.print()} className="print:hidden">
      <Printer className="h-4 w-4" strokeWidth={1.7} />
      چاپ فاکتور
    </Button>
  );
}
