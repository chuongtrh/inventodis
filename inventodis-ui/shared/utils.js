import { debounce } from "lodash";

export const debounceFn = (cb, type = "input", delayTime = 500) => {
  const db = debounce((value) => cb(value), delayTime);

  if (type === "select") return (val) => db(val);
  return (e) => db(e.target.value);
};
