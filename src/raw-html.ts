import { print } from './print';
import { Params } from './types';

type RawHtml = (params: Params, printFrame: HTMLIFrameElement) => void
const rawHtml: RawHtml = (params, printFrame) => {
  // Create printable element (container)
  const printableElement = document.createElement('div');
  printableElement.setAttribute('style', 'width:100%');

  // Set our raw html as the printable element inner html content
  printableElement.innerHTML = params.printable as string;

  // Print html contents
  print(params, printFrame, printableElement);
};

export { rawHtml };
