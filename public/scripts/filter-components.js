const buttons = [...document.querySelectorAll('[data-category-filter]')];
const cards = [...document.querySelectorAll('#catalog-grid > [data-category]')];
for (const button of buttons) {
  button.addEventListener('click', () => {
    const category = button.dataset.categoryFilter;
    for (const filter of buttons) {
      filter.classList.toggle('selected', filter === button);
      filter.setAttribute('aria-pressed', String(filter === button));
    }
    for (const card of cards) card.hidden = category !== 'All' && card.dataset.category !== category;
  });
}
