import { get, getFile, post } from '@/api/request/request';
import { PageData, DataBody } from '@/global/body';
import {
  GEN_TABLE_PAGE_URL,
  GEN_TABLE_INFO_URL,
  GEN_TABLE_URL,
  GEN_COLUMN_URL,
  GEN_PREVIEW_URL,
  GEN_DOWNLOAD_URL,
} from '@/api/url/gen';

export interface GenTableQueryParams {
  tableName?: string;
  tableComment?: string;
  tableEngine?: string;
  tableCollation?: string;
  packageName?: string;
  className?: string;
  functionName?: string;
  author?: string;
  tableCreateTimeRang?: string[];
  tableUpdateTimeRang?: string[];
}

export interface GenPageParams extends Partial<GenTableQueryParams> {
  current?: number;
  pageSize?: number;
}

export interface GenTableSaveBody {
  tableSchema?: string;
  tableName: string;
  packageName?: string;
  className?: string;
  functionName?: string;
  author?: string;
}

export interface GenTableBody extends GenTableSaveBody {
  id?: number;
  tableComment?: string;
  tableEngine?: string;
  tableCreateTime?: string;
  tableUpdateTime?: string;
  tableCollation?: string;
}

export interface GenColumnSaveBody {
  columnName?: string;
  fieldName?: string;
  fieldType?: string;
  fieldComment?: string;
  fieldDictKey?: string;
}

export interface GenColumnBody extends GenColumnSaveBody {
  columnKey?: string;
  columnExtra?: string;
  columnComment?: string;
  columnType?: string;
}

export interface GenPreviewTreeResponseBody {
  key?: string;
  title?: string;
  children?: GenPreviewTreeResponseBody[];
}

export interface GenPreviewTabResponseBody {
  key?: string;
  title?: string;
  code?: string;
}

export interface GenPreviewResponseBody {
  tree: GenPreviewTreeResponseBody[];
  tab: GenPreviewTabResponseBody[];
}

export function genTablePageApi(requestParams: GenPageParams) {
  return get<PageData<GenTableBody>>(GEN_TABLE_PAGE_URL, requestParams);
}

export function genTableInfoApi(tableName: string) {
  return get<GenTableBody>(`${GEN_TABLE_INFO_URL}/${tableName}`);
}

export function genTableSaveApi(requestBody: GenTableSaveBody) {
  return post<number>(GEN_TABLE_URL, requestBody);
}

export function genColumnApi(tableId: number | undefined) {
  return get<GenColumnBody[]>(`${GEN_COLUMN_URL}/${tableId}`);
}

export function genColumnSaveApi(
  tableId: number | undefined,
  requestBody: DataBody<GenColumnSaveBody[]>
) {
  return post(`${GEN_COLUMN_URL}/${tableId}`, requestBody);
}

export function genPreviewApi(tableId: number | undefined) {
  return get<GenPreviewResponseBody>(`${GEN_PREVIEW_URL}/${tableId}`);
}

export function genDownloadApi(tableId: number | undefined) {
  return getFile(`${GEN_DOWNLOAD_URL}/${tableId}`);
}
