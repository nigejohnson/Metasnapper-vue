const routes = [
  { path: '/', component: indexComponent },
  { path: '/index', component: indexComponent },
  { path: '/show-snaps', component: showsnapsComponent },
  { path: '/config', component: configComponent },
  { path: '/applog', component: applogComponent },

]


// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes: routes, // short for `routes: routes`
})

app.use(router)