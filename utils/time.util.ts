import { toFarsiNumber } from "@/utils/text.util";

export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${toFarsiNumber(m.toString().padStart(2, '0'))}:${toFarsiNumber(s.toString().padStart(2, '0'))}`;
};
