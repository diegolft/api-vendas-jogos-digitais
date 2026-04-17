export function parseBirthDateInput(value?: string | Date | null): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return null;
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(normalizedValue)) {
    const [day, month, year] = normalizedValue.split('/').map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));
    const isSameDate =
      parsedDate.getUTCFullYear() === year &&
      parsedDate.getUTCMonth() === month - 1 &&
      parsedDate.getUTCDate() === day;

    return isSameDate ? parsedDate : null;
  }

  const parsedDate = new Date(normalizedValue);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function formatBirthDate(value?: string | Date | null): string | null {
  if (!value) {
    return null;
  }

  const parsedDate = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const day = String(parsedDate.getUTCDate()).padStart(2, '0');
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
  const year = parsedDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

