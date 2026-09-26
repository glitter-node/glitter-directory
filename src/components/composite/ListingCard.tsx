import React from 'react';

export interface ListingCardProps { href: string; title?: string; category?: string | null; preview?: string | null; date?: string | null; thumbnail?: string | null; categoryText?: string; authorName?: string | null; isNew?: boolean; newLabel?: string; viewCount?: number | null; showViewCount?: boolean; viewCountText?: string; variant?: 'grid' | 'list'; }
export const ListingCard: React.FC<ListingCardProps> = ({ href, title = '', category, preview, date, thumbnail, categoryText = '', authorName, isNew = false, newLabel = '', viewCount, showViewCount = true, viewCountText = '', variant = 'grid' }) => {
  const mode = variant === 'list' ? 'list' : 'grid';

  return <article className={`gd-listing-card gd-listing-card--${mode}`} role="listitem">
  {thumbnail && <img className="gd-listing-image" src={thumbnail} alt="" loading="lazy" />}
  <div className="gd-listing-body"><a className="gd-listing-link" href={href}><h3>{title}</h3></a>{category && category !== 'unclassified' && <p className="gd-listing-category">{categoryText}</p>}{preview && <p className="gd-listing-preview">{preview}</p>}<div className="gd-listing-meta">{authorName && <span className="gd-listing-author">{authorName}</span>}{date && <time className="gd-listing-date" dateTime={date}>{date}</time>}{showViewCount && viewCount != null && viewCountText && <span className="gd-listing-views">{viewCountText}</span>}{isNew && newLabel && <span className="gd-listing-new">{newLabel}</span>}</div></div>
</article>;
};
