import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function Home() {
  const role = (await cookies()).get('role')?.value

  if (role === 'admin') redirect('/dashboard')
  if (role === 'user') redirect('/concerts')
  redirect('/login')
}
