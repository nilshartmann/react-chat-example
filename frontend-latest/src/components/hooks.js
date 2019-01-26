import React from "react";

export function useFormInput(initialValue, onEnter) {
  const [value, setValue] = React.useState(initialValue);

  function onChange(e) {
    setValue(e.target.value);
  }

  function onEnterHandler(e) {
    const keyCode = e.which || e.keyCode;
    if (keyCode === 13) {
      onEnter(value);
    }
  }

  return {
    value,
    onChange,
    onKeyPress: onEnter ? onEnterHandler : undefined
  };
}
