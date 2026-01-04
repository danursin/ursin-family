"use client";

import React from "react";

const gedcomUrl = "https://ursin-family.vercel.app/api/gedcom";
const params = new URLSearchParams({
    url: gedcomUrl,
    embedded: "true"
});
const src = `https://pewu.github.io/topola-viewer/#/view?${params.toString()}`;

export default function TopolaViewer() {
    const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

    const enterFullscreen = async () => {
        const current = iframeRef.current;
        if (current) {
            await current.requestFullscreen();
        }
    };

    return (
        <>
            <button onClick={enterFullscreen}>Full Screen</button>
            <iframe src={src} style={{ width: "100%", height: "85vh", border: "0" }} allowFullScreen />
        </>
    );
}
