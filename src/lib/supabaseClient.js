import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Faltan las variables de entorno VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. " +
      "Crea un archivo .env.local (desarrollo) o configura las variables en Vercel (producción)."
  );
}

const REMEMBER_KEY = "ff_remember_me";

// Controla si la sesión se guarda en localStorage (persiste tras cerrar el navegador, checkbox
// "Recordarme" activado) o en sessionStorage (se borra al cerrar la pestaña). Debe llamarse
// justo antes de iniciar sesión, ya que el cliente de Supabase se crea una sola vez.
export const setSessionPersistence = (recordar) => {
  try {
    localStorage.setItem(REMEMBER_KEY, recordar ? "1" : "0");
  } catch {
    // almacenamiento no disponible; se ignora
  }
};

const dynamicStorage = {
  getItem: (key) => {
    try {
      const recordar = localStorage.getItem(REMEMBER_KEY) !== "0";
      return (recordar ? localStorage : sessionStorage).getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      const recordar = localStorage.getItem(REMEMBER_KEY) !== "0";
      (recordar ? localStorage : sessionStorage).setItem(key, value);
    } catch {
      // almacenamiento no disponible; se ignora
    }
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {
      // almacenamiento no disponible; se ignora
    }
  },
};

// Cliente único de Supabase para toda la app (Auth + Postgres + Realtime).
// La clave usada aquí es la "anon public" / "publishable" — segura para el navegador,
// ya que el acceso real a los datos se controla con Row Level Security (RLS) en Postgres.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: dynamicStorage,
  },
});
