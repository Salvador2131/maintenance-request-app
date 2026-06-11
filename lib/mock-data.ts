import { User, School, Team, Task, CalendarEvent, Notification, TaskComment } from './types'

// Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@colegios.com',
    role: 'contralor',
  },
  {
    id: 'user-2',
    name: 'María García',
    email: 'maria.garcia@sanignacio.edu',
    role: 'director',
    schoolId: 'school-1',
  },
  {
    id: 'user-3',
    name: 'Juan Pérez',
    email: 'juan.perez@lasalle.edu',
    role: 'director',
    schoolId: 'school-2',
  },
  {
    id: 'user-4',
    name: 'Ana Rodríguez',
    email: 'ana.rodriguez@montessori.edu',
    role: 'director',
    schoolId: 'school-3',
  },
  {
    id: 'user-5',
    name: 'Roberto López',
    email: 'roberto.lopez@colegios.com',
    role: 'tecnico',
    teamId: 'team-1',
    specialty: 'electrico',
  },
  {
    id: 'user-6',
    name: 'Elena Martínez',
    email: 'elena.martinez@colegios.com',
    role: 'tecnico',
    teamId: 'team-2',
    specialty: 'informatico',
  },
  {
    id: 'user-7',
    name: 'Pedro Sánchez',
    email: 'pedro.sanchez@colegios.com',
    role: 'tecnico',
    teamId: 'team-3',
    specialty: 'fontaneria',
  },
  {
    id: 'user-8',
    name: 'Luis Hernández',
    email: 'luis.hernandez@colegios.com',
    role: 'admin_equipo',
    teamId: 'team-1',
  },
]

// Schools
export const mockSchools: School[] = [
  {
    id: 'school-1',
    name: 'Colegio San Ignacio',
    address: 'Av. Principal 123',
    city: 'Ciudad de México',
    directorId: 'user-2',
  },
  {
    id: 'school-2',
    name: 'Instituto La Salle',
    address: 'Calle Reforma 456',
    city: 'Guadalajara',
    directorId: 'user-3',
  },
  {
    id: 'school-3',
    name: 'Escuela Montessori del Valle',
    address: 'Blvd. de la Luz 789',
    city: 'Monterrey',
    directorId: 'user-4',
  },
]

// Teams
export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Equipo Eléctrico',
    specialty: 'electrico',
    adminId: 'user-8',
    memberIds: ['user-5'],
  },
  {
    id: 'team-2',
    name: 'Equipo Informático',
    specialty: 'informatico',
    memberIds: ['user-6'],
  },
  {
    id: 'team-3',
    name: 'Equipo de Fontanería',
    specialty: 'fontaneria',
    memberIds: ['user-7'],
  },
]

// Tasks
const now = new Date()
const dayMs = 24 * 60 * 60 * 1000

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Reparación de luces en aula 101',
    description: 'Las luces del aula 101 parpadean constantemente y una de ellas no enciende. Se requiere revisión urgente del sistema eléctrico.',
    type: 'electrico',
    priority: 'alta',
    status: 'en_progreso',
    schoolId: 'school-1',
    schoolName: 'Colegio San Ignacio',
    location: 'Aula 101, Edificio Principal',
    createdBy: 'user-2',
    createdByName: 'María García',
    assignedTo: 'user-5',
    assignedToName: 'Roberto López',
    createdAt: new Date(now.getTime() - 2 * dayMs),
    updatedAt: new Date(now.getTime() - 1 * dayMs),
    comments: [
      {
        id: 'comment-1',
        taskId: 'task-1',
        userId: 'user-5',
        userName: 'Roberto López',
        content: 'Revisando el sistema eléctrico, encontré un cable suelto. Procedo a reparar.',
        createdAt: new Date(now.getTime() - 1 * dayMs),
      },
    ],
  },
  {
    id: 'task-2',
    title: 'Fuga de agua en baños del segundo piso',
    description: 'Se detectó una fuga de agua en los baños de hombres del segundo piso. El piso está constantemente mojado.',
    type: 'fontaneria',
    priority: 'urgente',
    status: 'pendiente',
    schoolId: 'school-1',
    schoolName: 'Colegio San Ignacio',
    location: 'Baños 2do Piso, Edificio A',
    createdBy: 'user-2',
    createdByName: 'María García',
    createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    comments: [],
  },
  {
    id: 'task-3',
    title: 'Instalación de proyector en sala de conferencias',
    description: 'Se necesita instalar un nuevo proyector en la sala de conferencias y configurar la conexión con el sistema de audio.',
    type: 'informatico',
    priority: 'media',
    status: 'completada',
    schoolId: 'school-2',
    schoolName: 'Instituto La Salle',
    location: 'Sala de Conferencias, Edificio Administrativo',
    createdBy: 'user-3',
    createdByName: 'Juan Pérez',
    assignedTo: 'user-6',
    assignedToName: 'Elena Martínez',
    createdAt: new Date(now.getTime() - 5 * dayMs),
    updatedAt: new Date(now.getTime() - 1 * dayMs),
    completedAt: new Date(now.getTime() - 1 * dayMs),
    comments: [
      {
        id: 'comment-2',
        taskId: 'task-3',
        userId: 'user-6',
        userName: 'Elena Martínez',
        content: 'Proyector instalado y configurado. Sistema de audio funcionando correctamente.',
        createdAt: new Date(now.getTime() - 1 * dayMs),
      },
    ],
  },
  {
    id: 'task-4',
    title: 'Revisión de aires acondicionados',
    description: 'Mantenimiento preventivo de los aires acondicionados en las aulas del primer piso.',
    type: 'climatizacion',
    priority: 'baja',
    status: 'asignada',
    schoolId: 'school-2',
    schoolName: 'Instituto La Salle',
    location: 'Aulas 1-5, Primer Piso',
    createdBy: 'user-3',
    createdByName: 'Juan Pérez',
    assignedTo: 'user-5',
    assignedToName: 'Roberto López',
    createdAt: new Date(now.getTime() - 3 * dayMs),
    updatedAt: new Date(now.getTime() - 2 * dayMs),
    comments: [],
  },
  {
    id: 'task-5',
    title: 'Problema con red WiFi en biblioteca',
    description: 'La red WiFi de la biblioteca presenta conexión intermitente. Los estudiantes no pueden acceder a recursos en línea.',
    type: 'informatico',
    priority: 'alta',
    status: 'verificada',
    schoolId: 'school-3',
    schoolName: 'Escuela Montessori del Valle',
    location: 'Biblioteca Central',
    createdBy: 'user-4',
    createdByName: 'Ana Rodríguez',
    assignedTo: 'user-6',
    assignedToName: 'Elena Martínez',
    createdAt: new Date(now.getTime() - 7 * dayMs),
    updatedAt: new Date(now.getTime() - 2 * dayMs),
    completedAt: new Date(now.getTime() - 3 * dayMs),
    verifiedAt: new Date(now.getTime() - 2 * dayMs),
    comments: [
      {
        id: 'comment-3',
        taskId: 'task-5',
        userId: 'user-6',
        userName: 'Elena Martínez',
        content: 'Se reemplazó el router principal y se reconfiguraron los puntos de acceso.',
        createdAt: new Date(now.getTime() - 3 * dayMs),
      },
      {
        id: 'comment-4',
        taskId: 'task-5',
        userId: 'user-4',
        userName: 'Ana Rodríguez',
        content: 'Verificado. La red funciona correctamente. Gracias por la rápida atención.',
        createdAt: new Date(now.getTime() - 2 * dayMs),
      },
    ],
  },
  {
    id: 'task-6',
    title: 'Cambio de grifería en laboratorio',
    description: 'Los grifos del laboratorio de ciencias gotean constantemente. Se requiere cambio de empaques o grifería completa.',
    type: 'fontaneria',
    priority: 'media',
    status: 'cerrada',
    schoolId: 'school-3',
    schoolName: 'Escuela Montessori del Valle',
    location: 'Laboratorio de Ciencias, Edificio B',
    createdBy: 'user-4',
    createdByName: 'Ana Rodríguez',
    assignedTo: 'user-7',
    assignedToName: 'Pedro Sánchez',
    createdAt: new Date(now.getTime() - 10 * dayMs),
    updatedAt: new Date(now.getTime() - 6 * dayMs),
    completedAt: new Date(now.getTime() - 7 * dayMs),
    verifiedAt: new Date(now.getTime() - 6 * dayMs),
    comments: [],
  },
  {
    id: 'task-7',
    title: 'Instalación de enchufes adicionales',
    description: 'Se necesitan 4 enchufes adicionales en el aula de computación para conectar nuevos equipos.',
    type: 'electrico',
    priority: 'media',
    status: 'rechazada',
    schoolId: 'school-1',
    schoolName: 'Colegio San Ignacio',
    location: 'Aula de Computación',
    createdBy: 'user-2',
    createdByName: 'María García',
    assignedTo: 'user-5',
    assignedToName: 'Roberto López',
    createdAt: new Date(now.getTime() - 6 * dayMs),
    updatedAt: new Date(now.getTime() - 4 * dayMs),
    completedAt: new Date(now.getTime() - 5 * dayMs),
    rejectionReason: 'Los enchufes instalados no coinciden con el tipo especificado. Se requiere que sean enchufes con protección infantil.',
    comments: [
      {
        id: 'comment-5',
        taskId: 'task-7',
        userId: 'user-2',
        userName: 'María García',
        content: 'Rechazado: Se necesitan enchufes con protección infantil como se especificó originalmente.',
        createdAt: new Date(now.getTime() - 4 * dayMs),
      },
    ],
  },
  {
    id: 'task-8',
    title: 'Reparación de puerta principal',
    description: 'La puerta principal del edificio no cierra correctamente. El mecanismo de cierre está dañado.',
    type: 'general',
    priority: 'alta',
    status: 'pendiente',
    schoolId: 'school-2',
    schoolName: 'Instituto La Salle',
    location: 'Entrada Principal',
    createdBy: 'user-3',
    createdByName: 'Juan Pérez',
    createdAt: new Date(now.getTime() - 1 * dayMs),
    updatedAt: new Date(now.getTime() - 1 * dayMs),
    comments: [],
  },
  {
    id: 'task-9',
    title: 'Mantenimiento de computadoras',
    description: 'Limpieza y actualización de software en 20 computadoras del aula de informática.',
    type: 'informatico',
    priority: 'baja',
    status: 'en_progreso',
    schoolId: 'school-1',
    schoolName: 'Colegio San Ignacio',
    location: 'Aula de Informática',
    createdBy: 'user-2',
    createdByName: 'María García',
    assignedTo: 'user-6',
    assignedToName: 'Elena Martínez',
    createdAt: new Date(now.getTime() - 4 * dayMs),
    updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
    comments: [
      {
        id: 'comment-6',
        taskId: 'task-9',
        userId: 'user-6',
        userName: 'Elena Martínez',
        content: 'Avance: 12 de 20 computadoras completadas.',
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: 'task-10',
    title: 'Revisión de sistema contra incendios',
    description: 'Inspección y prueba del sistema de alarmas y extintores en todo el edificio.',
    type: 'general',
    priority: 'urgente',
    status: 'completada',
    schoolId: 'school-3',
    schoolName: 'Escuela Montessori del Valle',
    location: 'Todo el Campus',
    createdBy: 'user-4',
    createdByName: 'Ana Rodríguez',
    assignedTo: 'user-5',
    assignedToName: 'Roberto López',
    createdAt: new Date(now.getTime() - 8 * dayMs),
    updatedAt: new Date(now.getTime() - 5 * dayMs),
    completedAt: new Date(now.getTime() - 5 * dayMs),
    comments: [
      {
        id: 'comment-7',
        taskId: 'task-10',
        userId: 'user-5',
        userName: 'Roberto López',
        content: 'Revisión completada. Se reemplazaron 3 extintores vencidos y se reparó la alarma del piso 2.',
        createdAt: new Date(now.getTime() - 5 * dayMs),
      },
    ],
  },
]

// Calendar Events
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: 'event-1',
    title: 'Reunión de Directores',
    description: 'Revisión de presupuesto trimestral para mantenimiento',
    type: 'reunion',
    date: new Date(now.getTime() + 2 * dayMs),
    endDate: new Date(now.getTime() + 2 * dayMs + 2 * 60 * 60 * 1000),
    attendees: ['user-1', 'user-2', 'user-3', 'user-4'],
  },
  {
    id: 'event-2',
    title: 'Mantenimiento Preventivo - Aires Acondicionados',
    description: 'Revisión bimensual de sistemas de climatización',
    type: 'mantenimiento',
    date: new Date(now.getTime() + 5 * dayMs),
    schoolId: 'school-1',
  },
  {
    id: 'event-3',
    title: 'Reporte Mensual',
    description: 'Entrega de reporte de tareas completadas',
    type: 'reporte',
    date: new Date(now.getTime() + 10 * dayMs),
  },
  {
    id: 'event-4',
    title: 'Inspección de Seguridad',
    description: 'Inspección general de instalaciones',
    type: 'mantenimiento',
    date: new Date(now.getTime() + 7 * dayMs),
    schoolId: 'school-2',
  },
  {
    id: 'event-5',
    title: 'Reunión con Proveedor de Equipos',
    description: 'Revisión de cotización para nuevos proyectores',
    type: 'reunion',
    date: new Date(now.getTime() + 3 * dayMs),
    attendees: ['user-1', 'user-8'],
  },
]

// Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Nueva tarea urgente',
    message: 'Fuga de agua en baños del segundo piso - Colegio San Ignacio',
    type: 'tarea_creada',
    read: false,
    createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
    taskId: 'task-2',
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    title: 'Tarea completada',
    message: 'Revisión de sistema contra incendios finalizada',
    type: 'tarea_completada',
    read: false,
    createdAt: new Date(now.getTime() - 5 * dayMs),
    taskId: 'task-10',
  },
  {
    id: 'notif-3',
    userId: 'user-5',
    title: 'Nueva tarea asignada',
    message: 'Revisión de aires acondicionados - Instituto La Salle',
    type: 'tarea_asignada',
    read: true,
    createdAt: new Date(now.getTime() - 2 * dayMs),
    taskId: 'task-4',
  },
  {
    id: 'notif-4',
    userId: 'user-2',
    title: 'Tarea verificada',
    message: 'Problema con red WiFi en biblioteca marcada como verificada',
    type: 'tarea_verificada',
    read: true,
    createdAt: new Date(now.getTime() - 2 * dayMs),
    taskId: 'task-5',
  },
  {
    id: 'notif-5',
    userId: 'user-1',
    title: 'Reunión programada',
    message: 'Reunión de Directores en 2 días',
    type: 'reunion',
    read: false,
    createdAt: new Date(now.getTime() - 1 * dayMs),
  },
]

// Helper function to get tasks by school
export function getTasksBySchool(schoolId: string): Task[] {
  return mockTasks.filter((task) => task.schoolId === schoolId)
}

// Helper function to get tasks by assignee
export function getTasksByAssignee(userId: string): Task[] {
  return mockTasks.filter((task) => task.assignedTo === userId)
}

// Helper function to get user by ID
export function getUserById(userId: string): User | undefined {
  return mockUsers.find((user) => user.id === userId)
}

// Helper function to get school by ID
export function getSchoolById(schoolId: string): School | undefined {
  return mockSchools.find((school) => school.id === schoolId)
}

// Helper function to get notifications by user
export function getNotificationsByUser(userId: string): Notification[] {
  return mockNotifications.filter((notif) => notif.userId === userId)
}

// Helper function to get calendar events by user role
export function getCalendarEventsByRole(user: User): CalendarEvent[] {
  if (user.role === 'contralor') {
    return mockCalendarEvents
  }
  if (user.role === 'director') {
    return mockCalendarEvents.filter(
      (event) =>
        event.schoolId === user.schoolId ||
        event.attendees?.includes(user.id) ||
        event.type === 'reporte'
    )
  }
  if (user.role === 'tecnico') {
    return mockCalendarEvents.filter(
      (event) => event.type === 'mantenimiento' || event.attendees?.includes(user.id)
    )
  }
  return mockCalendarEvents
}
