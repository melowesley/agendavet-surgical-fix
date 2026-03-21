// middleware.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/aprovar', '/api/approve', '/api/resend-approval']

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
    || pathname.startsWith('/_next')
    || pathname.includes('.')
  // NOTE: do NOT add '/api/' generically — only explicit paths above are public
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options: CookieOptions) => {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove: (name, options: CookieOptions) => {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  if (isPublic(pathname)) return response

  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  const meta = session.user.app_metadata as { role?: string; status?: string }
  const role = meta?.role
  const status = meta?.status

  const redirect = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    return NextResponse.redirect(url)
  }

  // Secretário pendente ou rejeitado
  if (role === 'vet' && status === 'pending') return redirect('/login/vet?status=pending')
  if (role === 'vet' && status === 'rejected') return redirect('/login/vet?status=rejected')

  // Proteção cruzada de áreas
  if (pathname.startsWith('/tutor') && role === 'vet') return redirect('/vet/dashboard')
  if (pathname.startsWith('/vet') && role === 'tutor') return redirect('/tutor/dashboard')

  // Usuário sem role (estado inconsistente)
  if (!role) return redirect('/')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
