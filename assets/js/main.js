/* Shared interactions. No framework or jQuery dependency. */
(() => {
    'use strict';

    const menu = document.querySelector('#main-nav');
    const toggle = document.querySelector('.site-header__toggle');
    if (menu && toggle && window.bootstrap) {
        menu.addEventListener('shown.bs.collapse', () => toggle.setAttribute('aria-label', 'Закрыть меню'));
        menu.addEventListener('hidden.bs.collapse', () => toggle.setAttribute('aria-label', 'Открыть меню'));
        menu.addEventListener('click', (event) => {
            if (event.target.closest('a[href]') && menu.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && menu.classList.contains('show')) {
                bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
                toggle.focus();
            }
        });
    }

    // Bootstrap 5.0 tabs need explicit roving focus / arrow key support.
    document.querySelectorAll('.faq__categories').forEach((tablist) => {
        const tabs = [...tablist.querySelectorAll('[role="tab"]')];
        tablist.addEventListener('shown.bs.tab', (event) => {
            tabs.forEach((tab) => { tab.tabIndex = tab === event.target ? 0 : -1; });
        });
        tablist.addEventListener('keydown', (event) => {
            const current = tabs.indexOf(document.activeElement);
            if (current < 0 || !window.bootstrap) return;
            let next;
            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (current + 1) % tabs.length;
            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = tabs.length - 1;
            if (next === undefined) return;
            event.preventDefault();
            tabs[next].focus();
            bootstrap.Tab.getOrCreateInstance(tabs[next]).show();
        });
    });

    document.querySelectorAll('.faq__questions').forEach((group) => {
        group.querySelectorAll('details').forEach((item) => {
            item.addEventListener('toggle', () => {
                if (!item.open) return;
                group.querySelectorAll('details[open]').forEach((other) => {
                    if (other !== item) other.open = false;
                });
            });
        });
    });
})();
