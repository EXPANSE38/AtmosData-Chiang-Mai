// ===== Atmos Data Chiang Mai - Chart helper (Chart.js wrapper) =====

import { getAqiLevel } from '../utils.js';

/** Default Chart.js options for dark theme */
function getDefaultChartOptions(title = '') {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
    const textColor = isDark ? '#9ca3af' : '#6b7280';

    return {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            title: {
                display: !!title,
                text: title,
                color: textColor,
                font: { size: 14, weight: '600', family: 'Inter' },
                padding: { bottom: 16 },
            },
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                titleColor: isDark ? '#f3f4f6' : '#0f172a',
                bodyColor: isDark ? '#9ca3af' : '#475569',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleFont: { weight: '600', family: 'Inter' },
                bodyFont: { family: 'Inter' },
            },
        },
        scales: {
            x: {
                grid: { color: gridColor },
                ticks: { color: textColor, font: { size: 11, family: 'Inter' }, maxRotation: 45 },
            },
            y: {
                grid: { color: gridColor },
                ticks: { color: textColor, font: { size: 11, family: 'Inter' } },
                beginAtZero: true,
            },
        },
    };
}

/** Color each point by AQI level */
function getPointColors(values) {
    return values.map(v => getAqiLevel(v).color);
}

/** Create a gradient fill */
function createGradient(ctx, color) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '00');
    return gradient;
}

/**
 * Create / update a line chart
 */
export function createLineChart(canvas, labels, data, {
    label = 'PM2.5',
    title = '',
    color = '#3b82f6',
    unit = 'μg/m³',
    showAqiColors = false,
} = {}) {
    const ctx = canvas.getContext('2d');
    const options = getDefaultChartOptions(title);

    options.scales.y.title = {
        display: true,
        text: unit,
        color: '#6b7280',
        font: { size: 11, family: 'Inter' },
    };

    options.plugins.tooltip.callbacks = {
        label: (context) => {
            const val = context.parsed.y;
            if (val == null) return '';
            const level = getAqiLevel(val);
            return `${label}: ${val.toFixed(1)} ${unit} (${level.label})`;
        },
    };

    const pointColors = showAqiColors ? getPointColors(data) : color;

    const chartData = {
        labels,
        datasets: [{
            label,
            data,
            borderColor: showAqiColors ? pointColors : color,
            backgroundColor: createGradient(ctx, color),
            pointBackgroundColor: pointColors,
            pointBorderColor: 'transparent',
            pointRadius: 3,
            pointHoverRadius: 6,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            segment: showAqiColors ? {
                borderColor: (ctx) => getAqiLevel(ctx.p1.parsed.y).color,
            } : undefined,
        }],
    };

    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    return new Chart(ctx, {
        type: 'line',
        data: chartData,
        options,
    });
}

/**
 * Create a bar chart (e.g. for district comparison)
 */
export function createBarChart(canvas, labels, data, {
    label = 'PM2.5',
    title = '',
    unit = 'μg/m³',
} = {}) {
    const ctx = canvas.getContext('2d');
    const options = getDefaultChartOptions(title);

    options.scales.y.title = {
        display: true,
        text: unit,
        color: '#6b7280',
        font: { size: 11, family: 'Inter' },
    };

    const colors = data.map(v => getAqiLevel(v).color);

    const chartData = {
        labels,
        datasets: [{
            label,
            data,
            backgroundColor: colors.map(c => c + '80'),
            borderColor: colors,
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    return new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options,
    });
}
