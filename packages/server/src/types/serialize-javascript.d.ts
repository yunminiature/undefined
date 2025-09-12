declare module 'serialize-javascript' {
  function serialize(input: any, options?: { isJSON?: boolean }): string;
  export default serialize;
} 