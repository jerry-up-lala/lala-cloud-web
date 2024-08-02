import type { RouteRecordNormalized } from 'vue-router';

const modules = import.meta.glob('./modules/*.ts', { eager: true });
const externalModules = import.meta.glob('./externalModules/*.ts', {
  eager: true,
});

function formatModules(_modules: any, result: RouteRecordNormalized[]) {
  Object.keys(_modules).forEach((key) => {
    const defaultModule = _modules[key].default;
    if (!defaultModule) return;
    const moduleList = Array.isArray(defaultModule)
      ? [...defaultModule]
      : [defaultModule];
    result.push(...moduleList);
  });
  return result;
}

export function setRouteComponenName(componentOptions: any, routeName: string) {
  const clone = (comp: { default: any }) => {
    if (comp && comp.default) {
      return { ...comp.default, name: routeName };
    }
    return comp;
  };
  if (componentOptions instanceof Promise) {
    // 异步组件
    return componentOptions.then((comp) => {
      return clone(comp);
    });
  }
  // 同步组件
  return clone(componentOptions);
}

export const appRouteTree: RouteRecordNormalized[] = formatModules(modules, []);

export const appExternalRoutes: RouteRecordNormalized[] = formatModules(
  externalModules,
  []
);
