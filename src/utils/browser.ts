import Bowser from 'bowser';

const browser = Bowser.getParser(window.navigator.userAgent);
const browserName = browser.getBrowserName();
const Browser = {
  /* Firefox */
  isFirefox: () => {
    return browserName === 'Firefox';
  },
  /* Internet Explorer */
  isIE: () => {
    return browserName === 'Internet Explorer';
  },
  /* Edge */
  isEdge: () => {
    return browserName === 'Microsoft Edge';
  },
  /* Chrome */
  isChrome: () => {
    return browserName === 'Chrome';
  },
  /* Safari */
  isSafari: () => {
    return browserName === 'Safari';
  },
};

export default Browser;
