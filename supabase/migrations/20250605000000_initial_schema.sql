-- MantenPro — esquema inicial
-- Ejecutar en Supabase: SQL Editor o `supabase db push`

-- ─── Tablas base ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS schools (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  address     TEXT NOT NULL,
  city        TEXT NOT NULL,
  director_id TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teams (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  specialty  TEXT NOT NULL CHECK (specialty IN (
    'electrico', 'informatico', 'fontaneria', 'climatizacion', 'general'
  )),
  admin_id   TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profiles (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL UNIQUE,
  role       TEXT NOT NULL CHECK (role IN (
    'contralor', 'director', 'tecnico', 'admin_equipo'
  )),
  school_id  TEXT REFERENCES schools(id) ON DELETE SET NULL,
  team_id    TEXT REFERENCES teams(id) ON DELETE SET NULL,
  specialty  TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE schools
  ADD CONSTRAINT schools_director_id_fkey
  FOREIGN KEY (director_id) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE teams
  ADD CONSTRAINT teams_admin_id_fkey
  FOREIGN KEY (admin_id) REFERENCES profiles(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS team_members (
  team_id    TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (team_id, profile_id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id               TEXT PRIMARY KEY,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL,
  type             TEXT NOT NULL CHECK (type IN (
    'electrico', 'informatico', 'fontaneria', 'climatizacion', 'general'
  )),
  priority         TEXT NOT NULL CHECK (priority IN ('baja', 'media', 'alta', 'urgente')),
  status           TEXT NOT NULL CHECK (status IN (
    'pendiente', 'asignada', 'en_progreso', 'completada', 'verificada', 'rechazada', 'cerrada'
  )),
  school_id        TEXT NOT NULL REFERENCES schools(id) ON DELETE RESTRICT,
  location         TEXT NOT NULL,
  created_by       TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  assigned_to      TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at     TIMESTAMPTZ,
  verified_at      TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS task_comments (
  id         TEXT PRIMARY KEY,
  task_id    TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_attachments (
  id          TEXT PRIMARY KEY,
  task_id     TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  comment_id  TEXT REFERENCES task_comments(id) ON DELETE SET NULL,
  file_url    TEXT NOT NULL,
  file_name   TEXT NOT NULL,
  uploaded_by TEXT REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT NOT NULL CHECK (type IN (
    'tarea_creada', 'tarea_asignada', 'tarea_completada',
    'tarea_verificada', 'tarea_rechazada', 'reunion'
  )),
  read       BOOLEAN NOT NULL DEFAULT false,
  task_id    TEXT REFERENCES tasks(id) ON DELETE SET NULL,
  link       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  type        TEXT NOT NULL CHECK (type IN ('tarea', 'reunion', 'mantenimiento', 'reporte')),
  date        TIMESTAMPTZ NOT NULL,
  end_date    TIMESTAMPTZ,
  school_id   TEXT REFERENCES schools(id) ON DELETE SET NULL,
  task_id     TEXT REFERENCES tasks(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calendar_event_attendees (
  event_id   TEXT NOT NULL REFERENCES calendar_events(id) ON DELETE CASCADE,
  profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, profile_id)
);

-- ─── Índices ───────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_tasks_school_id ON tasks(school_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- ─── updated_at automático ─────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tasks_updated_at ON tasks;
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── RLS (políticas abiertas hasta implementar auth) ───────────────────────
-- TODO: reemplazar con políticas por rol cuando exista Supabase Auth

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_event_attendees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "demo_read_schools" ON schools FOR SELECT USING (true);
CREATE POLICY "demo_read_teams" ON teams FOR SELECT USING (true);
CREATE POLICY "demo_read_profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "demo_read_team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "demo_read_tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "demo_read_comments" ON task_comments FOR SELECT USING (true);
CREATE POLICY "demo_read_attachments" ON task_attachments FOR SELECT USING (true);
CREATE POLICY "demo_read_notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "demo_read_events" ON calendar_events FOR SELECT USING (true);
CREATE POLICY "demo_read_attendees" ON calendar_event_attendees FOR SELECT USING (true);

CREATE POLICY "demo_write_tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "demo_write_comments" ON task_comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "demo_write_notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket para adjuntos (ejecutar también en Storage del dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('task-attachments', 'task-attachments', false);
