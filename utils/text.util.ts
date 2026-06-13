export const isFarsi = (text: string) => /[\u0600-\u06FF]/.test(text);

export function toFarsiNumber(n: number | string): string {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
}

export const isFarsiChar = (char: string) => /[\u0600-\u06FF\u200C]/.test(char);

export const isCodeStart = (char: string) => /[a-zA-Z0-9]/.test(char);
