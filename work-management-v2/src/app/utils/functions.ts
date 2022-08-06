import { Hour } from "../state/hours/hour.model";
import { Worksite } from "../state/worksites/worksite.model";

export function convertToHoursAndMinutes(value: number) {
  let decimals = value / 60 - Math.floor(value / 60);
  const minutes = decimals * 60;
  const hours = (value - minutes) / 60;

  return {
    hours,
    minutes,
  };
}

export function mostRecentWorksite(worksites: Worksite[]) {
  const millisArr: { id: string, millis: number }[] = [];
  worksites.forEach(el => {
    const millis = new Date(el.updatedAt).valueOf();
    millisArr.push({
      id: el.id,
      millis
    });
  });

  let max: { id: string, millis: number } = { id: '', millis: 0 };
  millisArr.forEach(el => {
    if (el.millis > max.millis) {
      max = el;
    }
  });
  const found = worksites.find(el => el.id === max.id);
  return found ? found : null;
}

/**
 * compare input string date value to current date
 * @param inputDate input date {string}
 * @returns boolean, isCurrentDate
 */
export function compareToCurrentDate(inputDate: string) {
  const date = new Date();
  const comp = new Date(inputDate);

  const curDay = date.getDate();
  const curMonth = date.getMonth();
  const curYear = date.getFullYear();

  const compDay = comp.getDate();
  const compMonth = comp.getMonth();
  const compYear = comp.getFullYear();

  const isCurrentDate = curDay === compDay &&
    curMonth === compMonth &&
    curYear === compYear

  return isCurrentDate;
}

/**
 * reduce input hours Hour[] marked values (hours) to single minutes value
 * @param hours Hour[]
 * @returns minutes, Number
 */
export function hoursReduce(hours: Hour[]) {
  const reducedHours = hours?.map(el => el.marked).reduce((prev, cur) => prev + cur, 0);
  return reducedHours * 60;
}
