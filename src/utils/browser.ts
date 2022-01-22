const Browser = {
  // Firefox 1.0+
  isFirefox: () => {
    // @ts-ignore
    return typeof InstallTrigger !== 'undefined';
  },
  // Internet Explorer 6-11
  isIE: () => {
    // @ts-ignore
    return typeof window !== 'undefined' && !!window.MSInputMethodContext && !!document.documentMode;
  },
  // Edge 20+
  isEdge: () => {
    // @ts-ignore
    return !Browser.isIE() && !!window.StyleMedia;
  },
  // Chrome 1+
  isChrome: (context = window) => {
    // @ts-ignore
    return !!context.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
  },
  // At least Safari 3+: "[object HTMLElementConstructor]"
  isSafari: () => {
    return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ||
        navigator.userAgent.toLowerCase().indexOf('safari') !== -1;
  },
  // IOS Chrome
  isIOSChrome: () => {
    return navigator.userAgent.toLowerCase().indexOf('crios') !== -1;
  },
};

export default Browser;
