/* eslint-disable max-len */
import { html } from './html';
import { image } from './image';
import { json } from './json';
import { ExtendedIPdfConfig, pdf } from './pdf';
import { rawHtml } from './raw-html';
import { Config, ExtendedConfig, IBaseConfig, IHtmlConfig, IJsonConfig, IPdfConfig } from './types';
import Browser from './utils/browser';

const printTypes = ['pdf', 'html', 'image', 'json', 'raw-html'];

// Define default configs
const baseConfig: IBaseConfig = {
  type: 'pdf',
  documentTitle: 'Document',
  frameId: 'prntr',
  onError: (error: string) => { throw new Error(error); },
};
const baseIPdfConfig: Partial<IPdfConfig> = {
  base64: false,
};
const baseIHtmlConfig: Partial<IHtmlConfig> = {
  targetStyle: ['clear', 'display', 'width', 'min-width', 'height', 'min-height', 'max-height'],
  targetStyles: ['border', 'box', 'break', 'text-decoration'],
  ignoreElements: [],
  scanStyles: true,
};
const baseJsonConfig: Partial<IJsonConfig> = {
  gridHeaderStyle: 'font-weight: bold; padding: 5px; border: 1px solid #dddddd;',
  gridStyle: 'border: 1px solid lightgray; margin-bottom: -1px;',
  repeatTableHeader: true,
};

// Main initializer
function prntr(config: Config) {
  const printConfig = {
    ...baseConfig,
    ...config,
  };

  // Process parameters
  validateConfig(printConfig);

  // Start
  start(printConfig);
}

function validateConfig({ type, printable }: ExtendedConfig) {
  // Validate printable
  if (!printable) {
    throw new Error('Missing printable information.');
  }

  // Validate type
  if (typeof type !== 'string' || !printTypes.includes(type.toLowerCase())) {
    throw new Error('Invalid print type. Available types are: pdf, html, raw-html, image and json.');
  }
}

function start(config: ExtendedConfig) {
  const { onLoadingStart, frameId } = config;

  // Check for a print start hook function
  onLoadingStart?.();

  // To prevent duplication and issues, remove any used printFrame from the DOM
  clearPrintFrames(frameId);

  // Create a new iframe for the print job
  const printFrame = getPrintFrame(config);

  // Check printable type
  switch (config.type) {
    case 'pdf':
      startPdf({ ...baseIPdfConfig, ...config }, printFrame);
      break;
    case 'image':
      startOther(config, image(config, printFrame));
      break;
    case 'html':
      startOther(config, html({ ...baseIHtmlConfig, ...config }, printFrame));
      break;
    case 'raw-html':
      startOther(config, rawHtml(config, printFrame));
      break;
    case 'json':
      startOther(config, json({ ...baseJsonConfig, ...config }, printFrame));
      break;
  }
}

function getFallbackPrintable({ printable, fallbackPrintable, base64 }: IPdfConfig) {
  if (fallbackPrintable) {
    return base64 ? `data:application/pdf;base64,${fallbackPrintable}` : fallbackPrintable;
  }
  return base64 ? `data:application/pdf;base64,${printable}` : printable;
}

function printFallback(config: ExtendedIPdfConfig, hasHref?: boolean) {
  const fallbackPrintable = getFallbackPrintable(config);
  if (hasHref) {
    window.location.href = fallbackPrintable;
    return;
  }
  const win = window.open(fallbackPrintable, '_blank', 'toolbar=yes,scrollbars=yes,menubar=no,location=no,resizable=yes');
  win?.focus();
}

function startOther(config: ExtendedConfig, callback: any) {
  const { onLoadingEnd, onIncompatibleBrowser, onError, frameId } = config;

  // Check browser support for pdf and if not supported we will just open the pdf file instead
  if (Browser.isChromeMobile || Browser.isIosChrome) {
    try {
      console.info('Prntr doesn\'t support printing of Image elements in Chrome mobile');
      clearPrintFrames(frameId);
      onIncompatibleBrowser?.();
    } catch (error: any) {
      onError?.(error);
    } finally {
      onLoadingEnd?.();
    }
    return;
  }
  return callback;
}

function startPdf(config: ExtendedIPdfConfig, printFrame: HTMLIFrameElement) {
  const { onLoadingEnd, onIncompatibleBrowser, onError, frameId } = config;

  // Check browser support for pdf and if not supported we will just open the pdf file instead
  if (Browser.isIE || Browser.isSafari || Browser.isChromeMobile || Browser.isIosChrome) {
    try {
      if (Browser.isIE) console.info('Prntr doesn\'t support PDF printing in Internet Explorer');
      if (Browser.isChromeMobile || Browser.isIosChrome) console.info('Prntr doesn\'t support PDF printing in Chrome on Mobile');
      if (Browser.isSafari && !config.base64) console.info('Prntr doesn\'t support PDF printing in Safari');
      if (Browser.isSafari && !Browser.isIpad && config.base64) console.info('Prntr doesn\'t support PDF Base64 printing in Safari on Desktop or Iphone');

      const hasHref = !!Browser.isChromeMobile;
      printFallback(config, hasHref);
      clearPrintFrames(frameId);
      onIncompatibleBrowser?.();
    } catch (error: any) {
      onError?.(error);
    } finally {
      onLoadingEnd?.();
    }
    return;
  }
  pdf(config, printFrame);
}

function clearPrintFrames(frameId: string) {
  const usedFrame = document.getElementById(frameId);
  if (!usedFrame) return;
  usedFrame.parentNode?.removeChild(usedFrame);
}

function getPrintFrame({ type, documentTitle, css, frameId }: ExtendedConfig) {
  // Create a new iframe for the print job
  const printFrame = document.createElement('iframe');

  // Set iframe element id
  printFrame.setAttribute('id', frameId);

  if (Browser.isFirefox) {
    // Set the iframe to be is visible on the page (guaranteed by fixed position) but hidden using opacity 0, because
    // this works in Firefox. The height needs to be sufficient for some part of the document other than the PDF
    // viewer's toolbar to be visible in the page
    // eslint-disable-next-line max-len
    printFrame.setAttribute('style', 'width: 1px; height: 100px; position: fixed; left: 0; top: 0; opacity: 0; border-width: 0; margin: 0; padding: 0');
  } else {
    // Hide the iframe in other browsers
    printFrame.setAttribute('style', 'visibility: hidden; height: 0; width: 0; position: absolute; border: 0');
  }

  // For non pdf printing, pass an html document string to srcdoc (force onload callback)
  if (type !== 'pdf') {
    printFrame.srcdoc = `<html><head><title>${documentTitle}</title>`;

    // Attach css files
    if (css) {
      const styles = Array.isArray(css) ? css : [css];

      // Create link tags for each css file
      styles.forEach((file) => {
        printFrame.srcdoc += `<link rel="stylesheet" href="${file}">`;
      });
    }

    printFrame.srcdoc += '</head><body></body></html>';
  }

  return printFrame;
}
export { prntr };
