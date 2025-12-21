// a React component that uses an iframe
export default function TopolaViewer() {
    const gedcomUrl = "https://ursin-family.vercel.app/api"; // your API endpoint
    const src = `https://pewu.github.io/topola-viewer/#/view?url=${encodeURIComponent(gedcomUrl)}&embedded=true`;
    return <iframe src={src} style={{ width: "100%", height: "90vh", border: "0" }} allowFullScreen />;
}
