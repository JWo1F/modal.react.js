let number = 0;

export const getId = () => {
  return '~m' + (number += 1).toString(36);
};