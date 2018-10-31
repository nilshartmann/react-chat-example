const counterMap: { [prefix: string]: number } = {};

export function genid(prefix = "e") {
  const oldCounter = counterMap[prefix];
  const newCounter = oldCounter ? oldCounter + 1 : 1;
  counterMap[prefix] = newCounter;
  return `${prefix}${newCounter}`;
}
