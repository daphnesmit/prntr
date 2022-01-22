import { print } from './print';
import { PdfConfig } from './types';
import { cleanUp } from './utils/cleanUp';

export type ExtendedPdfConfig = PdfConfig & {
  frameId: string;
}
function pdf(config: ExtendedPdfConfig, printFrame: HTMLIFrameElement): void {
  const { base64, printable, onError } = config;

  // Check if we have base64 data
  if (base64) {
    const bytesArray = Uint8Array.from(window.atob(printable as string), c => c.charCodeAt(0));
    createBlobAndPrint(config, printFrame, bytesArray);
    return;
  }

  // Format pdf url
  const pdfUrl = /^(blob|http|\/\/)/i.test(printable as string)
    ? printable
    : window.location.origin + ((printable as string).charAt(0) !== '/' ? '/' + printable : printable);

  // Get the file through a http request (Preload)
  const req = new window.XMLHttpRequest();
  req.responseType = 'arraybuffer';

  req.addEventListener('error', () => {
    cleanUp({ ...config, printable: pdfUrl });
    onError?.(req.statusText, req);
    // Since we don't have a pdf document available, we will stop the print job
  });

  req.addEventListener('load', () => {
    // Check for errors
    if (![200, 201].includes(req.status)) {
      cleanUp(config);
      onError?.(req.statusText, req);

      // Since we don't have a pdf document available, we will stop the print job
      return;
    }

    // Print requested document
    createBlobAndPrint(config, printFrame, req.response);
  });

  req.open('GET', printable as string, true);
  req.send();
}

function createBlobAndPrint(config: ExtendedPdfConfig, printFrame: HTMLIFrameElement, data: Uint8Array) {
  // Pass response or base64 data to a blob and create a local object url
  const localPdfBlb = new window.Blob([data], { type: 'application/pdf' });
  const localPdf = window.URL.createObjectURL(localPdfBlb);

  // Set iframe src with pdf document url
  printFrame.setAttribute('src', localPdf);

  print(config, printFrame);
}

export { pdf };
