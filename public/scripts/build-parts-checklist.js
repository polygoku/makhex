// Browser-local parts-in-hand checklist. No network, account, checkout or tracking.
for (const panel of document.querySelectorAll('[data-build-checklist]')) {
  const slug = panel.dataset.projectSlug;
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) continue;
  const checkboxes = [...panel.querySelectorAll('input[type="checkbox"][data-part-slug]')];
  const progress = panel.querySelector('[data-checklist-progress]');
  const reset = panel.querySelector('[data-checklist-reset]');
  if (!progress || !reset || !checkboxes.length) continue;
  const key = 'makhex:workbench:v1:' + slug;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) {
      for (const checkbox of checkboxes) checkbox.checked = saved.includes(checkbox.dataset.partSlug);
    }
  } catch {
    // Browser storage might be disabled. The checklist remains usable for this page.
  }
  function render(save) {
    const marked = checkboxes.filter(input => input.checked).map(input => input.dataset.partSlug);
    progress.textContent = marked.length + ' of ' + checkboxes.length + ' part types checked';
    reset.disabled = marked.length === 0;
    if (save) {
      try { localStorage.setItem(key, JSON.stringify(marked)); } catch { /* optional */ }
    }
  }
  for (const checkbox of checkboxes) checkbox.addEventListener('change', () => render(true));
  reset.addEventListener('click', () => {
    for (const checkbox of checkboxes) checkbox.checked = false;
    render(true);
    checkboxes[0]?.focus();
  });
  render(false);
}
