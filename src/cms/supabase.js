import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://npqfnzuyglgrzsetrbdo.supabase.co';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_KEY || '';

export const supabaseUrl = rawUrl.trim().replace(/^["']|["']$/g, '');
export const supabaseAnonKey = rawKey.trim().replace(/^["']|["']$/g, '');

// Validate if real Supabase credentials are provided
export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-supabase-anon-key') &&
    !supabaseAnonKey.includes('your-supabase-public-anon-key-here') &&
    supabaseAnonKey.length > 5
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Storage Helper to upload files to Supabase Storage bucket
export async function uploadToSupabaseStorage(bucketName, path, file) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}

// Storage Helper to delete files from Supabase Storage bucket
export async function deleteFromSupabaseStorage(bucketName, path) {
  if (!isSupabaseConfigured() || !supabase) return;
  await supabase.storage.from(bucketName).remove([path]);
}
