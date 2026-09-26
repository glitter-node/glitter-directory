import DOMPurify from 'dompurify';

const config = {
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button', 'svg', 'math', 'meta', 'link'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'action', 'formaction'],
  ALLOW_DATA_ATTR: true,
  ADD_ATTR: ['target'],
};

export const sanitizeHtml = (html: string): string => String(DOMPurify.sanitize(html, config)).replace(/<a\s+([^>]*?)href=["']([^"']+)["']([^>]*?)>/gi, (full: string, before: string, href: string, after: string) => {
  if (!/^https?:\/\//i.test(href) || /\brel\s*=/.test(full)) return full;
  return `<a ${before}href="${href}"${after} rel="noopener noreferrer">`;
});
