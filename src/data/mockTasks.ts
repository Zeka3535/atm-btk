import type {
  AbonEquipment,
  AbonTraffic,
  DemoTask,
  DslamMeasure,
  LanDevice,
  MetricRow,
  ModemPanel,
  PonMeasure,
} from '../types'
import { todayYmd } from '../types'

const ymd = todayYmd()

const METRICS_HW_OK: MetricRow[] = [
  { icon: 'optical', label: 'Оптический уровень', value: '−19.8 дБм' },
  { icon: 'volt', label: 'Напряжение', value: '33.15 В' },
]

const METRICS_ZTE_OK: MetricRow[] = [
  { icon: 'optical', label: 'Оптический уровень', value: '−22.4 дБм' },
  { icon: 'volt', label: 'Напряжение', value: '33.25 В' },
]

const METRICS_ZTE_LOS: MetricRow[] = [
  { icon: 'optical', label: 'Оптический уровень', value: '−28.0 дБм' },
  { icon: 'volt', label: 'Напряжение', value: 'нет данных' },
]

const METRICS_HW_NEW: MetricRow[] = [
  { icon: 'optical', label: 'Оптический уровень', value: 'нет данных' },
  { icon: 'volt', label: 'Напряжение', value: 'нет данных' },
  { icon: 'speed', label: 'Тариф', value: 'Ясна 200 Смарт' },
]

const METRICS_ZTE_NEW: MetricRow[] = [
  { icon: 'optical', label: 'Оптический уровень', value: 'нет данных' },
  { icon: 'volt', label: 'Напряжение', value: 'нет данных' },
  { icon: 'speed', label: 'Тариф', value: 'Ясна 500 Смарт' },
]

const METRICS_DSLAM_OK: MetricRow[] = [
  { icon: 'signal', label: 'SNR вниз / вверх', value: '28 / 24 дБ' },
  { icon: 'attenuation', label: 'Затухание', value: '32 дБ' },
  { icon: 'speed', label: 'Профиль', value: 'ADSL2+ 12/1 Мбит/с' },
  { icon: 'modem', label: 'Порт DSLAM', value: 'Брест-7 / 0/2/3' },
]

const PRIMARY_OK: MetricRow[] = [
  { icon: 'note', label: 'Кросс / пара', value: 'КР-14 / пара 112' },
  { icon: 'signal', label: 'Состояние линии', value: 'Норма' },
  { icon: 'calendar', label: 'Последняя проверка', value: '28.07.2026' },
]

const STB_B900 = (mac: string, serial: string, issuedAt: string): AbonEquipment => ({
  kind: 'stb',
  title: 'Приставка ZALA',
  model: 'B900',
  serial,
  mac,
  issuedAt,
})

const EQ_HW_NEW: AbonEquipment[] = [
  {
    kind: 'modem',
    title: 'Модем Tenda',
    model: 'TS4224',
    serial: 'HWTC4A7B2C91',
    mac: 'A4:C1:38:4A:7B:2C',
    issuedAt: '28.07.2025',
  },
]

const EQ_ZTE_NEW_STB: AbonEquipment[] = [
  {
    kind: 'modem',
    title: 'Модем Universal',
    model: 'MA670-V3-U',
    serial: 'ZTEGC5D8E3F1',
    mac: '00:19:C6:5D:8E:3F',
    issuedAt: '19.06.2025',
  },
  STB_B900('AC:4E:91:B2:11:08', 'B900A1C22817', '19.06.2025'),
]

const EQ_ZTE_OK_STB: AbonEquipment[] = [
  {
    kind: 'modem',
    title: 'Модем ZTE',
    model: 'MA670',
    serial: 'ZTEGC8A1B2C3',
    mac: '00:19:C6:C8:A1:B2',
    issuedAt: '03.02.2025',
  },
  STB_B900('AC:4E:91:77:2D:9A', 'B900C4E19002', '03.02.2025'),
]

const EQ_ZTE_LOS: AbonEquipment[] = [
  {
    kind: 'modem',
    title: 'Модем ZTE',
    model: 'MA670',
    serial: 'ZTEGC8A1B2C3',
    mac: '00:19:C6:C8:A1:B2',
    issuedAt: '03.02.2025',
  },
]

const EQ_HW_ZALA: AbonEquipment[] = [
  {
    kind: 'modem',
    title: 'Модем Universal',
    model: 'MA670-V3-U',
    serial: 'HWTC9F8E7D6',
    mac: 'A4:C1:38:9F:8E:7D',
    issuedAt: '14.11.2024',
  },
  STB_B900('AC:4E:91:08:55:C1', 'B900D8814401', '14.11.2024'),
]

const EQ_DSLAM: AbonEquipment[] = [
  {
    kind: 'modem',
    title: 'Модем ADSL',
    model: 'ZTE H267A',
    serial: 'ZTEADSL129B44',
    mac: 'C8:3A:35:12:9B:44',
    issuedAt: '11.09.2023',
  },
]

const EQ_ZTE_Y50: AbonEquipment[] = [
  {
    kind: 'modem',
    title: 'Модем Tenda',
    model: 'TS4224',
    serial: 'ZTEGC9D2E1F0',
    mac: '00:19:C6:9D:2E:1F',
    issuedAt: '05.04.2024',
  },
]

const LAN_EMPTY: LanDevice[] = []

const LAN_HOME: LanDevice[] = [
  { name: 'iPhone 14', mac: '3C:22:FB:91:A2:10', ip: '192.168.1.12', online: true },
  { name: 'Samsung TV', mac: 'F8:E0:79:44:B1:C8', ip: '192.168.1.24', online: true },
  { name: 'Notebook-PC', mac: 'A0:CE:C8:33:09:7E', ip: '192.168.1.18', online: true },
  { name: 'Xiaomi Redmi', mac: '64:CC:2E:70:15:AA', ip: '192.168.1.31', online: false },
]

const LAN_ZALA: LanDevice[] = [
  { name: 'ZALA B900', mac: 'AC:4E:91:77:2D:9A', ip: '192.168.1.50', online: true },
  { name: 'Galaxy S23', mac: '8C:F5:A3:12:DE:44', ip: '192.168.1.14', online: true },
  { name: 'iPad', mac: 'F0:D1:A9:88:01:B2', ip: '192.168.1.22', online: true },
]

const LAN_OFFLINE: LanDevice[] = [
  { name: 'HUAWEI P40', mac: '00:9A:CD:55:10:03', ip: '192.168.1.16', online: false },
  { name: 'Smart-TV', mac: 'B8:27:EB:9C:41:20', ip: '192.168.1.40', online: false },
]

const TRAFFIC_JULY: AbonTraffic = {
  periodLabel: 'Июль 2026',
  downloadGb: 186.4,
  uploadGb: 24.8,
  sessions: {
    totalHours: 2126,
    averageMinutes: 25920,
    longestMinutes: 67680,
    sessionsCount: 3,
  },
  days: [
    { label: 'Пн', down: 22, up: 3 },
    { label: 'Вт', down: 31, up: 4 },
    { label: 'Ср', down: 18, up: 2 },
    { label: 'Чт', down: 27, up: 5 },
    { label: 'Пт', down: 35, up: 4 },
    { label: 'Сб', down: 41, up: 6 },
    { label: 'Вс', down: 28, up: 3 },
  ],
  months: [
    { label: 'Апр', down: 154, up: 21 },
    { label: 'Май', down: 163, up: 22 },
    { label: 'Июн', down: 171, up: 23 },
    { label: 'Июл', down: 186.4, up: 24.8 },
  ],
}

const TRAFFIC_LOW: AbonTraffic = {
  periodLabel: 'Июль 2026',
  downloadGb: 42.1,
  uploadGb: 6.3,
  sessions: {
    totalHours: 1184,
    averageMinutes: 13680,
    longestMinutes: 34560,
    sessionsCount: 4,
  },
  days: [
    { label: 'Пн', down: 4, up: 1 },
    { label: 'Вт', down: 6, up: 1 },
    { label: 'Ср', down: 5, up: 0.5 },
    { label: 'Чт', down: 7, up: 1 },
    { label: 'Пт', down: 8, up: 1.5 },
    { label: 'Сб', down: 9, up: 1 },
    { label: 'Вс', down: 5, up: 0.5 },
  ],
  months: [
    { label: 'Апр', down: 37.3, up: 5.4 },
    { label: 'Май', down: 39.8, up: 5.9 },
    { label: 'Июн', down: 41.2, up: 6.1 },
    { label: 'Июл', down: 42.1, up: 6.3 },
  ],
}

const TRAFFIC_NONE: AbonTraffic = {
  periodLabel: 'Июль 2026',
  downloadGb: 0,
  uploadGb: 0,
  sessions: {
    totalHours: 0,
    averageMinutes: 0,
    longestMinutes: 0,
    sessionsCount: 0,
  },
  days: [
    { label: 'Пн', down: 0, up: 0 },
    { label: 'Вт', down: 0, up: 0 },
    { label: 'Ср', down: 0, up: 0 },
    { label: 'Чт', down: 0, up: 0 },
    { label: 'Пт', down: 0, up: 0 },
    { label: 'Сб', down: 0, up: 0 },
    { label: 'Вс', down: 0, up: 0 },
  ],
  months: [
    { label: 'Апр', down: 0, up: 0 },
    { label: 'Май', down: 0, up: 0 },
    { label: 'Июн', down: 0, up: 0 },
    { label: 'Июл', down: 0, up: 0 },
  ],
}

const MODEM_NEW_HW: ModemPanel = {
  modemStatus: 'не активирован',
  portStatus: '[OFF]',
  profile: 'Ясна 200 Смарт',
  ports: [
    { name: 'ByFly', enabled: false },
    { name: 'IPTV', enabled: false },
    { name: 'IMS', enabled: false },
    { name: 'Охрана', enabled: false },
  ],
}

const MODEM_NEW_ZTE: ModemPanel = {
  modemStatus: 'не активирован',
  portStatus: '[OFF]',
  profile: 'Ясна 500 Смарт',
  ports: [
    { name: 'ByFly', enabled: false, login: '160002511380012' },
    { name: 'IPTV', enabled: false, login: '160002511380013' },
    { name: 'IMS', enabled: false, login: '160002511380012' },
    { name: 'Охрана', enabled: false },
  ],
}

const MODEM_ZTE_EXTRA_STB: ModemPanel = {
  modemStatus: 'в сети',
  portStatus: '[ON]',
  profile: 'Ясна 500 Смарт',
  speed: '512000 / 256000 кбит/с',
  ports: [
    { name: 'ByFly', enabled: true, login: '160002488120045' },
    { name: 'IPTV', enabled: true, login: '160002488120046' },
    { name: 'IMS', enabled: true, login: '160002488120045' },
    { name: 'Охрана', enabled: false },
  ],
}

const MODEM_ZTE_LOS: ModemPanel = {
  modemStatus: 'потеря сигнала',
  portStatus: '[OFF]',
  profile: 'Ясна 200 Смарт',
  ports: [
    { name: 'ByFly', enabled: false, login: '160002503910078' },
    { name: 'IPTV', enabled: false },
    { name: 'IMS', enabled: false },
    { name: 'Охрана', enabled: false },
  ],
}

const MODEM_HW_ZALA_FAIL: ModemPanel = {
  modemStatus: 'в сети',
  portStatus: '[ON]',
  profile: 'Ясна 500 Смарт',
  speed: '512000 / 256000 кбит/с',
  ports: [
    { name: 'ByFly', enabled: true },
    { name: 'IPTV', enabled: false },
    { name: 'IMS', enabled: true },
    { name: 'Охрана', enabled: false },
  ],
}

const MODEM_DSLAM_OK: ModemPanel = {
  modemStatus: 'в сети',
  portStatus: '[ON]',
  profile: 'ADSL2+ 12/1',
  speed: '11264 / 1024 кбит/с',
  ports: [
    { name: 'ByFly', enabled: true },
    { name: 'IPTV', enabled: false },
    { name: 'IMS', enabled: true },
  ],
}

const MODEM_ZTE_Y50: ModemPanel = {
  modemStatus: 'в сети',
  portStatus: '[ON]',
  profile: 'Ясна 200 Смарт',
  speed: '204800 / 102400 кбит/с',
  ports: [
    { name: 'ByFly', enabled: true, login: '160002520110088' },
    { name: 'IPTV', enabled: false },
    { name: 'IMS', enabled: true, login: '160002520110088' },
    { name: 'Охрана', enabled: false },
  ],
}

function ponHwSeries(baseRx = -16.2): PonMeasure[] {
  /* RX модема −14…−28 дБм — ближе к −28 на грани LOS */
  const pts = [baseRx - 1.1, baseRx - 0.5, baseRx + 0.2, baseRx].map((v) =>
    Math.max(-28, Math.min(-14, v)),
  )
  const stamps = [
    '2026-07-28 09:12:41',
    '2026-07-29 11:04:18',
    '2026-07-30 10:08:55',
    '2026-07-30 13:21:06',
  ]
  return pts.map((rx, i) => {
    const onuUp = Math.max(-28, Math.min(-14, rx + 1.1))
    const oltUp = (-12.85 - (i % 2) * 0.05).toFixed(2)
    const oltDn = (5.0 + (i % 3) * 0.01).toFixed(2)
    return {
      at: stamps[i],
      oltUpDown: `${oltUp}/${oltDn}`,
      onuUpDown: `${onuUp.toFixed(2)}/${rx.toFixed(2)}`,
      /* Затухание на модеме — тот же формат ↑/↓, дБм */
      attenuation: `${onuUp.toFixed(2)}/${rx.toFixed(2)}`,
      delta: i === pts.length - 1 ? '0.0/0' : `${(0.2 + i * 0.1).toFixed(1)}/${(0.1 + i * 0.05).toFixed(2)}`,
      voltage: `${(33.2 + i * 0.05).toFixed(2)} В`,
      laserCurrent: `${16 + (i % 3)} мА`,
      temperature: `${50 + i} °C`,
      onuRx: rx,
    }
  })
}

function ponZteSeries(baseRx = -22.4): PonMeasure[] {
  const pts = [baseRx - 0.8, baseRx - 0.2, baseRx].map((v) =>
    Math.max(-28, Math.min(-14, v)),
  )
  const stamps = ['2026-07-29 14:22:10', '2026-07-30 09:05:33', '2026-07-30 12:48:19']
  return pts.map((rx, i) => {
    const onuUp = Math.max(-28, Math.min(-14, rx + 0.9))
    const oltUp = (-13.1 - i * 0.05).toFixed(2)
    const oltDn = (4.9 + i * 0.05).toFixed(2)
    return {
      at: stamps[i],
      oltUpDown: `${oltUp}/${oltDn}`,
      onuUpDown: `${onuUp.toFixed(2)}/${rx.toFixed(2)}`,
      attenuation: `${onuUp.toFixed(2)}/${rx.toFixed(2)}`,
      delta: `${(0.3 + i * 0.1).toFixed(1)}/0.12`,
      voltage: `${(32.8 + i * 0.1).toFixed(2)} В`,
      laserCurrent: `${15 + i} мА`,
      temperature: `${45 + i} °C`,
      onuRx: rx,
    }
  })
}

function ponZteLosSeries(): PonMeasure[] {
  return [
    {
      at: '2026-07-29 18:10:00',
      oltUpDown: '-13.10/4.90',
      onuUpDown: '-21.90/-22.80',
      attenuation: '-21.90/-22.80',
      delta: '0.2/0.10',
      voltage: '32.90 В',
      laserCurrent: '15 мА',
      temperature: '44 °C',
      onuRx: -22.8,
    },
    {
      at: '2026-07-30 08:40:12',
      oltUpDown: '-13.40/4.70',
      onuUpDown: '-25.50/-26.40',
      attenuation: '-25.50/-26.40',
      delta: '1.8/0.40',
      voltage: '32.40 В',
      laserCurrent: '12 мА',
      temperature: '37 °C',
      onuRx: -26.4,
    },
    {
      at: '2026-07-30 11:05:33',
      oltUpDown: '-13.80/4.20',
      onuUpDown: '-27.20/-28.00',
      attenuation: '-27.20/-28.00',
      delta: '3.2/0.90',
      voltage: '31.80 В',
      laserCurrent: '9 мА',
      temperature: '35 °C',
      onuRx: -28.0,
    },
  ]
}

const DSLAM_MEAS_OK: DslamMeasure[] = [
  {
    at: '2026-07-29 10:15:00',
    speed: '10240 / 1024 кбит/с',
    snr: '26 / 22 дБ',
    attenuation: '34 / 18 дБ',
    attainableRate: '12400 / 1400',
  },
  {
    at: '2026-07-30 11:40:22',
    speed: '11264 / 1024 кбит/с',
    snr: '28 / 24 дБ',
    attenuation: '32 / 17 дБ',
    attainableRate: '13200 / 1500',
  },
]

/**
 * 7 демо-заявок: грамотные тексты, услуги / порты / измерения согласованы.
 * ФИО и адреса вымышленные (Брест).
 */
export const MOCK_TASKS: DemoTask[] = [
  {
    id: 'D1',
    period: 'until17',
    periodLabel: '13:00 - 17:00',
    dateLabel: 'Сегодня',
    address: 'Г. БРЕСТ, УЛ. ОКТЯБРЬСКОЙ РЕВОЛЮЦИИ, Д. 12, КВ. 84',
    addressKey: 'брест-окт-рев-12',
    subscriber: 'Савчук Андрей Викторович',
    phones: ['375336112244'],
    text: 'Ясна 200 Смарт, выдать модем huawei, дог СЦ',
    damage: '0: Нет данных',
    kind: 'connect',
    services: ['wifi'],
    serviceLines: ['ByFly', 'Wi‑Fi'],
    abonServices: [
      { type: 'ByFly', tariff: 'Ясна 200_Smart', status: 'offline', login: '160002496270001' },
      { type: 'Телефония', tariff: 'Городская линия', status: 'offline', cityPhone: '80162434512' },
      { type: 'Wi‑Fi', tariff: 'Роутер', status: 'offline' },
    ],
    wifi: { ssid: 'Beltelecom_Savchuk', password: 'HomeWifi12', band: '2.4 + 5 ГГц' },
    equipment: EQ_HW_NEW,
    lanDevices: LAN_EMPTY,
    traffic: TRAFFIC_NONE,
    carrier: 3,
    carrierMetrics: METRICS_HW_NEW,
    modem: MODEM_NEW_HW,
    isNew: true,
    isOtpisano: false,
    isClosed: false,
    isSended: false,
    isIzveschenie: false,
    reportText: '',
    reportDraft: '',
    reportSentDay: '',
    history: [
      {
        date: '2026-07-30',
        worker: 'Ковалёв А.С.',
        note: 'Ясна 200 Смарт, выдать модем huawei, дог СЦ',
        closeNote: '—',
      },
    ],
  },
  {
    id: 'D2',
    period: 'until17',
    periodLabel: '13:00 - 17:00',
    dateLabel: 'Сегодня',
    address: 'БРЕСТ Г., МОСКОВСКАЯ УЛ., Д. 45, КВ. 18',
    addressKey: 'брест-московская-45',
    subscriber: 'Кравченко Ирина Петровна',
    phones: ['375297701122', '375333001100'],
    text: 'Договор в СЦ. Мастеру выдать модем huawei и приставку В900. Ясна 500 Смарт. Предв. позвонить!',
    damage: '0: Нет данных',
    kind: 'connect',
    services: ['wifi', 'tv'],
    serviceLines: ['ByFly + ZALA', 'Wi‑Fi'],
    abonServices: [
      { type: 'ByFly + ZALA', tariff: 'Ясна 500_Smart', status: 'offline', login: '160002511380012' },
      { type: 'Телефония', tariff: 'Городская линия', status: 'offline', cityPhone: '80162410844' },
      { type: 'Wi‑Fi', tariff: 'Роутер', status: 'offline' },
    ],
    wifi: { ssid: 'ZTE_Home_45', password: 'KravWifi88', band: '2.4 ГГц' },
    equipment: EQ_ZTE_NEW_STB,
    lanDevices: LAN_EMPTY,
    traffic: TRAFFIC_NONE,
    carrier: 2,
    carrierMetrics: METRICS_ZTE_NEW,
    modem: MODEM_NEW_ZTE,
    isNew: true,
    isOtpisano: false,
    isClosed: false,
    isSended: false,
    isIzveschenie: false,
    reportText: '',
    reportDraft: '',
    reportSentDay: '',
    history: [
      {
        date: '2026-07-30',
        worker: 'Ковалёв А.С.',
        note: 'Договор в СЦ. Мастеру выдать модем huawei и приставку В900. Ясна 500 Смарт. Предв. позвонить!',
        closeNote: '—',
      },
    ],
  },
  {
    id: 'D3',
    period: 'until17',
    periodLabel: '13:00 - 17:00',
    dateLabel: 'Сегодня',
    address: 'БРЕСТ Г., МОСКОВСКАЯ УЛ., Д. 45, КВ. 52',
    addressKey: 'брест-московская-45',
    subscriber: 'Мельник Сергей Александрович',
    phones: ['375292264100'],
    text: 'Ясна 500 Смарт, выдать модем zte, дог СЦ',
    damage: '0: Нет данных',
    kind: 'connect',
    services: ['wifi', 'tv'],
    serviceLines: ['ByFly + ZALA'],
    abonServices: [
      { type: 'ByFly + ZALA', tariff: 'Ясна 500_Smart', status: 'online', login: '160002488120045' },
      { type: 'Телефония', tariff: 'Городская линия', status: 'online', cityPhone: '80162431190' },
      { type: 'Wi‑Fi', tariff: 'Роутер', status: 'online' },
    ],
    wifi: { ssid: 'Melnik_WiFi', password: 'PassMelnik1', band: '2.4 ГГц' },
    equipment: EQ_ZTE_OK_STB,
    lanDevices: LAN_ZALA,
    traffic: TRAFFIC_JULY,
    carrier: 2,
    carrierMetrics: METRICS_ZTE_OK,
    modem: MODEM_ZTE_EXTRA_STB,
    ponMeasures: ponZteSeries(),
    isNew: false,
    isOtpisano: false,
    isClosed: false,
    isSended: false,
    isIzveschenie: false,
    reportText: '',
    reportDraft: '',
    reportSentDay: '',
    history: [
      {
        date: '2026-07-30',
        worker: 'Ковалёв А.С.',
        note: 'Ясна 500 Смарт, выдать модем zte, дог СЦ',
        closeNote: '—',
      },
    ],
  },
  {
    id: 'D4',
    period: 'until17',
    periodLabel: '9:00 - 13:00',
    dateLabel: 'Сегодня',
    address: 'БРЕСТ Г., ОРЛОВСКАЯ УЛ., Д. 12, КВ. 7',
    addressKey: 'брест-орловская-12',
    subscriber: 'ООО «БрестТоргСервис»',
    phones: ['375447201198'],
    text: 'До 13:00. Потеря сигнала (LOS), индикатор ONU мигает. Нет интернета и телефонии. Контакт: +375 44 720-11-98 (МТС).',
    damage: '649: Не работает телефон',
    kind: 'repair',
    services: ['wifi'],
    serviceLines: ['ByFly', 'Wi‑Fi'],
    abonServices: [
      { type: 'ByFly', tariff: 'Ясна 200_Smart', status: 'offline', login: '160002503910078' },
      {
        type: 'Телефония',
        tariff: 'Городская линия',
        status: 'offline',
        cityPhone: '80162456033',
        cityPhones: ['80162456034', '80162456035', '80162456040', '80162456112'],
      },
      { type: 'Wi‑Fi', tariff: 'Роутер', status: 'offline' },
    ],
    wifi: { ssid: 'Boyko_Home', password: 'Orlovskaya12', band: '2.4 + 5 ГГц' },
    equipment: EQ_ZTE_LOS,
    lanDevices: LAN_OFFLINE,
    traffic: TRAFFIC_LOW,
    carrier: 2,
    carrierMetrics: METRICS_ZTE_LOS,
    modem: MODEM_ZTE_LOS,
    ponMeasures: ponZteLosSeries(),
    isNew: false,
    isOtpisano: false,
    isClosed: false,
    isSended: false,
    isIzveschenie: false,
    reportText: '',
    reportDraft: '',
    reportSentDay: '',
    history: [
      {
        date: '2026-07-30',
        worker: 'Ковалёв А.С.',
        note: 'До 13:00. Потеря сигнала (LOS), индикатор ONU мигает. Нет интернета и телефонии.',
        closeNote: '—',
      },
    ],
  },
  {
    id: 'D5',
    period: 'until17',
    periodLabel: '9:00 - 13:00',
    dateLabel: 'Сегодня',
    address: 'БРЕСТ Г., ПИОНЕРСКАЯ УЛ., Д. 28, КВ. 14',
    addressKey: 'брест-пионерская-28',
    subscriber: 'Левчук Виктор Павлович',
    phones: ['375333445566'],
    text: 'Повторный выезд: не работает ZALA. Интернет ок. Приставка В900. Предв. позвонить!',
    damage: '634: Другие ошибки ZALA',
    kind: 'repair',
    services: ['tv'],
    serviceLines: ['ByFly + ZALA'],
    abonServices: [
      { type: 'ByFly + ZALA', tariff: 'Ясна 500_Smart', status: 'online', login: '160002477650033' },
      { type: 'Телефония', tariff: 'Городская линия', status: 'online', cityPhone: '80162471458' },
    ],
    wifi: { ssid: 'Levchuk_Net', password: 'ZalaWifi99', band: '5 ГГц' },
    equipment: EQ_HW_ZALA,
    lanDevices: LAN_ZALA,
    traffic: TRAFFIC_JULY,
    carrier: 3,
    carrierMetrics: METRICS_HW_OK,
    modem: MODEM_HW_ZALA_FAIL,
    ponMeasures: ponHwSeries(-16.2),
    isNew: false,
    isOtpisano: true,
    isClosed: false,
    isSended: false,
    isIzveschenie: false,
    reportText: '',
    reportDraft: '',
    reportSentDay: '',
    history: [
      {
        date: '2026-07-29',
        worker: 'Петров И.В.',
        note: 'Не работает ZALA. Интернет ок. Приставка В900.',
        closeNote: 'Отказ: абонент отсутствовал.',
      },
      {
        date: '2026-07-30',
        worker: 'Ковалёв А.С.',
        note: 'Повторный выезд: не работает ZALA. Приставка В900. Предв. позвонить!',
        closeNote: '—',
      },
    ],
  },
  {
    id: 'D7',
    period: 'morning',
    periodLabel: 'В течение дня',
    dateLabel: 'Сегодня',
    address: 'БРЕСТ Г., КАРБЫШЕВА УЛ., Д. 6, КВ. 11',
    addressKey: 'брест-карбышева-6',
    subscriber: 'Жук Артём Валерьевич',
    phones: ['375291445566'],
    text: 'Платный выезд: настройка Wi‑Fi, смена пароля.',
    damage: '502: Настройка оборудования',
    kind: 'paid',
    services: ['pay', 'wifi'],
    serviceLines: ['Платный выезд', 'Wi‑Fi'],
    abonServices: [
      { type: 'ByFly', tariff: 'Ясна 200_Smart', status: 'online', login: '160001905670021' },
      { type: 'Телефония', tariff: 'Городская линия', status: 'online', cityPhone: '80162429015' },
      { type: 'Wi‑Fi', tariff: 'Роутер', status: 'online' },
    ],
    wifi: { ssid: 'Zhuk_WiFi', password: 'ChangeMe01', band: '2.4 ГГц' },
    equipment: EQ_DSLAM,
    lanDevices: LAN_HOME,
    traffic: TRAFFIC_LOW,
    carrier: 1,
    carrierMetrics: METRICS_DSLAM_OK,
    primaryMetrics: PRIMARY_OK,
    modem: MODEM_DSLAM_OK,
    dslamMeasures: DSLAM_MEAS_OK,
    isNew: false,
    isOtpisano: false,
    isClosed: false,
    isSended: false,
    isIzveschenie: false,
    reportText: '',
    reportDraft: '',
    reportSentDay: '',
    history: [
      {
        date: '2026-07-30',
        worker: 'Ковалёв А.С.',
        note: 'Платный выезд: настройка Wi‑Fi, смена пароля.',
        closeNote: '—',
      },
    ],
  },
  {
    id: 'C1',
    period: 'until17',
    periodLabel: '13:00 - 17:00',
    dateLabel: 'Сегодня',
    address: 'БРЕСТ Г., КРАСНОЗНАМЁННАЯ УЛ., Д. 15, КВ. 22',
    addressKey: 'брест-краснознаменная-15',
    subscriber: 'Кузнецова Марина Олеговна',
    phones: ['375447556677'],
    text: 'Ясна 200 Смарт, выдать модем zte, дог СЦ',
    damage: '0: Нет данных',
    kind: 'connect',
    services: ['wifi'],
    serviceLines: ['ByFly', 'Wi‑Fi'],
    abonServices: [
      { type: 'ByFly', tariff: 'Ясна 200_Smart', status: 'online', login: '160002520110088' },
      { type: 'Телефония', tariff: 'Городская линия', status: 'online', cityPhone: '80162451522' },
      { type: 'Wi‑Fi', tariff: 'Роутер', status: 'online' },
    ],
    wifi: { ssid: 'Kuznetsova_50', password: 'HomePass50', band: '2.4 ГГц' },
    equipment: EQ_ZTE_Y50,
    lanDevices: LAN_HOME,
    traffic: TRAFFIC_JULY,
    carrier: 2,
    carrierMetrics: [
      { icon: 'optical', label: 'Оптический уровень', value: '−21.6 дБм' },
      { icon: 'volt', label: 'Напряжение', value: '33.10 В' },
    ],
    modem: MODEM_ZTE_Y50,
    ponMeasures: ponZteSeries(-21.6),
    isNew: false,
    isOtpisano: false,
    isClosed: true,
    isSended: true,
    isIzveschenie: false,
    reportText: 'Модем установлен, услуги работают.',
    reportDraft: '',
    reportSentDay: ymd,
    history: [
      {
        date: '2026-07-30',
        worker: 'Сидоров М.А.',
        note: 'Ясна 200 Смарт, выдать модем zte, дог СЦ',
        closeNote: 'Модем установлен, услуги работают.',
      },
    ],
  },
]

const PERIOD_ORDER: Record<string, number> = {
  morning: 0,
  until17: 1,
  evening: 2,
}

export function isReportSentToday(t: DemoTask): boolean {
  return t.isSended && t.reportSentDay === todayYmd()
}

export function sortIncoming(tasks: DemoTask[]): DemoTask[] {
  const open = tasks.filter((t) => !t.isClosed)
  const active = open.map((t) => {
    if (t.isSended && t.reportSentDay && t.reportSentDay !== todayYmd()) {
      return { ...t, isSended: false }
    }
    return t
  })
  const reported = active.filter((t) => isReportSentToday(t))
  const rest = active.filter((t) => !isReportSentToday(t))
  rest.sort((a, b) => PERIOD_ORDER[a.period] - PERIOD_ORDER[b.period])
  return [...rest, ...reported]
}

/** Только окончательно закрытые */
export function closedTasks(tasks: DemoTask[]): DemoTask[] {
  return tasks.filter((t) => t.isClosed)
}
