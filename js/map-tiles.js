// ===== Map tile loading with network/CDN fallbacks =====

import { MAP_TILE_SOURCES } from './config.js';

const TILE_PROBE = { z: 9, x: 256, y: 189, s: 'a' };

export function isSlowConnection() {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return false;
    if (conn.saveData) return true;
    return ['slow-2g', '2g', '3g'].includes(conn.effectiveType);
}

function buildSampleTileUrl(source) {
    let url = source.url
        .replace('{z}', TILE_PROBE.z)
        .replace('{x}', TILE_PROBE.x)
        .replace('{y}', TILE_PROBE.y)
        .replace('{r}', '');

    if (source.subdomains) {
        url = url.replace('{s}', source.subdomains[0] || TILE_PROBE.s);
    }

    return url;
}

/** Test whether a tile server responds (handles blocked CDNs / slow WiFi) */
export function probeTileSource(source, timeoutMs = 10000) {
    return new Promise((resolve) => {
        const img = new Image();
        let settled = false;

        const finish = (ok) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            img.onload = null;
            img.onerror = null;
            img.src = '';
            resolve(ok);
        };

        const timer = setTimeout(() => finish(false), timeoutMs);
        img.onload = () => finish(true);
        img.onerror = () => finish(false);
        img.src = `${buildSampleTileUrl(source)}?probe=${Date.now()}`;
    });
}

export async function findWorkingTileSource(theme, { startIndex = 0 } = {}) {
    const sources = MAP_TILE_SOURCES[theme] || MAP_TILE_SOURCES.dark;
    const timeout = isSlowConnection() ? 15000 : 8000;

    for (let i = startIndex; i < sources.length; i += 1) {
        const ok = await probeTileSource(sources[i], timeout);
        if (ok) return { source: sources[i], index: i };
    }

    return { source: sources[sources.length - 1], index: sources.length - 1 };
}

export function createTileLayer(source, options = {}) {
    const slow = isSlowConnection();

    return L.tileLayer(source.url, {
        attribution: source.attribution,
        subdomains: source.subdomains || undefined,
        maxZoom: slow ? 17 : 19,
        minZoom: 3,
        detectRetina: slow ? false : (source.detectRetina ?? false),
        keepBuffer: slow ? 6 : 4,
        updateWhenIdle: true,
        updateWhenZooming: false,
        crossOrigin: true,
        ...options,
    });
}

export function getTileSourcesForTheme(theme) {
    return MAP_TILE_SOURCES[theme] || MAP_TILE_SOURCES.dark;
}
