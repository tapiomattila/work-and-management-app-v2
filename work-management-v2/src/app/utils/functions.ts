export function convertToHoursAndMinutes(value: number) {
  let decimals = value / 60 - Math.floor(value / 60);
  const minutes = decimals * 60;
  const hours = (value - minutes) / 60;

  return {
    hours,
    minutes,
  };
}
