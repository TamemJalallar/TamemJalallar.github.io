export async function configurePdfJsWorker(pdfjsLib: any) {
    const workerSrc = (await import("pdfjs-dist/build/pdf.worker.min.mjs")).default;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
  }
  