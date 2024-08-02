export default {
  path: '/external',
  name: 'External',
  meta: {
    icon: 'icon-link',
    locale: 'menu.external',
    requiresAuth: true,
    accessCodes: ['*'],
  },
  children: [
    {
      path: 'https://arco.design',
      name: 'ArcoWebsite',
      meta: {
        locale: 'menu.arcoWebsite',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.external', 'menu.arcoWebsite'],
      },
      children: null,
    },
    {
      id: 61,
      parentId: 59,
      path: 'https://jerry-up-blog.pages.dev',
      name: 'JerryUpBlog',
      meta: {
        locale: 'menu.jerryUpBlog',
        requiresAuth: true,
        accessCodes: ['*'],
        breadcrumb: ['menu.external', 'menu.jerryUpBlog'],
      },
      children: null,
    },
  ],
};
