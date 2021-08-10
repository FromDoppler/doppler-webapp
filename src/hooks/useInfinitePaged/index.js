import { useEffect, useState } from 'react';

export const useInfinitePaged = (callback) => {
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const fetch = async (pageNumber) => {
    const { success, value } = await callback(pageNumber);

    if (success) {
      const { items: newItems, currentPage, pagesCount } = value;
      setItems((items) => [...items, ...newItems]);
      setError(false);
      setHasMoreItems(currentPage < pagesCount);
    } else {
      setError(true);
    }
  };

  const loadMoreItems = async () => {
    if (!hasMoreItems) return;

    setFetching(true);
    const nextPage = page + 1;
    setPage(nextPage);
    //Fetch next page
    await fetch(nextPage);
    setFetching(false);
  };

  useEffect(() => {
    const firstFetch = async () => {
      await fetch(1);
      setLoading(false);
    };
    firstFetch();
  }, []);

  return { loading, fetching, error, items, hasMoreItems, loadMoreItems };
};
