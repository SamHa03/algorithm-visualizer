export function randomArray(size = 12) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
}
