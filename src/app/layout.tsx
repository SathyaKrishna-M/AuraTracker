import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileNav from "@/components/layout/MobileNav";
import ToastProvider from "@/components/providers/toast-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AuraTracker",
    description: "Track your group's karma",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} pb-20`}>
                <ToastProvider>
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <MobileNav />
                </ToastProvider>
            </body>
        </html>
    );
}
