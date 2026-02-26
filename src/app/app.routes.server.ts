import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'order-confirmation/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'admin/orders',
    renderMode: RenderMode.Server
  },
  {
    path: 'order-history',
    renderMode: RenderMode.Server
  },
  {
    path: 'checkout',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
