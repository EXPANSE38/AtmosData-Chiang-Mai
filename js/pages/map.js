// ===== AtmosData Chiang Mai - Map Page =====

import { airQualityAPI } from '../api.js';
import { getAqiLevel, formatNumber } from '../utils.js';
import { MAP_CENTER, MAP_ZOOM, AQI_LEVELS, icon } from '../config.js';
import {
    createTileLayer,
    findWorkingTileSource,
    getTileSourcesForTheme,
    isSlowConnection,
} from '../map-tiles.js';

const MAP_ELEMENT_ID = 'air-quality-map';
const TILE_ERROR_THRESHOLD = 6;

function waitForMapContainer(el, maxAttempts = 60) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const check = () => {
            attempts += 1;
            if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
                resolve();
                return;
            }
            if (attempts >= maxAttempts) {
                reject(new Error('Map container has no size'));
                return;
            }
            requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
    });
}

export class MapPage {
    constructor(container) {
        this.container = container;
        this.map = null;
        this.markers = [];
        this.tileLayer = null;
        this._onThemeChange = null;
        this._onOnline = null;
        this._onVisibility = null;
        this._resizeObserver = null;
        this._refreshing = false;
        this._tileProviderIndex = 0;
        this._tileErrorCount = 0;
        this._currentTheme = 'dark';
    }

    async render() {
        this.container.innerHTML = `
            <div class="page map-page">
                <div class="section_header">
                    <div>
                        <h2 style="display:flex;align-items:center;gap:var(--space-sm)">${icon('map', 24)} แผนที่คุณภาพอากาศ</h2>
                        <div class="section_subtitle">จุดตรวจวัด PM2.5 ในจังหวัดเชียงใหม่</div>
                    </div>
                    <button class="btn btn--outline btn--sm" id="map-refresh" type="button" style="display:flex;align-items:center;gap:var(--space-xs)">${icon('refresh', 14)} รีเฟรช</button>
                </div>

                <div class="map-container" id="${MAP_ELEMENT_ID}">
                    <div class="map-status map-status--hidden" id="map-status" role="status">
                        <span class="map-status__text" id="map-status-text"></span>
                        <button type="button" class="btn btn--sm btn--outline map-status__retry" id="map-status-retry">ลองใหม่</button>
                    </div>
                </div>

                <div class="map-legend">
                    ${AQI_LEVELS.map(level => `
                        <div class="map-legend_item">
                            <span class="map-legend_dot" style="background-color:${level.color}"></span>
                            <span>${level.label} (${level.min} - ${level.max})</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('map-refresh').addEventListener('click', () => this._refreshMap());
        document.querySelector('.map-container')?.addEventListener('click', (e) => {
            if (e.target.closest('#map-status-retry')) this._refreshMap();
        });

        this._onOnline = () => {
            this._showMapStatus('เชื่อมต่ออินเทอร์เน็ตแล้ว — กำลังโหลดแผนที่ใหม่...', 'info');
            this._refreshMap();
        };
        this._onVisibility = () => {
            if (document.visibilityState === 'visible') this._scheduleInvalidate();
        };

        window.addEventListener('online', this._onOnline);
        document.addEventListener('visibilitychange', this._onVisibility);

        await this._initMap();
        await this._loadMarkers();

        this._onThemeChange = () => this._switchThemeTiles();
        window.addEventListener('themechange', this._onThemeChange);
    }

    _getTheme() {
        return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    _showMapStatus(message, type = 'warning') {
        const el = document.getElementById('map-status');
        const text = document.getElementById('map-status-text');
        if (!el || !text) return;
        text.textContent = message;
        el.classList.remove('map-status--hidden', 'map-status--info', 'map-status--warning');
        el.classList.add(type === 'info' ? 'map-status--info' : 'map-status--warning');
    }

    _hideMapStatus() {
        document.getElementById('map-status')?.classList.add('map-status--hidden');
    }

    _scheduleInvalidate() {
        if (!this.map) return;
        const run = () => this.map.invalidateSize({ animate: false, pan: false });
        requestAnimationFrame(() => {
            run();
            requestAnimationFrame(run);
        });
        setTimeout(run, 100);
        setTimeout(run, 400);
        setTimeout(run, 1000);
    }

    _bindTileLayerEvents() {
        if (!this.tileLayer) return;

        this.tileLayer.off('tileerror');
        this.tileLayer.off('load');

        this.tileLayer.on('load', () => {
            this._tileErrorCount = 0;
            this._hideMapStatus();
        });

        this.tileLayer.on('tileerror', () => {
            this._tileErrorCount += 1;

            if (this._tileErrorCount >= TILE_ERROR_THRESHOLD) {
                this._tryNextTileProvider();
            } else if (this._tileErrorCount === 2) {
                this._showMapStatus(
                    isSlowConnection()
                        ? 'การเชื่อมต่อช้า — กำลังโหลดแผนที่...'
                        : 'กำลังโหลดแผนที่... กรุณารอสักครู่',
                    'info'
                );
            }
        });
    }

    async _applyTileSource(source, index) {
        if (!this.map) return;

        this._tileProviderIndex = index;
        this._tileErrorCount = 0;

        if (this.tileLayer) {
            this.map.removeLayer(this.tileLayer);
        }

        this.tileLayer = createTileLayer(source).addTo(this.map);
        this._bindTileLayerEvents();
        this._scheduleInvalidate();

        if (index > 0) {
            this._showMapStatus(`ใช้แผนที่สำรอง (${source.name}) — โหลดสำเร็จ`, 'info');
            setTimeout(() => this._hideMapStatus(), 3500);
        } else {
            this._hideMapStatus();
        }
    }

    async _tryNextTileProvider() {
        const sources = getTileSourcesForTheme(this._currentTheme);
        const nextIndex = this._tileProviderIndex + 1;

        if (nextIndex >= sources.length) {
            this._showMapStatus(
                'ไม่สามารถโหลดแผนที่ได้ — ตรวจสอบ WiFi แล้วกด "ลองใหม่"',
                'warning'
            );
            return;
        }

        this._showMapStatus(`กำลังลองแหล่งแผนที่สำรอง (${sources[nextIndex].name})...`, 'info');

        const ok = await findWorkingTileSource(this._currentTheme, { startIndex: nextIndex });
        await this._applyTileSource(ok.source, ok.index);
    }

    async _switchThemeTiles() {
        this._currentTheme = this._getTheme();
        const { source, index } = await findWorkingTileSource(this._currentTheme, { startIndex: 0 });
        await this._applyTileSource(source, index);
    }

    _destroyMap() {
        if (this._resizeObserver) {
            this._resizeObserver.disconnect();
            this._resizeObserver = null;
        }
        this.markers.forEach(m => m.remove());
        this.markers = [];
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        this.tileLayer = null;
        this._tileErrorCount = 0;
    }

    _mountStatusOverlay(container) {
        container.querySelector('#map-status')?.remove();
        container.insertAdjacentHTML('beforeend', `
            <div class="map-status map-status--hidden" id="map-status" role="status">
                <span class="map-status__text" id="map-status-text"></span>
                <button type="button" class="btn btn--sm btn--outline map-status__retry" id="map-status-retry">ลองใหม่</button>
            </div>
        `);
    }

    async _initMap() {
        const mapEl = document.getElementById(MAP_ELEMENT_ID);
        if (!mapEl) return;

        await waitForMapContainer(mapEl);

        this._currentTheme = this._getTheme();
        const { source, index } = await findWorkingTileSource(this._currentTheme, { startIndex: 0 });

        this.map = L.map(mapEl, {
            center: MAP_CENTER,
            zoom: MAP_ZOOM,
            zoomControl: true,
            attributionControl: true,
        });

        this._mountStatusOverlay(mapEl);

        if (!navigator.onLine) {
            this._showMapStatus('ไม่มีการเชื่อมต่ออินเทอร์เน็ต — แผนที่จะโหลดเมื่อกลับมาออนไลน์', 'warning');
        } else if (isSlowConnection()) {
            this._showMapStatus('การเชื่อมต่อช้า — กำลังโหลดแผนที่ (อาจใช้เวลานานขึ้น)...', 'info');
        }

        await this._applyTileSource(source, index);

        await new Promise((resolve) => {
            this.map.whenReady(() => {
                this._scheduleInvalidate();
                resolve();
            });
        });

        if (typeof ResizeObserver !== 'undefined') {
            this._resizeObserver = new ResizeObserver(() => this._scheduleInvalidate());
            this._resizeObserver.observe(mapEl);
        }
    }

    async _loadMarkers() {
        if (!this.map) return;

        try {
            this.markers.forEach(m => m.remove());
            this.markers = [];

            const districts = await airQualityAPI.fetchAllCurrent();

            districts.forEach(district => {
                const aqi = district.data?.current?.us_aqi;
                const pm25 = district.data?.current?.pm2_5;
                const pm10 = district.data?.current?.pm10;
                const level = getAqiLevel(aqi);

                const marker = L.circleMarker([district.lat, district.lng], {
                    radius: 14,
                    fillColor: level.color,
                    fillOpacity: 0.85,
                    color: '#fff',
                    weight: 2,
                    opacity: 0.9,
                }).addTo(this.map);

                const popupContent = `
                    <div style="min-width:200px;font-family:Inter, sans-serif;">
                        <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${district.name}</div>
                        <div style="font-size:12px;color:#9ca3af;margin-bottom:8px;">${district.nameEn}</div>
                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                            <span style="font-size:24px;font-weight:800;color:${level.color}">
                                ${aqi != null ? Math.round(aqi) : '--'}
                            </span>
                            <div>
                                <div style="font-size:11px;color:#9ca3af;">US AQI</div>
                                <div style="font-size:12px;font-weight:600;color:${level.color};">${level.label}</div>
                            </div>
                        </div>
                        <div style="display:flex;gap:16px;font-size:12px;color:#9ca3af;">
                            <div>PM2.5: <strong style="color:${level.color}">${formatNumber(pm25)}</strong></div>
                            <div>PM10: <strong>${formatNumber(pm10)}</strong></div>
                        </div>
                    </div>
                `;

                marker.bindPopup(popupContent, {
                    className: 'custom-popup',
                    closeButton: true,
                });

                marker.bindTooltip(`${district.name} - AQI: ${aqi != null ? Math.round(aqi) : '--'}`, {
                    direction: 'top',
                    offset: [0, -10],
                });

                this.markers.push(marker);
            });

            if (this.markers.length > 0) {
                const group = L.featureGroup(this.markers);
                this.map.fitBounds(group.getBounds().pad(0.12));
            } else {
                this.map.setView(MAP_CENTER, MAP_ZOOM);
            }

            this._scheduleInvalidate();
        } catch (err) {
            console.error('Map markers error:', err);
            this._showMapStatus('โหลดจุดตรวจวัดไม่สำเร็จ — กด "ลองใหม่"', 'warning');
        }
    }

    async _refreshMap() {
        if (this._refreshing) return;
        this._refreshing = true;

        const btn = document.getElementById('map-refresh');
        const originalHtml = btn?.innerHTML;
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = `${icon('refresh', 14)} กำลังโหลด...`;
        }

        try {
            airQualityAPI.clearCache();
            this._destroyMap();

            const mapEl = document.getElementById(MAP_ELEMENT_ID);
            if (mapEl) mapEl.replaceChildren();

            await this._initMap();
            await this._loadMarkers();
        } catch (err) {
            console.error('Map refresh error:', err);
            this._showMapStatus('โหลดแผนที่ไม่สำเร็จ — ตรวจสอบ WiFi แล้วกด "ลองใหม่"', 'warning');
        } finally {
            this._refreshing = false;
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = originalHtml;
            }
        }
    }

    destroy() {
        if (this._onThemeChange) {
            window.removeEventListener('themechange', this._onThemeChange);
        }
        if (this._onOnline) {
            window.removeEventListener('online', this._onOnline);
        }
        if (this._onVisibility) {
            document.removeEventListener('visibilitychange', this._onVisibility);
        }
        this._destroyMap();
    }
}
