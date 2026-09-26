import React from 'react';

export interface DirectoryPaginationProps {
  basePath: string;
  currentPage?: number | string | null;
  lastPage?: number | string | null;
  totalIsExact?: boolean | string | null;
  hasMorePages?: boolean | string | null;
  category?: string | null;
  search?: string | null;
  view?: string | null;
  sort?: string | null;
  perPage?: number | string | null;
  paginationLabel: string;
  previousLabel: string;
  nextLabel: string;
  previousAriaLabel: string;
  nextAriaLabel: string;
}

type PageToken = number | 'ellipsis';

const toPositiveInteger = (value: number | string | null | undefined, fallback: number): number => {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const toBoolean = (value: boolean | string | null | undefined): boolean =>
  value === true || value === 'true';

const addPage = (pages: PageToken[], page: number): void => {
  if (pages[pages.length - 1] !== page) pages.push(page);
};

const addEllipsis = (pages: PageToken[]): void => {
  if (pages[pages.length - 1] !== 'ellipsis') pages.push('ellipsis');
};

const exactPageWindow = (currentPage: number, lastPage: number): PageToken[] => {
  const pages: PageToken[] = [];
  const maxVisiblePages = 5;

  if (lastPage <= maxVisiblePages + 2) {
    for (let page = 1; page <= lastPage; page += 1) pages.push(page);
    return pages;
  }

  const halfVisible = Math.floor(maxVisiblePages / 2);
  let startPage = Math.max(2, currentPage - halfVisible);
  let endPage = Math.min(lastPage - 1, currentPage + halfVisible);

  if (currentPage <= halfVisible + 1) {
    endPage = Math.min(lastPage - 1, maxVisiblePages);
  } else if (currentPage >= lastPage - halfVisible) {
    startPage = Math.max(2, lastPage - maxVisiblePages + 1);
  }

  addPage(pages, 1);
  if (startPage > 2) addEllipsis(pages);
  for (let page = startPage; page <= endPage; page += 1) addPage(pages, page);
  if (endPage < lastPage - 1) addEllipsis(pages);
  addPage(pages, lastPage);

  return pages;
};

const inexactPageWindow = (currentPage: number, hasMorePages: boolean): PageToken[] => {
  const pages: PageToken[] = [];
  const maxVisiblePages = 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);
  const startPage = currentPage <= maxVisiblePages ? 1 : currentPage - halfVisible;

  if (startPage > 1) {
    addPage(pages, 1);
    if (startPage > 2) addEllipsis(pages);
  }

  for (let page = startPage; page <= currentPage; page += 1) addPage(pages, page);

  if (hasMorePages) {
    addPage(pages, currentPage + 1);
    addEllipsis(pages);
  }

  return pages;
};

export const DirectoryPagination: React.FC<DirectoryPaginationProps> = ({
  basePath,
  currentPage: currentPageProp,
  lastPage: lastPageProp,
  totalIsExact: totalIsExactProp,
  hasMorePages: hasMorePagesProp,
  category,
  search,
  view,
  sort,
  perPage,
  paginationLabel,
  previousLabel,
  nextLabel,
  previousAriaLabel,
  nextAriaLabel,
}) => {
  const currentPage = toPositiveInteger(currentPageProp, 1);
  const parsedLastPage = toPositiveInteger(lastPageProp, 0);
  const isExact = toBoolean(totalIsExactProp) && parsedLastPage > 0;
  const hasMorePages = toBoolean(hasMorePagesProp);
  const effectiveCurrentPage = isExact ? Math.min(currentPage, parsedLastPage) : currentPage;
  const canGoNext = isExact ? effectiveCurrentPage < parsedLastPage : hasMorePages;

  if ((!isExact || parsedLastPage <= 1) && effectiveCurrentPage === 1 && !canGoNext) return null;

  const pages = isExact
    ? exactPageWindow(effectiveCurrentPage, parsedLastPage)
    : inexactPageWindow(effectiveCurrentPage, hasMorePages);

  const buildHref = (page: number): string => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('q', search);
    if (perPage !== undefined && perPage !== null && String(perPage) !== '') params.set('per_page', String(perPage));
    if (view) params.set('view', view);
    if (sort) params.set('sort', sort);
    params.set('page', String(Math.max(1, Math.trunc(page))));
    return `${basePath}?${params.toString()}`;
  };

  return <nav className="gd-pagination" aria-label={paginationLabel}>
    {effectiveCurrentPage > 1 && <a className="gd-link-button gd-pagination-control" href={buildHref(effectiveCurrentPage - 1)} aria-label={previousAriaLabel}>{previousLabel}</a>}
    <div className="gd-pagination-pages">
      {pages.map((page, index) => page === 'ellipsis'
        ? <span className="gd-pagination-ellipsis" aria-hidden="true" key={`ellipsis-${index}`}>…</span>
        : page === effectiveCurrentPage
          ? <span className="gd-pagination-page gd-pagination-current" aria-current="page" key={page}>{page}</span>
          : <a className="gd-link-button gd-pagination-page" href={buildHref(page)} key={page}>{page}</a>)}
    </div>
    {canGoNext && <a className="gd-link-button gd-pagination-control" href={buildHref(effectiveCurrentPage + 1)} aria-label={nextAriaLabel}>{nextLabel}</a>}
  </nav>;
};
