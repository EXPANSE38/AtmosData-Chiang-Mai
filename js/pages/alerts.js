// ===== AtmosData Chiang Mai - Alerts Page =====

import { storage, getAqiLevel } from '../utils.js';
import { DISTRICTS, icon } from '../config.js';
import { airQualityAPI } from '../api.js';
import { showToast } from '../components/toast.js';

const STORAGE_KEY = 'alerts';

export class AlertsPage {
    constructor(container) {
        this.container = container;
        this.alerts = storage.get(STORAGE_KEY, []);
    }

    async render() {
        this.container.innerHTML = `
            <div class="page alerts-page">
                <div class="section_header">
                    <div>
                        <h2 style="display:flex;align-items:center;gap:var(--space-sm)">${icon('bell', 24)} ระบบแจ้งเตือน</h2>
                        <div class="section_subtitle">ตั้งค่าขีดจำกัดเพื่อรับการแจ้งเตือนค่าฝุ่นเกินเกณฑ์</div>
                    </div>
                </div>

                <div class="card alert-add-card">
                    <div class="section_title alert-add-card__title">${icon('plus', 18)} เพิ่มการแจ้งเตือนใหม่</div>
                    <div class="alert-form">
                        <div class="input-group">
                            <label class="input-group_label" for="alert-district">อำเภอ</label>
                            <select class="select" id="alert-district">
                                ${DISTRICTS.map(d => `<option value="${d.id}">${d.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="input-group">
                            <label class="input-group_label" for="alert-threshold">ค่า AQI ที่ต้องการแจ้งเตือน</label>
                            <input type="number" class="input" id="alert-threshold"
                                    placeholder="เช่น 100" min="1" max="500" value="100">
                        </div>
                        <button class="btn btn--primary alert-form__submit" type="button" id="alert-add">เพิ่มการแจ้งเตือน</button>
                    </div>
                </div>

                <div class="section">
                    <div class="section_header">
                        <div class="section_title" style="display:flex;align-items:center;gap:var(--space-sm)">${icon('listOrdered', 18)} การแจ้งเตือนที่ตั้งไว้</div>
                        <button class="btn btn--ghost btn--sm" id="alert-check" style="display:flex;align-items:center;gap:4px">${icon('search', 14)} ตรวจสอบตอนนี้</button>
                    </div>
                    <div class="alert-list" id="alerts-list">
                        ${this._renderAlerts()}
                    </div>
                </div>

                <div class="section">
                    <div class="section_header">
                        <div class="section_title" style="display:flex;align-items:center;gap:var(--space-sm)">${icon('clock', 18)} ประวัติการแจ้งเตือน</div>
                        <button class="btn btn--ghost btn--sm" id="clear-history">ล้างประวัติ</button>
                    </div>
                    <div id="alert-history">
                        ${this._renderHistory()}
                    </div>
                </div>
            </div>
        `;

        this._bindEvents();
    }

    _bindEvents() {
        document.getElementById('alert-add').addEventListener('click', () => this._addAlert());
        document.getElementById('alert-check').addEventListener('click', () => this._checkAlerts());
        document.getElementById('clear-history').addEventListener('click', () => this._clearHistory());

        document.getElementById('alert-threshold').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this._addAlert();
        });

        window._removeAlert = (id) => this._removeAlert(id);
    }

    _addAlert() {
        const districtId = document.getElementById('alert-district').value;
        const threshold = parseInt(document.getElementById('alert-threshold').value, 10);

        if (!threshold || threshold < 1 || threshold > 500) {
            showToast('กรุณาใส่ค่า AQI ระหว่าง 1-500', { type: 'warning' });
            return;
        }

        const district = DISTRICTS.find(d => d.id === districtId);
        if (!district) return;

        const exists = this.alerts.some(a => a.districtId === districtId && a.threshold === threshold);
        if (exists) {
            showToast('มีการแจ้งเตือนนี้อยู่แล้ว', { type: 'warning' });
            return;
        }

        this.alerts.push({
            id: Date.now(),
            districtId,
            districtName: district.name,
            threshold,
            createdAt: new Date().toISOString(),
        });

        this._saveAlerts();
        document.getElementById('alerts-list').innerHTML = this._renderAlerts();
        document.getElementById('alert-threshold').value = '100';
        showToast(`เพิ่มการแจ้งเตือนสำหรับ ${district.name} (AQI > ${threshold})`, { type: 'success' });
    }

    _removeAlert(id) {
        this.alerts = this.alerts.filter(a => a.id !== id);
        this._saveAlerts();
        document.getElementById('alerts-list').innerHTML = this._renderAlerts();
        showToast('ลบการแจ้งเตือนแล้ว', { type: 'info' });
    }

    async _checkAlerts() {
        if (this.alerts.length === 0) {
            showToast('ยังไม่มีการแจ้งเตือนที่ตั้งไว้', { type: 'info' });
            return;
        }

        showToast('กำลังตรวจสอบค่าฝุ่น...', { type: 'info', duration: 2000 });

        try {
            const districts = await airQualityAPI.fetchAllCurrent();
            const history = storage.get('alert_history', []);
            let triggered = 0;

            for (const alert of this.alerts) {
                const district = districts.find(d => d.id === alert.districtId);
                if (!district?.data?.current) continue;

                const aqi = district.data.current.us_aqi;
                if (aqi != null && aqi >= alert.threshold) {
                    triggered++;
                    const level = getAqiLevel(aqi);

                    history.unshift({
                        id: Date.now() + Math.random(),
                        districtName: alert.districtName,
                        threshold: alert.threshold,
                        actualAqi: Math.round(aqi),
                        level: level.label,
                        color: level.color,
                        time: new Date().toISOString(),
                    });

                    showToast(
                        `${alert.districtName}: AQI ${Math.round(aqi)} เกินเกณฑ์ ${alert.threshold}!`,
                        { type: 'warning', duration: 6000 }
                    );
                }
            }

            if (triggered === 0) {
                showToast('ค่าฝุ่นทุกอำเภอยังไม่เกินเกณฑ์ที่ตั้งไว้', { type: 'success' });
            }

            storage.set('alert_history', history.slice(0, 50));
            document.getElementById('alert-history').innerHTML = this._renderHistory();
        } catch (err) {
            console.error('Alert check error:', err);
            showToast('ไม่สามารถตรวจสอบข้อมูลได้', { type: 'error' });
        }
    }

    _clearHistory() {
        storage.remove('alert_history');
        document.getElementById('alert-history').innerHTML = this._renderHistory();
        showToast('ล้างประวัติเรียบร้อย', { type: 'info' });
    }

    _renderAlerts() {
        if (this.alerts.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state__icon">${icon('bellOff', 40)}</div>
                    <div class="empty-state__title">ยังไม่มีการแจ้งเตือน</div>
                    <div class="empty-state__desc">เพิ่มการแจ้งเตือนด้านบนเพื่อติดตามค่าฝุ่น</div>
                </div>
            `;
        }

        return this.alerts.map(a => {
            const level = getAqiLevel(a.threshold);
            return `
                <div class="card alert-item">
                    <div class="aqi-mini_dot" style="background:${level.color}"></div>
                    <div class="alert-item_info">
                        <div class="alert-item_district">${a.districtName}</div>
                        <div class="alert-item_threshold">แจ้งเตือนเมื่อ AQI ≥ ${a.threshold}</div>
                    </div>
                    <button class="alert-item_remove" onclick="window._removeAlert(${a.id})">${icon('x', 16)}</button>
                </div>
            `;
        }).join('');
    }

    _renderHistory() {
        const history = storage.get('alert_history', []);
        if (history.length === 0) {
            return `
                <div class="empty-state" style="padding:var(--space-xl)">
                    <div class="empty-state__icon">${icon('clock', 40)}</div>
                    <div class="empty-state__title">ยังไม่มีประวัติ</div>
                    <div class="empty-state__desc">ประวัติจะแสดงเมื่อมีค่าฝุ่นเกินเกณฑ์ที่ตั้งไว้</div>
                </div>
            `;
        }

        return `
            <div class="table-wrap">
                <table class="table">
                    <thead>
                        <tr>
                            <th>อำเภอ</th>
                            <th>ค่า AQI จริง</th>
                            <th>เกณฑ์ที่ตั้ง</th>
                            <th>ระดับ</th>
                            <th>เวลา</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${history.slice(0, 20).map(h => `
                            <tr>
                                <td style="font-weight:600">${h.districtName}</td>
                                <td style="color:${h.color};font-weight:700;font-family:var(--font-mono)">${h.actualAqi}</td>
                                <td style="font-family:var(--font-mono)">${h.threshold}</td>
                                <td><span class="badge" style="background:${h.color}20;color:${h.color}">${h.level}</span></td>
                                <td style="font-size:var(--text-sm);color:var(--text-muted)">
                                    ${new Date(h.time).toLocaleString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    _saveAlerts() {
        storage.set(STORAGE_KEY, this.alerts);
    }

    destroy() {
        delete window._removeAlert;
    }
}
