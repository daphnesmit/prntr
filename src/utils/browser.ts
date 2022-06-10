import Bowser from 'bowser';

const browser = typeof window !== 'undefined' ? Bowser.getParser(window.navigator.userAgent) : undefined;
const browserName = browser?.getBrowserName();
const platform = browser?.getPlatformType();
const engine = browser?.getEngine().name;

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
  navigator.platform.includes('MacIntel'),
  /* iphone */
  isIphone: browserName === 'Safari' && platform === 'mobile',
  /* Chrome mobile */
  isChromeMobile: browserName === 'Chrome' && platform === 'mobile',
  /* Chrome on iOs */
  isIosChrome: browserName === 'Chrome' && typeof window !== 'undefined' && navigator.userAgent.includes('CriOS'),
};

export default Browser;
