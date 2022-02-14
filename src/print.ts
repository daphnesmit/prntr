import { ExtendedConfig } from './types';
import Browser from './utils/browser';
import { cleanUp } from './utils/cleanUp';

function print(config: ExtendedConfig, printFrame: HTMLIFrameElement, printableElement?: HTMLElement) {
  const { type, frameId, style } = config;

  // Append iframe element to document body
  document.getElementsByTagName('body')[0].appendChild(printFrame);

  // Get iframe element
  const iframeElement = document.getElementById(frameId) as HTMLIFrameElement | null;

  if (!iframeElement) return;

  // Wait for iframe to load all content
  iframeElement.onload = () => {
    if (type === 'pdf') {
      // Add a delay for Firefox. In my tests, 1000ms was sufficient but 100ms was not
      if (Browser.isFirefox || Browser.isSafari) {
        setTimeout(() => performPrint(iframeElement, config), 1000);
      } else {
        performPrint(iframeElement, config);
      }
      return;
    }

    // Get iframe element document
    const printDocument = getPrintDocument(iframeElement);
    if (!printDocument) return;

    // Append printable element to the iframe body
    if (printableElement) printDocument.body.appendChild(printableElement);

    // Add custom style
    addStyle(style, printDocument);

    // If printing images, wait for them to load inside the iframe
    const images = printDocument.getElementsByTagName('img');

    if (images.length > 0) {
      loadIframeImages(Array.from(images)).then(() => performPrint(iframeElement, config));
    } else {
      performPrint(iframeElement, config);
    }
  };
}

function performPrint(iframeElement: HTMLIFrameElement, config: ExtendedConfig) {
  const { onError } = config;

  try {
    // Probably allowing to make this work in Firefox without needing to focus the window again
    iframeElement.focus();

    // If Edge or IE, try catch with execCommand
    if (Browser.isEdgeHTML || Browser.isIE) {
      try {
        iframeElement.contentWindow?.document.execCommand('print', true);
      } catch (e) {
        iframeElement.contentWindow?.print();
      }
    } else {
      // Other browsers
      iframeElement.contentWindow?.print();
    }
  } catch (error: any) {
    onError?.(error);
  } finally {
    if (Browser.isFirefox) {
      // Move the iframe element off-screen and make it invisible
      iframeElement.style.visibility = 'hidden';
      iframeElement.style.left = '-1px';
    }

    setTimeout(() => cleanUp(config), 100);
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

function addStyle(style: ExtendedConfig['style'], printDocument: Document) {
  if (!style) return;

  // Create style element
  const styleEl = document.createElement('style');
  styleEl.innerHTML = style;

  // Append style element to iframe's head
  printDocument.head.appendChild(styleEl);
}

function getPrintDocument(iframe: HTMLIFrameElement): Document | null {
  const printDocumentWindow = (iframe.contentWindow || iframe.contentDocument);
  const printDocument = printDocumentWindow && 'document' in printDocumentWindow
    ? printDocumentWindow?.document
    : null;
  return printDocument;
}

export { print };
