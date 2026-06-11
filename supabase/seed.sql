-- Datos iniciales (migrados desde lib/mock-data.ts)
-- Ejecutar DESPUÉS de la migración inicial

-- Colegios
INSERT INTO schools (id, name, address, city) VALUES
  ('school-1', 'Colegio San Ignacio', 'Av. Principal 123', 'Ciudad de México'),
  ('school-2', 'Instituto La Salle', 'Calle Reforma 456', 'Guadalajara'),
  ('school-3', 'Escuela Montessori del Valle', 'Blvd. de la Luz 789', 'Monterrey')
ON CONFLICT (id) DO NOTHING;

-- Equipos
INSERT INTO teams (id, name, specialty) VALUES
  ('team-1', 'Equipo Eléctrico', 'electrico'),
  ('team-2', 'Equipo Informático', 'informatico'),
  ('team-3', 'Equipo de Fontanería', 'fontaneria')
ON CONFLICT (id) DO NOTHING;

-- Perfiles
INSERT INTO profiles (id, name, email, role, school_id, team_id, specialty) VALUES
  ('user-1', 'Carlos Mendoza', 'carlos.mendoza@colegios.com', 'contralor', NULL, NULL, NULL),
  ('user-2', 'María García', 'maria.garcia@sanignacio.edu', 'director', 'school-1', NULL, NULL),
  ('user-3', 'Juan Pérez', 'juan.perez@lasalle.edu', 'director', 'school-2', NULL, NULL),
  ('user-4', 'Ana Rodríguez', 'ana.rodriguez@montessori.edu', 'director', 'school-3', NULL, NULL),
  ('user-5', 'Roberto López', 'roberto.lopez@colegios.com', 'tecnico', NULL, 'team-1', 'electrico'),
  ('user-6', 'Elena Martínez', 'elena.martinez@colegios.com', 'tecnico', NULL, 'team-2', 'informatico'),
  ('user-7', 'Pedro Sánchez', 'pedro.sanchez@colegios.com', 'tecnico', NULL, 'team-3', 'fontaneria'),
  ('user-8', 'Luis Hernández', 'luis.hernandez@colegios.com', 'admin_equipo', NULL, 'team-1', NULL)
ON CONFLICT (id) DO NOTHING;

UPDATE schools SET director_id = 'user-2' WHERE id = 'school-1';
UPDATE schools SET director_id = 'user-3' WHERE id = 'school-2';
UPDATE schools SET director_id = 'user-4' WHERE id = 'school-3';
UPDATE teams SET admin_id = 'user-8' WHERE id = 'team-1';

INSERT INTO team_members (team_id, profile_id) VALUES
  ('team-1', 'user-5'),
  ('team-2', 'user-6'),
  ('team-3', 'user-7')
ON CONFLICT DO NOTHING;

-- Tareas (timestamps relativos a now())
INSERT INTO tasks (id, title, description, type, priority, status, school_id, location, created_by, assigned_to, created_at, updated_at, completed_at, verified_at, rejection_reason) VALUES
  ('task-1', 'Reparación de luces en aula 101', 'Las luces del aula 101 parpadean constantemente y una de ellas no enciende.', 'electrico', 'alta', 'en_progreso', 'school-1', 'Aula 101, Edificio Principal', 'user-2', 'user-5', now() - interval '2 days', now() - interval '1 day', NULL, NULL, NULL),
  ('task-2', 'Fuga de agua en baños del segundo piso', 'Se detectó una fuga de agua en los baños de hombres del segundo piso.', 'fontaneria', 'urgente', 'pendiente', 'school-1', 'Baños 2do Piso, Edificio A', 'user-2', NULL, now() - interval '4 hours', now() - interval '4 hours', NULL, NULL, NULL),
  ('task-3', 'Instalación de proyector en sala de conferencias', 'Se necesita instalar un nuevo proyector en la sala de conferencias.', 'informatico', 'media', 'completada', 'school-2', 'Sala de Conferencias', 'user-3', 'user-6', now() - interval '5 days', now() - interval '1 day', now() - interval '1 day', NULL, NULL),
  ('task-4', 'Revisión de aires acondicionados', 'Mantenimiento preventivo de los aires acondicionados.', 'climatizacion', 'baja', 'asignada', 'school-2', 'Aulas 1-5, Primer Piso', 'user-3', 'user-5', now() - interval '3 days', now() - interval '2 days', NULL, NULL, NULL),
  ('task-5', 'Problema con red WiFi en biblioteca', 'La red WiFi de la biblioteca presenta conexión intermitente.', 'informatico', 'alta', 'verificada', 'school-3', 'Biblioteca Central', 'user-4', 'user-6', now() - interval '7 days', now() - interval '2 days', now() - interval '3 days', now() - interval '2 days', NULL),
  ('task-6', 'Cambio de grifería en laboratorio', 'Los grifos del laboratorio de ciencias gotean constantemente.', 'fontaneria', 'media', 'cerrada', 'school-3', 'Laboratorio de Ciencias', 'user-4', 'user-7', now() - interval '10 days', now() - interval '6 days', now() - interval '7 days', now() - interval '6 days', NULL),
  ('task-7', 'Instalación de enchufes adicionales', 'Se necesitan 4 enchufes adicionales en el aula de computación.', 'electrico', 'media', 'rechazada', 'school-1', 'Aula de Computación', 'user-2', 'user-5', now() - interval '6 days', now() - interval '4 days', now() - interval '5 days', NULL, 'Los enchufes instalados no coinciden con el tipo especificado.'),
  ('task-8', 'Reparación de puerta principal', 'La puerta principal del edificio no cierra correctamente.', 'general', 'alta', 'pendiente', 'school-2', 'Entrada Principal', 'user-3', NULL, now() - interval '1 day', now() - interval '1 day', NULL, NULL, NULL),
  ('task-9', 'Mantenimiento de computadoras', 'Limpieza y actualización de software en 20 computadoras.', 'informatico', 'baja', 'en_progreso', 'school-1', 'Aula de Informática', 'user-2', 'user-6', now() - interval '4 days', now() - interval '12 hours', NULL, NULL, NULL),
  ('task-10', 'Revisión de sistema contra incendios', 'Inspección y prueba del sistema de alarmas y extintores.', 'general', 'urgente', 'completada', 'school-3', 'Todo el Campus', 'user-4', 'user-5', now() - interval '8 days', now() - interval '5 days', now() - interval '5 days', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO task_comments (id, task_id, user_id, content, created_at) VALUES
  ('comment-1', 'task-1', 'user-5', 'Revisando el sistema eléctrico, encontré un cable suelto. Procedo a reparar.', now() - interval '1 day'),
  ('comment-2', 'task-3', 'user-6', 'Proyector instalado y configurado. Sistema de audio funcionando correctamente.', now() - interval '1 day'),
  ('comment-3', 'task-5', 'user-6', 'Se reemplazó el router principal y se reconfiguraron los puntos de acceso.', now() - interval '3 days'),
  ('comment-4', 'task-5', 'user-4', 'Verificado. La red funciona correctamente. Gracias por la rápida atención.', now() - interval '2 days'),
  ('comment-5', 'task-7', 'user-2', 'Rechazado: Se necesitan enchufes con protección infantil como se especificó originalmente.', now() - interval '4 days'),
  ('comment-6', 'task-9', 'user-6', 'Avance: 12 de 20 computadoras completadas.', now() - interval '12 hours'),
  ('comment-7', 'task-10', 'user-5', 'Revisión completada. Se reemplazaron 3 extintores vencidos.', now() - interval '5 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO notifications (id, user_id, title, message, type, read, task_id, created_at) VALUES
  ('notif-1', 'user-1', 'Nueva tarea urgente', 'Fuga de agua en baños del segundo piso - Colegio San Ignacio', 'tarea_creada', false, 'task-2', now() - interval '4 hours'),
  ('notif-2', 'user-1', 'Tarea completada', 'Revisión de sistema contra incendios finalizada', 'tarea_completada', false, 'task-10', now() - interval '5 days'),
  ('notif-3', 'user-5', 'Nueva tarea asignada', 'Revisión de aires acondicionados - Instituto La Salle', 'tarea_asignada', true, 'task-4', now() - interval '2 days'),
  ('notif-4', 'user-2', 'Tarea verificada', 'Problema con red WiFi en biblioteca marcada como verificada', 'tarea_verificada', true, 'task-5', now() - interval '2 days'),
  ('notif-5', 'user-1', 'Reunión programada', 'Reunión de Directores en 2 días', 'reunion', false, NULL, now() - interval '1 day')
ON CONFLICT (id) DO NOTHING;

INSERT INTO calendar_events (id, title, description, type, date, end_date, school_id) VALUES
  ('event-1', 'Reunión de Directores', 'Revisión de presupuesto trimestral', 'reunion', now() + interval '2 days', now() + interval '2 days 2 hours', NULL),
  ('event-2', 'Mantenimiento Preventivo - Aires Acondicionados', 'Revisión bimensual', 'mantenimiento', now() + interval '5 days', NULL, 'school-1'),
  ('event-3', 'Reporte Mensual', 'Entrega de reporte de tareas completadas', 'reporte', now() + interval '10 days', NULL, NULL),
  ('event-4', 'Inspección de Seguridad', 'Inspección general de instalaciones', 'mantenimiento', now() + interval '7 days', NULL, 'school-2'),
  ('event-5', 'Reunión con Proveedor de Equipos', 'Revisión de cotización para nuevos proyectores', 'reunion', now() + interval '3 days', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO calendar_event_attendees (event_id, profile_id) VALUES
  ('event-1', 'user-1'), ('event-1', 'user-2'), ('event-1', 'user-3'), ('event-1', 'user-4'),
  ('event-5', 'user-1'), ('event-5', 'user-8')
ON CONFLICT DO NOTHING;
