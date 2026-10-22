const filters = [...document.querySelectorAll('[data-level-filter]')];
const cards = [...document.querySelectorAll('#projects-grid > [data-level]')];
for (const button of filters) {
  button.addEventListener('click', () => {
    const level = button.dataset.levelFilter;
    for (const filter of filters) {
      filter.classList.toggle('selected', filter === button);
      filter.setAttribute('aria-pressed', String(filter === button));
    }
    for (const card of cards) card.hidden = level !== 'All' && card.dataset.level !== level;
  });
}
