// Stub module — used by Vite aliases to keep jsPDF's optional html()
// dependencies (html2canvas, dompurify) out of the bundle. We never
// call doc.html(), so the imports are dead code.
export default function noop() {}
export const html2canvas = noop;
