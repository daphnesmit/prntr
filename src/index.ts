import { prntr } from './init';

if (typeof window !== 'undefined') {
  window.prntr = prntr;
}

export default prntr;
