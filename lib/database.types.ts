export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          school_id: string | null
          team_id: string | null
          specialty: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      schools: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          director_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['schools']['Row'], 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['schools']['Insert']>
      }
      teams: {
        Row: {
          id: string
          name: string
          specialty: string
          admin_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['teams']['Row'], 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['teams']['Insert']>
      }
      team_members: {
        Row: { team_id: string; profile_id: string }
        Insert: Database['public']['Tables']['team_members']['Row']
        Update: Partial<Database['public']['Tables']['team_members']['Insert']>
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          type: string
          priority: string
          status: string
          school_id: string
          location: string
          created_by: string
          assigned_to: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
          verified_at: string | null
        }
        Insert: Omit<
          Database['public']['Tables']['tasks']['Row'],
          'created_at' | 'updated_at'
        > & { created_at?: string; updated_at?: string }
        Update: Partial<Database['public']['Tables']['tasks']['Insert']>
      }
      task_comments: {
        Row: {
          id: string
          task_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['task_comments']['Row'], 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['task_comments']['Insert']>
      }
      task_attachments: {
        Row: {
          id: string
          task_id: string
          comment_id: string | null
          file_url: string
          file_name: string
          uploaded_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['task_attachments']['Row'], 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['task_attachments']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          read: boolean
          task_id: string | null
          link: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      calendar_events: {
        Row: {
          id: string
          title: string
          description: string | null
          type: string
          date: string
          end_date: string | null
          school_id: string | null
          task_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['calendar_events']['Row'], 'created_at'> & {
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['calendar_events']['Insert']>
      }
      calendar_event_attendees: {
        Row: { event_id: string; profile_id: string }
        Insert: Database['public']['Tables']['calendar_event_attendees']['Row']
        Update: Partial<Database['public']['Tables']['calendar_event_attendees']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type DbProfile = Database['public']['Tables']['profiles']['Row']
export type DbTask = Database['public']['Tables']['tasks']['Row']
export type DbTaskComment = Database['public']['Tables']['task_comments']['Row']
export type DbSchool = Database['public']['Tables']['schools']['Row']
export type DbTeam = Database['public']['Tables']['teams']['Row']
export type DbNotification = Database['public']['Tables']['notifications']['Row']
export type DbCalendarEvent = Database['public']['Tables']['calendar_events']['Row']
