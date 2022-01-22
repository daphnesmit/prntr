import { prntr } from './init';

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.prntr = prntr;
}

export default prntr;
