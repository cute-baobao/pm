import { startTransition, useEffect, useState } from 'react';
import { PAGINATION } from '../configs/constants';

interface useEntitySearchProps<T extends { search: string; page: number }> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMs = 300,
}: useEntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  // Only watch the specific param we care about to avoid effect churn when
  // other params change. Wrap calls to setParams in startTransition so that
  // the resulting navigation/state update is low-priority and won't cause a
  // noticeable white flash while the app-router fetches new server content.
  useEffect(() => {
    const currentSearch = params.search;

    if (localSearch === '' && currentSearch !== '') {
      startTransition(() => {
        setParams({
          ...params,
          search: '',
          page: PAGINATION.DEFAULT_PAGE,
        });
      });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== currentSearch) {
        startTransition(() => {
          setParams({
            ...params,
            search: localSearch,
            page: PAGINATION.DEFAULT_PAGE,
          });
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch, params.search, debounceMs]);

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}
