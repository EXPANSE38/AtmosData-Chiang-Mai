// ===== AtmosData Chiang Mai - Dashboard Page =====

import { airQualityAPI } from '../api.js';
import { getAqiLevel, formatNumber, animateNumber } from '../utils.js';
import { createLineChart, createBarChart } from '../components/charts.js';
import { DISTRICTS, icon } from '../config.js';

export class DashboardPage {
    constructor(container) {
        this.container = container;
        this.charts = [];
        this.selectedDistrict = this._getDistrictFromHash() || DISTRICTS[0].id;
    }

    _getDistrictFromHash() {
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        return params.get('district');
    }

    async render() {
        this.container.innerHTML = `
            <div class="page dashboard-page">
                <div class="section_header">
                    <div>
                        <h2 style="display:flex;align-items:center;gap:var(--space-sm)">${icon('dashboard', 24)} แดชบอร์ด</h2>
                        <div class="section_subtitle">ข้อมูลคุณภาพอากาศละเอียดรายสถานี</div>
                    </div>
                </div>

                <div class="dashboard-controls">
                    <div class="input-group">
                        <label class="input-group_label">เลือกอำเภอ</label>
                        <select class="select" id="district-select">
                            ${DISTRICTS.map(d => `
                                <option value="${d.id}" ${d.id === this.selectedDistrict ? 'selected' : ''}>
                                    ${d.name} (${d.nameEn})
                                </option>
                            `).join('')}
                        </select>
                    </div>
                </div>

                <div class="dashboard-data" id="dashboard-data">
                <div class="dashboard-stats" id="stats">
                    ${this._renderStatSkeletons()}
                </div>

                <div class="section dashboard-pollutants-section">
                    <div class="section_title dashboard-pollutants-section__title">${icon('droplets', 18)} สารมลพิษปัจจุบัน</div>
                    <div class="dashboard-pollutants" id="dashboard-pollutants">
                        ${Array(8).fill('<div class="card pollutant-card pollutant-card--skeleton skeleton"></div>').join('')}
                    </div>
                </div>

                <div class="dashboard-charts">
                    <div class="card dashboard-chart-card">
                        <div class="section_title" style="margin-bottom:var(--space-md);display:flex;align-items:center;gap:var(--space-sm)">${icon('activity', 18)} PM2.5 ย้อนหลัง 24 ชั่วโมง</div>
                        <div class="chart-container" style="height:300px">
                            <canvas id="dash-chart-24h"></canvas>
                        </div>
                    </div>

                    <div class="card dashboard-chart-card">
                        <div class="section_title" style="margin-bottom:var(--space-md);display:flex;align-items:center;gap:var(--space-sm)">${icon('clock', 18)} ค่าเฉลี่ย PM2.5 รายวัน (7 วัน)</div>
                        <div class="chart-container" style="height:300px">
                            <canvas id="dash-chart-7d"></canvas>
                        </div>
                    </div>

                    <div class="card dashboard-chart-card">
                        <div class="section_title" style="margin-bottom:var(--space-md);display:flex;align-items:center;gap:var(--space-sm)">${icon('layers', 18)} เปรียบเทียบรายอำเภอ</div>
                        <div class="chart-container" style="height:300px">
                            <canvas id="dash-chart-compare"></canvas>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        `;

        document.getElementById('district-select').addEventListener('change', async (e) => {
            this.selectedDistrict = e.target.value;
            this._syncDistrictHash();
            await this._loadData({ animate: true });
        });

        await this._loadData({ animate: false });
    }

    _syncDistrictHash() {
        const newHash = `#/dashboard?district=${encodeURIComponent(this.selectedDistrict)}`;
        if (window.location.hash !== newHash) {
            history.replaceState(null, '', newHash);
        }
    }

    async onRouteQueryChange() {
        const district = this._getDistrictFromHash();
        if (!district || district === this.selectedDistrict) return;

        this.selectedDistrict = district;
        const selectEl = document.getElementById('district-select');
        if (selectEl) selectEl.value = this.selectedDistrict;
        await this._loadData({ animate: true });
    }

    async _loadData({ animate = false } = {}) {
        const dataEl = document.getElementById('dashboard-data');
        const selectEl = document.getElementById('district-select');

        if (animate) {
            dataEl?.classList.add('dashboard-data--updating');
            if (selectEl) selectEl.disabled = true;
        }

        try {
            const [districtData, allDistricts] = await Promise.all([
                airQualityAPI.fetchDistrict(
                    DISTRICTS.find(d => d.id === this.selectedDistrict) || DISTRICTS[0]
                ),
                airQualityAPI.fetchAllCurrent(),
            ]);

            if (animate) {
                await this._wait(180);
            }

            this._updateStats(districtData, { animate });
            this._updatePollutants(districtData);
            this._updateCharts(districtData);
            this._updateCompareChart(allDistricts);

            if (animate) {
                dataEl?.classList.remove('dashboard-data--updating');
                this._playEnterAnimation();
            }
        } catch (err) {
            console.error('Data loading error:', err);
            dataEl?.classList.remove('dashboard-data--updating');
        } finally {
            if (selectEl) selectEl.disabled = false;
        }
    }

    _wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    _playEnterAnimation() {
        const items = document.querySelectorAll(
            '#dashboard-data .stat-card, #dashboard-data .pollutant-card, #dashboard-data .dashboard-chart-card'
        );
        items.forEach((el, i) => {
            el.classList.remove('dashboard-item--enter');
            el.style.animationDelay = `${i * 45}ms`;
            void el.offsetWidth;
            el.classList.add('dashboard-item--enter');
        });
    }

    _updateStats(district, { animate = false } = {}) {
        if (!district?.data?.current) return;
        const c = district.data.current;
        const level = getAqiLevel(c.us_aqi);

        const hourly = airQualityAPI.extractHourlyData(district.data, 24);
        const validPm25 = hourly.pm25.filter(v => v != null);
        const max24h = validPm25.length ? Math.max(...validPm25) : null;
        const min24h = validPm25.length ? Math.min(...validPm25) : null;

        const stats = [
            { iconName: 'gauge', value: Math.round(c.us_aqi ?? 0), label: 'US AQI', color: level.color },
            { iconName: 'wind', value: formatNumber(c.pm2_5), label: 'PM2.5 (µg/m³)', color: level.color },
            { iconName: 'arrowUp', value: formatNumber(max24h), label: 'สูงสุด 24ชม.', color: '#ef4444' },
            { iconName: 'arrowDown', value: formatNumber(min24h), label: 'ต่ำสุด 24ชม.', color: '#22c55e' },
        ];

        document.getElementById('stats').innerHTML = stats.map((s, i) => `
            <div class="card stat-card">
                <div class="stat-card_icon" style="color:${s.color}">${icon(s.iconName, 22)}</div>
                <div class="stat-card_value" style="color:${s.color}" data-stat-index="${i}">${animate ? '0' : s.value}</div>
                <div class="stat-card_label">${s.label}</div>
            </div>
        `).join('');

        if (animate) {
            stats.forEach((s, i) => {
                const el = document.querySelector(`[data-stat-index="${i}"]`);
                if (!el) return;
                const target = parseFloat(String(s.value).replace(/,/g, ''));
                if (!isNaN(target)) {
                    animateNumber(el, target);
                } else {
                    el.textContent = s.value;
                }
            });
        }
    }

    _getPollutantStyle(key, value) {
        if (value == null || isNaN(value)) {
            return { color: 'var(--text-muted)', level: null };
        }
        if (key === 'pm25' || key === 'pm10' || key === 'euAqi') {
            const level = getAqiLevel(value);
            return { color: level.color, level };
        }
        return { color: 'var(--accent)', level: null };
    }

    _updatePollutants(district) {
        if (!district?.data?.current) return;
        const c = district.data.current;

        const pollutants = [
            { key: 'pm25', name: 'PM2.5', value: c.pm2_5, unit: 'µg/m³', iconName: 'wind' },
            { key: 'pm10', name: 'PM10', value: c.pm10, unit: 'µg/m³', iconName: 'layers' },
            { key: 'o3', name: 'O₃ โอโซน', value: c.ozone, unit: 'µg/m³', iconName: 'activity' },
            { key: 'no2', name: 'NO₂', value: c.nitrogen_dioxide, unit: 'µg/m³', iconName: 'droplets' },
            { key: 'so2', name: 'SO₂', value: c.sulphur_dioxide, unit: 'µg/m³', iconName: 'alertTriangle' },
            { key: 'co', name: 'CO', value: c.carbon_monoxide, unit: 'µg/m³', iconName: 'gauge' },
            { key: 'dust', name: 'ฝุ่นละออง', value: c.dust, unit: 'µg/m³', iconName: 'wind' },
            { key: 'euAqi', name: 'EU AQI', value: c.european_aqi, unit: '', iconName: 'gauge' },
        ];

        document.getElementById('dashboard-pollutants').innerHTML = pollutants.map(p => {
            const { color, level } = this._getPollutantStyle(p.key, p.value);
            const displayValue = p.value != null && !isNaN(p.value)
                ? (p.key === 'euAqi' ? Math.round(p.value) : formatNumber(p.value))
                : '--';

            return `
                <div class="card pollutant-card" style="--pollutant-color: ${color}">
                    <div class="pollutant-card_header">
                        <span class="pollutant-card_icon">${icon(p.iconName, 18)}</span>
                        <span class="pollutant-card_name">${p.name}</span>
                    </div>
                    <div class="pollutant-card_value">${displayValue}</div>
                    ${p.unit ? `<div class="pollutant-card_unit">${p.unit}</div>` : ''}
                    ${level ? `<span class="badge pollutant-card_badge" style="background:${level.bg};color:${level.color}">${level.label}</span>` : ''}
                </div>
            `;
        }).join('');
    }

    _updateCharts(district) {
        if (!district?.data) return;

        this.charts.forEach(c => c.destroy());
        this.charts = [];

        const hourly = airQualityAPI.extractHourlyData(district.data, 24);
        const labels24h = hourly.times.map(t =>
            new Date(t).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
        );

        this.charts.push(createLineChart(
            document.getElementById('dash-chart-24h'),
            labels24h,
            hourly.pm25,
            { label: 'PM2.5', showAqiColors: true, unit: 'µg/m³' }
        ));

        const daily = airQualityAPI.extractDailyAverages(district.data, 7);
        const labels7d = daily.dates.map(d =>
            new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
        );

        this.charts.push(createBarChart(
            document.getElementById('dash-chart-7d'),
            labels7d,
            daily.pm25,
            { label: 'PM2.5 เฉลี่ย', unit: 'µg/m³' }
        ));
    }

    _updateCompareChart(allDistricts) {
        const labels = allDistricts.map(d => d.name);
        const pm25Values = allDistricts.map(d => d.data?.current?.pm2_5 ?? 0);

        this.charts.push(createBarChart(
            document.getElementById('dash-chart-compare'),
            labels,
            pm25Values,
            { label: 'PM2.5', unit: 'µg/m³' }
        ));
    }

    _renderStatSkeletons() {
        return Array(4).fill('').map(() =>
            '<div class="card stat-card skeleton" style="height:100px"></div>'
        ).join('');
    }

    destroy() {
        this.charts.forEach(c => c.destroy());
        this.charts = [];
    }
}
