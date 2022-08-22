export function isPrintableASCII(str: string) {
  // eslint-disable-next-line no-control-regex
  return /^[\x21-\x7E]*$/.test(str);
}

export function isValidEmail(str: string) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    str
  );
}