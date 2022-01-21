import { print } from './print';
import { Params } from './types';
import { cleanUp } from './utils/functions';

const createBlobAndPrint = (params: Params, printFrame: HTMLIFrameElement, data: Uint8Array) => {
  // Pass response or base64 data to a blob and create a local object url
  const localPdfBlb = new window.Blob([data], { type: 'application/pdf' });
  const localPdf = window.URL.createObjectURL(localPdfBlb);

  // Set iframe src with pdf document url
  printFrame.setAttribute('src', localPdf);

  print(params, printFrame);
};

type Pdf = (params: Params, printFrame: HTMLIFrameElement) => void
const pdf: Pdf = (params, printFrame) => {
  const { base64, printable, onError } = params;

  // Check if we have base64 data
  if (base64) {
    const bytesArray = Uint8Array.from(window.atob(printable), c => c.charCodeAt(0));
    createBlobAndPrint(params, printFrame, bytesArray);
    return;
  }

  // Format pdf url
  const formattedPrintable = /^(blob|http|\/\/)/i.test(printable)
    ? printable
    : window.location.origin + (printable.charAt(0) !== '/' ? '/' + printable : printable);

  // Get the file through a http request (Preload)
  const req = new window.XMLHttpRequest();
  req.responseType = 'arraybuffer';

  req.addEventListener('error', () => {
    cleanUp({ ...params, printable: formattedPrintable });
    onError?.(req.statusText, req);

    // Since we don't have a pdf document available, we will stop the print job
  });

  req.addEventListener('load', () => {
    console.log(req.status);
    // Check for errors
    if ([200, 201].indexOf(req.status) === -1) {
      cleanUp(params);
      onError?.(req.statusText, req);

      // Since we don't have a pdf document available, we will stop the print job
      return;
    }

    // Print requested document
    createBlobAndPrint(params, printFrame, req.response);
  });

  req.open('GET', printable, true);
  req.send();
};

export { pdf };
