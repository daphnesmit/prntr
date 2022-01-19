import Prntr, { PrntrArguments } from './Prntr'

function prntr(...args: PrntrArguments) {
  return new Prntr(...args)
}
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.prntr = prntr;
}

export default Prntr