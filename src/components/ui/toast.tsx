"use client";

import { useEffect, useState } from "react";
import { X, Check, AlertCircle, Info } from "lucide-react";
import { ToastMessage } from "@/lib/toast-context";
import { cn } from "@/lib/utils";

interface ToastProps {
    toast: ToastMessage;
    onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true));

        // Auto dismiss
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose(toast.id), 300); // Wait for exit animation
        }, 4000);

        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(toast.id), 300);
    };

    const icons = {
        success: <Check className="w-4 h-4 text-emerald-400" />,
        error: <AlertCircle className="w-4 h-4 text-red-400" />,
        info: <Info className="w-4 h-4 text-blue-400" />
    };

    const bgColors = {
        success: "bg-emerald-500/10 border-emerald-500/20",
        error: "bg-red-500/10 border-red-500/20",
        info: "bg-blue-500/10 border-blue-500/20"
    };

    return (
        <div
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg transition-all duration-300 transform mb-2 w-full max-w-sm pointer-events-auto",
                bgColors[toast.type],
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            )}
        >
            <div className={cn("p-1.5 rounded-full bg-white/5")}>
                {icons[toast.type]}
            </div>

            <p className="flex-1 text-sm font-medium text-white/90">{toast.message}</p>

            <button
                onClick={handleClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
                <X className="w-3.5 h-3.5 text-white/50" />
            </button>
        </div>
    );
}
