// ===== Atmos Data Chiang Mai - SPA Hash Router =====

export class Router {
    constructor(container) {
        this.container = container;
        this.routes = new Map();
        this.currentPage = null;
        this._activeRoutePath = null;
        this.onHashChange = this._handleRoute.bind(this);
    }

    //** Register a route */
    on(path, pageFactory) {
        this.routes.set(path, pageFactory);
        return this;
    }

    /** Start listening for hash changes */
    start() {
        window.addEventListener('hashchange', this.onHashChange);
        this._handleRoute();
    }

    /** Stop the router */
    destroy() {
        window.removeEventListener('hashchange', this.onHashChange);
        if (this.currentPage?.destroy) this.currentPage.destroy();
    }

    /** Navigate programmatically */
    navigate(path) {
        window.location.hash = path;
    }

    /** Get current route path (without query string) */
    get currentRoute() {
        const hash = window.location.hash.slice(1) || '/';
        return hash.split('?')[0] || '/';
    }

    /** Get full hash including query string */
    get currentHash() {
        return window.location.hash.slice(1) || '/';
    }
    
    /** Internal: Handle route changes */
    async _handleRoute() {
        const path = this.currentRoute;
        const fullHash = this.currentHash;

        // Same page, only query changed (e.g. dashboard district) — update in place
        if (
            this.currentPage &&
            this._activeRoutePath === path &&
            typeof this.currentPage.onRouteQueryChange === 'function'
        ) {
            try {
                await this.currentPage.onRouteQueryChange(fullHash);
            } catch (err) {
                console.error('Page query update error:', err);
            }
            this._updateNav(path);
            return;
        }

        this._activeRoutePath = path;

        // Cleanup previous page
        if (this.currentPage?.destroy) {
            this.currentPage.destroy();
        }

        // Find matching route
        const pageFactory = this.routes.get(path) || this.routes.get('/');

        if (pageFactory) {
            // Show loading state
            this.container.innerHTML = `
                <div class="page" style="display:flex;align-items:center;justify-content:center;min-height:50vh;">
                    <div class="loading-spinner"></div>
                </div>
            `;

            try {
                this.currentPage = pageFactory(this.container);
                await this.currentPage.render();
            } catch (err) {
                console.error('Page render error:', err);
                this.container.innerHTML = `
                <div class="page">
                    <div class="empty-state">
                        <div class="empty-state__icon" style="color:var(--aqi-moderate)"><svg xmlns="http://www.w3.org/2000/svg" width="40"
                        height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12
                        9v4m0 4h.01"/></svg></div>
                        <div class="empty-state__title">เกิดข้อผิดพลาด</div>
                        <div class="empty-state__desc">${err.message}</div>
                        <button class="btn btn--outline" onclick="location.reload()" style="margin-top:1rem">
                            โหลดใหม่
                        </button>
                    </div>
                </div>
                `;
            }
        }

        // Update active nav link
        this._updateNav(path);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /** Update the active state on nav links */
    _updateNav(path) {
        const basePath = path.split('?')[0] || '/';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = (link.getAttribute('href') || '').replace('#', '').split('?')[0] || '/';
            link.classList.toggle('active', href === basePath);
        });
    }
}