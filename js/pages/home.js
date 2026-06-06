// ===== AtmosData Chiang Mai - Home Page =====

import { airQualityAPI } from '../api.js';
import { getAqiLevel, getHealthAdvice, formatNumber, formatTime, timeAgo, animateNumber } from '../utils.js';
import { createLineChart } from '../components/charts.js';
import { icon } from '../config.js';

export class HomePage {
    constructor(container) {
        this.container = container;
        this.chart = null;
    }

    async render() {
        this.container.innerHTML = `
            <div class="page home-page">
                <div class="home-hero_time">
                    <span class="pulse"></span>
                    <span id="live-time">กำลังโหลดข้อมูล...</span>
                </div>

                <!-- Hero -->
                <div class="home-hero">
                    <div class="home-hero_left">
                        <div class="aqi-hero card" id="hero-card">
                            <div class="aqi-hero_glow" id="hero-glow"></div>
                            <div class="aqi-hero_icon" id="hero-icon">${icon('gauge', 48)}</div>
                            <div class="aqi-hero_value" id="hero-value">--</div>
                            <div class="aqi-hero_label" id="hero-label">US AQI</div>
                            <div class="aqi-hero_sublabel" id="hero-sublabel">กำลังดึงข้อมูล...</div>
                            <div style="margin-top:1rem">
                                <span class="badge" id="hero-badge">--</span>
                            </div>
                            <div class="aqi-hero_details" style="margin-top:0.75rem;display:flex;gap:var(--space-lg);justify-content:center">
                                <div class="aqi-hero_detail">
                                    <span class="aqi-hero_detail_label">PM2.5</span>
                                    <span class="aqi-hero_detail_value" id="hero-pm25">--</span>
                                    <span class="aqi-hero_detail_unit">µg/m³</span>
                                </div>
                                <div class="aqi-hero_detail">
                                    <span class="aqi-hero_detail_label">PM10</span>
                                    <span class="aqi-hero_detail_value" id="hero-pm10">--</span>
                                    <span class="aqi-hero_detail_unit">µg/m³</span>
                                </div>
                                <div class="aqi-hero_detail">
                                    <span class="aqi-hero_detail_label">EU AQI</span>
                                    <span class="aqi-hero_detail_value" id="hero-eu-aqi">--</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="home-hero_right">
                        <div class="card home-hero_chart-card">
                            <div class="section_title" style="margin-bottom:var(--space-md);display:flex;align-items:center;gap:var(--space-sm)">${icon('activity', 18)} ค่า PM2.5 ย้อนหลัง 24 ชม.</div>
                            <div class="chart-container home-hero_chart" style="height:280px">
                                <canvas id="hero-chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- District Overview -->
                <div class="section">
                    <div class="section_header">
                        <div>
                            <div class="section_title" style="display:flex;align-items:center;gap:var(--space-sm)">${icon('mapPin', 18)} ค่าฝุ่นรายอำเภอ</div>
                            <div class="section_subtitle">เปรียบ PM2.5 ปัจจุบันของแต่ละอำเภอในเชียงใหม่</div>
                        </div>
                        <a href="#/ranking" class="btn btn--outline btn--sm">ดูทั้งหมด</a>
                    </div>
                    <div class="home-districts" id="districts-grid">
                        ${this._renderSkeletons(6)}
                    </div>
                </div>

                <!-- Health Advice -->
                <div class="section">
                    <div class="section_header">
                        <div>
                            <div class="section_title" style="display:flex;align-items:center;gap:var(--space-sm)">${icon('shield', 18)} คำแนะนำสุขภาพ</div>
                            <div class="section_subtitle">คำแนะนำตามระดับค่าฝุ่นปัจจุบัน</div>
                        </div>
                    </div>
                    <div class="home-advice" id="advice-grid">
                        <div class="card skeleton" style="height:120px"></div>
                        <div class="card skeleton" style="height:120px"></div>
                        <div class="card skeleton" style="height:120px"></div>
                    </div>
                </div>
            </div>
        `;

        await this._loadData();
    }

    async _loadData() {
        try {
            const districts = await airQualityAPI.fetchAllDistricts({ pastDays: 1, forecastDays: 1 });
            const main = districts.find(d => d.id === 'mueang') || districts[0];
            this._updateHero(main);
            this._updateChart(main);
            this._updateDistricts(districts);
            this._updateAdvice(main);
        } catch (err) {
            console.error('Failed to load home data:', err);
            const sublabel = document.getElementById('hero-sublabel');
            if (sublabel) sublabel.textContent = 'ไม่สามารถโหลดข้อมูลได้';
        }
    }

    _updateHero(district) {
        if (!district?.data?.current) return;

        const c = district.data.current;
        const level = getAqiLevel(c.us_aqi);
        const time = c.time;

        const heroIcon = document.getElementById('hero-icon');
        heroIcon.style.color = level.color;

        const valueEl = document.getElementById('hero-value');
        animateNumber(valueEl, c.us_aqi ?? 0);

        document.getElementById('hero-sublabel').textContent = `${district.name} • ${timeAgo(time)}`;
        document.getElementById('hero-pm25').textContent = formatNumber(c.pm2_5);
        document.getElementById('hero-pm10').textContent = formatNumber(c.pm10);
        document.getElementById('hero-eu-aqi').textContent = c.european_aqi != null ? Math.round(c.european_aqi) : '--';

        const badge = document.getElementById('hero-badge');
        badge.textContent = level.label;
        badge.style.background = level.bg;
        badge.style.color = level.color;

        document.getElementById('hero-glow').style.background = `radial-gradient(circle, ${level.color}, transparent)`;
        document.getElementById('hero-card').style.borderColor = level.color + '30';
        document.getElementById('live-time').textContent = `อัปเดตล่าสุด: ${formatTime(time)}`;
    }

    _updateChart(district) {
        if (!district?.data) return;

        const hourly = airQualityAPI.extractHourlyData(district.data, 24);
        const labels = hourly.times.map(t => {
            const d = new Date(t);
            return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        });

        const canvas = document.getElementById('hero-chart');
        if (!canvas) return;

        this.chart = createLineChart(canvas, labels, hourly.pm25, {
            label: 'PM2.5',
            color: '#3b82f6',
            showAqiColors: true,
            unit: 'μg/m³',
        });
    }

    _updateDistricts(districts) {
        const grid = document.getElementById('districts-grid');
        if (!grid) return;

        grid.innerHTML = districts.map(d => {
            const aqi = d.data?.current?.us_aqi;
            const pm25 = d.data?.current?.pm2_5;
            const level = getAqiLevel(aqi);

            return `
                <div class="card card--interactive aqi-mini" onclick="location.hash='#/dashboard?district=${d.id}'">
                    <div class="aqi-mini_dot" style="background:${level.color}"></div>
                    <div class="aqi-mini_info">
                        <div class="aqi-mini_name">${d.name}</div>
                        <div class="aqi-mini_districts">${d.nameEn} • PM2.5: ${formatNumber(pm25)} μg/m³</div>
                    </div>
                    <div>
                        <div class="aqi-mini_value" style="color:${level.color}">${aqi != null ? Math.round(aqi) : '--'}</div>
                        <div class="aqi-mini_unit">AQI</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    _updateAdvice(district) {
        const aqi = district?.data?.current?.us_aqi ?? 0;
        const advice = getHealthAdvice(aqi);
        const level = getAqiLevel(aqi);

        const groups = [
            { key: 'general', iconName: 'users', label: 'ประชาชนทั่วไป' },
            { key: 'students', iconName: 'users', label: 'นักเรียน' },
            { key: 'elderly', iconName: 'heart', label: 'ผู้สูงอายุ' },
            { key: 'sensitive', iconName: 'shield', label: 'ผู้ป่วยภูมิแพ้' },
        ];

        document.getElementById('advice-grid').innerHTML = groups.map(g => `
            <div class="card advice-card" style="border-left-color:${level.color}">
                <div class="advice-card_group">${icon(g.iconName, 14)} ${g.label}</div>
                <div class="advice-card_text">${advice[g.key]}</div>
            </div>
        `).join('');
    }

    _renderSkeletons(count) {
        return Array(count).fill('').map(() =>
            '<div class="card skeleton" style="height:72px"></div>'
        ).join('');
    }

    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}
