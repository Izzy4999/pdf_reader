"use client"
import React, { useState } from "react";
import { Dialog } from "./ui/dialog";
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

type Props = {};

export default function UploadButton({}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(false);
        }
      }}
    >
      <DialogTrigger onClick={()=> setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent>
        
      </DialogContent>
    </Dialog>
  );
}
