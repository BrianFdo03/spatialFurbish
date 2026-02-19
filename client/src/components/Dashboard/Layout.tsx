import React from "react";
import { Sidebar } from "@/components/Dashboard/Sidebar";

export interface LayoutProps {
    title: string;
    children: React.ReactNode;
    action?: React.ReactNode;
}

export function Layout({ title, children, action }: LayoutProps) {
    return (
        <div className="flex min-h-screen bg-stone-50">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-serif font-bold text-stone-800">
                        {title}
                    </h1>
                    {action && <div>{action}</div>}
                </header>
                <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
