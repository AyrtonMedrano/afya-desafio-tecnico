export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'diners' | 'elo' | 'unknown';

export function normalizeCardDigits(input: string): string {
  return input.replace(/\D/g, '');
}

export function formatCardNumber(input: string): { formatted: string; digits: string } {
  const digits = normalizeCardDigits(input).slice(0, 19); 
  const groups = digits.match(/.{1,4}/g) || [];
  return { formatted: groups.join(' '), digits };
}

export function luhnCheck(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (shouldDouble) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function detectCardBrand(digits: string): CardBrand {
  const d = digits;
  if (/^4\d{12,18}$/.test(d)) return 'visa';
  if (/^(?:5[1-5]\d{14}|2[2-7]\d{14})$/.test(d)) return 'mastercard';
  if (/^3[47]\d{13}$/.test(d)) return 'amex';          // 15 dígitos
  if (/^3(?:0[0-5]|[68]\d)\d{11}$/.test(d)) return 'diners'; // 14 dígitos
  if (/^(4011|4312|4389|4514|4576|4577|5041|5067|509[0-5]|6277|65(04|05|06|07|08|16)|6550)\d+$/.test(d))
    return 'elo';
  return 'unknown';
}

export function formatExpiry(input: string): { formatted: string; mm: string; yy: string } {
  const digits = input.replace(/\D/g, '').slice(0, 4);
  const mm = digits.slice(0, 2);
  const yy = digits.slice(2, 4);
  const formatted = mm + (digits.length > 2 ? '/' + yy : '');
  return { formatted, mm, yy };
}

export function isExpiryFuture(mmStr: string, yyStr: string): boolean {
  if (mmStr.length !== 2 || yyStr.length !== 2) return false;
  const mm = Number(mmStr);
  if (mm < 1 || mm > 12) return false;
  const year = 2000 + Number(yyStr);

  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth() + 1; 

  if (year > curYear) return true;
  if (year < curYear) return false;
  return mm > curMonth;
}

export function formatCpf(input: string): { formatted: string; digits: string } {
  const digits = input.replace(/\D/g, '').slice(0, 11);
  let formatted = digits;
  if (digits.length > 9) {
    formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  } else if (digits.length > 6) {
    formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  } else if (digits.length > 3) {
    formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }
  return { formatted, digits };
}