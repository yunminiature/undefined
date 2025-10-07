// Расширение типов Express для res.locals
declare namespace Express {
  interface Response {
    locals: {
      nonce?: string;
    };
  }
}
