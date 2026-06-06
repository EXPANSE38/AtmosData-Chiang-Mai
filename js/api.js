// ===== AtmosData - Air Quality API Service =====

import { API_BASE, DISTRICTS, CURRENT_FIELDS, HOURLY_FIELDS } from './config.js';

class AirQualityAPI {
    constructor() {
        this._cache = new Map();
        this._cacheTTL = 10 * 60 * 1000; // 10 min
    }

    _buildUrl(lat, lng, { pastDays = 7, forecastDays = 3 } = {}) {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lng,
            current: CURRENT_FIELDS,
            hourly: HOURLY_FIELDS,
            timezone: 'Asia/Bangkok',
            past_days: pastDays,
            forecast_days: forecastDays,
        });
        return `${API_BASE}?${params}`;
    }

    async _fetchCached(url) {
        const now = Date.now();
        const cached = this._cache.get(url);
        if (cached && now - cached.ts < this._cacheTTL) {
            return cached.data;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json();
        this._cache.set(url, {data, ts: now });
        return data;
    }

    async fetchDistrict(district, options = {}) {
        const url = this._buildUrl(district.lat, district.lng, options);
        const data = await this._fetchCached(url);
        return { ...district, data };
    }

    async fetchAllDistricts(options = {}) {
        const results =  await Promise.allSettled(
            DISTRICTS.map(d => this.fetchDistrict(d, options))
        );
        return results.map((result, i) => {
            if (result.status === 'fulfilled') return result.value;
            return { ...DISTRICTS[i], data: null, error: result.reason?.message };
        });
    }

    async fetchAllCurrent() {
        return this.fetchAllDistricts({ pastDays: 1, forecastDays: 1});
    }

    extractHourlyData(apiData, hours = 24) {
        if (!apiData?.hourly) return { times: [], pm25: [], pm10: [], aqi: [], euAqi: [], co: [], no2: [], so2: [], o3: [], dust: [] };
        const h = apiData.hourly;
        const now = new Date();
        const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);

        const indices = [];
        for (let i = 0; i < h.time.length; i++) {
            const t = new Date(h.time[i]);
            if (t >= cutoff && t <= now) indices.push(i);
        }

        return {
            times: indices.map(i => h.time[i]),
            pm25: indices.map(i => h.pm2_5?.[i]),
            pm10: indices.map(i => h.pm10?.[i]),
            aqi: indices.map(i => h.us_aqi?.[i]),
            euAqi: indices.map(i => h.european_aqi?.[i]),
            co: indices.map(i => h.carbon_monoxide?.[i]),
            no2: indices.map(i => h.nitrogen_dioxide?.[i]),
            so2: indices.map(i => h.sulphur_dioxide?.[i]),
            o3: indices.map(i => h.ozone?.[i]),
            dust: indices.map(i => h.dust?.[i]),
        };
    }

    extractDailyAverages(apiData, days = 7) {
        if (!apiData?.hourly) return { dates: [], pm25: [], pm10: [], aqi: [] };
        const { time, pm2_5, pm10, us_aqi } = apiData.hourly;
        const byDate = {};

        for ( let i = 0; i < time.length; i++) {
            const date = time[i].split('T')[0];
            if (!byDate[date]) byDate[date] = { pm25: [], pm10: [], aqi: [] };
            if (pm2_5?.[i] != null) byDate[date].pm25.push(pm2_5[i]);
            if (pm10?.[i] != null) byDate[date].pm10.push(pm10[i]);
            if (us_aqi?.[i] != null) byDate[date].aqi.push(us_aqi[i]);
        }

        const sortedDates = Object.keys(byDate).sort().slice(-days);
        const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

        return {
            dates: sortedDates,
            pm25: sortedDates.map(d => avg(byDate[d].pm25)),
            pm10: sortedDates.map(d => avg(byDate[d].pm10)),
            aqi: sortedDates.map(d => avg(byDate[d].aqi)),
        };
    }

    clearCache() {
        this._cache.clear();
    }
}

export const airQualityAPI = new AirQualityAPI();