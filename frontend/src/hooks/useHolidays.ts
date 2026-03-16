import { useState, useEffect } from 'react';
import { fetchHolidays } from '@/api';
import type { HolidayMap } from '@/types';

export function useHolidays(year: number, countryCode = 'US'): HolidayMap {
  const [map, setMap] = useState<HolidayMap>({});

  useEffect(() => {
    fetchHolidays(year, countryCode).then(holidays => {
      const next: HolidayMap = {};
      holidays.forEach(h => {
        if (!next[h.date]) next[h.date] = [];
        next[h.date].push(h);
      });
      setMap(next);
    });
  }, [year, countryCode]);

  return map;
}
