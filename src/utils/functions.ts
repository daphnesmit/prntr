import { Config, Params } from '../types';
import Browser from './browser';

export function capitalizePrint(obj: string) {
  return obj.charAt(0).toUpperCase() + obj.slice(1);
}

export function collectStyles(element: HTMLElement, params: Params) {
  const win = document.defaultView || window;

  // String variable to hold styling for each element
  let elementStyle = '';

  // Loop over computed styles
  const styles = win.getComputedStyle(element, '');

  for (let key = 0; key < styles.length; key++) {
    // Check if style should be processed
    if (
      params.targetStyles?.indexOf('*') !== -1 ||
      params.targetStyle?.indexOf(styles[key]) !== -1 ||
      targetStylesMatch(params.targetStyles, styles[key])
    ) {
      if (styles.getPropertyValue(styles[key])) {
        elementStyle += styles[key] + ':' + styles.getPropertyValue(styles[key]) + ';';
      }
    }
  }

  // Print friendly defaults (deprecated)
  elementStyle += 'max-width: ' + params.maxWidth + 'px !important; font-size: ' + params.font_size + ' !important;';

  return elementStyle;
}

function targetStylesMatch(styles: NonNullable<Params['targetStyles']>, value: string | string[]) {
  for (let i = 0; i < styles.length; i++) {
    if (typeof value === 'object' && value.indexOf(styles[i]) !== -1) return true;
  }
  return false;
}

export function addHeader(printElement: any, params: Config) {
  // Create the header container div
  const headerContainer = document.createElement('div');

  if (!params.header) {
    return printElement.insertBefore(headerContainer, printElement.childNodes[0]);
  }

  // Check if the header is text or raw html
  if (isRawHTML(params.header)) {
    headerContainer.innerHTML = params.header;
  } else {
    // Create header element
    const headerElement = document.createElement('h1');

    // Create header text node
    const headerNode = document.createTextNode(params.header);

    // Build and style
    headerElement.appendChild(headerNode);
    if (params.headerStyle) headerElement.setAttribute('style', params.headerStyle);
    headerContainer.appendChild(headerElement);
  }

  printElement.insertBefore(headerContainer, printElement.childNodes[0]);
}

export function cleanUp(params: Params) {
  // Check for a finished loading hook function
  params.onLoadingEnd?.();

  // If preloading pdf files, clean blob url
  if (params.onLoadingStart) window.URL.revokeObjectURL(params.printable);

  // Run onPrintDialogClose callback
  let event = 'mouseover';

  if (Browser.isChrome() || Browser.isFirefox()) {
    // Ps.: Firefox will require an extra click in the document to fire the focus event.
    event = 'focus';
  }

  const handler = () => {
    // Make sure the event only happens once.
    window.removeEventListener(event, handler);

    params.onPrintDialogClose?.();

    // Remove iframe from the DOM
    const iframe = document.getElementById(params.frameId);
    iframe?.remove();
  };

  window.addEventListener(event, handler);
}

export function isRawHTML(raw: string) {
  // eslint-disable-next-line prefer-regex-literals
  const regexHtml = new RegExp('<([A-Za-z][A-Za-z0-9]*)\\b[^>]*>(.*?)</\\1>');
  return regexHtml.test(raw);
}
