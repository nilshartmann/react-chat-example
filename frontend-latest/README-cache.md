`react-cache` still very unstable and alpha, does not work with React 16.8, so it must be built from sources, as outlined here:

https://github.com/facebook/react/issues/14780#issuecomment-477644546

git clone git@github.com:facebook/react.git --depth=1 && cd react && yarn install --frozen-lockfile && npm run build react-cache && cd .. && npm i \$(npm pack ./react/build/node_modules/react-cache) && rm -rf react react-cache-\*.tgz

A copy of the built module is in folder `.react-cache-from-source`. It can be copied to `node_modules/react-cache` if building from sources does not work.
