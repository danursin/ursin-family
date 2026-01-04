"use client";

import { ReactNode, createContext, useContext, useState } from "react";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

type ToastSeverity = "success" | "error" | "warning" | "info";

type ToastContextValue = {
    showToast: (message: string, severity?: ToastSeverity) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<{
        open: boolean;
        message: string;
        severity: ToastSeverity;
    }>({ open: false, message: "", severity: "info" });

    const showToast = (message: string, severity: ToastSeverity = "info") => {
        setToast({ open: true, message, severity });
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
