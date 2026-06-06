// ===== Atmos Data Chiang Mai - Toast notifacation system =====

import { icon } from '../config.js';

let container = null;

function ensureContainer() {
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

const TOAST_ICONS = {
    info: 'info',
    success: 'check',
    warning: 'alertTriangle',
    error: 'x',
};

const TOAST_COLORS = {
    info: 'info',
    success: 'check',
    warning: 'alert-triangle',
    error: 'x',
};

export function showToast(message, { type = 'info', duration = 4000 } = {}) {
    ensureContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <span class="toast__icon">${icon(TOAST_ICONS[type] || 'info', 18)}</span>
        <span class="toast__message">${message}</span>
        <button class="toast__close">${icon('x', 14)}</button>
    `;

    container.appendChild(toast);

    const remove = () => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast__close').addEventListener('click', remove);

    if (duration > 0) {
        setTimeout(remove, duration);
    }
}
