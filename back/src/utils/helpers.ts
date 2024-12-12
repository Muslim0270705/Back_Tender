import iconv from "iconv-lite";

export function decodeFileName(fileName: string): string {
  return iconv.decode(Buffer.from(fileName, "latin1"), "utf8");
}

export function isValidPin($pin: string) {
  var USER_PIN_REG_EXP =
    /^[1,2](0[1-9]|[1-2][0-9]|(3)[0-1])(0[1-9]|1[0-2])(19[2-9][0-9]|20[0-9][0-9])\d{5}$/;
  return USER_PIN_REG_EXP.test($pin);
}

export function isValidEmail($email: string) {
  var emailPattern =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  return emailPattern.test($email);
}

export function generateCode() {
  return Math.floor(10000 + Math.random() * 90000);
}

export function isValidDate(dateString: string): boolean {
  // Regular expression to match DD-MM-YYYY format
  var regex = /^\d{2}-\d{2}-\d{4}$/;

  if (!regex.test(dateString)) {
    return false;
  }

  var parts = dateString.split("-");
  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10);

  var date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
