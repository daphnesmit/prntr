import { print } from './print';
import { IRawHtmlConfig } from './types';

export type ExtendedRawHtmlConfig = IRawHtmlConfig & {
  frameId: string;
}
function rawHtml (config: ExtendedRawHtmlConfig, printFrame: HTMLIFrameElement) {
  const { printable } = config;

  // Create printable element (container)
  const printableElement = document.createElement('div');
  printableElement.setAttribute('style', 'width:100%');

  // Set our raw html as the printable element inner html content
  printableElement.innerHTML = printable as string;

  // Print html contents
  print(config, printFrame, printableElement);
}

export { rawHtml };
