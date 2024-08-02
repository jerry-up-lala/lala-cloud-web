import { MENU_LIST_URL, MENU_ROUTE_URL } from '@/api/url/menu';
import { get } from '@/api/request/request';
import type { RouteRecordNormalized } from 'vue-router';
import { DataBody } from '@/global/body';

export interface MenuInfoResponseBody {
  /**
   * 菜单/按钮ID
   */
  id: number;
  /**
   * 菜单/按钮类型，1-菜单,2-按钮
   */
  type: number;
  /**
   * 菜单名称/按钮名称(语言包键名)
   */
  locale: string;
  /**
   * 访问码
   */
  accessCodes: string[] | null;

  /**
   * 图标
   */
  icon: null | string;

  /**
   * 是否需要鉴权
   */
  requiresAuth: boolean;

  /**
   * 菜单路由地址
   */
  path: null | string;

  /**
   * 菜单路由名称
   */
  name: null | string;

  /**
   * 菜单是否隐藏
   */
  hideInMenu: boolean | null;

  /**
   * 子菜单单独显示
   */
  hideChildrenInMenu: boolean | null;

  /**
   * 菜单打开位置
   */
  noAffix: boolean | null;
  /**
   * 排序值
   */
  order: number;

  children: MenuInfoResponseBody[] | null;
}

export function menuListApi(params: DataBody<string>) {
  return get<MenuInfoResponseBody[]>(MENU_LIST_URL, params);
}

export function routeTreeApi() {
  return get<RouteRecordNormalized[]>(MENU_ROUTE_URL);
}

export default {};
