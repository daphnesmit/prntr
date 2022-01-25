import { print } from './print';
import { ImageConfig } from './types';
import { addHeader } from './utils/addHeader';
import Browser from './utils/browser';

type ExtendedImageConfig = ImageConfig & {
  frameId: string;
}
function image (config: ExtendedImageConfig, printFrame: HTMLIFrameElement) {
  const { printable, header, headerStyle } = config;

  // Check if we are printing one image or multiple images
  // Create array with one image
  const images = Array.isArray(printable) ? printable : [printable];

  // Create printable element (container)
  const printableElement = document.createElement('div');

  // Create all image elements and append them to the printable container
  appendImages(images, printableElement);

  // Check if we are adding a print header
  if (header) {
    addHeader(printableElement, header, headerStyle);
  }

  // Print image
  print(config, printFrame, printableElement);
}

function appendImages (images: string[], printableElement: HTMLDivElement) {
  images.forEach(src => {
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
}
export { image };
