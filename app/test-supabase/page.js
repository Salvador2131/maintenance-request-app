'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function TestSupabasePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function runTest() {
      try {
        await supabase.from('pruebas').insert({ nombre: 'Test desde Next.js' });
        const { data: rows, error: selectError } = await supabase
          .from('pruebas')
          .select('*')
          .order('id', { ascending: false })
          .limit(5);
        if (selectError) throw selectError;
        setData(rows);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    runTest();
  }, [supabase]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <h1>✅ Conexión a Supabase exitosa</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}