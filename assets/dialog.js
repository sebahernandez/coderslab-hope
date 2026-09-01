import { Component } from '@theme/component';
import { debounce, isClickedOutside, onAnimationEnd } from '@theme/utilities';

/**
 * A custom element that manages a dialog.
 *
 * @typedef {object} Refs
 * @property {HTMLDialogElement} dialog – The dialog element.
 *
 * @extends Component<Refs>
 */
export class DialogComponent extends Component {
  requiredRefs = ['dialog'];

  connectedCallback() {
    super.connectedCallback();

    if (this.minWidth || this.maxWidth) {
      window.addEventListener('resize', this.#handleResize);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.minWidth || this.maxWidth) {
      window.removeEventListener('resize', this.#handleResize);
    }
  }

  #handleResize = debounce(() => {
    const { minWidth, maxWidth } = this;

    if (!minWidth && !maxWidth) return;

    const windowWidth = window.innerWidth;
    if (windowWidth < minWidth || windowWidth > maxWidth) {
      this.closeDialog();
    }
  }, 50);

  /**
   * Shows the dialog.
   */
  showDialog() {
    const { dialog } = this.refs;

    if (dialog.open) return;

    dialog.showModal();
    this.dispatchEvent(new DialogOpenEvent());

    // A tap that lands while the opening (slide-in / fade-in) animation is still running can miss its
    // target, since hit-testing uses the dialog's current in-transit position rather than its final one.
    // Finishing the animation on first contact settles the geometry before the resulting click fires,
    // so the very first tap (e.g. on the drawer's checkout button) lands correctly.
    this.addEventListener('pointerdown', this.#finishOpeningAnimation, { once: true });

    // Wait until the next tick to add the event listeners to avoid race condition
    // when `showDialog` is called within a click event listener.
    setTimeout(() => {
      this.addEventListener('click', this.#handleClick);
      this.addEventListener('keydown', this.#handleKeyDown);
    });
  }

  /**
   * Immediately completes any in-flight opening animation on the dialog or its content.
   */
  #finishOpeningAnimation = () => {
    this.refs.dialog.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
  };

  /**
   * Closes the dialog.
   */
  closeDialog = async () => {
    const { dialog } = this.refs;

    if (!dialog.open) return;

    this.removeEventListener('click', this.#handleClick);
    this.removeEventListener('keydown', this.#handleKeyDown);
    this.removeEventListener('pointerdown', this.#finishOpeningAnimation);

    dialog.classList.add('dialog-closing');

    await onAnimationEnd(dialog, undefined, {
      subtree: true,
    });

    dialog.close();
    dialog.classList.remove('dialog-closing');

    this.dispatchEvent(new DialogCloseEvent());
  };

  /**
   * Toggles the dialog.
   */
  toggleDialog = () => {
    if (this.refs.dialog.open) {
      this.closeDialog();
    } else {
      this.showDialog();
    }
  };

  /**
   * Closes the dialog when the user clicks outside of it.
   *
   * @param {MouseEvent} event - The mouse event.
   */
  #handleClick(event) {
    const { dialog } = this.refs;

    if (isClickedOutside(event, dialog)) {
      this.closeDialog();
    }
  }

  /**
   * Closes the dialog when the user presses the escape key.
   *
   * @param {KeyboardEvent} event - The keyboard event.
   */
  #handleKeyDown(event) {
    if (event.key !== 'Escape') return;

    event.preventDefault();
    this.closeDialog();
  }

  /**
   * Gets the minimum width of the dialog.
   *
   * @returns {number} The minimum width of the dialog.
   */
  get minWidth() {
    return Number(this.getAttribute('dialog-active-min-width'));
  }

  /**
   * Gets the maximum width of the dialog.
   *
   * @returns {number} The maximum width of the dialog.
   */
  get maxWidth() {
    return Number(this.getAttribute('dialog-active-max-width'));
  }
}

if (!customElements.get('dialog-component')) customElements.define('dialog-component', DialogComponent);

export class DialogOpenEvent extends CustomEvent {
  constructor() {
    super(DialogOpenEvent.eventName);
  }

  static eventName = 'dialog:open';
}

export class DialogCloseEvent extends CustomEvent {
  constructor() {
    super(DialogCloseEvent.eventName);
  }

  static eventName = 'dialog:close';
}

document.addEventListener(
  'toggle',
  (event) => {
    if (event.target instanceof HTMLDialogElement || event.target instanceof HTMLDetailsElement) {
      if (event.target.hasAttribute('scroll-lock')) {
        const { open } = event.target;

        if (open) {
          document.documentElement.setAttribute('scroll-lock', '');
        } else {
          document.documentElement.removeAttribute('scroll-lock');
        }
      }
    }
  },
  { capture: true }
);
