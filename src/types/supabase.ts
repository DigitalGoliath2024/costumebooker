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
          created_at: string
          display_name: string
          bio: string
          state: string
          city: string
          price_min: number | null
          price_max: number | null
          facebook: string | null
          instagram: string | null
          tiktok: string | null
          twitter: string | null
          is_active: boolean
          payment_status: 'unpaid' | 'paid' | 'expired'
          payment_expiry: string | null
          travel_radius: 'local_only' | 'short_distance' | 'medium_distance' | 'long_distance' | 'nationwide'
          available_for_travel: boolean
          available_virtual: boolean
          require_travel_expenses: boolean
          require_deposit: boolean
          bring_own_costume: boolean
          perform_outdoors: boolean
          require_dressing_room: boolean
          family_friendly_only: boolean
          adult_themes_ok: boolean
          group_performer: boolean
          background_check: boolean
        }
        Insert: {
          id: string
          created_at?: string
          display_name: string
          bio: string
          state: string
          city: string
          price_min?: number | null
          price_max?: number | null
          facebook?: string | null
          instagram?: string | null
          tiktok?: string | null
          twitter?: string | null
          is_active?: boolean
          payment_status?: 'unpaid' | 'paid' | 'expired'
          payment_expiry?: string | null
          travel_radius?: 'local_only' | 'short_distance' | 'medium_distance' | 'long_distance' | 'nationwide'
          available_for_travel?: boolean
          available_virtual?: boolean
          require_travel_expenses?: boolean
          require_deposit?: boolean
          bring_own_costume?: boolean
          perform_outdoors?: boolean
          require_dressing_room?: boolean
          family_friendly_only?: boolean
          adult_themes_ok?: boolean
          group_performer?: boolean
          background_check?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          display_name?: string
          bio?: string
          state?: string
          city?: string
          price_min?: number | null
          price_max?: number | null
          facebook?: string | null
          instagram?: string | null
          tiktok?: string | null
          twitter?: string | null
          is_active?: boolean
          payment_status?: 'unpaid' | 'paid' | 'expired'
          payment_expiry?: string | null
          travel_radius?: 'local_only' | 'short_distance' | 'medium_distance' | 'long_distance' | 'nationwide'
          available_for_travel?: boolean
          available_virtual?: boolean
          require_travel_expenses?: boolean
          require_deposit?: boolean
          bring_own_costume?: boolean
          perform_outdoors?: boolean
          require_dressing_room?: boolean
          family_friendly_only?: boolean
          adult_themes_ok?: boolean
          group_performer?: boolean
          background_check?: boolean
        }
      }
      // ... other tables
    }
  }
}