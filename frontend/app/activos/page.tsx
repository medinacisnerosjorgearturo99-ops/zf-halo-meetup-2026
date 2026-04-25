import { ActivosClient } from './ActivosClient';

async function getActivos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activos`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Falló la conexión al traer los activos');
  return res.json();
}

export default async function ActivosPage() {
  const activos = await getActivos();
  return <ActivosClient activos={activos} />;
}