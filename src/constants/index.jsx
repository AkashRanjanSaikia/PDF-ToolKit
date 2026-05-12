import React from 'react';
import { FileStack, Image as ImageIcon, Trash2, ShieldAlert } from 'lucide-react';

export const FEATURES = [
  {
    title: "Merge PDF",
    description: "Combine multiple PDF files into one single document in seconds.",
    icon: <FileStack size={24} />,
    color: "#4f46e5",
    path: "/merge-pdf"
  },
  {
    title: "Image to PDF",
    description: "Convert JPG, PNG, and BMP images into high-quality PDF files.",
    icon: <ImageIcon size={24} />,
    color: "#10b981",
    path: "/image-to-pdf"
  },
  {
    title: "Page Deletor",
    description: "Remove unnecessary pages from your document with ease.",
    icon: <Trash2 size={24} />,
    color: "#ef4444",
    path: "/page-deletor"
  },
  {
    title: "PDF Protection",
    description: "Secure your sensitive files with encrypted passwords instantly.",
    icon: <ShieldAlert size={24} />,
    color: "#f59e0b",
    path: "/pdf-protection"
  }
];
