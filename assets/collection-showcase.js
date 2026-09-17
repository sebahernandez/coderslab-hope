/**
 * <collection-showcase>
 * Filtrado client-side instantáneo por categoría.
 * Compara el `data-filter` del chip contra el `data-tags` de cada tarjeta.
 * data-filter="*" (chip "Todos") muestra todas las tarjetas.
 */
class CollectionShowcase extends HTMLElement {
  connectedCallback() {
    this.chips = Array.from(this.querySelectorAll('.cs-chip'));
    this.cards = Array.from(this.querySelectorAll('.cs-card'));

    this.chips.forEach((chip) => {
      chip.addEventListener('click', () => this.apply(chip));
    });

    // Aplica el chip activo inicial (o "Todos" por defecto) si existe.
    const initial = this.querySelector('.cs-chip.is-active') || this.chips[0];
    if (initial) this.apply(initial);
  }

  apply(activeChip) {
    this.chips.forEach((chip) => {
      const isActive = chip === activeChip;
      chip.classList.toggle('is-active', isActive);
      chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const filter = activeChip.dataset.filter;

    this.cards.forEach((card) => {
      const tags = (card.dataset.tags || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const show = filter === '*' || tags.includes(filter);
      card.classList.toggle('cs-card--hidden', !show);
    });
  }
}

if (!customElements.get('collection-showcase')) {
  customElements.define('collection-showcase', CollectionShowcase);
}
