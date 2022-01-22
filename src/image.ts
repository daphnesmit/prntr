import { print } from './print';
import { Params } from './types';
import Browser from './utils/browser';
import { addHeader } from './utils/functions';

type Image = (params: Params, printFrame: HTMLIFrameElement) => void
const image: Image = (params, printFrame) => {
  // Check if we are printing one image or multiple images
  if (!Array.isArray(params.printable)) {
    // Create array with one image
    params.printable = [params.printable];
  }

  // Create printable element (container)
  const printableElement = document.createElement('div');

  // Create all image elements and append them to the printable container
  params.printable.forEach(src => {
    // Create the image element
    const img = document.createElement('img');

    // Set image src with the file url
    img.src = src;

    // The following block is for Firefox, which for some reason requires the image's src to be fully qualified in
    // order to print it
    if (Browser.isFirefox()) {
      const fullyQualifiedSrc = img.src;
      img.src = fullyQualifiedSrc;
    }

    // Create the image wrapper
    const imageWrapper = document.createElement('div');

    // Append image to the wrapper element
    imageWrapper.appendChild(img);

    // Append wrapper to the printable element
    printableElement.appendChild(imageWrapper);
  });

  // Check if we are adding a print header
  if (params.header) addHeader(printableElement, params);

  // Print image
  print(params, printFrame, printableElement);
};

export { image };
