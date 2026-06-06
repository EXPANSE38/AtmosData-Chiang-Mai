// ===== AtmosData - About Page =====

import { AQI_LEVELS, APP_FULL_NAME, icon } from '../config.js';

const FEATURES = [
    { iconName: 'dashboard', title: 'แดชบอร์ดเรียลไทม์', desc: 'ดูค่า PM2.5 และ US AQI ปัจจุบัน พร้อมกราฟย้อนหลัง' },
    { iconName: 'map', title: 'แผนที่รายอำเภอ', desc: 'จุดตรวจวัด 17 อำเภอทั่วจังหวัดเชียงใหม่' },
    { iconName: 'ranking', title: 'จัดอันดับค่าฝุ่น', desc: 'เปรียบเทียบคุณภาพอากาศระหว่างอำเภอได้ทันที' },
    { iconName: 'bell', title: 'ระบบแจ้งเตือน', desc: 'ตั้งเกณฑ์ AQI แล้วรับการแจ้งเตือนเมื่อเกินค่าที่กำหนด' },
    { iconName: 'shield', title: 'คำแนะนำสุขภาพ', desc: 'แนะนำตามกลุ่มเสี่ยง นักเรียน ผู้สูงอายุ และผู้ป่วยภูมิแพ้' },
    { iconName: 'activity', title: 'กราฟย้อนหลัง', desc: 'ติดตามแนวโน้ม PM2.5 รายชั่วโมงและรายวัน' },
];

const TECH_STACK = [
    { iconName: 'globe', name: 'HTML5', desc: 'Semantic markup' },
    { iconName: 'layers', name: 'CSS3', desc: 'Custom Properties, Grid, Flexbox' },
    { iconName: 'code', name: 'JavaScript ES Modules', desc: 'Vanilla JS, No framework' },
    { iconName: 'activity', name: 'Chart.js', desc: 'Data visualization' },
    { iconName: 'map', name: 'Leaflet', desc: 'Interactive map' },
    { iconName: 'database', name: 'Open-Meteo API', desc: 'Air quality data' },
];

const ROADMAP = [
    'คาดการณ์ค่าฝุ่น 6–12 ชั่วโมงล่วงหน้าด้วย Machine Learning',
    'Safe Time Planner แนะนำเวลาที่เหมาะสำหรับกิจกรรมกลางแจ้ง',
    'แจ้งเตือนผ่าน LINE Notify / Telegram',
    'รองรับข้อมูลจากหลายจังหวัด',
    'เปรียบเทียบข้อมูลรายปีและวิเคราะห์แนวโน้ม',
];

export class AboutPage {
    constructor(container) {
        this.container = container;
    }

    async render() {
        this.container.innerHTML = `
            <div class="page about-page">
                <div class="about-content">

                    <header class="about-hero card">
                        <div class="about-hero_brand">
                            <img src="icon.png" alt="" class="about-hero_logo" width="56" height="56">
                            <div>
                                <h1 class="about-hero_title">เกี่ยวกับ ${APP_FULL_NAME}</h1>
                                <p class="about-hero_subtitle">เฝ้าระวังฝุ่น PM2.5 เพื่อชุมชนในจังหวัดเชียงใหม่</p>
                            </div>
                        </div>
                        <p class="about-hero_desc">
                            <strong>${APP_FULL_NAME}</strong> คือเว็บแอปพลิเคชันติดตามคุณภาพอากาศ
                            สำหรับนักเรียนและชุมชนในจังหวัดเชียงใหม่ พัฒนาขึ้นเพื่อช่วยให้ผู้คนตัดสินใจ
                            เรื่องกิจกรรมกลางแจ้งได้อย่างปลอดภัยมากขึ้น ด้วยข้อมูลแบบเรียลไทม์
                            กราฟย้อนหลัง แผนที่รายพื้นที่ และระบบแจ้งเตือน
                        </p>
                    </header>

                    <section class="about-section">
                        <h2 class="about-section_title">${icon('layers', 22)} ฟีเจอร์หลัก</h2>
                        <div class="about-features">
                            ${FEATURES.map(f => `
                                <div class="card about-feature">
                                    <div class="about-feature_icon">${icon(f.iconName, 22)}</div>
                                    <div class="about-feature_title">${f.title}</div>
                                    <div class="about-feature_desc">${f.desc}</div>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <section class="about-section">
                        <h2 class="about-section_title">${icon('gauge', 22)} ดัชนีคุณภาพอากาศ (US AQI)</h2>
                        <p class="about-section_lead">
                            เราใช้ดัชนี US AQI (United States Air Quality Index) ซึ่งเป็นมาตรฐานที่ยอมรับทั่วโลก
                            ในการวัดระดับคุณภาพอากาศ โดยแบ่งเป็น 6 ระดับ:
                        </p>
                        <div class="aqi-scale about-aqi-scale">
                            ${AQI_LEVELS.map(l => `
                                <div class="aqi-scale_segment" style="background:${l.color}" title="${l.label}"></div>
                            `).join('')}
                        </div>
                        <div class="table-wrap">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>ช่วง AQI</th>
                                        <th>ระดับ</th>
                                        <th>ความหมาย</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${AQI_LEVELS.map(l => `
                                        <tr>
                                            <td>
                                                <span class="badge" style="background:${l.bg};color:${l.color}">
                                                    ${l.min} – ${l.max}
                                                </span>
                                            </td>
                                            <td style="font-weight:600;color:${l.color}">${l.label}</td>
                                            <td style="color:var(--text-secondary)">${l.labelEn}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section class="about-section">
                        <h2 class="about-section_title">${icon('database', 22)} แหล่งข้อมูล</h2>
                        <div class="card about-source">
                            <div class="about-source_item">
                                <strong>Open-Meteo Air Quality</strong>
                                <p>ข้อมูลคุณภาพอากาศแบบเปิด ไม่ต้องใช้ API Key ครอบคลุมทั่วโลก</p>
                                <a href="https://open-meteo.com" target="_blank" rel="noopener" class="about-source_link">
                                    ${icon('externalLink', 14)} open-meteo.com
                                </a>
                            </div>
                            <p class="about-source_note">
                                ข้อมูลอ้างอิงจากแบบจำลอง CAMS (Copernicus Atmosphere Monitoring Service)
                                ขององค์การอวกาศยุโรป ซึ่งรวมข้อมูลจากสถานีตรวจวัดภาคพื้นดินและดาวเทียม
                            </p>
                        </div>
                    </section>

                    <section class="about-section">
                        <h2 class="about-section_title">${icon('code', 22)} เทคโนโลยีที่ใช้</h2>
                        <div class="about-tech">
                            ${TECH_STACK.map(t => `
                                <div class="card tech-item">
                                    <div class="tech-item_icon">${icon(t.iconName, 28)}</div>
                                    <div class="tech-item_name">${t.name}</div>
                                    <div class="tech-item_desc">${t.desc}</div>
                                </div>
                            `).join('')}
                        </div>
                    </section>

                    <section class="about-section">
                        <h2 class="about-section_title">${icon('info', 22)} หมายเหตุ</h2>
                        <div class="card about-notes">
                            <ul class="about-notes_list">
                                <li>ข้อมูลมาจากแบบจำลองคุณภาพอากาศ อาจมีความคลาดเคลื่อนจากค่าจริง</li>
                                <li>ควรใช้ข้อมูลเป็นตัวชี้แนวโน้ม ไม่ใช่ข้อมูลทางการแพทย์</li>
                                <li>หากมีอาการผิดปกติ ควรพบแพทย์โดยตรง</li>
                            </ul>
                        </div>
                    </section>

                    <section class="about-section">
                        <h2 class="about-section_title">${icon('externalLink', 22)} สิ่งที่อยากพัฒนาต่อ</h2>
                        <div class="card about-roadmap">
                            <ul class="about-roadmap_list">
                                ${ROADMAP.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                    </section>

                    <footer class="card about-footer">
                        <div class="about-footer_icon">${icon('heart', 32)}</div>
                        <p class="about-footer_title">พัฒนาด้วยความตั้งใจเพื่อสุขภาพของชาวเชียงใหม่</p>
                        <p class="about-footer_desc">${APP_FULL_NAME} — เฝ้าฝุ่น เพื่อลมหายใจที่ดี</p>
                    </footer>

                </div>
            </div>
        `;
    }

    destroy() {}
}
