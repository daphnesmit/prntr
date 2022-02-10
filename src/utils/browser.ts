import Bowser from 'bowser';

const browser = Bowser.getParser(window.navigator.userAgent);
const browserName = browser.getBrowserName();
const Browser = {
  /* Firefox */
  isFirefox: browserName === 'Firefox',
  /* Internet Explorer */
  isIE: browserName === 'Internet Explorer',
  /* Edge */
  isEdge: browserName === 'Microsoft Edge',
  /* Chrome */
  isChrome: browserName === 'Chrome',
  /* Safari */
  isSafari: browserName === 'Safari',
};

export default Browser;
