export const delayInvocation = cb => new Promise(resolve => setTimeout(() => resolve(cb()), 3000));

export function shouldDelayForDemo() {
  const urlParams = new URLSearchParams(window.location.search);
  const delay = urlParams.get("delay");
  return delay !== null;
}
