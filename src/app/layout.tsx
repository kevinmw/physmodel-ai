import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhysModel AI - 高中物理动态模型生成器",
  description: "拍照识别物理题目，AI自动生成GeoGebra动态物理模型",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
