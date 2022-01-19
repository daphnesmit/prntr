import print from './lib/init';

const prntr = print.init;

if (typeof window !== 'undefined') {
  window.prntr = prntr;
}

export default prntr;
