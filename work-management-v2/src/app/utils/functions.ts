import { NavItems } from './interfaces/navigation-items.interface';

export function convertToHoursAndMinutes(value: number) {
  let decimals = value / 60 - Math.floor(value / 60);
  const minutes = decimals * 60;
  const hours = (value - minutes) / 60;

  return {
    hours,
    minutes,
  };
}

export function setActiveValue(navItems: NavItems, inputValue: string) {
  const obj = navItems;
  let k: keyof typeof obj;
  for (k in obj) {
    if (k === inputValue) {
      obj[k] = true;
    }
  }
}

export function resetActive(navItems: NavItems) {
  const obj = navItems;
  let k: keyof typeof obj;
  for (k in obj) {
    obj[k] = false;
  }
}
