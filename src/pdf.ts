import { print } from './print';
import { PdfConfig } from './types';
import Browser from './utils/browser';
import { cleanUp, cleanupFast } from './utils/cleanUp';

export type ExtendedPdfConfig = PdfConfig & {
  frameId: string;
}

function pdf(config: ExtendedPdfConfig, printFrame: HTMLIFrameElement): void {
  const { base64, printable } = config;

  // Check if we have base64 data
  if (base64) {
    const bytesArray = Uint8Array.from(window.atob(printable as string), c => c.charCodeAt(0));
    createBlobAndPrint(config, printFrame, bytesArray);
    return;
  }

  // Get the file through a http request (Preload)
  createPdfRequest(config, printFrame);
}

function getWindowOpenOptions() {
  return 'toolbar=yes,scrollbars=yes,menubar=no,location=no,resizable=yes';
}
function createPdfRequest(config: ExtendedPdfConfig, printFrame: HTMLIFrameElement) {
  const { printable, onError } = config;

  // Format pdf url
  const pdfUrl = getPdfUrl(printable);

  // When browsers don't support printing, open the fallback url in a new window
  // Iphone, Ipad and desktop Safari
  if (Browser.isSafari) {
    cleanupFast(config);
    window.open(pdfUrl, '_blank', getWindowOpenOptions());
    return;
  }

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

function getPdfUrl(printable: ExtendedPdfConfig['printable']): string {
  return /^(blob|http|\/\/)/i.test(printable as string)
    ? printable
    : window.location.origin + ((printable as string).charAt(0) !== '/' ? '/' + printable : printable);
}

// TODO: implement for chrome mobile
// function openBlobWithFileReader(data: Uint8Array) {
//   const reader = new FileReader();
//   const out = new Blob([data], { type: 'application/pdf' });
//   reader.onload = function() {
//     console.log('reader.result', reader.result);
//     window.location.href = reader.result as string;
//   };
//   reader.readAsDataURL(out);
// }

function createBlobAndPrint(
  config: ExtendedPdfConfig,
  printFrame: HTMLIFrameElement,
  data: Uint8Array,
) {
  // Pass response or base64 data to a blob and create a local object url
  const localPdfBlb = new window.Blob([data], { type: 'application/pdf' });
  const localPdf = window.URL.createObjectURL(localPdfBlb);

  // When browsers don't support printing ther base64 pdf, open the fallback url in a new window
  // Iphone and desktop Safari
  if ((Browser.isSafari && !Browser.isIpad)) {
    cleanupFast(config);
    window.location.href = localPdf;
    return;
  }

  // Set iframe src with pdf document url
  printFrame.setAttribute('src', localPdf);

  print(config, printFrame, undefined);
}

export { pdf };
