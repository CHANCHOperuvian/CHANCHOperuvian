import { RosterOperator, OperatorProfile } from '../types/coverage';

/**
 * Nómina completa de Teamleaders y Asesores extraída directamente
 * de la hoja de Google Sheets "Actualizacion de Datos del Operador".
 */
export const INITIAL_ROSTER: RosterOperator[] = [
  // Teamleaders
  { id: 'TL-01', numero: 0, teamleader: 'DIRECCIÓN', nombreAsesor: 'DAVID VABLOS', codigoPerop: 'PEROP1AM-15609', campana: 'CHILE', turno: '07:00-16:00', registrado: true, pinPersonal: '1234' },
  { id: 'TL-02', numero: 0, teamleader: 'DIRECCIÓN', nombreAsesor: 'AIXA CASTELLANOS', codigoPerop: 'CO-OPERATOR-24140', campana: 'CHILE/ECUADOR', turno: '13:00-22:00', registrado: true, pinPersonal: '1234' },
  { id: 'TL-03', numero: 0, teamleader: 'DIRECCIÓN', nombreAsesor: 'CARLOS TELLO', codigoPerop: 'CO-OPERATOR-29553', campana: 'MEXICO/CHILE', turno: '13:00-22:00', registrado: true, pinPersonal: '1234' },
  { id: 'TL-04', numero: 0, teamleader: 'DIRECCIÓN', nombreAsesor: 'DALIA CASTILLO', codigoPerop: 'CO-OPERATOR-30520', campana: 'COLOMBIA/ECUADOR', turno: '07:00-16:00', registrado: true, pinPersonal: '1234' },
  { id: 'TL-05', numero: 0, teamleader: 'DIRECCIÓN', nombreAsesor: 'DANIEL DE LA CRUZ', codigoPerop: 'PEROP1AM-10005', campana: 'CHILE/PERU', turno: '13:00-22:00', registrado: true, pinPersonal: '1234' },
  { id: 'TL-06', numero: 0, teamleader: 'DIRECCIÓN', nombreAsesor: 'ERIKA ASTOCONDOR', codigoPerop: 'PEROP1AM-17759', campana: 'PERU/CHILE', turno: '13:00-22:00', registrado: true, pinPersonal: '1234' },
  { id: 'TL-07', numero: 0, teamleader: 'DIRECCIÓN', nombreAsesor: 'JHOSEP GARCIA', codigoPerop: 'PEROP1AM-28998', campana: 'ECUADOR/MEXICO', turno: '22:00-07:00', registrado: true, pinPersonal: '1234' },
  { id: 'TL-08', numero: 0, teamleader: 'DIRECCIÓN', nombreAsesor: 'MILAGRO MENDOZA', codigoPerop: 'PEROP1AM-29862', campana: 'PARAGUAY/MEXICO', turno: '07:00-16:00', registrado: true, pinPersonal: '1234' },
  { id: 'TL-09', numero: 0, teamleader: 'DIRECCIÓN', nombreAsesor: 'NAYELI LOPEZ', codigoPerop: 'PEROP1AM-29871', campana: 'PERU', turno: '07:00-16:00', registrado: true, pinPersonal: '1234' },
  { id: 'TL-10', numero: 0, teamleader: 'DIRECCIÓN', nombreAsesor: 'ALEXANDER PAJUELO', codigoPerop: 'PEROP1AM-11347', campana: 'PSMEXICO', turno: '09:00-18:00', registrado: true, pinPersonal: '1234' },

  // Asesores de DAVID VABLOS (Campaña CHILE)
  { id: 'OP-59', numero: 59, teamleader: 'DAVID VABLOS', nombreAsesor: 'JOSE LUIS RUEDA ARIAS', codigoPerop: 'PEROP1AM-40656', campana: 'CHILE', turno: '07:00-16:00', descanso: 'JUEVES' },
  { id: 'OP-60', numero: 60, teamleader: 'DAVID VABLOS', nombreAsesor: 'ILIARI ARIANA CHIMOY VASQUEZ', codigoPerop: 'PEROP1AM-41922', campana: 'CHILE', turno: '07:00-16:00', descanso: 'SABADO' },
  { id: 'OP-61', numero: 61, teamleader: 'DAVID VABLOS', nombreAsesor: 'ADRIAN JEREMI DE LA CRUZ CUEVA', codigoPerop: 'PEROP1AM-38932', campana: 'CHILE', turno: '07:00-16:00', descanso: 'JUEVES' },
  { id: 'OP-62', numero: 62, teamleader: 'DAVID VABLOS', nombreAsesor: 'MARIA CRISTINA MENDOZA ALONZO', codigoPerop: 'PEROP1AM-4124', campana: 'CHILE', turno: '07:00-16:00', descanso: 'DOMINGO' },
  { id: 'OP-63', numero: 63, teamleader: 'DAVID VABLOS', nombreAsesor: 'ZAYURI EMILI ORTEGA MELGAREJO', codigoPerop: 'PEROP1AM-40784', campana: 'CHILE', turno: '07:00-16:00', descanso: 'MARTES' },
  { id: 'OP-64', numero: 64, teamleader: 'DAVID VABLOS', nombreAsesor: 'AURA MARINA GUEDES ACOSTA', codigoPerop: 'PEROP1AM-39782', campana: 'CHILE', turno: '07:00-16:00', descanso: 'VIERNES' },
  { id: 'OP-65', numero: 65, teamleader: 'DAVID VABLOS', nombreAsesor: 'ESTIBEN YEROVI MENDOZA TORRES', codigoPerop: 'PEROP1AM-41608', campana: 'CHILE', turno: '07:00-16:00', descanso: 'DOMINGO' },
  { id: 'OP-66', numero: 66, teamleader: 'DAVID VABLOS', nombreAsesor: 'ANGEL SEBASTIAN TICA ROJAS', codigoPerop: 'PEROP1AM-41096', campana: 'CHILE', turno: '07:00-16:00', descanso: 'LUNES' },
  { id: 'OP-67', numero: 67, teamleader: 'DAVID VABLOS', nombreAsesor: 'RODRIGO ANTONIO ALDANA ESPINOZA', codigoPerop: 'PEROP1AM-42155', campana: 'PERU', turno: '07:00-16:00', descanso: 'SABADO' },
  { id: 'OP-68', numero: 68, teamleader: 'DAVID VABLOS', nombreAsesor: 'DIANA CAROLINA ORTIZ ALEJANDRO', codigoPerop: 'PEROP1AM-42165', campana: 'PERU', turno: '07:00-16:00', descanso: 'LUNES' },
  { id: 'OP-69', numero: 69, teamleader: 'DAVID VABLOS', nombreAsesor: 'DAVID RAFAEL ROMERO DE LA CRUZ', codigoPerop: 'PEROP1AM-41808', campana: 'PERU', turno: '07:00-16:00', descanso: 'DOMINGO' },
  { id: 'OP-70', numero: 70, teamleader: 'DAVID VABLOS', nombreAsesor: 'INDIRA MASSIEL MIA SILVERA VALENTE', codigoPerop: 'PEROP1AM-42199', campana: 'CHILE', turno: '07:00-16:00', descanso: 'MARTES' },

  // Asesores de DANIEL DE LA CRUZ (Campaña CHILE / PERU)
  { id: 'OP-46', numero: 46, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'GIANPIERE CARDENAS ROMANI', codigoPerop: 'PEROP1AM-41221', campana: 'CHILE', turno: '13:00-22:00', descanso: 'VIERNES' },
  { id: 'OP-47', numero: 47, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'NATALIA JOHANA URBANO MENDOZA', codigoPerop: 'PEROP1AM-41801', campana: 'CHILE', turno: '13:00-22:00', descanso: 'VIERNES' },
  { id: 'OP-48', numero: 48, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'XIOMARA TAHIS GUZMAN CAJO', codigoPerop: 'PEROP1AM-41338', campana: 'CHILE', turno: '13:00-22:00', descanso: 'SABADO' },
  { id: 'OP-49', numero: 49, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'ETHEL CRHIS MIGUEL BARRIOS', codigoPerop: 'PEROP1AM-35363', campana: 'CHILE', turno: '13:00-22:00', descanso: 'DOMINGO' },
  { id: 'OP-50', numero: 50, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'LUCIA VALERIA GARRIDO GARCIA', codigoPerop: 'PEROP1AM-7397', campana: 'CHILE', turno: '13:00-22:00', descanso: 'JUEVES' },
  { id: 'OP-51', numero: 51, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'EMERSON JOAO COAGUILA PERLECHE', codigoPerop: 'PEROP1AM-29871', campana: 'CHILE', turno: '13:00-22:00', descanso: 'LUNES' },
  { id: 'OP-52', numero: 52, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'KEVIN OMAR ZEGARRA LUCAS', codigoPerop: 'PEROP1AM-42152', campana: 'CHILE', turno: '13:00-22:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-53', numero: 53, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'ROSBETLY EVELYN MINAYA FLORES', codigoPerop: 'PEROP1AM-41008', campana: 'PERU', turno: '13:00-22:00', descanso: 'DOMINGO' },
  { id: 'OP-54', numero: 54, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'CLAUDIA STEPHANIE RAMIREZ JUSTO', codigoPerop: 'PEROP1AM-7391', campana: 'PERU', turno: '13:00-22:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-55', numero: 55, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'NAYELI SELINA AVELLANEDA GARCIA', codigoPerop: 'PEROP1AM-41446', campana: 'PERU', turno: '13:00-22:00', descanso: 'MARTES' },
  { id: 'OP-56', numero: 56, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'VERONICA ANTONELLA AGUIRRE SERRANO', codigoPerop: 'PEROP1AM-40593', campana: 'PERU', turno: '13:00-22:00', descanso: 'MARTES' },
  { id: 'OP-57', numero: 57, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'ADRIANA SOFIA VALLEJOS ALBURQUEQUE', codigoPerop: 'PEROP1AM-41374', campana: 'PERU', turno: '13:00-22:00', descanso: 'SABADO' },
  { id: 'OP-58', numero: 58, teamleader: 'DANIEL DE LA CRUZ', nombreAsesor: 'TRACY MAVEL RIOS VARGAS', codigoPerop: 'PEROP1AM-41811', campana: 'PERU', turno: '13:00-22:00', descanso: 'MARTES' },

  // Asesores de AIXA CASTELLANOS
  { id: 'OP-01_A', numero: 1, teamleader: 'AIXA CASTELLANOS', nombreAsesor: 'MARIA CAROLINA LOPEZ RAMIREZ', codigoPerop: 'PEROP1AM-40495', campana: 'ECUADOR', turno: '13:00-22:00', descanso: 'VIERNES' },
  { id: 'OP-02_A', numero: 2, teamleader: 'AIXA CASTELLANOS', nombreAsesor: 'ZOILA ELENA CARRANZA GALINDO', codigoPerop: 'PEROP1AM-41017', campana: 'ECUADOR', turno: '13:00-22:00', descanso: 'JUEVES' },
  { id: 'OP-03_A', numero: 3, teamleader: 'AIXA CASTELLANOS', nombreAsesor: 'YESSICA YOVANA IZAGUIRRE PUMARICRA', codigoPerop: 'PEROP1AM-30253', campana: 'ECUADOR', turno: '13:00-22:00', descanso: 'SABADO' },
  { id: 'OP-04_A', numero: 4, teamleader: 'AIXA CASTELLANOS', nombreAsesor: 'JUAN MANUEL BOYER PEREZ', codigoPerop: 'PEROP1AM-28998', campana: 'ECUADOR', turno: '13:00-22:00', descanso: 'MARTES' },
  { id: 'OP-05_A', numero: 5, teamleader: 'AIXA CASTELLANOS', nombreAsesor: 'LUCIANA CAMILA CANALES ROJAS', codigoPerop: 'PEROP1AM-42185', campana: 'ECUADOR', turno: '13:00-22:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-06_A', numero: 6, teamleader: 'AIXA CASTELLANOS', nombreAsesor: 'JOCELYN DAYANA FLORES JILAPA', codigoPerop: 'PEROP1AM-40494', campana: 'URUGUAY', turno: '13:00-22:00', descanso: 'VIERNES' },
  { id: 'OP-07_A', numero: 7, teamleader: 'AIXA CASTELLANOS', nombreAsesor: 'LIS KARINA IZAGUIRRE PUMARICRA', codigoPerop: 'PEROP1AM-41830', campana: 'URUGUAY', turno: '13:00-22:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-08_A', numero: 8, teamleader: 'AIXA CASTELLANOS', nombreAsesor: 'GERALDINE ESTEFANY MORALES MEDINA', codigoPerop: 'PEROP1AM-4618', campana: 'URUGUAY', turno: '13:00-22:00', descanso: 'DOMINGO' },
  { id: 'OP-09_A', numero: 9, teamleader: 'AIXA CASTELLANOS', nombreAsesor: 'MARIANA ESTEFANIA LUQUEZ YAGUA', codigoPerop: 'PEROP1AM-17759', campana: 'URUGUAY', turno: '13:00-22:00', descanso: 'SABADO' },
  { id: 'OP-10_A', numero: 10, teamleader: 'AIXA CASTELLANOS', nombreAsesor: 'JUAN PABLO BOYER MORA', codigoPerop: 'PEROP1AM-15609', campana: 'URUGUAY', turno: '13:00-22:00', descanso: 'LUNES' },

  // Asesores de CARLOS TELLO
  { id: 'OP-22', numero: 22, teamleader: 'CARLOS TELLO', nombreAsesor: 'MARY LUZ PETRO PADILLA', codigoPerop: 'co-operator-29553', campana: 'MEXICO', turno: '13:00-22:00', descanso: 'DOMINGO' },
  { id: 'OP-23', numero: 23, teamleader: 'CARLOS TELLO', nombreAsesor: 'FRANCIS ESTEFANI VERA SOTO', codigoPerop: 'co-operator-30520', campana: 'MEXICO', turno: '13:00-22:00', descanso: 'LUNES' },
  { id: 'OP-24', numero: 24, teamleader: 'CARLOS TELLO', nombreAsesor: 'KAREN ELENA ELLES LEÓN', codigoPerop: 'co-operator-24140', campana: 'MEXICO', turno: '13:00-22:00', descanso: 'MARTES' },
  { id: 'OP-25', numero: 25, teamleader: 'CARLOS TELLO', nombreAsesor: 'JEREMY BRIAN GIMENEZ VALIENTE', codigoPerop: 'PEROP1AM-42184', campana: 'PARAGUAY', turno: '13:00-22:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-26', numero: 26, teamleader: 'CARLOS TELLO', nombreAsesor: 'ROBERT RICHARD REZZA GUERRA', codigoPerop: 'PEROP1AM-10005', campana: 'PARAGUAY', turno: '13:00-22:00', descanso: 'VIERNES' },
  { id: 'OP-27', numero: 27, teamleader: 'CARLOS TELLO', nombreAsesor: 'CESAR ALEXANDER MAYANGA MINAYA', codigoPerop: 'PEROP1AM-32506', campana: 'PARAGUAY', turno: '13:00-22:00', descanso: 'JUEVES' },
  { id: 'OP-28', numero: 28, teamleader: 'CARLOS TELLO', nombreAsesor: 'ANNY ROCIO MACALUPÚ MILLA', codigoPerop: 'PEROP1AM-41582', campana: 'PARAGUAY', turno: '13:00-22:00', descanso: 'MARTES' },
  { id: 'OP-29', numero: 29, teamleader: 'CARLOS TELLO', nombreAsesor: 'FABRIZZIO YANDE REQUEJO AGUIRRE', codigoPerop: 'PEROP1AM-39884', campana: 'PARAGUAY', turno: '13:00-22:00', descanso: 'MARTES' },

  // Asesores de DALIA CASTILLO
  { id: 'OP-30', numero: 30, teamleader: 'DALIA CASTILLO', nombreAsesor: 'NELLY ANA HUARHUA YUPANQUI', codigoPerop: 'PEROP1AM-29246', campana: 'COLOMBIA', turno: '07:00-16:00', descanso: 'DOMINGO' },
  { id: 'OP-31', numero: 31, teamleader: 'DALIA CASTILLO', nombreAsesor: 'YENE MAGDALENI TAKAHASHI RIBBECK', codigoPerop: 'PEROP1AM-4578', campana: 'COLOMBIA', turno: '07:00-16:00', descanso: 'SABADO' },
  { id: 'OP-32', numero: 32, teamleader: 'DALIA CASTILLO', nombreAsesor: 'JULIA IRENE RAMOS MEJIA', codigoPerop: 'PEROP1AM-40163', campana: 'ECUADOR', turno: '07:00-16:00', descanso: 'LUNES' },
  { id: 'OP-33', numero: 33, teamleader: 'DALIA CASTILLO', nombreAsesor: 'BRENDA ELIANE MANRIQUE REMIGIO', codigoPerop: 'PEROP1AM-40365', campana: 'ECUADOR', turno: '07:00-16:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-34', numero: 34, teamleader: 'DALIA CASTILLO', nombreAsesor: 'ANA CECILIA PEREZ PANDARES', codigoPerop: 'PEROP1AM-40669', campana: 'ECUADOR', turno: '07:00-16:00', descanso: 'LUNES' },
  { id: 'OP-35', numero: 35, teamleader: 'DALIA CASTILLO', nombreAsesor: 'JAVIER ALFONSO MICHUE ROJAS', codigoPerop: 'PEROP1AM-41391', campana: 'ECUADOR', turno: '07:00-16:00', descanso: 'VIERNES' },
  { id: 'OP-36', numero: 36, teamleader: 'DALIA CASTILLO', nombreAsesor: 'VICKY NAZARET FERNANDEZ GARCIA', codigoPerop: 'PEROP1AM-4995', campana: 'ECUADOR', turno: '07:00-16:00', descanso: 'JUEVES' },
  { id: 'OP-37', numero: 37, teamleader: 'DALIA CASTILLO', nombreAsesor: 'CESAR FERNANDO SANCHEZ TORRES', codigoPerop: 'PEROP1AM-41857', campana: 'ECUADOR', turno: '07:00-16:00', descanso: 'SABADO' },
  { id: 'OP-38', numero: 38, teamleader: 'DALIA CASTILLO', nombreAsesor: 'DANNA JENNIFER LEIVA CASIQUE', codigoPerop: 'PEROP1AM-40881', campana: 'ECUADOR', turno: '07:00-16:00', descanso: 'DOMINGO' },
  { id: 'OP-39', numero: 39, teamleader: 'DALIA CASTILLO', nombreAsesor: 'CRISTHIAN ALEXANDER CAMPOS CARBONERO', codigoPerop: 'PEROP1AM-41057', campana: 'ECUADOR', turno: '07:00-16:00', descanso: 'SABADO' },
  { id: 'OP-40', numero: 40, teamleader: 'DALIA CASTILLO', nombreAsesor: 'AKEMI DUBAN CHUQUIMANGO MUÑOZ', codigoPerop: 'PEROP1AM-41639', campana: 'ECUADOR', turno: '07:00-16:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-41', numero: 41, teamleader: 'DALIA CASTILLO', nombreAsesor: 'ROSA THALIA AREVALO PORTOCARRERO', codigoPerop: 'PEROP1AM-39022', campana: 'URUGUAY', turno: '07:00-16:00', descanso: 'DOMINGO' },
  { id: 'OP-42', numero: 42, teamleader: 'DALIA CASTILLO', nombreAsesor: 'HENRY OSCAR DE LA FLOR CHANCHARI', codigoPerop: 'PEROP1AM-40205', campana: 'URUGUAY', turno: '07:00-16:00', descanso: 'JUEVES' },
  { id: 'OP-43', numero: 43, teamleader: 'DALIA CASTILLO', nombreAsesor: 'JHON HUARI VASQUEZ', codigoPerop: 'PEROP1AM-40398', campana: 'URUGUAY', turno: '07:00-16:00', descanso: 'SABADO' },
  { id: 'OP-44', numero: 44, teamleader: 'DALIA CASTILLO', nombreAsesor: 'MARIA CECILIA VARA AGUIRRE', codigoPerop: 'PEROP1AM-41168', campana: 'URUGUAY', turno: '07:00-16:00', descanso: 'VIERNES' },
  { id: 'OP-45', numero: 45, teamleader: 'DALIA CASTILLO', nombreAsesor: 'MARINA COROMOTO PIÑANGO MARCANO', codigoPerop: 'PEROP1AM-40884', campana: 'URUGUAY', turno: '07:00-16:00', descanso: 'LUNES' },

  // Asesores de ERIKA ASTOCONDOR
  { id: 'OP-71', numero: 71, teamleader: 'ERIKA ASTOCONDOR', nombreAsesor: 'YERLIN JOSE EGUSQUIZA CORDOVA', codigoPerop: 'PEROP1AM-40945', campana: 'COLOMBIA', turno: '13:00-22:00', descanso: 'VIERNES' },
  { id: 'OP-72', numero: 72, teamleader: 'ERIKA ASTOCONDOR', nombreAsesor: 'JAIRO ALBERTO SALINAS PRIMO', codigoPerop: 'PEROP1AM-41573', campana: 'COLOMBIA', turno: '13:00-22:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-73', numero: 73, teamleader: 'ERIKA ASTOCONDOR', nombreAsesor: 'MANUEL ALEJANDRO VARGAS MALVACIAS', codigoPerop: 'PEROP1AM-40453', campana: 'COSTA RICA', turno: '13:00-22:00', descanso: 'MARTES' },
  { id: 'OP-74', numero: 74, teamleader: 'ERIKA ASTOCONDOR', nombreAsesor: 'LUCIA KARINA VALERO DUQUE', codigoPerop: 've-operator-21204', campana: 'PERU', turno: '13:00-22:00', descanso: 'JUEVES' },
  { id: 'OP-75', numero: 75, teamleader: 'ERIKA ASTOCONDOR', nombreAsesor: 'GERALDINE GABINA SALAS HANCCO', codigoPerop: 'PEROP1AM-7961', campana: 'PERU', turno: '13:00-22:00', descanso: 'DOMINGO' },
  { id: 'OP-76', numero: 76, teamleader: 'ERIKA ASTOCONDOR', nombreAsesor: 'ALEXANDRA INGRID TAPULLIMA URQUIA', codigoPerop: 'PEROP1AM-37107', campana: 'PERU', turno: '13:00-22:00', descanso: 'JUEVES' },
  { id: 'OP-77', numero: 77, teamleader: 'ERIKA ASTOCONDOR', nombreAsesor: 'YENIFER ALEXANDRA MELGAREJO QUISPE', codigoPerop: 'PEROP1AM-41156', campana: 'PERU', turno: '13:00-22:00', descanso: 'MARTES' },
  { id: 'OP-78', numero: 78, teamleader: 'ERIKA ASTOCONDOR', nombreAsesor: 'CLAUDIA MARITZA QUINTANA ALMORA', codigoPerop: 'PEROP1AM-39747', campana: 'PERU', turno: '13:00-22:00', descanso: 'LUNES' },
  { id: 'OP-79', numero: 79, teamleader: 'ERIKA ASTOCONDOR', nombreAsesor: 'NATALIA JADE PEREZ MOYA', codigoPerop: 'PEROP1AM-42154', campana: 'PERU', turno: '13:00-22:00', descanso: 'VIERNES' },
  { id: 'OP-80', numero: 80, teamleader: 'ERIKA ASTOCONDOR', nombreAsesor: 'MILENKA NAHOMI TAPULLIMA URQUIA', codigoPerop: 'PEROP1AM-35654', campana: 'PERU', turno: '13:00-22:00', descanso: 'JUEVES' },
  { id: 'OP-81', numero: 81, teamleader: 'ERIKA ASTOCONDOR', nombreAsesor: 'ELOY RONALDO GUTIERREZ LIZARME', codigoPerop: 'PEROP1AM-42157', campana: 'PERU', turno: '13:00-22:00', descanso: 'JUEVES' },
  { id: 'OP-82', numero: 82, teamleader: 'ERIKA ASTOCONDOR', nombreAsesor: 'CHRISTIAN MARTIN HUALLA HUAMAN', codigoPerop: 'PEROP1AM-41661', campana: 'PERU', turno: '13:00-22:00', descanso: 'SABADO' },

  // Asesores de JHOSEP GARCIA
  { id: 'OP-83', numero: 83, teamleader: 'JHOSEP GARCIA', nombreAsesor: 'APHRIL ELIZABETH FALCON INOCENTE', codigoPerop: 'PEROP1AM-42164', campana: 'ECUADOR', turno: '22:00-07:00', descanso: 'VIERNES' },
  { id: 'OP-84', numero: 84, teamleader: 'JHOSEP GARCIA', nombreAsesor: 'SEBASTIAN ALEJANDRO ROSAS', codigoPerop: 'PEROP1AM-6945', campana: 'ECUADOR', turno: '22:00-07:00', descanso: 'SABADO' },
  { id: 'OP-85', numero: 85, teamleader: 'JHOSEP GARCIA', nombreAsesor: 'DINA ROMANI VEGA', codigoPerop: 'PEROP1AM-41336', campana: 'ECUADOR', turno: '22:00-07:00', descanso: 'DOMINGO' },
  { id: 'OP-86', numero: 86, teamleader: 'JHOSEP GARCIA', nombreAsesor: 'ANELHI NIKOL OCHOCHOQUE MASCO', codigoPerop: 'PEROP1AM-29862', campana: 'ECUADOR', turno: '22:00-07:00', descanso: 'JUEVES' },
  { id: 'OP-87', numero: 87, teamleader: 'JHOSEP GARCIA', nombreAsesor: 'DAYANA DEL PILAR NUNURA MOZOMBITE', codigoPerop: 'PEROP1AM-40099', campana: 'ECUADOR', turno: '22:00-07:00', descanso: 'MARTES' },
  { id: 'OP-88', numero: 88, teamleader: 'JHOSEP GARCIA', nombreAsesor: 'ALEXANDRA XIMENA CALDERON GIRON', codigoPerop: 'PEROP1AM-41776', campana: 'MEXICO', turno: '22:00-07:00', descanso: 'JUEVES' },
  { id: 'OP-89', numero: 89, teamleader: 'JHOSEP GARCIA', nombreAsesor: 'YAJAIRA MILDRED SULLON VILCHEZ', codigoPerop: 'PEROP1AM-40499', campana: 'MEXICO', turno: '22:00-07:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-90', numero: 90, teamleader: 'JHOSEP GARCIA', nombreAsesor: 'ANGEL JHONERICK VASQUEZ PEREDO', codigoPerop: 'PEROP1AM-39257', campana: 'PERU', turno: '22:00-07:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-91', numero: 91, teamleader: 'JHOSEP GARCIA', nombreAsesor: 'SHEILY ESTEFANY SALVADOR OJEDA', codigoPerop: 'PEROP1AM-40012', campana: 'PERU', turno: '22:00-07:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-92', numero: 92, teamleader: 'JHOSEP GARCIA', nombreAsesor: 'ALEX HERNAN MACAVILCA JABEL', codigoPerop: 'PEROP1AM-42183', campana: 'PERU', turno: '22:00-07:00', descanso: 'MARTES' },
  { id: 'OP-93', numero: 93, teamleader: 'JHOSEP GARCIA', nombreAsesor: 'CARLOS ANDRES TAFUR CASTRO', codigoPerop: 'PEROP1AM-41356', campana: 'PERU', turno: '22:00-07:00', descanso: 'LUNES' },
  { id: 'OP-94', numero: 94, teamleader: 'JHOSEP GARCIA', nombreAsesor: 'CARLOS FABRIZIO RAMOS DE ROSAS OLAYA', codigoPerop: 'PEROP1AM-42193', campana: 'PERU', turno: '22:00-07:00', descanso: 'SABADO' },

  // Asesores de MILAGRO MENDOZA
  { id: 'OP-95', numero: 95, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'ROSEMERY ELI ACEVEDO ALBAN', codigoPerop: 'PEROP1AM-41470', campana: 'COSTA RICA', turno: '07:00-16:00', descanso: 'VIERNES' },
  { id: 'OP-96', numero: 96, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'LENYHER DANY SMITH SALVADOR OJEDA', codigoPerop: 'PEROP1AM-42161', campana: 'MEXICO', turno: '07:00-16:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-97', numero: 97, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'RONALD WILLIAM GUTIERREZ ACUÑA', codigoPerop: 'PEROP1AM-42162', campana: 'MEXICO', turno: '07:00-16:00', descanso: 'SABADO' },
  { id: 'OP-98', numero: 98, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'MARICIELO YESBELL YARLEQUE NAVARRO', codigoPerop: 'PEROP1AM-42200', campana: 'MEXICO', turno: '07:00-16:00', descanso: 'VIERNES' },
  { id: 'OP-99', numero: 99, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'RUTH XIOMARA RIOS VARGAS', codigoPerop: 'PEROP1AM-41864', campana: 'PARAGUAY', turno: '07:00-16:00', descanso: 'LUNES' },
  { id: 'OP-100', numero: 100, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'XIMENA ALEXANDRA CALLE ALTAMIRANO', codigoPerop: 'PEROP1AM-42186', campana: 'PARAGUAY', turno: '07:00-16:00', descanso: 'DOMINGO' },
  { id: 'OP-101', numero: 101, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'NEIDRE DEL VALLE GUZMAN ROJAS', codigoPerop: 'PEROP1AM-32514', campana: 'PARAGUAY', turno: '07:00-16:00', descanso: 'DOMINGO' },
  { id: 'OP-102', numero: 102, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'LINDA MELANY FIORELLA SALINAS SAAVEDRA', codigoPerop: 'PEROP1AM-41328', campana: 'PARAGUAY', turno: '07:00-16:00', descanso: 'LUNES' },
  { id: 'OP-103', numero: 103, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'LORENA ANALI NAVARRO ALVARADO', codigoPerop: 'PEROP1AM-39724', campana: 'PARAGUAY', turno: '07:00-16:00', descanso: 'DOMINGO' },
  { id: 'OP-104', numero: 104, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'DIMAS JOSE LUQUEZ VENTURA', codigoPerop: 'PEROP1AM-41384', campana: 'PARAGUAY', turno: '07:00-16:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-105', numero: 105, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'ESTEPHANYE LISSET CONSTANTINO CERVANTES', codigoPerop: 'PEROP1AM-41832', campana: 'PARAGUAY', turno: '07:00-16:00', descanso: 'LUNES' },
  { id: 'OP-106', numero: 106, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'YAJAIRA KAHORI DE LA CRUZ CUEVA', codigoPerop: 'PEROP1AM-41865', campana: 'PARAGUAY', turno: '07:00-16:00', descanso: 'VIERNES' },
  { id: 'OP-107', numero: 107, teamleader: 'MILAGRO MENDOZA', nombreAsesor: 'DANIELA CLAUDIA MICHUE ROJAS', codigoPerop: 'PEROP1AM-42075', campana: 'PARAGUAY', turno: '07:00-16:00', descanso: 'SABADO' },

  // Asesores de NAYELI LOPEZ
  { id: 'OP-108', numero: 108, teamleader: 'NAYELI LOPEZ', nombreAsesor: 'CAMILA VALENTINA ROJAS HIDALGO', codigoPerop: 'PEROP1AM-42135', campana: 'PERU', turno: '07:00-16:00', descanso: 'VIERNES' },
  { id: 'OP-109', numero: 109, teamleader: 'NAYELI LOPEZ', nombreAsesor: 'YASMIN LUCIA POMA ALVINO', codigoPerop: 'PEROP1AM-40172', campana: 'PERU', turno: '07:00-16:00', descanso: 'JUEVES' },
  { id: 'OP-110', numero: 110, teamleader: 'NAYELI LOPEZ', nombreAsesor: 'JENIFER AYUMI MARIA NAVARRO TAKAHASHI', codigoPerop: 'PEROP1AM-42175', campana: 'PERU', turno: '07:00-16:00', descanso: 'VIERNES' },
  { id: 'OP-111', numero: 111, teamleader: 'NAYELI LOPEZ', nombreAsesor: 'JAIRO MORENO ARAUJO', codigoPerop: 'PEROP1AM-41389', campana: 'PERU', turno: '07:00-16:00', descanso: 'MARTES' },
  { id: 'OP-112', numero: 112, teamleader: 'NAYELI LOPEZ', nombreAsesor: 'INGRID ALEXANDRA VILLAR ROMAN', codigoPerop: 'PEROP1AM-41147', campana: 'PERU', turno: '07:00-16:00', descanso: 'DOMINGO' },
  { id: 'OP-113', numero: 113, teamleader: 'NAYELI LOPEZ', nombreAsesor: 'EVA MICAELA GOICOCHEA PEREDA', codigoPerop: 'PEROP1AM-41327', campana: 'PERU', turno: '07:00-16:00', descanso: 'DOMINGO' },
  { id: 'OP-114', numero: 114, teamleader: 'NAYELI LOPEZ', nombreAsesor: 'CRISTHINA JIMENA PUELLES CHARICHE', codigoPerop: 'PEROP1AM-41858', campana: 'PERU', turno: '07:00-16:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-115', numero: 115, teamleader: 'NAYELI LOPEZ', nombreAsesor: 'JEFFERSON OMAR TORRES ALDAZABAL', codigoPerop: 'PEROP1AM-42044', campana: 'PERU', turno: '07:00-16:00', descanso: 'VIERNES' },
  { id: 'OP-116', numero: 116, teamleader: 'NAYELI LOPEZ', nombreAsesor: 'AKEMY ANGOLINE CLAROS ANGULO', codigoPerop: 'PEROP1AM-42138', campana: 'PERU', turno: '07:00-16:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-117', numero: 117, teamleader: 'NAYELI LOPEZ', nombreAsesor: 'ANTONY LEONARDO CURO VEGA', codigoPerop: 'PEROP1AM-42163', campana: 'PERU', turno: '07:00-16:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-118', numero: 118, teamleader: 'NAYELI LOPEZ', nombreAsesor: 'GABRYEL ALEXANDRO MARIN MERINO', codigoPerop: 'PEROP1AM-42166', campana: 'PERU', turno: '07:00-16:00', descanso: 'SABADO' },
  { id: 'OP-119', numero: 119, teamleader: 'NAYELI LOPEZ', nombreAsesor: 'ANGEL SEBASTIAN DOLORES QUISPE', codigoPerop: 'PEROP1AM-42174', campana: 'PERU', turno: '07:00-16:00', descanso: 'VIERNES' },

  // Asesores de ALEXANDER PAJUELO
  { id: 'OP-11', numero: 11, teamleader: 'ALEXANDER PAJUELO', nombreAsesor: 'MARIA DEL CARMEN YAGUA GOMEZ', codigoPerop: 'PEROP1AM-11347', campana: 'PSMEXICO', turno: '09:00-18:00', descanso: 'DOMINGO' },
  { id: 'OP-12', numero: 12, teamleader: 'ALEXANDER PAJUELO', nombreAsesor: 'JORGE ANTONIO MUCHATI GUERRA', codigoPerop: 'PEROP1AM-29501', campana: 'PSMEXICO', turno: '09:00-18:00', descanso: 'LUNES' },
  { id: 'OP-13', numero: 13, teamleader: 'ALEXANDER PAJUELO', nombreAsesor: 'JOHAN STEPH RAMIREZ PUYOSA', codigoPerop: 'PEROP1AM-3296', campana: 'PSMEXICO', turno: '09:00-18:00', descanso: 'VIERNES' },
  { id: 'OP-14', numero: 14, teamleader: 'ALEXANDER PAJUELO', nombreAsesor: 'JHON ANTONI FLORES VEGA', codigoPerop: 'PEROP1AM-40331', campana: 'PSMEXICO', turno: '09:00-18:00', descanso: 'DOMINGO' },
  { id: 'OP-15', numero: 15, teamleader: 'ALEXANDER PAJUELO', nombreAsesor: 'LEONARDO SEBASTIAN CRUZ QUISPE', codigoPerop: 'PEROP1AM-41425', campana: 'PSMEXICO', turno: '09:00-18:00', descanso: 'SABADO' },
  { id: 'OP-16', numero: 16, teamleader: 'ALEXANDER PAJUELO', nombreAsesor: 'MIGUEL ANGEL NAVARRO TAKAHASHI', codigoPerop: 'PEROP1AM-4576', campana: 'PSMEXICO', turno: '09:00-18:00', descanso: 'MARTES' },
  { id: 'OP-17', numero: 17, teamleader: 'ALEXANDER PAJUELO', nombreAsesor: 'ANDRE ANTONIO PINO GUTIERREZ', codigoPerop: 'PEROP1AM-40362', campana: 'PSMEXICO', turno: '09:00-18:00', descanso: 'SABADO' },
  { id: 'OP-18', numero: 18, teamleader: 'ALEXANDER PAJUELO', nombreAsesor: 'RUTH ELIZABETH MENDOZA CASTILLO', codigoPerop: 'PEROP1AM-42168', campana: 'PSMEXICO', turno: '09:00-18:00', descanso: 'DOMINGO' },
  { id: 'OP-19', numero: 19, teamleader: 'ALEXANDER PAJUELO', nombreAsesor: 'JOSE ALBERTO ARTEAGA MUÑOZ', codigoPerop: 'PEROP1AM-42137', campana: 'PSMEXICO', turno: '09:00-18:00', descanso: 'MIÉRCOLES' },
  { id: 'OP-20', numero: 20, teamleader: 'ALEXANDER PAJUELO', nombreAsesor: 'ROBIÑHO QUIJANDRIA REYES', codigoPerop: 'PEROP1AM-41406', campana: 'PSMEXICO', turno: '09:00-18:00', descanso: 'JUEVES' },
  { id: 'OP-21', numero: 21, teamleader: 'ALEXANDER PAJUELO', nombreAsesor: 'NIANCALBERT JESUS VILLEGAS TORO', codigoPerop: 'PEROP1AM-41820', campana: 'PSMEXICO', turno: '09:00-18:00', descanso: 'VIERNES' }
];

/**
 * Normaliza cadenas para búsqueda sin distinguir mayúsculas, minúsculas ni tildes.
 */
function normalizarTexto(texto: string): string {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Busca un operador en la nómina por código PEROP o por nombre de asesor.
 */
export function buscarEnNomina(
  roster: RosterOperator[],
  criterio: string
): RosterOperator | null {
  const norm = normalizarTexto(criterio);
  if (!norm) return null;

  return (
    roster.find(op => {
      const codeNorm = normalizarTexto(op.codigoPerop);
      const nameNorm = normalizarTexto(op.nombreAsesor);
      const tlNorm = normalizarTexto(op.teamleader);
      return codeNorm === norm || nameNorm === norm || nameNorm.includes(norm) || codeNorm.includes(norm);
    }) || null
  );
}

/**
 * Parsea filas de CSV copiadas directamente de la pestaña
 * "Actualizacion de Datos del Operador" de Google Sheets.
 */
export function parsearCsvNomina(csvTexto: string): RosterOperator[] {
  const lineas = csvTexto.split('\n').filter(l => l.trim().length > 0);
  const nuevos: RosterOperator[] = [];

  for (let i = 0; i < lineas.length; i++) {
    const columnas = lineas[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (columnas.length < 5) continue;

    // Detectar si contiene PEROP1AM o co-operator
    const idxPerop = columnas.findIndex(c => c.toUpperCase().includes('PEROP') || c.toLowerCase().includes('operator'));
    if (idxPerop !== -1) {
      const perop = columnas[idxPerop];
      const nombre = columnas[idxPerop - 1] || 'ASESOR NO IDENTIFICADO';
      const tl = columnas[idxPerop - 2] || 'SUPERVISIÓN';
      const campana = columnas[idxPerop + 1] || 'CHILE';
      const turno = columnas[idxPerop + 2] || '07:00-16:00';
      const descanso = columnas[idxPerop + 3] || 'DOMINGO';

      if (perop && !perop.includes('#') && perop.length > 4) {
        nuevos.push({
          id: `IMP-${nuevos.length + 1}`,
          numero: nuevos.length + 1,
          teamleader: tl.replace(/^\d+/, '').trim() || 'SUPERVISIÓN',
          nombreAsesor: nombre,
          codigoPerop: perop,
          campana,
          turno,
          descanso,
          registrado: false
        });
      }
    }
  }

  return nuevos;
}
