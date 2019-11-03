import React from "react";
// import { unstable_createResource } from "react-cache";

import { demo_delayRandomImgLoad } from "../demo-help";

export function Box({ children, active }) {
  return <div className="Box">{active ? <b>{children}</b> : children}</div>;
}

export function Avatar({ userId, ...attributes }) {
  const src = `/avatars/${userId}.svg`;
  // ImageResource.read(src);
  return <img className="Avatar" src={src} {...attributes} />;
}

export function AvatarPlaceholder() {
  return <img className="Avatar" src="/avatars/dummy.svg" />;
}

// credits: @jaredpalmer
// https://github.com/jaredpalmer/react-conf-2018/blob/master/full-suspense/src/components/ArtistDetails.js
// const ImageResource = unstable_createResource(
//   source =>
//     new Promise(resolve =>
//       demo_delayRandomImgLoad(() => {
//         const img = new Image();
//         img.src = source;
//         img.onload = resolve;
//       })
//     )
// );
