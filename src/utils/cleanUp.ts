import { ExtendedConfig } from '../types';
import Browser from './browser';

export function cleanUp(config: ExtendedConfig) {
  const { onLoadingEnd, onLoadingStart, onPrintDialogClose, frameId, printable } = config;

  // Check for a finished loading hook function
  onLoadingEnd?.();

  // If preloading pdf files, clean blob url
  if (onLoadingStart && typeof printable === 'string') window.URL.revokeObjectURL(printable);

  // Run onPrintDialogClose callback
  let event = 'mouseover';

  if (Browser.isChrome || Browser.isFirefox) {
    // Ps.: Firefox will require an extra click in the document to fire the focus event.
    event = 'focus';
  }

  const handler = () => {
    // Make sure the event only happens once.
    window.removeEventListener(event, handler);

    onPrintDialogClose?.();

    // Remove iframe from the DOM
    const iframe = document.getElementById(frameId);
    iframe?.remove();
  };

  window.addEventListener(event, handler);
}
