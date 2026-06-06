// ===== Atmos Data Chiang Mai - Navbar Component =====

import { storage } from '../utils.js';
import { APP_NAME, icon } from '../config.js';

const Nav_ITEMS = [
    { path: '/', label: 'หน้าแรก', iconName: 'home' },
    { path: '/dashboard', label: 'แดชบอร์ด', iconName: 'dashboard' },
    { path: '/map', label: 'แผนที่', iconName: 'map' },
    { path: '/ranking', label: 'จัดอันดับ', iconName: 'ranking' },
    { path: '/alerts', label: 'แจ้งเตือน', iconName: 'bell' },
    { path: '/about', label: 'เกี่ยวกับ', iconName: 'info' },
];

export function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('nav-overlay');

    const linkHtml = Nav_ITEMS.map(item => `
        <a href="#${item.path}" class="nav-link" data-route="${item.path}">
        <span class="nav-link_icon">${icon(item.iconName, 18)}</span>
        <span>${item.label}</span>
        </a>
    `).join('');

    navbar.innerHTML = `
        <a href="#/" class="navbar_brand">
            <div class="navbar_brand-icon"><img src="icon.png" alt="" class="navbar_logo" width="32" height="32"></div>
            <span>${APP_NAME}</span>
        </a>
        <nav class="navbar_nav">
            ${linkHtml}
        </nav>
        <div class="navbar_actions">
        <button class="theme-toggle" id="theme-toggle" aria-label="สลับธีม">${icon('moon', 18)}</button>
        <button class="navbar_menu-btn" id="menu-btn" aria-label="เปิดเมนู">${icon('menu', 20)}</button>
        </div>
    `;

    mobileNav.innerHTML = `
    <button class="mobile-nav_close" id="mobile-close" aria-label="ปิดเมนู">${icon('x', 20)}</button>
    ${linkHtml}
    `;

    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = storage.get('theme', 'dark');
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeBtn.innerHTML = currentTheme === 'dark' ? icon('sun', 18) : icon('moon', 18);

    themeBtn.addEventListener('click', () => {
        const isdark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isdark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        storage.set('theme', newTheme);
        themeBtn.innerHTML = newTheme === 'dark' ? icon('sun', 18) : icon('moon', 18);
        window.dispatchEvent(new CustomEvent('themechange', { detail: newTheme }));
    });

    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('mobile-close');

    const openMobile = () => {
        mobileNav.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMobile = () => {
        mobileNav.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', openMobile);
    closeBtn.addEventListener('click', closeMobile);
    overlay.addEventListener('click', closeMobile);

    mobileNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobile);
    });
}
