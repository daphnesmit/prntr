export function addHeader(printElement: HTMLElement, header: string, headerStyle?: string) {
  // Create the header container div
  const headerContainer = document.createElement('div');

  if (!header) {
    return printElement.insertBefore(headerContainer, printElement.childNodes[0]);
  }

  // Check if the header is text or raw html
  if (isRawHTML(header)) {
    headerContainer.innerHTML = header;
  } else {
    // Create header element
    const headerElement = document.createElement('h1');

    // Create header text node
    const headerNode = document.createTextNode(header);

    // Build and style
    headerElement.appendChild(headerNode);
    if (headerStyle) headerElement.setAttribute('style', headerStyle);
    headerContainer.appendChild(headerElement);
  }

  printElement.insertBefore(headerContainer, printElement.childNodes[0]);
}

function isRawHTML(raw: string) {
  // eslint-disable-next-line prefer-regex-literals
  const regexHtml = new RegExp('<([A-Za-z][A-Za-z0-9]*)\\b[^>]*>(.*?)</\\1>');
  return regexHtml.test(raw);
}
