import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { accessCodes } = userStore;
  if (Array.isArray(value)) {
    if (value.length > 0) {
      const permissionValues = value;
      const hasPermission =
        accessCodes &&
        accessCodes.some((item: string) => {
          return permissionValues.includes(item);
        });
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(`need accessCodes!`);
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};
