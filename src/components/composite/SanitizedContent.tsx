import React, { useMemo } from 'react';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

export interface SanitizedContentProps { content?: string; isHtml?: boolean; className?: string; }
export const SanitizedContent: React.FC<SanitizedContentProps> = ({ content = '', isHtml = false, className = '' }) => {
  const html = useMemo(() => sanitizeHtml(content), [content]);
  if (!content.trim()) return null;
  return isHtml ? <div className={`gd-detail-content ${className}`.trim()} dangerouslySetInnerHTML={{ __html: html }} /> : <div className={`gd-detail-text ${className}`.trim()}>{content}</div>;
};
