const TEMPLATE_DIR = "_template";

function getDayDiff(startDate: Date, endDate: Date): number {
  const msInDay = 24 * 60 * 60 * 1000;

  return Math.round((Number(endDate) - Number(startDate)) / msInDay);
}

function getCurrentDay(): number {
  const now = new Date();
  const start = new Date(2022, 11, 1);

  return getDayDiff(start, now);
}

export { getCurrentDay, TEMPLATE_DIR };
