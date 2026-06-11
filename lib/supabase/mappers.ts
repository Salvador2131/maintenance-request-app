// Funciones de mapeo que aceptan los argumentos que usa el código existente
export const mapCalendarEvent = (event: any, ...args: any[]) => event
export const mapNotification = (notif: any, ...args: any[]) => notif
export const mapProfile = (profile: any, ...args: any[]) => profile
export const mapSchool = (school: any, ...args: any[]) => school
export const mapTask = (task: any, ...args: any[]) => task
export const mapTaskComment = (comment: any, userName?: string) => {
  // Si se pasa el nombre de usuario, lo adjuntamos al comentario
  if (userName) {
    return { ...comment, user_name: userName }
  }
  return comment
}
export const mapTeam = (team: any, ...args: any[]) => team