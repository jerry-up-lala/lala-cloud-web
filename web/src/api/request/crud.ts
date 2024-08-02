import { get, getFile, post, put, deleteRequest } from '@/api/request/request';
import { PageData, DataBody } from '@/global/body';
import {
  CRUD_URL,
  CRUD_PAGE_URL,
  CRUD_INFO_URL,
  CRUD_TEMPLATE_URL,
  CRUD_EXPORT_URL,
} from '@/api/url/crud';

export interface CrudQueryParams {
  input: string;
  inputNumberStart?: number;
  inputNumberEnd?: number;
  inputTagList: string[];
  autoComplete: string;
  mention: string;
  textArea: string;
  rateStart?: number;
  rateEnd?: number;
  sliderStart?: number;
  sliderEnd?: number;
  switchInfo: string;
  radioList: number[];
  checkboxList: number[];
  selectInfoList: number[];
  cascaderList: number[];
  treeSelectList: number[];
  transferList: number[];
  dateTimePickerRang: string[];
}

export interface CrudPageParams extends Partial<CrudQueryParams> {
  current?: number;
  pageSize?: number;
}

export interface CrudExportParams extends Partial<CrudPageParams> {
  ids?: string[];
  currentPage?: boolean;
}

export interface CrudDataBody {
  id: string;
  input: string;
  inputNumber: number;
  inputTagList: string[];
  autoComplete: string;
  mention: string;
  textArea: string;
  rate: number;
  slider: number;
  switchInfo: string;
  radio: string;
  checkboxList: string[];
  selectInfo: string;
  cascader: string;
  treeSelect: string;
  transferList: string[];
  dateTimePicker: string;
  upload: string;
}

export function crudPageApi(requestParams: CrudPageParams) {
  return get<PageData<CrudDataBody>>(CRUD_PAGE_URL, requestParams);
}

export function crudInfoApi(id: string) {
  return get<CrudDataBody>(`${CRUD_INFO_URL}/${id}`);
}

export function crudAddApi(requestBody: CrudDataBody) {
  return post(CRUD_URL, requestBody);
}

export function crudUpdateApi(id: string, requestBody: CrudDataBody) {
  return put(`${CRUD_URL}/${id}`, requestBody);
}

export function crudTemplateApi() {
  return getFile(CRUD_TEMPLATE_URL);
}

export function crudExportApi(requestParams: CrudExportParams) {
  return getFile(CRUD_EXPORT_URL, requestParams);
}

export function crudBatchDeleteApi(requestBody: DataBody<string[]>) {
  return deleteRequest(CRUD_URL, requestBody);
}

export function crudDeleteApi(id: string) {
  return deleteRequest(`${CRUD_URL}/${id}`);
}
