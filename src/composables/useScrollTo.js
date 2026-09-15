/**
 * Scrolls an element to the top of the window, or of a scrolling container,
 * with the browser's own scrolling.
 *
 * Whether the scroll animates is the stylesheet's decision (`scroll-behavior`
 * in `_global.less`), so `prefers-reduced-motion` is honoured without any
 * script knowing about it. Replaces the vue-scrollto plugin, which always
 * animated on the main thread.
 */
export function useScrollTo() {
	/**
	 * Scroll an element into view at the top of its scrolling ancestor
	 *
	 * @param {string|Element|{$el: Element}} target A selector, an element
	 *   or a component instance
	 * @param {Object} [options]
	 * @param {number} [options.offset=0] Pixels to stop short of the element;
	 *   negative leaves room above it (-50 keeps it clear of a sticky header)
	 * @param {Element} [options.container] A scrolling ancestor to scroll
	 *   instead of the window
	 */
	function scrollTo(target, {offset = 0, container = null} = {}) {
		const element =
			typeof target === 'string' ? document.querySelector(target) : target;
		const el = element && element.$el ? element.$el : element;
		if (!el || typeof el.getBoundingClientRect !== 'function') {
			return;
		}
		const top = el.getBoundingClientRect().top + offset;
		if (container) {
			container.scrollTo({
				top: container.scrollTop + top - container.getBoundingClientRect().top,
			});
			return;
		}
		window.scrollTo({top: window.scrollY + top});
	}

	return {scrollTo};
}
