import { Config } from '../types';

declare global {
  interface Window {
    prntr: (config: Config) => void;
  }
}
