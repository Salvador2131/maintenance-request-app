import { createServerClient } from "@supabase/ssr"; 
import { type NextRequest, NextResponse } from "next/server"; 
 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; 
 
export const createClient = (request: NextRequest) =
  let supabaseResponse = NextResponse.next({ request }); 
 
  const supabase = createServerClient( 
    supabaseUrl!, 
    supabaseKey!, 
    { 
      cookies: { 
        getAll() { 
          return request.cookies.getAll() 
        }, 
        setAll(cookiesToSet) { 
          cookiesToSet.forEach(({ name, value, options }) =, value)) 
          supabaseResponse = NextResponse.next({ request }) 
            supabaseResponse.cookies.set(name, value, options) 
          ) 
        }, 
      }, 
    }, 
  ); 
 
  return supabaseResponse 
} 
