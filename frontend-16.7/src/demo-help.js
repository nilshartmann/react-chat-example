function shouldDelayForDemo() {
  const urlParams = new URLSearchParams(window.location.search);
  const delay = urlParams.get("delay");
  return delay !== null;
}

function shouldDelayForFetch() {
  const urlParams = new URLSearchParams(window.location.search);
  const delay = urlParams.get("delayfetch");
  return delay !== null;
}

export const demo_delayInvocationRandom = cb => demo_delayInvocation(cb, (Math.floor(Math.random() * 3) + 1) * 1000);

export const demo_delayInvocation = (cb, timeoutInMs = 1500) =>
  shouldDelayForDemo() ? new Promise(resolve => setTimeout(() => resolve(cb()), timeoutInMs)) : cb();

export const demo_delayFetch = (cb, timeoutInMs = 1500) =>
  shouldDelayForFetch() ? new Promise(resolve => setTimeout(() => resolve(cb()), timeoutInMs)) : cb();
