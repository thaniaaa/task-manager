export function formatDateToString(date) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


export function getTodayDateString() {
  return formatDateToString(
    new Date()
  );
}


export function parseDateString(
  dateString
) {
  if (!dateString) {
    return null;
  }

  const dateParts =
    dateString.split("-");

  const year =
    Number(dateParts[0]);

  const month =
    Number(dateParts[1]);

  const day =
    Number(dateParts[2]);

  return new Date(
    year,
    month - 1,
    day
  );
}


export function formatDateForDisplay(
  dateString
) {
  const date =
    parseDateString(dateString);

  if (!date) {
    return "No due date";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(date);
}