import { ExtendedConfig } from '../types';
import Browser from './browser';

function removeIframe(frameId: string, delay = 300) {
  const iframe = document.getElementById(frameId);
  setTimeout(() => iframe?.remove(), delay);
}

export function cleanupFast(config: ExtendedConfig) {
  const { onLoadingStart, onLoadingEnd, printable, frameId, iframeRemovalDelay } = config;

  // Check for a finished loading hook function
  onLoadingEnd?.();

  // If preloading pdf files, clean blob url
  if (onLoadingStart && typeof printable === 'string') window.URL.revokeObjectURL(printable);

  // Remove Iframe
  removeIframe(frameId, iframeRemovalDelay);
}

export function cleanUp(config: ExtendedConfig) {
  const { onLoadingEnd, onLoadingStart, onPrintDialogClose, frameId, printable, iframeRemovalDelay } = config;

  // Check for a finished loading hook function
  onLoadingEnd?.();

  // If preloading pdf files, clean blob url
  if (onLoadingStart && typeof printable === 'string') window.URL.revokeObjectURL(printable);

  let event = 'mouseover';

  if (Browser.isChrome || (Browser.isEdge && !Browser.isEdgeHTML) || Browser.isFirefox) {
    // Ps.: Firefox will require an extra click in the document to fire the focus event.
    event = 'focus';
  }

  const handler = () => {
    // Make sure the event only happens once.
    window.removeEventListener(event, handler);

    // Run onPrintDialogClose callback
    onPrintDialogClose?.();

    // Remove iframe from the DOM
    removeIframe(frameId, iframeRemovalDelay);
  };

  window.addEventListener(event, handler);
}
