import { supabase } from './supabaseClient'

export async function apiFetch(path, options = {}) {
  const result = await supabase.auth.getSession();
  const session = result.data.session;
  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(await res.text());
  console.log(session.access_token);
  return res.json();
}