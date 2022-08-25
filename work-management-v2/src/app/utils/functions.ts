import { Hour } from "../state/hours/hour.model";
import { Worksite } from "../state/worksites/worksite.model";
import { MINUTESINHOUR } from "./configs/app.config";

/**
 * 
 * @param value Number
 * @returns
 */
export function convertToHoursAndMinutes(value: number) {
  let decimals = value / MINUTESINHOUR - Math.floor(value / MINUTESINHOUR);
  const minutes = decimals * MINUTESINHOUR;
  const hours = (value - minutes) / MINUTESINHOUR;

  return {
    hours,
    minutes,
  };
}

/**
 * 
 * @param hours 
 * @returns 
 */
export function mostRecentWorksiteByHour(hours: Hour[]) {
  return hours.reduce((a, b) => {
    return new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b;
  }, {} as Hour);
}

/**
 * 
 * @param worksites 
 * @returns 
 */
export function mostRecentWorksiteByUpdate(worksites: Worksite[]) {
  return worksites.reduce((a, b) => {
    return new Date(a.updatedAt) > new Date(b.updatedAt) ? a : b;
  }, {} as Worksite)
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
 * Reduce input hours Hour[] marked values (hours) to single minutes value
 * @param hours Hour[]
 * @returns minutes, Number
 */
export function hoursReduce(hours: Hour[]) {
  const reducedHours = hours?.map(el => el.marked).reduce((prev, cur) => prev + cur, 0);
  return reducedHours * MINUTESINHOUR;
}
