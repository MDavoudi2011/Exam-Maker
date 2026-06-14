import { useState, useEffect } from 'react';

export function useResponsivePagination(currentPage: number, totalPages: number) {
  const [maxPages, setMaxPages] = useState(7); // Including '...', default mobile 7 page blocks

  useEffect(() => {
    const updateMaxPages = () => {
      const width = window.innerWidth;
      if (width < 360) setMaxPages(5); // very small screen
      else if (width < 480) setMaxPages(7); // standard mobile
      else if (width < 640) setMaxPages(9); // large mobile
      else if (width < 768) setMaxPages(11); // tablet
      else if (width < 1024) setMaxPages(13); // md
      else setMaxPages(15); // lg/xl
    };

    updateMaxPages();
    window.addEventListener('resize', updateMaxPages);
    return () => window.removeEventListener('resize', updateMaxPages);
  }, []);

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const half = Math.floor((maxPages - 3) / 2);
    let startPage, endPage;
    let isLeftEllipsis = false;
    let isRightEllipsis = false;

    if (currentPage <= half + 2) {
      startPage = 1;
      endPage = maxPages - 2; 
      isLeftEllipsis = false;
      isRightEllipsis = true;
    } else if (currentPage >= totalPages - (half + 1)) {
      startPage = totalPages - (maxPages - 3);
      endPage = totalPages;
      isLeftEllipsis = true;
      isRightEllipsis = false;
    } else {
      const centerSlots = maxPages - 4;
      const offset = Math.floor(centerSlots / 2);
      startPage = currentPage - offset;
      endPage = startPage + centerSlots - 1;
      if (centerSlots === 0) {
        startPage = currentPage;
        endPage = currentPage;
      }
      isLeftEllipsis = true;
      isRightEllipsis = true;
    }

    if (isLeftEllipsis) {
      pages.push(1);
      pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (isRightEllipsis) {
      pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return { getVisiblePages };
}
