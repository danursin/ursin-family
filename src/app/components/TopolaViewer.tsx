// a React component that uses an iframe
export default function TopolaViewer() {
    const gedcomUrl = "https://ursin-family.vercel.app/api/gedcom";
    const params = new URLSearchParams({
        url: gedcomUrl,
        embedded: "true"
    });
    const src = `https://pewu.github.io/topola-viewer/#/view?${params.toString()}`;
    return <iframe src={src} style={{ width: "100%", height: "85vh", border: "0" }} allowFullScreen />;
}
