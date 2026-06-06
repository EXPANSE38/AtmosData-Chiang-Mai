// ===== AtmosData Chiang Mai - District Ranking Page =====

import { airQualityAPI } from '../api.js';
import { getAqiLevel, formatNumber } from '../utils.js';
import { icon } from '../config.js';

export class RankingPage {
    constructor(container) {
        this.container = container;
        this.sortBy = 'aqi';
        this.sortOrder = 'desc';
    }

    async render() {
        this.container.innerHTML = `
            <div class="page ranking-page">
                <div class="ranking-header">
                    <div>
                        <h2 style="display:flex;align-items:center;gap:var(--space-sm)">${icon('listOrdered', 24)} จัดอันดับค่าฝุ่นรายอำเภอ</h2>
                        <div class="section_subtitle">เปรียบเทียบค่าฝุ่น PM2.5 ปัจจุบันของอำเภอในเชียงใหม่</div>
                    </div>
                    <div style="display:flex;gap:var(--space-sm)">
                        <button class="btn btn--outline btn--sm" id="sort-aqi">เรียงตาม AQI</button>
                        <button class="btn btn--outline btn--sm" id="sort-pm25">เรียงตาม PM2.5</button>
                        <button class="btn btn--outline btn--sm" id="sort-toggle" style="display:flex;align-items:center;gap:4px">${icon('arrowDown', 14)} สลับ</button>
                    </div>
                </div>

                <div class="table-wrap" id="ranking-table">
                    <table class="table">
                        <thead>
                            <tr>
                                <th style="width:60px;text-align:center">#</th>
                                <th>อำเภอ</th>
                                <th>สถานะ</th>
                                <th style="text-align:right">US AQI</th>
                                <th style="text-align:right">PM2.5</th>
                                <th style="text-align:right">PM10</th>
                                <th style="text-align:right">ระดับ</th>
                            </tr>
                        </thead>
                        <tbody id="ranking-body">
                            <tr><td colspan="7" style="text-align:center;padding:3rem">
                                <div class="loading-spinner" style="margin:0 auto"></div>
                            </td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="card" style="margin-top:var(--space-xl);padding:var(--space-lg)">
                    <div class="section_title" style="margin-bottom:var(--space-md);display:flex;align-items:center;gap:var(--space-sm)">${icon('gauge', 18)} มาตรวัดคุณภาพอากาศ (US AQI)</div>
                    <div class="aqi-scale">
                        <div class="aqi-scale_segment" style="background:var(--aqi-good)"></div>
                        <div class="aqi-scale_segment" style="background:var(--aqi-moderate)"></div>
                        <div class="aqi-scale_segment" style="background:var(--aqi-sensitive)"></div>
                        <div class="aqi-scale_segment" style="background:var(--aqi-unhealthy)"></div>
                        <div class="aqi-scale_segment" style="background:var(--aqi-very-unhealthy)"></div>
                        <div class="aqi-scale_segment" style="background:var(--aqi-hazardous)"></div>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:var(--text-xs);color:var(--text-muted);margin-top:var(--space-sm)">
                        <span>0 ดี</span>
                        <span>51 ปานกลาง</span>
                        <span>101 กลุ่มเสี่ยง</span>
                        <span>151 มีผลต่อสุขภาพ</span>
                        <span>201 อันตราย</span>
                        <span>301 วิกฤต</span>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('sort-aqi').addEventListener('click', () => {
            this.sortBy = 'aqi';
            this._sortAndRender();
        });
        document.getElementById('sort-pm25').addEventListener('click', () => {
            this.sortBy = 'pm25';
            this._sortAndRender();
        });
        document.getElementById('sort-toggle').addEventListener('click', () => {
            this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
            this._sortAndRender();
        });

        await this._loadData();
    }

    async _loadData() {
        try {
            this._districts = await airQualityAPI.fetchAllCurrent();
            this._sortAndRender();
        } catch (err) {
            console.error('Ranking data error:', err);
            document.getElementById('ranking-body').innerHTML = `
                <tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--text-muted)">
                    ไม่สามารถโหลดข้อมูลได้
                </td></tr>
            `;
        }
    }

    _sortAndRender() {
        if (!this._districts) return;

        const sorted = [...this._districts].sort((a, b) => {
            const va = this.sortBy === 'aqi'
                ? (a.data?.current?.us_aqi ?? -1)
                : (a.data?.current?.pm2_5 ?? -1);
            const vb = this.sortBy === 'aqi'
                ? (b.data?.current?.us_aqi ?? -1)
                : (b.data?.current?.pm2_5 ?? -1);
            return this.sortOrder === 'desc' ? vb - va : va - vb;
        });

        const maxAqi = Math.max(...sorted.map(d => d.data?.current?.us_aqi ?? 0), 1);

        document.getElementById('ranking-body').innerHTML = sorted.map((d, i) => {
            const aqi = d.data?.current?.us_aqi;
            const pm25 = d.data?.current?.pm2_5;
            const pm10 = d.data?.current?.pm10;
            const level = getAqiLevel(aqi);
            const barWidth = aqi != null ? Math.min((aqi / maxAqi) * 100, 100) : 0;

            return `
                <tr>
                    <td class="rank-cell">${i + 1}</td>
                    <td>
                        <div style="font-weight:600">${d.name}</div>
                        <div style="font-size:var(--text-xs);color:var(--text-muted)">${d.nameEn}</div>
                    </td>
                    <td>
                        <span class="badge" style="background:${level.bg};color:${level.color}">
                            ${level.label}
                        </span>
                    </td>
                    <td class="aqi-cell" style="text-align:right;color:${level.color}">
                        ${aqi != null ? Math.round(aqi) : '--'}
                    </td>
                    <td style="text-align:right;font-family:var(--font-mono)">${formatNumber(pm25)}</td>
                    <td style="text-align:right;font-family:var(--font-mono)">${formatNumber(pm10)}</td>
                    <td class="bar-cell">
                        <div class="aqi-bar" style="width:${barWidth}%;background:${level.color}"></div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    destroy() {}
}
