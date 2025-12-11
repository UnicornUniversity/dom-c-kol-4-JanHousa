// randomInRange returns a random floating-point number in the range [min, max).
export function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

// Returns a random element from the given array.
export function randomChoice(array) {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}