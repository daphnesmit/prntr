import { print } from './print';
import { IHtmlConfig } from './types';
import { addHeader } from './utils/addHeader';

export type ExtendedHtmlConfig = IHtmlConfig & {
  frameId: string;
}
function html(config: ExtendedHtmlConfig, printFrame: HTMLIFrameElement) {
  const { printable, header, headerStyle } = config;

  // Get the DOM printable element
  const printElement = document.getElementById(printable as string);

  // Check if the element exists
  if (!printElement) {
    window.console.error('Invalid HTML element id: ' + printable);
    return;
  }

  // Clone the target element including its children (if available)
  const clonedPrintable = cloneElement(printElement, config);

  // Add header
  if (header) {
    addHeader(clonedPrintable, header, headerStyle);
  }

  // Print html element contents
  print(config, printFrame, clonedPrintable);
}

export function collectStyles(element: HTMLElement, config: ExtendedHtmlConfig) {
  const { targetStyle, targetStyles } = config;
  const win = document.defaultView || window;

  // String variable to hold styling for each element
  let elementStyle = '';

  // Loop over computed styles
  const styles = win.getComputedStyle(element, '');

  for (let key = 0; key < styles.length; key++) {
    // Check if style should be processed
    if (
      targetStyles?.includes('*') ||
      targetStyle?.includes(styles[key]) ||
      targetStylesMatch(targetStyles || [], styles[key])
    ) {
      if (styles.getPropertyValue(styles[key])) {
        elementStyle += `${styles[key]}:${styles.getPropertyValue(styles[key])};`;
      }
    }
  }

  return elementStyle;
}

function targetStylesMatch(
  styles: NonNullable<ExtendedHtmlConfig['targetStyles']>,
  value: string | string[],
): boolean {
  for (let i = 0; i < styles.length; i++) {
    if (typeof value === 'object' && value.includes(styles[i])) return true;
  }
  return false;
}

function cloneElement(element: HTMLElement, config: ExtendedHtmlConfig): HTMLElement {
  const { ignoreElements = [], scanStyles: shouldScanStyles } = config;

  // Clone the main node (if not already inside the recursion process)
  const clone = element.cloneNode();

  // Loop over and process the children elements / nodes (including text nodes)
  const childNodesArray = Array.prototype.slice.call(element.childNodes);
  for (let i = 0; i < childNodesArray.length; i++) {
    // Check if we are skipping the current element
    if (ignoreElements.includes(childNodesArray[i].id)) {
      continue;
    }

    // Clone the child element
    const clonedChild = cloneElement(childNodesArray[i], config);

    // Attach the cloned child to the cloned parent node
    clone.appendChild(clonedChild);
  }
  // Get all styling for print element (for nodes of type element only)
  if (shouldScanStyles && element.nodeType === 1) {
    (clone as HTMLElement).setAttribute('style', collectStyles(element, config));
  }

  // Check if the element needs any state processing (copy user input data)
  switch (element.tagName) {
    case 'SELECT':
      // Copy the current selection value to its clone
      (clone as HTMLSelectElement).value = (element as HTMLSelectElement).value;
      break;
    case 'CANVAS':
      // Copy the canvas content to its clone
      (clone as HTMLCanvasElement).getContext('2d')?.drawImage(element as HTMLCanvasElement, 0, 0);
      break;
  }

  return clone as HTMLElement;
}

export { html };
