const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name:'home', component: () => import('pages/IndexPage.vue') },
      { path: 'access', name: 'access', component: () => import('pages/AccessPage.vue') },
      { path: 'workers', name: 'workers', component: () => import('pages/WorkersPage.vue') },
      { path: 'scanBonus', name: 'scanBonus', component: () => import('pages/ScanBonusPage.vue') },
      { path: 'createBonus', name: 'createBonus', component: () => import('pages/CreateBonusPage.vue') },
      { path: 'chooseAction', name: 'chooseAction', component: () => import('pages/ChooseActionPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
