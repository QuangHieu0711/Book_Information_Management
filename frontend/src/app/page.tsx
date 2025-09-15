import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Page() {
  const cookieStore = await cookies(); 
  const token = cookieStore.get('authToken');
  if (token) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
  return null;
}
