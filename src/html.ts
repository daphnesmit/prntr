import { print } from './print';
import { Params } from './types';
import { addHeader, collectStyles } from './utils/functions';

function cloneElement (element: HTMLElement, params: Params) {
  // Clone the main node (if not already inside the recursion process)
  const clone = element.cloneNode();

  // Loop over and process the children elements / nodes (including text nodes)
  const childNodesArray = Array.prototype.slice.call(element.childNodes);
  for (let i = 0; i < childNodesArray.length; i++) {
    // Check if we are skipping the current element
    if (params.ignoreElements?.indexOf(childNodesArray[i].id) !== -1) {
      continue;
    }

    // Clone the child element
    const clonedChild = cloneElement(childNodesArray[i], params);

    // Attach the cloned child to the cloned parent node
    clone.appendChild(clonedChild);
  }

  // Get all styling for print element (for nodes of type element only)
  if (params.scanStyles && element.nodeType === 1) {
    (clone as HTMLElement).setAttribute('style', collectStyles(element, params));
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

function isHtmlStr(printable: Params['printable']): boolean {
  return /<[a-z][\s\S]*>/i.test(printable);
}

function createElementFromHTML(printable: Params['printable']) {
  const div = document.createElement('div');
  div.innerHTML = printable.trim();
  return div.firstChild as HTMLElement;
}

type Html = (params: Params, printFrame: HTMLIFrameElement) => void
const html: Html = (params, printFrame) => {
  // Get the DOM printable element
  const printElement = isHtmlStr(params.printable)
    ? createElementFromHTML(params.printable)
    : document.getElementById(params.printable);

  // Check if the element exists
  if (!printElement) {
    window.console.error('Invalid HTML element id: ' + params.printable);
    return;
  }

  // Clone the target element including its children (if available)
  const clonedPrintable = cloneElement(printElement, params);

  // Add header
  if (params.header) {
    addHeader(clonedPrintable, params);
  }

  // Print html element contents
  print(params, printFrame, clonedPrintable);
};

export { html };
