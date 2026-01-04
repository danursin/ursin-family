"use client";

import React from "react";
import { useToast } from "./ToastProvider";

const gedcomUrl = "https://ursin-family.vercel.app/api/gedcom";
const params = new URLSearchParams({
    url: gedcomUrl,
    embedded: "true"
});
const src = `https://pewu.github.io/topola-viewer/#/view?${params.toString()}`;

export default function TopolaViewer() {
    const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
    const { showToast } = useToast();

    const enterFullscreen = async () => {
        const current = iframeRef.current;
        if (current) {
            try {
                await current.requestFullscreen();
            } catch (err) {
                const message = (err as Error).message;
                showToast(message, "error");
            }
        }
    };

    return (
        <>
            <button onClick={enterFullscreen}>Full Screen</button>
            <iframe ref={iframeRef} src={src} style={{ width: "100%", height: "85vh", border: "0" }} allowFullScreen allow="fullscreen" />
        </>
    );
}
