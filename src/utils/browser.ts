import Bowser from 'bowser';

const browser = typeof window !== 'undefined' && Bowser.getParser(window.navigator.userAgent);
const browserName = browser && browser.getBrowserName();
const engine = browser && browser.getEngine().name;

const Browser = {
  /* Firefox */
  isFirefox: browserName === 'Firefox',
  /* Internet Explorer */
  isIE: browserName === 'Internet Explorer',
  /* Edge */
  isEdge: browserName === 'Microsoft Edge',
  /* Edge HTML Engine detection */
  isEdgeHTML: browserName === 'Microsoft Edge' && engine === 'EdgeHTML',
  /* Chrome */
  isChrome: browserName === 'Chrome',
  /* Safari */
  isSafari: browserName === 'Safari',
};

export default Browser;
