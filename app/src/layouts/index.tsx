import Header from "@/components/header";
import { Box } from "@mui/material";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: React.ReactElement;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateRows: '60px 1fr' }}>
      <Header />
      <main className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </main>
    </Box>
  )
}

export default RootLayout;
