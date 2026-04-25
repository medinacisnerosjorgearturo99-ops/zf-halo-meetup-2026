import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Roles
  const roles = ['Usuario', 'Gerente', 'Administrador patrimonial', 'Auditor', 'Guardia'];
  for (const nombre of roles) {
    await prisma.rol.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }
  console.log('✅ Roles creados');

  // Usuarios por rol
  const usuarios = [
    { nombre: 'Jorge Arturo', email: 'admin@zfhalo.com', password: 'admin', rol: 'Administrador patrimonial' },
    { nombre: 'Angel Emanuel',    email: 'gerente@zfhalo.com', password: 'gerente', rol: 'Gerente' },
    { nombre: 'Sebastian Resendiz',    email: 'auditor@zfhalo.com', password: 'auditor', rol: 'Auditor' },
    { nombre: 'Uriel Ramirez',    email: 'usuario@zfhalo.com', password: 'user', rol: 'Usuario' },
    { nombre: 'Jose Hernandez',    email: 'guardia@zfhalo.com', password: 'guardia', rol: 'Guardia' },
  ];

  for (const u of usuarios) {
    const existe = await prisma.usuario.findUnique({ where: { email: u.email } });
    if (!existe) {
      const rol = await prisma.rol.findUnique({ where: { nombre: u.rol } });
      await prisma.usuario.create({
        data: { nombre: u.nombre, email: u.email, password: u.password, rol_id: rol!.id },
      });
    }
  }
  console.log('✅ Usuarios creados');

  // Catálogos básicos
  const categorias = ['Línea de producción', 'Refacciones', 'Por definir', 'Equipo de cómputo', 'Maq. Propia', 'Laboratorio', 'Equipo de distribución', 'Moldes', 'Sistemas', 'Vehículo de transporte'];
  for (const nombre of categorias) {
    await prisma.categoria.upsert({ where: { nombre }, update: {}, create: { nombre } });
  }
  console.log('✅ Categorías creadas');

  const marcas = ['Vector Labs', 'OmniTech', 'Nova Instruments', 'GammaTech', 'Epsilon Systems', 'Delta Instruments', 'BetaWorks', 'AlfaLabs'];
  for (const nombre of marcas) {
    await prisma.marca.upsert({ where: { nombre }, update: {}, create: { nombre } });
  }
  console.log('✅ Marcas creadas');

  const proyectos = ['Proyecto Validación SIL', 'Proyecto Validación HIL', 'Proyecto Sensing 2026', 'Proyecto Pilot Gen2', 'Proyecto Percepción', 'Proyecto Park Assist', 'Proyecto L2+', 'Proyecto Fusión', 'Proyecto Data Pipeline', 'Proyecto Control'];
  for (const nombre of proyectos) {
    await prisma.proyecto.upsert({ where: { nombre }, update: {}, create: { nombre } });
  }
  console.log('✅ Proyectos creados');

  // ─── UBICACIONES ─────────────────────────────────────────
  const ubicacionesData = [
    { area: 'Validación HIL',       subarea: 'A0001', ubicacion_fisica: 'Validación HIL - A0001' },
    { area: 'Validación HIL',       subarea: 'A0002', ubicacion_fisica: 'Validación HIL - A0002' },
    { area: 'Prototipado mecánico', subarea: 'A0001', ubicacion_fisica: 'Prototipado mecánico - A0001' },
    { area: 'Lab Radar',            subarea: 'A0001', ubicacion_fisica: 'Lab Radar - A0001' },
    { area: 'Data Engineering',     subarea: 'A0001', ubicacion_fisica: 'Data Engineering - A0001' },
    { area: 'Data Engineering',     subarea: 'A0002', ubicacion_fisica: 'Data Engineering - A0002' },
    { area: 'Integración',          subarea: 'A0001', ubicacion_fisica: 'Integración - A0001' },
    { area: 'Integración',          subarea: 'A0002', ubicacion_fisica: 'Integración - A0002' },
    { area: 'Integración',          subarea: 'A0003', ubicacion_fisica: 'Integración - A0003' },
    { area: 'Percepción',           subarea: 'A0001', ubicacion_fisica: 'Percepción - A0001' },
  ];
  for (const u of ubicacionesData) {
    const existe = await prisma.ubicacion.findFirst({ where: { area: u.area, subarea: u.subarea } });
    if (!existe) await prisma.ubicacion.create({ data: u });
  }
  console.log('✅ Ubicaciones creadas');

   // ─── HELPER para buscar IDs ───────────────────────────────
  const cat  = async (n: string) => (await prisma.categoria.findUnique({ where: { nombre: n } }))!.id;
  const mar  = async (n: string) => (await prisma.marca.findUnique({ where: { nombre: n } }))!.id;
  const pro  = async (n: string) => (await prisma.proyecto.findUnique({ where: { nombre: n } }))!.id;
  const ubi  = async (area: string, subarea: string) =>
    (await prisma.ubicacion.findFirst({ where: { area, subarea } }))!.id;
  const fecha = (str: string) => {
    const [d, m, y] = str.split('-');
    return new Date(`${y}-${m}-${d}`);
  };

  // ─── ACTIVOS ─────────────────────────────────────────────
  const activos = [
    {
      identificador: '100001', qr_code_hash: 'hash-100001',
      nombre_maquina: 'EQP-ADAS-0001', tag: 'MNR-ADAS-00001', numero_serie: 'SN41116573584',
      modelo: 'Serie X300', marca_id: await mar('BetaWorks'), anio: 2026,
      pedimento: '11 75 6912 0533224', factura: '98922225902',
      fecha_compra: fecha('23-03-2024'), descripcion: 'Banco de pruebas de integración',
      tipo_compra: 'Importación', tipo_nacional: 'Definitiva', estado: 'impairment', compra: 'SI',
      categoria_id: await cat('Línea de producción'), ubicacion_id: await ubi('Validación HIL', 'A0001'),
      proyecto_id: await pro('Proyecto Validación SIL'),
    },
    {
      identificador: '100002', qr_code_hash: 'hash-100002',
      nombre_maquina: 'EQP-ADAS-0002', tag: 'MNR-ADAS-00002', numero_serie: 'SN46890615212',
      modelo: 'Serie X100', marca_id: await mar('GammaTech'), anio: 2024,
      pedimento: '43 35 2547 3612365', factura: '841639821539',
      fecha_compra: fecha('20-11-2024'), descripcion: 'Cámara 4K para percepción visual',
      tipo_compra: 'Importación', tipo_nacional: 'Temporal', estado: 'Dada de baja', compra: 'SI',
      categoria_id: await cat('Refacciones'), ubicacion_id: await ubi('Prototipado mecánico', 'A0001'),
      proyecto_id: await pro('Proyecto Pilot Gen2'),
    },
    {
      identificador: '100003', qr_code_hash: 'hash-100003',
      nombre_maquina: 'EQP-ADAS-0003', tag: 'MNR-ADAS-00003', numero_serie: 'SN17761556863',
      modelo: 'DAQ-500', marca_id: await mar('BetaWorks'), anio: 2024,
      pedimento: '10 70 4803 6067228', factura: '212943106111',
      fecha_compra: fecha('23-05-2023'), descripcion: 'Workstation GPU para entrenamiento de modelos',
      tipo_compra: 'Importación', tipo_nacional: 'Temporal', estado: 'Calibración', compra: 'SI',
      categoria_id: await cat('Por definir'), ubicacion_id: await ubi('Lab Radar', 'A0001'),
      proyecto_id: await pro('Proyecto Validación SIL'),
    },
    {
      identificador: '100004', qr_code_hash: 'hash-100004',
      nombre_maquina: 'EQP-ADAS-0004', tag: 'MNR-ADAS-00004', numero_serie: 'SN97846728339',
      modelo: 'Modelo B1', marca_id: await mar('GammaTech'), anio: 2023,
      pedimento: '45 26 4374 1197935', factura: '698410899699',
      fecha_compra: fecha('17-12-2023'), descripcion: 'Montacargas para logística interna',
      tipo_compra: 'Importación', tipo_nacional: 'Propia', estado: 'En tránsito', compra: 'NO',
      categoria_id: await cat('Equipo de cómputo'), ubicacion_id: await ubi('Validación HIL', 'A0002'),
      proyecto_id: await pro('Proyecto Validación SIL'),
    },
    {
      identificador: '100005', qr_code_hash: 'hash-100005',
      nombre_maquina: 'EQP-ADAS-0005', tag: 'MNR-ADAS-00005', numero_serie: 'SN40305022733',
      modelo: 'Serie X100', marca_id: await mar('OmniTech'), anio: 2024,
      pedimento: '34 08 3456 9515702', factura: '789752985454',
      fecha_compra: fecha('06-10-2024'), descripcion: 'LiDAR 64 canales para mapeo',
      tipo_compra: 'Nacional', tipo_nacional: 'Temporal', estado: 'Fuera de servicio', compra: 'NO',
      categoria_id: await cat('Maq. Propia'), ubicacion_id: await ubi('Data Engineering', 'A0001'),
      proyecto_id: await pro('Proyecto Sensing 2026'),
    },
    {
      identificador: '100006', qr_code_hash: 'hash-100006',
      nombre_maquina: 'EQP-ADAS-0006', tag: 'MNR-ADAS-00006', numero_serie: 'SN86214147353',
      modelo: 'CAM-4K', marca_id: await mar('Epsilon Systems'), anio: 2024,
      pedimento: '74 51 5930 3679591', factura: '558949878788',
      fecha_compra: fecha('07-10-2025'), descripcion: 'Radar 77GHz para pruebas de campo',
      tipo_compra: 'Importación', tipo_nacional: 'Propia', estado: 'impairment', compra: 'SI',
      categoria_id: await cat('Laboratorio'), ubicacion_id: await ubi('Data Engineering', 'A0002'),
      proyecto_id: await pro('Proyecto Validación HIL'),
    },
    {
      identificador: '100007', qr_code_hash: 'hash-100007',
      nombre_maquina: 'EQP-ADAS-0007', tag: 'MNR-ADAS-00007', numero_serie: 'SN61812456976',
      modelo: 'HIL-1000', marca_id: await mar('Vector Labs'), anio: 2026,
      pedimento: '32 70 0188 1921859', factura: '973600532631',
      fecha_compra: fecha('04-01-2026'), descripcion: 'Herramental de laboratorio para ensamblaje',
      tipo_compra: 'Nacional', tipo_nacional: 'Propia', estado: 'En tránsito', compra: 'NO',
      categoria_id: await cat('Equipo de distribución'), ubicacion_id: await ubi('Integración', 'A0001'),
      proyecto_id: await pro('Proyecto Data Pipeline'),
    },
    {
      identificador: '100008', qr_code_hash: 'hash-100008',
      nombre_maquina: 'EQP-ADAS-0008', tag: 'MNR-ADAS-00008', numero_serie: 'SN79486780724',
      modelo: 'Serie X200', marca_id: await mar('Epsilon Systems'), anio: 2026,
      pedimento: '77 25 2504 6273233', factura: '179378618081',
      fecha_compra: fecha('09-01-2026'), descripcion: 'Racks de almacenamiento para instrumentación',
      tipo_compra: 'Importación', tipo_nacional: 'Definitiva', estado: 'En aduana', compra: 'NO',
      categoria_id: await cat('Moldes'), ubicacion_id: await ubi('Integración', 'A0002'),
      proyecto_id: await pro('Proyecto Percepción'),
    },
    {
      identificador: '100009', qr_code_hash: 'hash-100009',
      nombre_maquina: 'EQP-ADAS-0009', tag: 'MNR-ADAS-00009', numero_serie: 'SN41385534207',
      modelo: 'Serie X100', marca_id: await mar('Delta Instruments'), anio: 2019,
      pedimento: '10 93 7962 1161193', factura: '837434066816',
      fecha_compra: fecha('26-12-2025'), descripcion: 'Módulo de control eléctrico de pruebas',
      tipo_compra: 'Importación', tipo_nacional: 'Definitiva', estado: 'En evaluación', compra: 'NO',
      categoria_id: await cat('Sistemas'), ubicacion_id: await ubi('Percepción', 'A0001'),
      proyecto_id: await pro('Proyecto Park Assist'),
    },
    {
      identificador: '100010', qr_code_hash: 'hash-100010',
      nombre_maquina: 'EQP-ADAS-0010', tag: 'MNR-ADAS-00010', numero_serie: 'SN95351450010',
      modelo: 'HIL-1000', marca_id: await mar('Delta Instruments'), anio: 2026,
      pedimento: '96 93 3295 5229731', factura: '715859444665',
      fecha_compra: fecha('03-02-2025'), descripcion: 'Molde para prototipado rápido',
      tipo_compra: 'Nacional', tipo_nacional: 'Propia', estado: 'Calibración', compra: 'SI',
      categoria_id: await cat('Vehículo de transporte'), ubicacion_id: await ubi('Integración', 'A0003'),
      proyecto_id: await pro('Proyecto Sensing 2026'),
    },
  ];

  for (const activo of activos) {
    await prisma.activo.upsert({
      where: { identificador: activo.identificador },
      update: {},
      create: activo,
    });
  }
  console.log('✅ Activos creados');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());