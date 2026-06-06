// ===== Atmos Data Chiang Mai - Main App Entry =====

import { Router } from './router.js';
import { initNavbar } from './components/navbar.js';

// Page imports
import { HomePage } from './pages/home.js';
import { DashboardPage } from './pages/dashboard.js';
import { MapPage } from './pages/map.js';
import { RankingPage } from './pages/ranking.js';
import { AlertsPage } from './pages/alerts.js';
import { AboutPage } from './pages/about.js';

class App {
    constructor() {
        this.container = document.getElementById('app');
        this.router = new Router(this.container);
    }

    init() {
        // Initialize Navbar
        initNavbar();

        // Register routes
        this.router
            .on('/', (el) => new HomePage(el))
            .on('/dashboard', (el) => new DashboardPage(el))
            .on('/map', (el) => new MapPage(el))
            .on('/ranking', (el) => new RankingPage(el))
            .on('/alerts', (el) => new AlertsPage(el))
            .on('/about', (el) => new AboutPage(el));

        // Start routing
        this.router.start();

        console.log('Atmos Data Chiang Mai App - Loaded');
    }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
