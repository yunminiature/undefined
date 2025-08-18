/* eslint-disable @typescript-eslint/no-empty-function */
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Polyfills
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

if (!window.matchMedia) {
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

Object.defineProperty(HTMLCanvasElement.prototype, 'getBoundingClientRect', {
  configurable: true,
  value() {
    return {
      width: 200,
      height: 200,
      top: 0,
      left: 0,
      bottom: 200,
      right: 200,
      x: 0,
      y: 0,
      toJSON() {},
    } as DOMRect;
  },
});

Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });

declare global {
  interface CanvasRenderingContext2D {
    roundRect(
      x: number,
      y: number,
      w: number,
      h: number,
      r?: number | number[] | DOMPointInit | Iterable<number | DOMPointInit>
    ): void;
  }
}

if (!('roundRect' in CanvasRenderingContext2D.prototype)) {
  Object.defineProperty(CanvasRenderingContext2D.prototype, 'roundRect', {
    value: function (this: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
      (this as any).rect?.(x, y, w, h);
    },
    configurable: true,
    writable: true,
  });
}

console.log('setupFiles loaded');
