export const formatOrderDateTZ = (input: string | Date) => {
  const d = typeof input === 'string' ? new Date(input) : input;
  const now = new Date();

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');

  let prefix = '';
  if (sameDay(d, now)) {
    prefix = 'Сегодня';
  } else if (sameDay(d, yesterday)) {
    prefix = 'Вчера';
  } else {
    const diff = Math.floor((+now - +d) / 86400000);
    const n10 = diff % 10;
    const n100 = diff % 100;
    const form =
      n10 === 1 && n100 !== 11
        ? 'день'
        : n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)
          ? 'дня'
          : 'дней';
    prefix = `${diff} ${form} назад`;
  }

  return `${prefix}, ${hh}:${mm} i-GMT+3`;
};
