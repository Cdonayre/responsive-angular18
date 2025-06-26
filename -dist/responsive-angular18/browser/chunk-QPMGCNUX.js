import {
  AuthService,
  ROUTE_PATHS,
  Router,
  StorageEncryptService
} from "./chunk-FBN4GXPF.js";
import {
  inject
} from "./chunk-7SPA2HJF.js";

// src/app/core/guard/auth.guard.ts
var authGuard = (__route, __state) => {
  const authService = inject(AuthService);
  const localStorageServiceEncrypt = inject(StorageEncryptService);
  const router = inject(Router);
  const currentUser = authService.isAuthenticated();
  if (currentUser) {
    return true;
  }
  localStorageServiceEncrypt.clearData();
  return router.navigate([ROUTE_PATHS.LOGIN]);
};
var AuthLoginGuard = (__route, __state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.isAuthenticated();
  if (currentUser) {
    return router.navigate([ROUTE_PATHS.DASHBOARD]);
  } else {
    return true;
  }
};

// src/app/app.routes.ts
var routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    loadChildren: () => import("./chunk-FNYBIFN2.js").then((m) => m.AUTH_ROUTES),
    canActivate: [AuthLoginGuard]
  },
  {
    path: "dashboard",
    loadChildren: () => import("./chunk-KIJMQ3VJ.js").then((m) => m.ADMIN_ROUTES),
    canActivate: [authGuard],
    data: { breadcrumb: "Inicio" }
  },
  // {
  //   path: 'sidebar',
  //   loadChildren: () =>
  //     import('./shared/sidebar/sidebar.component').then((m) => m.SidebarComponent),
  //   canActivate: [authGuard],
  //   data: { breadcrumb: 'Inicio' },
  // },
  { path: "**", redirectTo: "not-found" }
];

export {
  routes
};
//# sourceMappingURL=chunk-QPMGCNUX.js.map
