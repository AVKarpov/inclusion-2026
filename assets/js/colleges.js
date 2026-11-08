(() => {
    'use strict';

    const cards = [...document.querySelectorAll('.college-card')];
    const form = document.querySelector('#college-filters');
    const count = document.querySelector('#college-count');
    const empty = document.querySelector('#college-empty');
    const imageToggle = document.querySelector('#toggle-images');
    const modal = document.querySelector('#example-college-modal');
    if (!form || !modal) return;

    const normalize = (value) => value.toLocaleLowerCase('ru').trim().replace(/ё/g, 'е');

    const applyFilters = () => {
        const query = normalize(form.elements.college.value);
        const statuses = [...form.querySelectorAll('input[name="status"]:checked')].map((input) => input.value);
        const access = [...form.querySelectorAll('input[name="access"]:checked')].map((input) => input.value);
        let visible = 0;

        cards.forEach((card) => {
            const nameMatches = normalize(card.dataset.search).includes(query);
            const statusMatches = statuses.every((status) => card.dataset.status.split(' ').includes(status));
            const accessMatches = access.every((marker) => card.dataset.access.split(' ').includes(marker));
            const matches = nameMatches && statusMatches && accessMatches;
            card.hidden = !matches;
            if (matches) visible += 1;
        });

        count.textContent = String(visible);
        empty.hidden = visible !== 0;
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        applyFilters();
    });
    form.addEventListener('reset', () => requestAnimationFrame(applyFilters));
    document.querySelector('#empty-reset')?.addEventListener('click', () => form.reset());

    imageToggle?.addEventListener('click', () => {
        const hidden = document.body.classList.toggle('college-images-hidden');
        imageToggle.setAttribute('aria-pressed', String(hidden));
        imageToggle.textContent = hidden ? 'Показать все изображения' : 'Убрать все изображения';
    });

    modal.addEventListener('show.bs.modal', () => {
        modal.querySelector('.college-modal__body').scrollTop = 0;
    });

    modal.querySelectorAll('.admissions__toggle').forEach((button) => {
        button.addEventListener('click', () => {
            const expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!expanded));
            document.getElementById(button.getAttribute('aria-controls')).hidden = expanded;
        });
    });
})();
