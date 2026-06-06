// ===== AtmosData Chiang Mai - Configuration =====

export const APP_NAME = 'AtmosData';
export const APP_FULL_NAME = 'AtmosData Chiang Mai';

// SVG icon paths (Lucide-compatible, 24x24 viewBox)
export const ICONS = {
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  dashboard: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>',
  map: '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  ranking: '<path d="M8 21h8m-4-4v4m-2.8-4h5.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C18 15.48 18 14.92 18 13.8V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C16.48 3 15.92 3 14.8 3H9.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C6 4.52 6 5.08 6 6.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C7.52 17 8.08 17 9.2 17z"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  wind: '<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  thermometer: '<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
  arrowUp: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  arrowDown: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  refresh: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  alertTriangle: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4m0 4h.01"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
  activity: '<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  mapPin: '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  droplets: '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
  layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  externalLink: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  listOrdered: '<line x1="10" x2="21" y1="6" y2="6"/><line x1="10" x2="21" y1="12" y2="12"/><line x1="10" x2="21" y1="18" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
  bellOff: '<path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"/><path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="m2 2 20 20"/>',
};

    /** Create an SVG icon element string */
export function icon(name, size = 20) {
  const path = ICONS[name] || '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">${path}</svg>`;
}

// Chiang Mai district monitoring stations (17 points across the province)
export const DISTRICTS = [
  { id: 'mueang', name: 'เมืองเชียงใหม่', nameEn: 'Mueang', lat: 18.7883, lng: 98.9853 },
  { id: 'mae-rim', name: 'แม่ริม', nameEn: 'Mae Rim', lat: 18.9157, lng: 98.9525 },
  { id: 'san-sai', name: 'สันทราย', nameEn: 'San Sai', lat: 18.8452, lng: 99.0367 },
  { id: 'hang-dong', name: 'หางดง', nameEn: 'Hang Dong', lat: 18.6917, lng: 98.9242 },
  { id: 'san-kamphaeng', name: 'สันกำแพง', nameEn: 'San Kamphaeng', lat: 18.7445, lng: 99.1223 },
  { id: 'doi-saket', name: 'ดอยสะเก็ด', nameEn: 'Doi Saket', lat: 18.8745, lng: 99.1594 },
  { id: 'saraphi', name: 'สารภี', nameEn: 'Saraphi', lat: 18.6818, lng: 99.0251 },
  { id: 'mae-taeng', name: 'แม่แตง', nameEn: 'Mae Taeng', lat: 19.1174, lng: 98.9250 },
  { id: 'chiang-dao', name: 'เชียงดาว', nameEn: 'Chiang Dao', lat: 19.3628, lng: 98.9680 },
  { id: 'fang', name: 'ฝาง', nameEn: 'Fang', lat: 19.9164, lng: 99.2036 },
  { id: 'phrao', name: 'พร้าว', nameEn: 'Phrao', lat: 19.3649, lng: 99.2042 },
  { id: 'hot', name: 'ฮอด', nameEn: 'Hot', lat: 18.1908, lng: 98.5981 },
  { id: 'chom-thong', name: 'จอมทอง', nameEn: 'Chom Thong', lat: 18.4200, lng: 98.6720 },
  { id: 'mae-chaem', name: 'แม่แจ่ม', nameEn: 'Mae Chaem', lat: 18.4970, lng: 98.3730 },
  { id: 'san-pa-tong', name: 'สันป่าตอง', nameEn: 'San Pa Tong', lat: 18.6242, lng: 98.8499 },
  { id: 'mae-ai', name: 'แม่อาย', nameEn: 'Mae Ai', lat: 20.0297, lng: 99.2860 },
  { id: 'wiang-haeng', name: 'เวียงแหง', nameEn: 'Wiang Haeng', lat: 19.5514, lng: 98.6437 },
];

// US AQI breakpoints
export const AQI_LEVELS = [
  { min: 0, max: 50, label: 'ดี', labelEn: 'Good', color: '#22c55e', bg: 'rgba(34,197,94,0.10)' },
  { min: 51, max: 100, label: 'ปานกลาง', labelEn: 'Moderate', color: '#eab308', bg: 'rgba(234,179,8,0.10)' },
  { min: 101, max: 150, label: 'มีผลต่อกลุ่มเสี่ยง', labelEn: 'Unhealthy for Sensitive', color: '#f97316', bg: 'rgba(249,115,22,0.10)' },
  { min: 151, max: 200, label: 'มีผลต่อสุขภาพ', labelEn: 'Unhealthy', color: '#ef4444', bg: 'rgba(239,68,68,0.10)' },
  { min: 201, max: 300, label: 'อันตรายมาก', labelEn: 'Very Unhealthy', color: '#a855f7', bg: 'rgba(168,85,247,0.10)' },
  { min: 301, max: 500, label: 'วิกฤต', labelEn: 'Hazardous', color: '#881337', bg: 'rgba(136,19,55,0.10)' },
];

// Health advice
export const HEALTH_ADVICE = [
  {
    maxAqi: 50,
    general: 'คุณภาพอากาศดี สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ',
    students: 'นักเรียนสามารถออกกำลังกายกลางแจ้งได้ตามปกติ',
    elderly: 'ผู้สูงอายุสามารถทำกิจกรรมกลางแจ้งได้ตามปกติ',
    sensitive: 'ผู้ป่วยภูมิแพ้สามารถทำกิจกรรมได้ตามปกติ',
  },
  {
    maxAqi: 100,
    general: 'คุณภาพอากาศพอใช้ กลุ่มเสี่ยงควรระวัง',
    students: 'นักเรียนสามารถออกกำลังกายได้ แต่ควรสังเกตอาการ',
    elderly: 'ผู้สูงอายุควรลดกิจกรรมกลางแจ้งที่ต้องออกแรงมาก',
    sensitive: 'ผู้ป่วยภูมิแพ้ควรพกยาติดตัวและหลีกเลี่ยงกิจกรรมหนัก',
  },
  {
    maxAqi: 150,
    general: 'เริ่มมีผลกระทบต่อกลุ่มเสี่ยง ควรสวมหน้ากาก N95',
    students: 'นักเรียนควรลดกิจกรรมกลางแจ้ง เปลี่ยนเป็นในร่ม',
    elderly: 'ผู้สูงอายุควรอยู่ในอาคารและปิดหน้าต่าง',
    sensitive: 'ผู้ป่วยภูมิแพ้ควรงดกิจกรรมกลางแจ้ง สวมหน้ากาก N95',
  },
  {
    maxAqi: 200,
    general: 'มีผลกระทบต่อสุขภาพทุกคน ควรหลีกเลี่ยงกิจกรรมกลางแจ้ง',
    students: 'นักเรียนงดออกกำลังกายกลางแจ้ง ใช้ห้องเรียนปิดเครื่องฟอก',
    elderly: 'ผู้สูงอายุงดออกนอกอาคาร ใช้เครื่องฟอกอากาศ',
    sensitive: 'ผู้ป่วยภูมิแพ้งดกิจกรรมกลางแจ้ง พบแพทย์หากมีอาการ',
  },
  {
    maxAqi: 300,
    general: 'อันตรายมาก ทุกคนควรอยู่ในอาคารที่มีเครื่องฟอก',
    students: 'โรงเรียนควรพิจารณาปิดเรียนหรือเรียนออนไลน์',
    elderly: 'ผู้สูงอายุงดออกนอกอาคาร เปิดเครื่องฟอกอากาศตลอด',
    sensitive: 'ผู้ป่วยภูมิแพ้ควรพบแพทย์หากมีอาการ งดออกนอกอาคาร',
  },
  {
    maxAqi: 500,
    general: 'วิกฤต ทุกคนต้องอยู่ในอาคาร สวม N95 หากจำเป็นต้องออก',
    students: 'งดกิจกรรมทุกชนิดกลางแจ้ง โรงเรียนควรปิดเรียน',
    elderly: 'ผู้สูงอายุห้ามออกนอกอาคาร ติดต่อแพทย์หากมีอาการ',
    sensitive: 'ผู้ป่วยภูมิแพ้ห้ามออกนอกอาคาร เตรียมยาพร้อมใช้',
  },
];

// Open-Meteo Air Quality API
export const API_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// All pollutant fields we want to request
export const CURRENT_FIELDS = 'pm2_5,pm10,us_aqi,european_aqi,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,uv_index,ammonia,alder_pollen,birch_pollen,grass_pollen';
export const HOURLY_FIELDS = 'pm2_5,pm10,us_aqi,european_aqi,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust';

// Map defaults
export const MAP_CENTER = [18.7883, 98.9853];
export const MAP_ZOOM = 9;
export const MAP_TILE_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
export const MAP_TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/** Tile providers tried in order — works when school WiFi blocks one CDN */
export const MAP_TILE_SOURCES = {
    dark: [
        {
            name: 'CARTO Dark',
            url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
            subdomains: 'abcd',
            attribution: MAP_ATTRIBUTION,
            detectRetina: true,
        },
        {
            name: 'CARTO Voyager',
            url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            subdomains: 'abcd',
            attribution: MAP_ATTRIBUTION,
            detectRetina: false,
        },
        {
            name: 'OpenStreetMap',
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            subdomains: '',
            attribution: OSM_ATTRIBUTION,
            detectRetina: false,
        },
    ],
    light: [
        {
            name: 'CARTO Light',
            url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            subdomains: 'abcd',
            attribution: MAP_ATTRIBUTION,
            detectRetina: true,
        },
        {
            name: 'CARTO Voyager',
            url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            subdomains: 'abcd',
            attribution: MAP_ATTRIBUTION,
            detectRetina: false,
        },
        {
            name: 'OpenStreetMap',
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            subdomains: '',
            attribution: OSM_ATTRIBUTION,
            detectRetina: false,
        },
    ],
};
