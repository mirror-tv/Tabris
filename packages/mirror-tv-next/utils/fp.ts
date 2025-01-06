function pipe<A, B>(fn1: (arg: A) => B): (arg: A) => B
function pipe<A, B, C>(fn1: (arg: A) => B, fn2: (arg: B) => C): (arg: A) => C
function pipe<A, B, C, D>(
  fn1: (arg: A) => B,
  fn2: (arg: B) => C,
  fn3: (arg: C) => D
): (arg: A) => D

function pipe(...fns: Array<(arg: unknown) => unknown>) {
  return (input: unknown) => fns.reduce((acc, fn) => fn(acc), input)
}

export { pipe }
