import { NextResponse } from 'next/server'
import { DEMO_USER_COOKIE } from '@/lib/demo-session'

export async function POST(request: Request) {
  const body = await request.json()
  const userId = body?.userId as string | undefined

  if (!userId) {
    return NextResponse.json({ error: 'userId requerido' }, { status: 400 })
  }

  const response = NextResponse.json({ ok: true, userId })
  response.cookies.set(DEMO_USER_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(DEMO_USER_COOKIE)
  return response
}
