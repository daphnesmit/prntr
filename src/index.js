import print from './lib/init';

const printIt = print.init;

if (typeof window !== 'undefined') {
  window.printIt = printIt;
}

export default printIt;
