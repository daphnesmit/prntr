import Bowser from 'bowser';

const browser = typeof window !== 'undefined' && Bowser.getParser(window.navigator.userAgent);
const browserName = browser && browser.getBrowserName();
const platform = browser && browser.getPlatformType();
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
  /* ipad */
  isIpad: typeof window !== 'undefined' && navigator.maxTouchPoints &&
  navigator.maxTouchPoints > 2 &&
  /MacIntel/.test(navigator.platform),
  /* iphone */
  isIphone: typeof window !== 'undefined' && browserName === 'Safari' && platform === 'mobile',
};

export default Browser;
