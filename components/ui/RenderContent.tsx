import React from 'react';
import { isFarsiChar, isCodeStart } from '@/utils/text.util';

export const RenderContent = ({ content }: { content: string }) => {
  if (!content) return null;
  const blocks = content.split(/```([\s\S]*?)```/g);
  return blocks.map((block, i) => {
    if (i % 2 === 1) {
      return (
        <pre key={i} className="block my-4 p-4 bg-slate-800 text-slate-100 font-mono text-sm text-left rounded-xl overflow-x-auto w-full dir-ltr" dir="ltr">
          <code>{block}</code>
        </pre>
      );
    }
    const inlineParts = block.split(/`([^`]+)`/g);
    return (
      <span key={i} className="whitespace-pre-wrap leading-relaxed inline">
        {inlineParts.map((part, j) => {
          if (j % 2 === 1) {
            return <code key={j} className="inline-block px-1.5 py-0.5 mx-1 bg-muted text-foreground font-mono text-sm rounded-md dir-ltr text-left" dir="ltr">{part}</code>;
          }
 
          const textParts: { text: string; isCode: boolean }[] = [];
          let currentStr = '';
          let inCode = false;

          for (let k = 0; k < part.length; k++) {
            const char = part[k];
            if (inCode) {
              if (isFarsiChar(char)) {
                // We reached Farsi character. Code block ends.
                const match = currentStr.match(/([()[\]{}،,.:؛;'"\s]+)$/);
                if (match) {
                  // trailing punctuation should stay with code if it matches opening
                  // but for simplicity, we just keep it in code if it's not space?
                  // Actually, let's move trailing spaces and Farsi-specific punctuation out.
                  const trailing = match[1];
                  const trailingSpacesAndArabicPunc = trailing.match(/([\s،؛]+)$/);
                  if (trailingSpacesAndArabicPunc) {
                    const pureTrailing = trailingSpacesAndArabicPunc[1];
                    const code = currentStr.slice(0, currentStr.length - pureTrailing.length);
                    if (code) textParts.push({ text: code, isCode: true });
                    currentStr = pureTrailing + char;
                  } else {
                    textParts.push({ text: currentStr, isCode: true });
                    currentStr = char;
                  }
                } else {
                  textParts.push({ text: currentStr, isCode: true });
                  currentStr = char;
                }
                inCode = false;
              } else {
                currentStr += char;
              }
            } else {
              if (isCodeStart(char)) {
                // Transitioning to code. Check if currentStr ends with brackets or quotes
                const match = currentStr.match(/([()[\]{}"']+\s*)$/);
                if (match) {
                  const pre = match[1];
                  const nonCode = currentStr.slice(0, currentStr.length - pre.length);
                  if (nonCode) {
                    textParts.push({ text: nonCode, isCode: false });
                  }
                  currentStr = pre + char;
                } else {
                  if (currentStr) {
                    textParts.push({ text: currentStr, isCode: false });
                  }
                  currentStr = char;
                }
                inCode = true;
              } else {
                currentStr += char;
              }
            }
          }
 
          if (currentStr) {
            if (inCode) {
              const match = currentStr.match(/(\s+)$/);
              if (match) {
                const spaces = match[1];
                const code = currentStr.slice(0, currentStr.length - spaces.length);
                if (code) textParts.push({ text: code, isCode: true });
                if (spaces) textParts.push({ text: spaces, isCode: false });
              } else {
                textParts.push({ text: currentStr, isCode: true });
              }
            } else {
              textParts.push({ text: currentStr, isCode: false });
            }
          }

          return textParts.map((t, idx) => {
            if (t.isCode && /[a-zA-Z0-9]/.test(t.text)) {
              return (
                <span key={`${j}-${idx}`} dir="ltr" className="inline-block font-mono bg-secondary/70 px-1.5 py-0.5 rounded-md text-[0.9em] mx-1 align-middle whitespace-pre">
                  {t.text}
                </span>
              );
            }
            return <span key={`${j}-${idx}`}>{t.text}</span>;
          });
        })}
      </span>
    );
  });
};
