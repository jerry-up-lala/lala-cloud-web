import { getToken } from '@/utils/auth';

export interface Upload {
  action: string;
  headers: Record<string, string>;
}

export const loadUpload = (action: string): Upload => {
  return {
    action: import.meta.env.VITE_API_BASE_URL + action,
    headers: { Authorization: `Bearer ${getToken()}` },
  };
};
