import { useNow as useNowNextIntl } from 'next-intl';

export function useNow() {
  const now = useNowNextIntl();
  return { now: now.toLocaleDateString() };
}
