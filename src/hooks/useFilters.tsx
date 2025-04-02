import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

type TFilters<T> = Record<keyof T, string>;

export const useFilters = <T extends Record<string, string>>({
  initFilters,
  dropUnassociatedFilters,
}: {
  initFilters: TFilters<T>;
  dropUnassociatedFilters?: boolean;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Search params that are not associated with the current filters. These search params may be
   * filters used by other resources or components.
   */
  const unassociatedSearchParams = useMemo(() => {
    const searchQueryMap: Record<string, string> = {};
    if (dropUnassociatedFilters) {
      return searchQueryMap;
    }

    searchParams.forEach((value, key) => {
      if (key in initFilters) {
        return;
      }

      searchQueryMap[key] = value;
    });

    return searchQueryMap;
  }, []);

  /**
   * Loop trough the filter key list and build a filter object based with the
   * return value of the passed callback function.
   */
  const loopTroughFilters = useCallback(
    (callback: (filterKey: string) => string) => {
      return Object.keys(initFilters).reduce<Record<string, string>>((acc, key) => {
        if (typeof key !== "string") {
          console.error(`useFilters: Filter key must be a string, received type ${typeof key}`);
          return acc;
        }

        const filterValue = callback(key);
        if (filterValue) {
          acc[key] = filterValue;
        }

        return acc;
      }, {});
    },
    [initFilters],
  );

  /**
   * Filters extracted from the URL search params based on the provided filter keys.
   */
  const filters = useMemo(() => {
    return loopTroughFilters((key) => {
      return searchParams.get(key) ?? initFilters[key];
    }) as T;
  }, [searchParams, loopTroughFilters, initFilters]);

  /**
   * Combines the new and the current filters while removing the empty values.
   */
  const formatFilters = (newFilters: Partial<Record<keyof T, string>>): TFilters<T> => {
    const newFilterCollection = loopTroughFilters((key) => {
      return newFilters[key] ?? filters[key] ?? initFilters[key];
    });

    return removeEmptyValues({ ...unassociatedSearchParams, ...newFilterCollection }, false) as TFilters<T>;
  };

  /**
   * Sets the new filters in the URL search params.
   */
  const setFilters = (newFilters: Partial<Record<keyof T, string>>) => {
    const formattedFilters = formatFilters(newFilters);
    const encodedFilters = new URLSearchParams(formattedFilters).toString();

    setSearchParams(encodedFilters, { replace: true });
  };

  return {
    formatFilters,
    setFilters,
    filters,
  };
};

const removeEmptyValues = <T extends Record<string, string>>(obj: T, removeEmptyString = true) => {
  const processedObj = Object.keys(obj).reduce<Record<string, string>>((acc, key) => {
    if (removeEmptyString && obj[key] === "") {
      return acc;
    }

    if (obj[key] !== undefined && obj[key] !== null) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});

  return processedObj as Partial<T>;
};
