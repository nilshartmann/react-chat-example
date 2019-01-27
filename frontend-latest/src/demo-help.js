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

function shouldDelayForImg() {
  const urlParams = new URLSearchParams(window.location.search);
  const delay = urlParams.get("delayimg");

  return delay !== null;
}

export const demo_delayRandomImgLoad = cb =>
  shouldDelayForImg() ? new Promise(resolve => setTimeout(() => resolve(cb()), (Math.floor(Math.random() * 4) + 2) * 500)) : cb();

export const demo_delayInvocation = (cb, timeoutInMs = 1500) =>
  shouldDelayForDemo() ? new Promise(resolve => setTimeout(() => resolve(cb()), timeoutInMs)) : cb();

// export const demo_delayFetch = (cb, timeoutInMs = 1500) =>
//   shouldDelayForFetch() ? new Promise(resolve => setTimeout(() => resolve(cb()), timeoutInMs)) : cb();

export const demo_delayFetch = (cb, timeoutInMs = 125) =>
  shouldDelayForFetch()
    ? new Promise(resolve => setTimeout(() => resolve(cb()), (Math.floor(Math.random() * 4) + 2) * timeoutInMs))
    : cb();
