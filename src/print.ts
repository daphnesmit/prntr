import { Params } from './types';
import Browser from './utils/browser';
import { cleanUp } from './utils/functions';

function performPrint(iframeElement: HTMLIFrameElement, params: Params) {
  try {
    iframeElement.focus();

    // If Edge or IE, try catch with execCommand
    if (Browser.isEdge() || Browser.isIE()) {
      try {
        iframeElement.contentWindow?.document.execCommand('print', false);
      } catch (e) {
        iframeElement.contentWindow?.print();
      }
    } else {
      // Other browsers
      iframeElement.contentWindow?.print();
    }
  } catch (error: any) {
    params.onError?.(error);
  } finally {
    if (Browser.isFirefox()) {
      // Move the iframe element off-screen and make it invisible
      iframeElement.style.visibility = 'hidden';
      iframeElement.style.left = '-1px';
    }

    cleanUp(params);
  }
}

function loadIframeImages(images: HTMLImageElement[]) {
  const promises = images.map(image => {
    if (!image.src || image.src === window.location.href) return undefined;
    return loadIframeImage(image);
  });

  return Promise.all(promises);
}

function loadIframeImage(image: HTMLImageElement) {
  return new Promise(resolve => {
    const pollImage = () => {
      !image || typeof image.naturalWidth === 'undefined' || image.naturalWidth === 0 || !image.complete
        ? setTimeout(pollImage, 500)
        : resolve(image);
    };
    pollImage();
  });
}

const print = (params: Params, printFrame: HTMLIFrameElement, printableElement?: HTMLElement) => {
  const { type, frameId, style } = params;

  // Append iframe element to document body
  document.getElementsByTagName('body')[0].appendChild(printFrame);

  // Get iframe element
  const iframeElement = document.getElementById(frameId) as HTMLIFrameElement | null;

  if (!iframeElement) return;

  // Wait for iframe to load all content
  iframeElement.onload = () => {
    if (type === 'pdf') {
      // Add a delay for Firefox. In my tests, 1000ms was sufficient but 100ms was not
      if (Browser.isFirefox()) {
        setTimeout(() => performPrint(iframeElement, params), 1000);
      } else {
        performPrint(iframeElement, params);
      }
      return;
    }

    // Get iframe element document
    const printDocumentWindow = (iframeElement.contentWindow || iframeElement.contentDocument);
    const printDocument = printDocumentWindow && 'document' in printDocumentWindow
      ? printDocumentWindow?.document
      : null;

    if (!printDocument) return;

    // Append printable element to the iframe body
    if (printableElement) printDocument.body.appendChild(printableElement);

    // Add custom style
    if (style) {
      // Create style element
      const styleEl = document.createElement('style');
      styleEl.innerHTML = style;

      // Append style element to iframe's head
      printDocument.head.appendChild(styleEl);
    }

    // If printing images, wait for them to load inside the iframe
    const images = printDocument.getElementsByTagName('img');

    if (images.length > 0) {
      loadIframeImages(Array.from(images)).then(() => performPrint(iframeElement, params));
    } else {
      performPrint(iframeElement, params);
    }
  };
};

export { print };