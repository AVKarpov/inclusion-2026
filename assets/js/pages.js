/* Shared interactions for the applicant, support, project and contact pages. */
(() => {
    'use strict';

    // Bootstrap 5.0 handles selection; add roving focus and keyboard navigation.
    document.querySelectorAll('[data-tablist]').forEach((tablist) => {
        const tabs = [...tablist.querySelectorAll('[role="tab"]')];
        tablist.addEventListener('shown.bs.tab', (event) => {
            tabs.forEach((tab) => { tab.tabIndex = tab === event.target ? 0 : -1; });
        });
        tablist.addEventListener('keydown', (event) => {
            const index = tabs.indexOf(document.activeElement);
            if (index < 0 || !window.bootstrap) return;
            let next;
            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
            if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = tabs.length - 1;
            if (next === undefined) return;
            event.preventDefault();
            tabs[next].focus({ preventScroll: true });
            bootstrap.Tab.getOrCreateInstance(tabs[next]).show();
            tabs[next].scrollIntoView({ block: 'nearest', inline: 'nearest' });
        });
    });

    const projectTabs = document.querySelector('.project-browser__tabs[role="tablist"]');
    if (projectTabs) {
        const wideScreen = window.matchMedia('(min-width: 992px)');
        const setOrientation = () => projectTabs.setAttribute('aria-orientation', wideScreen.matches ? 'vertical' : 'horizontal');
        setOrientation();
        wideScreen.addEventListener('change', setOrientation);
    }

    const filters = document.querySelector('#event-filters');
    if (filters) {
        const cards = [...document.querySelectorAll('.event-card')];
        const count = document.querySelector('#event-count');
        const empty = document.querySelector('#event-empty');
        const applyFilters = () => {
            const type = filters.elements.namedItem('type').value;
            const format = filters.elements.namedItem('format').value;
            const date = filters.elements.namedItem('date').value;
            let visible = 0;
            cards.forEach((card) => {
                const matches = (!type || type === card.dataset.eventType)
                    && (!format || format === card.dataset.eventFormat)
                    && (!date || date === card.dataset.eventDate);
                card.hidden = !matches;
                if (matches) visible += 1;
            });
            count.textContent = String(visible);
            empty.hidden = visible !== 0;
        };
        filters.addEventListener('submit', (event) => {
            event.preventDefault();
            applyFilters();
        });
        filters.addEventListener('reset', () => requestAnimationFrame(applyFilters));
        document.querySelector('#event-reset').addEventListener('click', () => filters.reset());
    }

    document.querySelectorAll('.info-modal').forEach((dialog) => {
        dialog.addEventListener('shown.bs.modal', () => {
            dialog.querySelector('.modal-body').scrollTop = 0;
        });
    });

    const carousel = document.querySelector('#past-events-carousel');
    carousel?.addEventListener('slid.bs.carousel', (event) => {
        const total = carousel.querySelectorAll('.carousel-item').length;
        document.querySelector('#carousel-status').textContent = `Событие ${event.to + 1} из ${total}`;
    });
})();
