"use client";

import { createContext, useContext } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType) => void;
    removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return {
        success: (msg: string) => context.addToast(msg, "success"),
        error: (msg: string) => context.addToast(msg, "error"),
        info: (msg: string) => context.addToast(msg, "info"),
    };
}
