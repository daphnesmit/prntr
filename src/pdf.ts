import { print } from './print';
import { IPdfConfig } from './types';
import { cleanUp } from './utils/cleanUp';

export type ExtendedIPdfConfig = IPdfConfig & {
  frameId: string;
}

function pdf(config: ExtendedIPdfConfig, printFrame: HTMLIFrameElement): void {
  const { base64: hasBase64, printable } = config;

  // Check if we have base64 data
  if (hasBase64) {
    const bytesArray = Uint8Array.from(window.atob(printable as string), (c) => c.charCodeAt(0));
    createBlobAndPrint(config, printFrame, bytesArray);
    return;
  }

  // Get the file through a http request (Preload)
  createPdfRequest(config, printFrame);
}

function createPdfRequest(config: ExtendedIPdfConfig, printFrame: HTMLIFrameElement) {
  const { printable, onError } = config;

  // Format pdf url
  const pdfUrl = getPdfUrl(printable);

  // Request pdf url
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

function getPdfUrl(printable: ExtendedIPdfConfig['printable']): string {
  return /^(blob|http|\/\/)/i.test(printable as string)
    ? printable
    : window.location.origin + (!(printable as string).startsWith('/') ? '/' + printable : printable);
}

function createBlobAndPrint(
  config: ExtendedIPdfConfig,
  printFrame: HTMLIFrameElement,
  data: Uint8Array,
) {
  // Pass response or base64 data to a blob and create a local object url
  const localPdfBlb = new window.Blob([data], { type: 'application/pdf' });
  const localPdf = window.URL.createObjectURL(localPdfBlb);

  // Set iframe src with pdf document url
  printFrame.setAttribute('src', localPdf);

  print(config, printFrame, undefined);
}

export { pdf };
