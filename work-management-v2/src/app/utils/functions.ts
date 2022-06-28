import { Hour } from "./models/hours.interface";
import { Worksite } from "./models/worksite.interface";

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
  });;
  return worksites.find(el => el.id === max.id);
}

export function compareToCurrentDate(inputDate: string) {
  const date = new Date();
  const comp = new Date(inputDate);

  const curDay = date.getDate();
  const curMonth = date.getMonth();
  const curYear = date.getFullYear();

  const compDay = comp.getDate();
  const compMonth = comp.getMonth();
  const compYear = comp.getFullYear();

  const compare = curDay === compDay &&
    curMonth === compMonth &&
    curYear === compYear

  return compare;
}

export function hoursReduce(hours: Hour[]) {
  const marked = hours?.map(el => el.marked);
  const reduce = marked.reduce((prev, cur) => prev + cur, 0);
  const totalMinutes = reduce * 60;
  return totalMinutes;
}
