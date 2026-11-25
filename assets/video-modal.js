import { DialogComponent } from '@theme/dialog';

/**
 * A dialog that lazily mounts a video player when opened and unmounts it on close,
 * which stops playback for uploaded videos and for YouTube/Vimeo iframes alike.
 *
 * @typedef {object} Refs
 * @property {HTMLDialogElement} dialog – The dialog element.
 * @property {HTMLElement} player – Container that receives the video markup while open.
 * @property {HTMLTemplateElement} videoTemplate – Template holding the video markup.
 *
 * @extends DialogComponent
 */
class VideoModal extends DialogComponent {
  /** @type {AbortController | undefined} */
  #abortController;

  requiredRefs = ['dialog', 'player', 'videoTemplate'];

  connectedCallback() {
    super.connectedCallback();

    this.#abortController?.abort();
    this.#abortController = new AbortController();

    // The native `close` event fires for Escape, backdrop click and the close button.
    this.refs.dialog.addEventListener('close', this.#unmountPlayer, {
      signal: this.#abortController.signal,
    });
  }

  updatedCallback() {
    super.updatedCallback();

    // Refs may point to new nodes after a section re-render: rebind the listener.
    this.#abortController?.abort();
    this.#abortController = new AbortController();
    this.refs.dialog.addEventListener('close', this.#unmountPlayer, {
      signal: this.#abortController.signal,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#abortController?.abort();
    this.#abortController = undefined;
  }

  /**
   * Mounts the video from the template (once) and opens the dialog.
   */
  showDialog() {
    const { player, videoTemplate } = this.refs;

    if (player && videoTemplate && !player.hasChildNodes()) {
      player.append(videoTemplate.content.cloneNode(true));
    }

    super.showDialog();
  }

  /**
   * Removes the player markup so audio and network activity stop.
   */
  #unmountPlayer = () => {
    this.refs.player?.replaceChildren();
  };
}

if (!customElements.get('video-modal')) customElements.define('video-modal', VideoModal);
