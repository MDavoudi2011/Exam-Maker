import { codeToHtml } from 'shiki';

export async function highlightCode(code: string, lang: string = 'javascript') {
  try {
    return await codeToHtml(code, {
      lang,
      theme: 'github-dark-dimmed'
    });
  } catch (e) {
    return `<pre><code>${code}</code></pre>`;
  }
}
