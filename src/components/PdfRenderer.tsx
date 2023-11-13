"use client";
import { ChevronDown, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  url: string;
};

export default function PdfRenderer({ url }: Props) {
  const [numPages, setNumPages] = useState<number>();

  const { toast } = useToast();
  const { width, ref, height } = useResizeDetector();

  console.log(url);
  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button variant={"ghost"} aria-label="previous page">
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1,5">
            <Input className="w-12 h-8" />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <div ref={ref}>
          <Document
            file={url}
            loading={
              <div className="flex justify-center">
                <Loader2 className="my-24 h-6 w-6 animate-spin" />
              </div>
            }
            className={"max-h-full"}
            onLoadError={() => {
              toast({
                title: "Error to loading PDF",
                description: "Please try again",
                variant: "destructive",
              });
            }}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page
              width={width ? width : 1}
              // height={height ? height : 1}
              pageNumber={1}
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
