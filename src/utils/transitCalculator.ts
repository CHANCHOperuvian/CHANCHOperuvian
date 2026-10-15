/**
 * Utilidad para el cálculo de fecha estimada de entrega
 * contabilizando días hábiles de tránsito (excluyendo fines de semana).
 */

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export interface DeliveryCalculation {
  fechaEstimada: Date;
  fechaTextoLargo: string;
  fechaCorta: string;
  diaSemana: string;
  diasTransito: number;
}

export function calcularFechaEntrega(
  diasTransito: number,
  fechaBase: Date = new Date()
): DeliveryCalculation {
  const fecha = new Date(fechaBase);

  // Si son más de las 15:00 hrs en Chile, la orden entra a preparación para el siguiente día hábil
  if (fecha.getHours() >= 15) {
    fecha.setDate(fecha.getDate() + 1);
  }

  let diasAgregados = 0;
  while (diasAgregados < diasTransito) {
    fecha.setDate(fecha.getDate() + 1);
    const dia = fecha.getDay();
    // Excluir Domingo (0) y Sábado (6)
    if (dia !== 0 && dia !== 6) {
      diasAgregados++;
    }
  }

  const diaSemana = DIAS_SEMANA[fecha.getDay()];
  const diaMes = fecha.getDate();
  const mesNombre = MESES[fecha.getMonth()];
  const anio = fecha.getFullYear();

  const diaPad = String(diaMes).padStart(2, '0');
  const mesPad = String(fecha.getMonth() + 1).padStart(2, '0');

  return {
    fechaEstimada: fecha,
    fechaTextoLargo: `${diaSemana} ${diaMes} de ${mesNombre} de ${anio}`,
    fechaCorta: `${diaPad}/${mesPad}/${anio}`,
    diaSemana,
    diasTransito
  };
}

/**
 * Cálculo de fecha estimada de entrega para Paraguay teniendo en cuenta
 * los días permitidos de reparto (ej: 'Martes y Jueves', 'SOLO MARTES', 'LUNES A VIERNES').
 */
export function calcularFechaEntregaParaguay(
  diasTransito: number,
  diasEntregaTexto: string = 'LUNES A VIERNES',
  fechaBase: Date = new Date()
): DeliveryCalculation {
  const fecha = new Date(fechaBase);

  // Si son pasadas las 15:00, entra al siguiente ciclo
  if (fecha.getHours() >= 15) {
    fecha.setDate(fecha.getDate() + 1);
  }

  // Normalizar días permitidos
  const lower = (diasEntregaTexto || '').toLowerCase();
  const diasPermitidos: number[] = []; // 1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes

  if (lower.includes('lunes a viernes')) {
    diasPermitidos.push(1, 2, 3, 4, 5);
  } else {
    if (lower.includes('lunes')) diasPermitidos.push(1);
    if (lower.includes('martes')) diasPermitidos.push(2);
    if (lower.includes('miercoles') || lower.includes('miércoles')) diasPermitidos.push(3);
    if (lower.includes('jueves')) diasPermitidos.push(4);
    if (lower.includes('viernes')) diasPermitidos.push(5);
  }

  if (diasPermitidos.length === 0) {
    diasPermitidos.push(1, 2, 3, 4, 5);
  }

  // Avanzar al menos días de tránsito (o 1 día de preparación)
  let agregados = 0;
  const minTransito = Math.max(1, diasTransito || 2);
  while (agregados < minTransito) {
    fecha.setDate(fecha.getDate() + 1);
    const d = fecha.getDay();
    if (d !== 0 && d !== 6) {
      agregados++;
    }
  }

  // Buscar el siguiente día que coincida con los días de entrega
  let intentos = 0;
  while (!diasPermitidos.includes(fecha.getDay()) && intentos < 14) {
    fecha.setDate(fecha.getDate() + 1);
    intentos++;
  }

  const diaSemana = DIAS_SEMANA[fecha.getDay()];
  const diaMes = fecha.getDate();
  const mesNombre = MESES[fecha.getMonth()];
  const anio = fecha.getFullYear();

  const diaPad = String(diaMes).padStart(2, '0');
  const mesPad = String(fecha.getMonth() + 1).padStart(2, '0');

  return {
    fechaEstimada: fecha,
    fechaTextoLargo: `${diaSemana} ${diaMes} de ${mesNombre} de ${anio}`,
    fechaCorta: `${diaPad}/${mesPad}/${anio}`,
    diaSemana,
    diasTransito
  };
}

