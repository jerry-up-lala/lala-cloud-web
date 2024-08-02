import qs from 'query-string';

export default ({ mock, setup }: { mock?: boolean; setup: () => void }) => {
  if (mock !== false && import.meta.env.VITE_MOCK_OPEN === 'true') setup();
};

export interface MockParams {
  url: string;
  type: string;
  body: string;
}

export const successRWrap = (data: unknown) => {
  return {
    data,
    error: null,
  };
};

export const errorRWrap = (data: unknown, msg: string, code = 100010) => {
  return {
    data,
    error: {
      code,
      msg,
    },
  };
};

export const pageRWrap = (params: MockParams, dataList: any[]) => {
  const { current = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
  const p = current as number;
  const ps = pageSize as number;
  return successRWrap({
    list: dataList.slice((p - 1) * ps, p * ps),
    total: dataList.length,
  });
};
