// ===== Atmos Data Chiang Mai - Utility helpers=====

import { AQI_LEVELS, HEALTH_ADVICE } from './config.js';

//** Get the AQI level object for a given US AQI value */
export function getAqiLevel(aqi) {
    if (aqi == null || isNaN(aqi)) return AQI_LEVELS[0];
    for (const level of AQI_LEVELS) {
        if (aqi <= level.max) return level;
    }
    return AQI_LEVELS[AQI_LEVELS.length - 1];
}

/** Get the health advice for a given AQI */
export function getHealthAdvice(aqi) {
    if (aqi == null || isNaN(aqi)) return HEALTH_ADVICE[0];
    for (const advice of HEALTH_ADVICE) {
        if (aqi <= advice.maxAqi) return advice;
    }
    return HEALTH_ADVICE[HEALTH_ADVICE.length - 1];
}

/** Format a number with locale */
export function formatNumber(num, decimals = 1) {
    if (num == null || isNaN(num)) return '-';
    return Number(num).toFixed(decimals);
}

/** Format ISO date string to Thai locale */
export function formatDateThai(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
}

//* Format ISO date string to time (HH:mm) */
export function formatTime(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
}

//** Format ISO date string to short datetime */
export function formatDateTime(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

//** Relative time label (e.g., "5 นาทีที่แล้ว") */
export function timeAgo(dateStr) {
    if (!dateStr) return '-';
    const now = Date.now();
    const then = new Date(dateStr).getTime();
    const diff = Math.floor((now - then) / 1000);
    
    if (diff < 60) return 'เมื่อสักครู่';
    if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ชั่วโมงที่แล้ว`;
    return `${Math.floor(diff / 86400)} วันที่แล้ว`;
}

//** Create an HTML element from a template string */
export function html(strings, ...values) {
    return strings.reduce((result, str, i) => result + str + (values[i] || ''), '');
}

//** Create a DOM element from HTML string */
export function createElement(htmlString) {
    const template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
}

//** Debounce Utility */
export function debounce(fn, ms = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    };
}

/** Animate a number counting up */
export function animateNumber(element, target, duration = 800) {
    const start = parseFloat(element.textContent) || 0;
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        const current = start + (target - start) * eased;
        element.textContent = formatNumber(current, target % 1 === 0 ? 0 : 1);
        if (progress < 1) requestAnimationFrame(update);
    }
    
    requestAnimationFrame(update);
    }
    
/** Store/retrieve from localStorage */
export const storage = {
    get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(`atmostdata_${key}`);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(`atmostdata_${key}`, JSON.stringify(value));
        } catch { /* quota exceeded - ignore */ }
    },
    remove(key) {
        localStorage.removeItem(`atmostdata_${key}`);
    },
};
