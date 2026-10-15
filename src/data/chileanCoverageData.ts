import { ZoneDeliveryRecord, ProductInfo, OperatorProfile } from '../types/coverage';
import { calcularFechaEntrega } from '../utils/transitCalculator';

export const CHILE_PRODUCTS: ProductInfo[] = [
  {
    id: 'PROD-DUSTON',
    nombre: 'Duston Gel (Chile)',
    precioCLP: 38990,
    precio: 38990,
    precioTexto: '$38.990 CLP',
    moneda: 'CLP',
    simboloMoneda: '$',
    categoria: 'Salud y Articulaciones / Gel Tópico',
    campanaDefault: 'CHILE',
    promociones: [
      { cantidad: 1, precioTotalCLP: 38990, precioTotal: 38990, precioTotalTexto: '$38.990 CLP', ahorro: 'Precio Regular (Envío Gratis)' },
      { cantidad: 2, precioTotalCLP: 64990, precioTotal: 64990, precioTotalTexto: '$64.990 CLP', ahorro: 'Ahorro $12.990 CLP (Promoción 2x)' },
      { cantidad: 3, precioTotalCLP: 84990, precioTotal: 84990, precioTotalTexto: '$84.990 CLP', ahorro: 'Ahorro $31.980 CLP (Tratamiento Completo 3x)' }
    ]
  },
  {
    id: 'PROD-FLEXIGO',
    nombre: 'FlexiGo (CL) WM 20336',
    precioCLP: 38990,
    precio: 38990,
    precioTexto: '$38.990 CLP',
    moneda: 'CLP',
    simboloMoneda: '$',
    categoria: 'Movilidad y Alivio Muscular',
    campanaDefault: 'CHILE',
    promociones: [
      { cantidad: 1, precioTotalCLP: 38990, precioTotal: 38990, precioTotalTexto: '$38.990 CLP', ahorro: 'Envío Gratis a Todo Chile' },
      { cantidad: 2, precioTotalCLP: 64990, precioTotal: 64990, precioTotalTexto: '$64.990 CLP', ahorro: 'Paga 2 con Descuento Especial' },
      { cantidad: 3, precioTotalCLP: 84990, precioTotal: 84990, precioTotalTexto: '$84.990 CLP', ahorro: 'Paga 2 y Lleva 3 (Mejor Valor)' }
    ]
  },
  {
    id: 'PROD-GLOWY',
    nombre: 'Glowy Care (CL)',
    precioCLP: 40990,
    precio: 40990,
    precioTexto: '$40.990 CLP',
    moneda: 'CLP',
    simboloMoneda: '$',
    categoria: 'Cuidado Facial y Rejuvenecimiento',
    campanaDefault: 'CHILE',
    promociones: [
      { cantidad: 1, precioTotalCLP: 40990, precioTotal: 40990, precioTotalTexto: '$40.990 CLP', ahorro: 'Envío Gratis a Domicilio' },
      { cantidad: 2, precioTotalCLP: 69990, precioTotal: 69990, precioTotalTexto: '$69.990 CLP', ahorro: 'Ahorro $11.990 CLP' },
      { cantidad: 3, precioTotalCLP: 89990, precioTotal: 89990, precioTotalTexto: '$89.990 CLP', ahorro: 'Kit Completo 3 Unidades' }
    ]
  },
  {
    id: 'PROD-OXYS',
    nombre: 'Oxys (CL)',
    precioCLP: 40656,
    precio: 40656,
    precioTexto: '$40.656 CLP',
    moneda: 'CLP',
    simboloMoneda: '$',
    categoria: 'Serum Antiedad y Regenerador',
    campanaDefault: 'CHILE',
    promociones: [
      { cantidad: 1, precioTotalCLP: 40656, precioTotal: 40656, precioTotalTexto: '$40.656 CLP', ahorro: 'Precio Lanzamiento Chile' },
      { cantidad: 2, precioTotalCLP: 68990, precioTotal: 68990, precioTotalTexto: '$68.990 CLP', ahorro: 'Pack Dúo Regenerativo' }
    ]
  },
  {
    id: 'PROD-VITAFLEX',
    nombre: 'Vitaflex (CL)',
    precioCLP: 38990,
    precio: 38990,
    precioTexto: '$38.990 CLP',
    moneda: 'CLP',
    simboloMoneda: '$',
    categoria: 'Salud Ósea y Regeneración',
    campanaDefault: 'CHILE',
    promociones: [
      { cantidad: 1, precioTotalCLP: 38990, precioTotal: 38990, precioTotalTexto: '$38.990 CLP', ahorro: 'Envío Gratis' },
      { cantidad: 2, precioTotalCLP: 64990, precioTotal: 64990, precioTotalTexto: '$64.990 CLP', ahorro: 'Pack x 2' }
    ]
  },
  {
    id: 'PROD-CARDIWELL',
    nombre: 'Cardiwell (CL)',
    precioCLP: 39990,
    precio: 39990,
    precioTexto: '$39.990 CLP',
    moneda: 'CLP',
    simboloMoneda: '$',
    categoria: 'Salud Cardiovascular y Circulatoria',
    campanaDefault: 'CHILE',
    promociones: [
      { cantidad: 1, precioTotalCLP: 39990, precioTotal: 39990, precioTotalTexto: '$39.990 CLP', ahorro: 'Envío Gratis' },
      { cantidad: 2, precioTotalCLP: 66990, precioTotal: 66990, precioTotalTexto: '$66.990 CLP', ahorro: 'Tratamiento 2 Meses' }
    ]
  }
];

export const TELEVENTAS_OPERATORS: OperatorProfile[] = [
  {
    id: 'OP-01',
    nombre: 'DAVID EDDY VABLOS SALVATIERRA',
    codigoOperador: 'PEROP1AM-15609',
    pais: 'Chile / Perú',
    campanasAsignadas: ['Chile 1-1', 'Chile 2-2', 'Chile-PS-Auto Priority Call', 'Chile 1-1 FlexiGo (CL)'],
    efectividad: '17.7%'
  },
  {
    id: 'OP-02',
    nombre: 'AIXA SAHIRA CASTELLANOS ROSALES',
    codigoOperador: 'CO-OPERATOR-24140',
    pais: 'Chile / Colombia',
    campanasAsignadas: ['Chile 1-1', 'Duston Gel (CL)', 'EE1'],
    efectividad: '21.4%'
  },
  {
    id: 'OP-03',
    nombre: 'JOHANNA ELIZABETH CALDERON LORENZO',
    codigoOperador: 'PEROP1AM-20090',
    pais: 'Chile / Perú',
    campanasAsignadas: ['Chile 1-1', 'Chile 2-2'],
    efectividad: '19.2%'
  },
  {
    id: 'OP-04',
    nombre: 'LUIS ANGEL SALAZAR GOMEZ',
    codigoOperador: 'PEROP1AM-22008',
    pais: 'Chile / Perú',
    campanasAsignadas: ['Chile 1-1', 'FlexiGo (CL)'],
    efectividad: '18.5%'
  },
  {
    id: 'OP-05',
    nombre: 'ANDREA CAROLINA PEREZ RAMIREZ',
    codigoOperador: 'PEROP1AM-25410',
    pais: 'Chile / Perú',
    campanasAsignadas: ['Chile 1-1', 'Glowy Care'],
    efectividad: '16.8%'
  },
  {
    id: 'OP-06',
    nombre: 'CARLOS ENRIQUE MORALES SILVA',
    codigoOperador: 'PEROP1AM-27311',
    pais: 'Chile / Perú',
    campanasAsignadas: ['Chile 1-1', 'Cardiwell'],
    efectividad: '20.1%'
  },
  {
    id: 'OP-07',
    nombre: 'JHOSEP AGUSTIN GARCIA PALOMINO',
    codigoOperador: 'PEROP1AM-28998',
    pais: 'Chile / Perú',
    campanasAsignadas: ['Chile 1-1', 'Chile-PS-Auto'],
    efectividad: '22.1%'
  },
  {
    id: 'OP-08',
    nombre: 'MILAGRO CAROLINA MENDOZA IZAGUIRRE',
    codigoOperador: 'PEROP1AM-29862',
    pais: 'Chile / Perú',
    campanasAsignadas: ['Chile 1-1', 'Chile 2-2'],
    efectividad: '20.9%'
  },
  {
    id: 'OP-09',
    nombre: 'NAYELI ROMINA LOPEZ CASAHUAMAN',
    codigoOperador: 'PEROP1AM-29871',
    pais: 'Chile / Perú',
    campanasAsignadas: ['Chile 1-1', 'Duston Gel'],
    efectividad: '17.3%'
  },
  {
    id: 'OP-10',
    nombre: 'NERY NELISVANI PORTAL ESTELA',
    codigoOperador: 'PEROP1AM-30253',
    pais: 'Chile / Perú',
    campanasAsignadas: ['Chile 1-1', 'Chile 3-3'],
    efectividad: '14.0%'
  }
];

export const CHILE_REGIONS = [
  'Región Metropolitana de Santiago',
  'Región de Valparaíso',
  'Región del Biobío',
  'Región de Antofagasta',
  'Región de Coquimbo',
  'Región del Maule',
  'Región de La Araucanía',
  'Región de O\'Higgins',
  'Región de Los Lagos',
  'Región de Tarapacá',
  'Región de Atacama',
  'Región de Los Ríos',
  'Región de Arica y Parinacota',
  'Región de Ñuble',
  'Región de Aysén',
  'Región de Magallanes'
] as const;

export const COMUNAS_BY_REGION: Record<string, string[]> = {
  'Región Metropolitana de Santiago': [
    'Santiago Centro', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú',
    'Puente Alto', 'La Florida', 'San Bernardo', 'Vitacura', 'Lo Barnechea',
    'Estación Central', 'Macul', 'Peñalolén', 'La Reina', 'Quilicura', 'San Miguel',
    'Pudahuel', 'Recoleta', 'Independencia', 'Huechuraba', 'Conchalí', 'Renca',
    'Quinta Normal', 'Cerro Navia', 'Lo Prado', 'Cerrillos', 'Pedro Aguirre Cerda',
    'San Joaquín', 'La Cisterna', 'La Granja', 'San Ramón', 'El Bosque', 'Lo Espejo',
    'Colina', 'Lampa', 'Tiltil', 'Buin', 'Paine', 'Melipilla', 'Talagante', 'Peñaflor', 'Padre Hurtado'
  ],
  'Región de Valparaíso': [
    'Viña del Mar', 'Valparaíso', 'Quilpué', 'Villa Alemana', 'Concón', 
    'San Antonio', 'Quillota', 'Los Andes', 'San Felipe', 'La Calera', 'Limache', 'Casablanca'
  ],
  'Región del Biobío': [
    'Concepción', 'Talcahuano', 'San Pedro de la Paz', 'Chiguayante', 'Coronel',
    'Hualpén', 'Los Ángeles', 'Penco', 'Tomé', 'Lota'
  ],
  'Región de Antofagasta': [
    'Antofagasta', 'Calama', 'Mejillones', 'Tocopilla', 'San Pedro de Atacama'
  ],
  'Región de Coquimbo': [
    'La Serena', 'Coquimbo', 'Ovalle', 'Illapel', 'Vicuña', 'Salamanca'
  ],
  'Región del Maule': [
    'Talca', 'Curicó', 'Linares', 'Maule', 'Constitución', 'San Javier', 'Molina', 'Parral'
  ],
  'Región de La Araucanía': [
    'Temuco', 'Padre Las Casas', 'Villarrica', 'Pucón', 'Angol', 'Victoria', 'Lautaro'
  ],
  'Región de O\'Higgins': [
    'Rancagua', 'Machalí', 'Rengo', 'San Fernando', 'Graneros', 'Santa Cruz', 'San Vicente'
  ],
  'Región de Los Lagos': [
    'Puerto Montt', 'Puerto Varas', 'Osorno', 'Castro', 'Ancud', 'Frutillar', 'Llanquihue'
  ],
  'Región de Tarapacá': [
    'Iquique', 'Alto Hospicio', 'Pozo Almonte'
  ],
  'Región de Atacama': [
    'Copiapó', 'Vallenar', 'Caldera', 'Chañaral'
  ],
  'Región de Los Ríos': [
    'Valdivia', 'La Unión', 'Río Bueno', 'Panguipulli'
  ],
  'Región de Arica y Parinacota': [
    'Arica', 'Camarones', 'Putre'
  ],
  'Región de Ñuble': [
    'Chillán', 'Chillán Viejo', 'San Carlos', 'Bulnes'
  ],
  'Región de Aysén': [
    'Coyhaique', 'Puerto Aysén', 'Chile Chico'
  ],
  'Región de Magallanes': [
    'Punta Arenas', 'Puerto Natales', 'Porvenir'
  ]
};

/**
 * Base de datos oficial de localidades/sectores por comuna de Chile
 * Basada en el documento de cobertura y despacho de televentas Chile.
 */
export const LOCALIDADES_BY_COMUNA: Record<string, string[]> = {
  // Región Metropolitana
  'Santiago Centro': [
    'Santiago Centro Cívico',
    'Barrio Brasil',
    'Barrio Yungay',
    'Barrio Bellas Artes',
    'Barrio Lastarria',
    'Barrio Diez de Julio',
    'Parque Almagro',
    'Barrio Meiggs',
    'Barrio República',
    'Santa Isabel',
    'San Diego',
    'Club Hípico'
  ],
  'Providencia': [
    'Providencia Centro',
    'Barrio Italia',
    'Pedro de Valdivia Norte',
    'Los Leones',
    'Tobalaba',
    'Manuel Montt',
    'Salvador',
    'Bellavista Providencia',
    'Inés de Suárez'
  ],
  'Las Condes': [
    'El Golf',
    'San Carlos de Apoquindo',
    'Los Dominicos',
    'Manquehue',
    'Rotonda Atenas',
    'Estoril',
    'Colón 4000',
    'Paul Harris',
    'Sebastián Elcano'
  ],
  'Ñuñoa': [
    'Plaza Ñuñoa',
    'Estadio Nacional',
    'Villa Frei',
    'Suárez Mujica',
    'Parque Bustamante Oriente',
    'Irarrázaval',
    'Plaza Egaña',
    'Simón Bolívar'
  ],
  'Maipú': [
    'Maipú Centro',
    'Ciudad Satélite',
    'El Abrazo',
    'Rinconada de Maipú',
    'Los Pajaritos',
    'Pajaritos Sur',
    'Villa Los Héroes',
    'La Farfana',
    'Longitudinal',
    'El Trébol',
    'Las Parcelas',
    'Santa Ana de Chena'
  ],
  'Puente Alto': [
    'Plaza Puente Alto',
    'Bajos de Mena',
    'Las Vizcachas',
    'Casas Viejas',
    'Ciudad del Este',
    'Villa Los Aromos',
    'San Carlos Puente Alto',
    'Villa Andes del Sur',
    'Nonato Coo'
  ],
  'La Florida': [
    'Bellavista de La Florida',
    'Walker Martínez',
    'Vicente Valdés',
    'Rojas Magallanes',
    'Trinidad',
    'Santa Amalia',
    'Los Quillayes',
    'San José de la Estrella',
    'La Florida Alto'
  ],
  'San Bernardo': [
    'San Bernardo Centro',
    'Nos',
    'Lo Herrera',
    'Estación San Bernardo',
    'El Manzano',
    'Chena',
    'La Estancilla',
    'El Canelo'
  ],
  'Vitacura': [
    'Lo Curro',
    'Santa María de Manquehue',
    'Jardín del Este',
    'Tabancura',
    'Pío XI',
    'Nueva Costanera',
    'Bicentenario'
  ],
  'Lo Barnechea': [
    'La Dehesa',
    'El Arrayán',
    'Farellones',
    'Valle Escondido',
    'Los Trapenses',
    'La Ermita'
  ],
  'Estación Central': [
    'Estación Central Centro',
    'Villa Francia',
    'Villa Portales',
    'General Velásquez',
    'Pajaritos Estación Central',
    'Los Nogales'
  ],
  'Macul': [
    'Macul Centro',
    'Villa Macul',
    'Quilín',
    'Campus San Joaquín Oriente',
    'Santa Julia',
    'Rodrigo de Araya'
  ],
  'Peñalolén': [
    'Peñalolén Alto',
    'San Luis de Peñalolén',
    'Lo Hermida',
    'Las Pircas',
    'Comunidad Ecológica',
    'Consistorial'
  ],
  'La Reina': [
    'La Reina Alta',
    'La Reina Media',
    'Príncipe de Gales',
    'Plaza Ossandón',
    'Tobalaba La Reina'
  ],
  'Quilicura': [
    'Quilicura Centro',
    'Valle Lo Campino',
    'San Ignacio',
    'Lo Echevers',
    'Parque Central',
    'O’Higgins Quilicura'
  ],
  'San Miguel': [
    'El Llano Subercaseaux',
    'Departamental San Miguel',
    'Lo Vial',
    'San Miguel Centro',
    'Barrio Atacama'
  ],
  'Pudahuel': [
    'Pudahuel Norte',
    'Pudahuel Sur',
    'Ciudad de los Valles',
    'Enea',
    'Noviciado',
    'Lo Aguirre',
    'Aeropuerto Pudahuel'
  ],
  'Recoleta': [
    'El Salto',
    'Zapadores',
    'Patronato Recoleta',
    'Cementerio Recoleta',
    'Vespucio Norte Recoleta'
  ],
  'Independencia': [
    'Independencia Centro',
    'Hospitales',
    'Plaza Chacabuco',
    'Hipódromo Chile',
    'Barrio Vivaceta'
  ],
  'Huechuraba': [
    'Ciudad Empresarial',
    'Pedro Fontova',
    'El Barrero',
    'Santa Marta de Huechuraba',
    'Los Libertadores'
  ],
  'Conchalí': [
    'Conchalí Centro',
    'Dorsal',
    'El Cortijo',
    'Zapadores Poniente',
    'Cardenal Caro'
  ],
  'Renca': [
    'Renca Centro',
    'Huamachuco',
    'Mirador Renca',
    'Lo Boza',
    'Vespucio Renca'
  ],
  'Quinta Normal': [
    'Quinta Normal Centro',
    'Parque Quinta Normal',
    'Matucana',
    'Carrascal',
    'Lourdes'
  ],
  'Cerro Navia': [
    'Cerro Navia Centro',
    'Resbalón',
    'Mapocho Poniente',
    'Salvador Gutiérrez'
  ],
  'Lo Prado': [
    'Lo Prado Centro',
    'San Pablo Lo Prado',
    'Neptuno',
    'Blanqueado'
  ],
  'Cerrillos': [
    'Parque Bicentenario Cerrillos',
    'Buzeta',
    'Villa México',
    'Los Cerrillos'
  ],
  'Pedro Aguirre Cerda': [
    'Población Dávila',
    'La Victoria',
    'Ochagavía',
    'San Joaquín PAC'
  ],
  'San Joaquín': [
    'La Castrina',
    'Villa Santa Elena',
    'Campus San Joaquín',
    'Vicente Celis'
  ],
  'La Cisterna': [
    'Intermodal La Cisterna',
    'La Cisterna Centro',
    'El Parrón',
    'Santa Rosa La Cisterna'
  ],
  'La Granja': [
    'La Granja Centro',
    'Malaquías Concha',
    'Villa Brasil',
    'Santa Rosa La Granja'
  ],
  'San Ramón': [
    'San Ramón Centro',
    'La Bandera',
    'Parque La Bandera',
    'Santa Rosa San Ramón'
  ],
  'El Bosque': [
    'El Bosque Centro',
    'Los Morros',
    'Observatorio',
    'Base Aérea El Bosque'
  ],
  'Lo Espejo': [
    'Lo Espejo Centro',
    'Santa Olga',
    'José María Caro',
    'Las Dalias'
  ],
  'Colina': [
    'Colina Centro',
    'Chicureo',
    'Chamisero',
    'Piedra Roja',
    'Las Canteras',
    'Esmeralda',
    'San José de Colina',
    'Peldehue'
  ],
  'Lampa': [
    'Lampa Centro',
    'Batuco',
    'Valle Grande',
    'Estación Colina',
    'Chicauma',
    'Lipangue',
    'Santa Rosa de Lampa'
  ],
  'Tiltil': [
    'Tiltil Centro',
    'Polpaico',
    'Rungue',
    'Huertos Familiares',
    'Montenegro',
    'Caleu'
  ],
  'Buin': [
    'Buin Centro',
    'Alto Jahuel',
    'Bajos de Agustinas',
    'El Recurso',
    'Maipo',
    'Valdivia de Paine',
    'Viluco'
  ],
  'Paine': [
    'Paine Centro',
    'Champa',
    'Hospital',
    'Huelquén',
    'Rangue',
    'Aculeo',
    'Abrantes'
  ],
  'Melipilla': [
    'Melipilla Centro',
    'Bollenar',
    'Culiprán',
    'Pahuilmo',
    'San Manuel',
    'Puangue',
    'Mallarauco'
  ],
  'Talagante': [
    'Talagante Centro',
    'Lonquén',
    'El Roto Chileno',
    'Carampangue',
    'Loreto'
  ],
  'Peñaflor': [
    'Peñaflor Centro',
    'Malloco',
    'Las Palmeras',
    'Pelvin',
    'Miraflores Peñaflor'
  ],
  'Padre Hurtado': [
    'Padre Hurtado Centro',
    'Santa Rosa de Chena',
    'El Trebal',
    'Mariposas de Chena'
  ],

  // Región de Valparaíso
  'Viña del Mar': [
    'Viña del Mar Centro',
    'Reñaca',
    'Miraflores',
    'Gómez Carreño',
    'Forestal',
    'Chorrillos',
    'Plan de Viña',
    'Nueva Aurora',
    'Achupallas',
    'Santa Inés',
    'Recreo',
    'El Salto Viña'
  ],
  'Valparaíso': [
    'Valparaíso Plan',
    'Playa Ancha',
    'Cerro Alegre',
    'Cerro Concepción',
    'Placilla de Peñuelas',
    'Curauma',
    'Laguna Verde',
    'Cerro Barón',
    'Cerro Bellavista',
    'Cerro Esperanza'
  ],
  'Quilpué': [
    'Quilpué Centro',
    'El Belloto',
    'Paso Hondo',
    'Los Pinos',
    'Colliguay',
    'Valencia'
  ],
  'Villa Alemana': [
    'Villa Alemana Centro',
    'Peñablanca',
    'Troncos Viejos',
    'Huanhualí',
    'Gumabia'
  ],
  'Concón': [
    'Concón Centro',
    'Bosques de Montemar',
    'Costa de Montemar',
    'Playa Amarilla',
    'Las Gaviotas'
  ],
  'San Antonio': [
    'San Antonio Centro',
    'Barrancas',
    'Llolleo',
    'Cuncumén',
    'San Juan',
    'Bellavista San Antonio'
  ],
  'Quillota': [
    'Quillota Centro',
    'San Pedro de Quillota',
    'Boco',
    'La Tetera',
    'San Isidro'
  ],
  'Los Andes': [
    'Los Andes Centro',
    'Río Blanco',
    'San Rafael',
    'Curimón Los Andes',
    'Saladillo'
  ],
  'San Felipe': [
    'San Felipe Centro',
    'Curimón',
    'Bellavista San Felipe',
    'El Asiento',
    'Almendral'
  ],
  'La Calera': [
    'La Calera Centro',
    'Artificio',
    'Pachacamita'
  ],
  'Limache': [
    'Limache Viejo',
    'San Francisco de Limache',
    'Lliu Lliu',
    'Los Laureles'
  ],
  'Casablanca': [
    'Casablanca Centro',
    'Tapihue',
    'La Viñita',
    'Lagunillas Casablanca',
    'Quintay'
  ],

  // Región del Biobío
  'Concepción': [
    'Concepción Centro',
    'Barrio Universitario',
    'Collao',
    'Lorenzo Arenas',
    'Palomares',
    'Pedro de Valdivia Concepción',
    'Lomas de San Sebastián',
    'Lomas de San Andrés',
    'Agüita de la Perdiz'
  ],
  'Talcahuano': [
    'Talcahuano Centro',
    'San Vicente',
    'Las Higueras',
    'Medio Camino',
    'Los Cerros',
    'Huachipato',
    'Isla Rocuant'
  ],
  'San Pedro de la Paz': [
    'San Pedro de la Paz Centro',
    'Lomas Coloradas',
    'Boca Sur',
    'Villa San Pedro',
    'Candelaria',
    'Andalué',
    'Michaihue',
    'Idahue'
  ],
  'Chiguayante': [
    'Chiguayante Centro',
    'Lonco',
    'Villuco',
    'Schaub',
    'Manquimávida'
  ],
  'Coronel': [
    'Coronel Centro',
    'Lagunillas',
    'Camilo Olavarría',
    'Schwager',
    'Yobilo',
    'Paso Seco'
  ],
  'Hualpén': [
    'Hualpén Centro',
    'Lenga',
    'Caleta Chome',
    'Villa Acero',
    'Parque Central Hualpén'
  ],
  'Los Ángeles': [
    'Los Ángeles Centro',
    'Santa Fe',
    'San Carlos de Purén',
    'Chacayal',
    'El Peral',
    'Millantú'
  ],
  'Penco': [
    'Penco Centro',
    'Lirquén',
    'Cerro Verde',
    'Playa Negra'
  ],
  'Tomé': [
    'Tomé Centro',
    'Dichato',
    'Punta de Parra',
    'Coliumo',
    'Cocholgüe'
  ],
  'Lota': [
    'Lota Bajo',
    'Lota Alto',
    'Colcura',
    'Chivilingo'
  ],

  // Región de Antofagasta
  'Antofagasta': [
    'Antofagasta Centro',
    'Antofagasta Norte',
    'Antofagasta Sur',
    'Coviefi',
    'Coloso',
    'La Chimba',
    'Playa Blanca Antofagasta',
    'Jardines del Sur'
  ],
  'Calama': [
    'Calama Centro',
    'Chiu Chiu',
    'Lasana',
    'Ayquina',
    'Peuco',
    'Gustavo Le Paige'
  ],
  'Mejillones': [
    'Mejillones Centro',
    'Hornitos',
    'Michilla'
  ],
  'Tocopilla': [
    'Tocopilla Centro',
    'Caleta Buena Tocopilla',
    'Punta Blanca'
  ],
  'San Pedro de Atacama': [
    'San Pedro Centro',
    'Toconao',
    'Socaire',
    'Peine',
    'Talabre'
  ],

  // Región de Coquimbo
  'La Serena': [
    'La Serena Centro',
    'Las Compañías',
    'La Florida La Serena',
    'San Joaquín La Serena',
    'El Milagro',
    'Caspiche',
    'Algarrobito',
    'La Pampa',
    'Puerta del Mar'
  ],
  'Coquimbo': [
    'Coquimbo Centro',
    'Guanaqueros',
    'Tongoy',
    'Tierras Blancas',
    'La Herradura',
    'Sindempart',
    'Pan de Azúcar Coquimbo',
    'El Sauce Coquimbo',
    'Punta Mira'
  ],
  'Ovalle': [
    'Ovalle Centro',
    'Sotaquí',
    'Cerrillos de Tamaya',
    'Huamalata',
    'Barraza',
    'Limarí'
  ],
  'Illapel': [
    'Illapel Centro',
    'Cuz Cuz',
    'Las Cañas',
    'Huintil'
  ],
  'Vicuña': [
    'Vicuña Centro',
    'Elqui',
    'Paihuano',
    'Rivadavias',
    'Diaguitas'
  ],
  'Salamanca': [
    'Salamanca Centro',
    'Chillepin',
    'Cuncumén Salamanca',
    'Tránsito'
  ],

  // Región del Maule
  'Talca': [
    'Talca Centro',
    'La Florida Talca',
    'San Valentín',
    'Carlos Trupp',
    'Punta de Diamante',
    'Huilliborgoa',
    'Las Rastras',
    'Parque Deportivo'
  ],
  'Curicó': [
    'Curicó Centro',
    'Los Niches',
    'Sarmiento',
    'Tutquén',
    'Potrero Grande',
    'Zapallar Curicó'
  ],
  'Linares': [
    'Linares Centro',
    'Vara Gruesa',
    'San Víctor Álamos',
    'Las Obras',
    'Llepo',
    'San Antonio Linares'
  ],
  'Maule': [
    'Maule Centro',
    'Cculenar',
    'Duao Maule',
    'Chacarillas'
  ],
  'Constitución': [
    'Constitución Centro',
    'Putú',
    'Las Cañas',
    'Maguillines'
  ],
  'San Javier': [
    'San Javier Centro',
    'Bobadilla',
    'Nirivilo',
    'Melozal'
  ],
  'Molina': [
    'Molina Centro',
    'Tres Esquinas',
    'Lontué',
    'Radal'
  ],
  'Parral': [
    'Parral Centro',
    'Catillo',
    'Talquita',
    'Perquilauquén'
  ],

  // Región de La Araucanía
  'Temuco': [
    'Temuco Centro',
    'Labranza',
    'Pedro de Valdivia Temuco',
    'Amanecer',
    'Fundo El Carmen',
    'Santa Rosa Temuco',
    'Pueblo Nuevo Temuco',
    'Avenida Alemania'
  ],
  'Padre Las Casas': [
    'Padre Las Casas Centro',
    'San Ramón Padre Las Casas',
    'Metrenco',
    'Huichahue',
    'Pulmahue'
  ],
  'Villarrica': [
    'Villarrica Centro',
    'Licán Ray',
    'Ñancul',
    'Voipir',
    'Pedregoso'
  ],
  'Pucón': [
    'Pucón Centro',
    'Caburgua',
    'Quelhue',
    'Villa San Pedro Pucón',
    'Candelaria Pucón'
  ],
  'Angol': [
    'Angol Centro',
    'Huequén',
    'Deuco',
    'Tijeral'
  ],
  'Victoria': [
    'Victoria Centro',
    'Púa',
    'Selva Oscura',
    'Quino'
  ],
  'Lautaro': [
    'Lautaro Centro',
    'Pillanlelbún',
    'Malalcahuello rural'
  ],

  // Región de O'Higgins
  'Rancagua': [
    'Rancagua Centro',
    'El Teniente',
    'Baquedano Rancagua',
    'Manzanal',
    'Parque Koke',
    'Villa Triana',
    'Punta de Cortés'
  ],
  'Machalí': [
    'Machalí Centro',
    'El Polo',
    'Nogales',
    'Coya',
    'Tierras Blancas Machalí'
  ],
  'Rengo': [
    'Rengo Centro',
    'Rosario',
    'Esmeralda Rengo',
    'Popeta'
  ],
  'San Fernando': [
    'San Fernando Centro',
    'Angostura San Fernando',
    'Puente Negro',
    'Roma'
  ],
  'Graneros': [
    'Graneros Centro',
    'La Cabaña',
    'Las Mercedes Graneros'
  ],
  'Santa Cruz': [
    'Santa Cruz Centro',
    'Paniahue',
    'Chépica',
    'Isla de Yáquil'
  ],
  'San Vicente': [
    'San Vicente de Tagua Tagua Centro',
    'Zúñiga',
    'El Tambo',
    'Pueblo de Indios'
  ],

  // Región de Los Lagos
  'Puerto Montt': [
    'Puerto Montt Centro',
    'Alerce',
    'Pelluco',
    'Chinquihue',
    'Tenglo',
    'Chamiza',
    'Cardonal',
    'Mirasol',
    'Pichi Pelluco',
    'Valle Volcanes'
  ],
  'Puerto Varas': [
    'Puerto Varas Centro',
    'Ensenada',
    'Nueva Braunau',
    'Peulla',
    'Ralún',
    'Colonia Río Sur'
  ],
  'Osorno': [
    'Osorno Centro',
    'Rahue Alto',
    'Rahue Bajo',
    'Ovejería',
    'Franque',
    'Cancura',
    'Pilauco'
  ],
  'Castro': [
    'Castro Centro',
    'Gamboa',
    'Nercón',
    'Rilán',
    'Ten Ten'
  ],
  'Ancud': [
    'Ancud Centro',
    'Chacao',
    'Lechagua',
    'Pudeto'
  ],
  'Frutillar': [
    'Frutillar Bajo',
    'Frutillar Alto',
    'Casma',
    'Punta Larga'
  ],
  'Llanquihue': [
    'Llanquihue Centro',
    'Los Pellines',
    'Colegual'
  ],

  // Región de Tarapacá
  'Iquique': [
    'Iquique Centro',
    'Playa Brava',
    'Cavancha',
    'Chanavayita',
    'Caleta Los Verdes',
    'Huayquique',
    'Las Dunas'
  ],
  'Alto Hospicio': [
    'Alto Hospicio Centro',
    'Santa Rosa Hospicio',
    'La Negra Hospicio',
    'El Boro',
    'La Pampa Hospicio'
  ],
  'Pozo Almonte': [
    'Pozo Almonte Centro',
    'La Tirana',
    'Mamiña',
    'Pintados'
  ],

  // Región de Atacama
  'Copiapó': [
    'Copiapó Centro',
    'Paipote',
    'San Pedro Copiapó',
    'Toledo Copiapó',
    'El Palomar',
    'Tierra Amarilla conurbación'
  ],
  'Vallenar': [
    'Vallenar Centro',
    'Huasco conurbación',
    'Domeyko',
    'Buena Esperanza'
  ],
  'Caldera': [
    'Caldera Centro',
    'Bahía Inglesa',
    'Loreto Caldera'
  ],
  'Chañaral': [
    'Chañaral Centro',
    'Barquito',
    'El Salado'
  ],

  // Región de Los Ríos
  'Valdivia': [
    'Valdivia Centro',
    'Niebla',
    'Isla Teja',
    'Collico',
    'Corvi Valdivia',
    'Las Ánimas',
    'Torobayo'
  ],
  'La Unión': [
    'La Unión Centro',
    'Puerto Nuevo',
    'Trumao'
  ],
  'Río Bueno': [
    'Río Bueno Centro',
    'Crucero',
    'Cayurruca'
  ],
  'Panguipulli': [
    'Panguipulli Centro',
    'Coñaripe',
    'Choshuenco',
    'Liquiñe',
    'Neltume'
  ],

  // Región de Arica y Parinacota
  'Arica': [
    'Arica Centro',
    'Valle de Azapa',
    'Valle de Lluta',
    'San Miguel de Azapa',
    'Villa Frontera',
    'El Agro Arica',
    'Saucache'
  ],
  'Camarones': [
    'Cuya',
    'Caleta Camarones',
    'Esquiña'
  ],
  'Putre': [
    'Putre Centro',
    'Socoroma',
    'Parinacota'
  ],

  // Región de Ñuble
  'Chillán': [
    'Chillán Centro',
    'Los Volcanes Chillán',
    'Quinchamalí',
    'Las Mariposas',
    'Doña Rosa',
    'Parque Lantaño'
  ],
  'Chillán Viejo': [
    'Chillán Viejo Centro',
    'Rucapequén',
    'Nebulana'
  ],
  'San Carlos': [
    'San Carlos Centro',
    'Cachapoal',
    'Ribera de Ñuble'
  ],
  'Bulnes': [
    'Bulnes Centro',
    'Santa Clara Bulnes',
    'Tres Esquinas Bulnes'
  ],

  // Región de Aysén
  'Coyhaique': [
    'Coyhaique Centro',
    'Balmaceda',
    'El Blanco',
    'Valle Simpson',
    'Villa Ortega'
  ],
  'Puerto Aysén': [
    'Puerto Aysén Centro',
    'Puerto Chacabuco',
    'Bahía Acantilada'
  ],
  'Chile Chico': [
    'Chile Chico Centro',
    'Fachinal',
    'Mallín Grande'
  ],

  // Región de Magallanes
  'Punta Arenas': [
    'Punta Arenas Centro',
    'Río Seco',
    'Barranco Amarillo',
    'Pampa Redonda',
    'Leñadura',
    'Playa Norte',
    'Barrio Croata'
  ],
  'Puerto Natales': [
    'Puerto Natales Centro',
    'Villa Renoval',
    'Cerro Castillo'
  ],
  'Porvenir': [
    'Porvenir Centro',
    'Bahía Chilota',
    'San Sebastián'
  ]
};

export function getLocalidadesForComuna(comuna: string): string[] {
  if (!comuna) return [];
  return LOCALIDADES_BY_COMUNA[comuna] || [`${comuna} Centro`, `${comuna} Sector Urbano`];
}

const PRODUCT_NAMES = CHILE_PRODUCTS.map(p => p.nombre);

/**
 * Genera el dataset semilla con las reglas estrictas de la hoja compartida:
 * 1. Cada registro tiene su LOCALIDAD REAL y ÚNICA de la comuna correspondiente
 *    (Evita repetición con solo el nombre de la comuna al filtrar)
 * 2. Paqueterías exclusivas: 'Contraentrega' o 'Blue Express'
 * 3. Métodos de pago exclusivos:
 *    - 'Contraentrega' => 'Efectivo y Transferencia' al momento de la entrega
 *    - 'Blue Express' => 'Solo Efectivo' al momento de la entrega
 * 4. Días de tránsito para contabilizar la fecha estimada de entrega
 */
export function generateSeedData(count: number = 1400): ZoneDeliveryRecord[] {
  const records: ZoneDeliveryRecord[] = [];
  let recordIdCounter = 1;

  // Paso 1: Generar todas las localidades auténticas de cada comuna de Chile
  for (const region of CHILE_REGIONS) {
    const comunas = COMUNAS_BY_REGION[region] || [];

    for (const comuna of comunas) {
      const localidades = LOCALIDADES_BY_COMUNA[comuna] || [`${comuna} Centro`];

      for (const localidad of localidades) {
        let paqueteria: ZoneDeliveryRecord['paqueteria'];
        let metodoPago: ZoneDeliveryRecord['metodoPago'];
        let diasTransito: number;
        let restricciones: string;

        // Región Metropolitana utiliza Contraentrega (Efectivo y Transferencia)
        if (region === 'Región Metropolitana de Santiago') {
          paqueteria = 'Contraentrega';
          metodoPago = 'Efectivo y Transferencia';
          // Comunas céntricas de Santiago: 1 día de tránsito; periféricas: 2 días
          if (['Santiago Centro', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú', 'Puente Alto', 'La Florida', 'San Bernardo'].includes(comuna)) {
            diasTransito = 1;
            restricciones = `Reparto express por Contraentrega en ${localidad}. Acepta Efectivo y Transferencia bancaria directa al repartidor.`;
          } else {
            diasTransito = 2;
            restricciones = `Reparto Contraentrega en sector periférico (${localidad}). Acepta Efectivo y Transferencia al recibir.`;
          }
        } 
        // Valparaíso y Biobío núcleos principales: Contraentrega
        else if ((region === 'Región de Valparaíso' && ['Viña del Mar', 'Valparaíso', 'Concón', 'Quilpué'].includes(comuna)) ||
                 (region === 'Región del Biobío' && ['Concepción', 'Talcahuano', 'San Pedro de la Paz'].includes(comuna))) {
          paqueteria = 'Contraentrega';
          metodoPago = 'Efectivo y Transferencia';
          diasTransito = 2;
          restricciones = `Ruta directa Contraentrega en ${localidad}. Acepta Efectivo y Transferencia al momento de recibir.`;
        }
        // Resto del país: Reparto con Blue Express (Solo Efectivo)
        else {
          paqueteria = 'Blue Express';
          metodoPago = 'Solo Efectivo';

          if (['Región de O\'Higgins', 'Región del Maule', 'Región de Coquimbo', 'Región de Ñuble'].includes(region)) {
            diasTransito = 2;
            restricciones = `Despacho Blue Express a ${localidad}. IMPORTANTE: Con Blue Express el pago es ÚNICAMENTE EN EFECTIVO.`;
          } else if (['Región de Antofagasta', 'Región de La Araucanía', 'Región de Los Ríos', 'Región de Los Lagos'].includes(region)) {
            diasTransito = 3;
            restricciones = `Despacho regional Blue Express a ${localidad}. IMPORTANTE: Con Blue Express el pago es ÚNICAMENTE EN EFECTIVO.`;
          } else {
            // Regiones extremas (Arica, Tarapacá, Atacama, Aysén, Magallanes)
            diasTransito = 4;
            restricciones = `Despacho zona extrema Blue Express a ${localidad}. IMPORTANTE: Con Blue Express el pago es ÚNICAMENTE EN EFECTIVO.`;
          }
        }

        const calc = calcularFechaEntrega(diasTransito);

        records.push({
          id: `CL-ZON-${String(recordIdCounter++).padStart(6, '0')}`,
          campaignId: 'CHILE',
          pais: 'Chile',
          region,
          comuna,
          localidad,
          provincia: comuna,
          sectorZona: `Sector: ${localidad} (${comuna})`,
          coberturaEstado: 'Factible con Cobertura',
          paqueteria,
          metodoPago,
          diasTransito,
          fechaEntregaEstimada: calc.fechaTextoLargo,
          costoEnvioCLP: 0,
          envioGratis: true,
          productosDisponibles: PRODUCT_NAMES,
          restricciones,
          ultimaActualizacion: '2026-10-14'
        });
      }
    }
  }

  // Paso 2: Si count es mayor al total base de localidades (~500), expandir con sub-sectores identificados de cada localidad
  const baseRecords = [...records];
  let cycle = 1;
  while (records.length < count && baseRecords.length > 0) {
    for (const base of baseRecords) {
      if (records.length >= count) break;

      const sectorNum = cycle + 1;
      const subLocalidad = `${base.localidad} - Etapa ${sectorNum}`;
      const calc = calcularFechaEntrega(base.diasTransito);

      records.push({
        ...base,
        id: `CL-ZON-${String(recordIdCounter++).padStart(6, '0')}`,
        localidad: subLocalidad,
        sectorZona: `Sector: ${subLocalidad} (${base.comuna})`,
        fechaEntregaEstimada: calc.fechaTextoLargo
      });
    }
    cycle++;
  }

  return records;
}

export function generateMassiveDataset(targetCount: number = 52000): ZoneDeliveryRecord[] {
  const records: ZoneDeliveryRecord[] = [];
  const base = generateSeedData(1500);

  let idCounter = 1;
  const copies = Math.ceil(targetCount / base.length);

  for (let c = 0; c < copies; c++) {
    for (const item of base) {
      if (records.length >= targetCount) break;
      const calc = calcularFechaEntrega(item.diasTransito);
      const sub = c === 0 ? item.localidad : `${item.localidad} - Sector ${c + 1}`;
      records.push({
        ...item,
        id: `CL-ZON-${String(idCounter++).padStart(6, '0')}`,
        localidad: sub,
        sectorZona: `Sector: ${sub} (${item.comuna})`,
        fechaEntregaEstimada: calc.fechaTextoLargo
      });
    }
  }

  return records;
}
