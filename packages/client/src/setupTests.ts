/* eslint-disable @typescript-eslint/no-empty-function */
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom'; // если ещё не подключён
import 'whatwg-fetch'; // fetch на базе WHATWG

// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

if (!window.matchMedia) {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  window.matchMedia = function matchMedia(query: string): MediaQueryList {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {}, // deprecated
      removeListener: () => {}, // deprecated
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList;
  };
}
