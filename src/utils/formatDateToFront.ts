export function formatDateWithHours(date: string) {
  const dateFormat = new Date(date);

  const dateDay = new Intl.DateTimeFormat('pt-br').format(dateFormat);

  return `${dateDay}`;
}