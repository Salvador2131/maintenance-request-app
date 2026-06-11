export const DEMO_USER_COOKIE = 'demo_user';

export function isProtectedPath(pathname: string): boolean {
  const protectedPaths = ['/dashboard', '/tareas', '/calendario', '/colegios', '/equipos', '/configuracion', '/reportes'];
  return protectedPaths.some(path => pathname.startsWith(path));
}