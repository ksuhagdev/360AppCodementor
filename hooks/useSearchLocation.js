import { useState } from 'react';
import { useAsync } from 'react-async-hook';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import request from '../helper/functions/request';

export default function useSearchLocation(country = 'au') {
  const [query, setQuery] = useState('');

  const debouncedSearchLocation = useConstant(() => AwesomeDebouncePromise(searchLocation, 1000));

  const search = useAsync(async () => {
    if (query.length === 0) {
      return [];
    }
    return debouncedSearchLocation(query, country);
  }, [query]);

  return {
    query,
    setQuery,
    search,
  };
}

const searchLocation = async (query, country) => {
  if (query && query.length < 2) {
    return [];
  }

  try {
    const { data } = await request({
      url: `/suburbs?country=${country}&suburb=${query}`,
      config: { method: 'GET' },
    });


    return data;
  } catch (error) {
    return error;
  }
};
