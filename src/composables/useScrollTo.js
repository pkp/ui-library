/**
 * Scrolls an element to the top of the window, or of a scrolling container,
 * with the browser's own scrolling.
 *
 * The scroll animates unless the user asked the OS or browser for reduced
 * motion (WCAG 2.3.3), in which case it jumps instantly. Besides
 * accessibility this matters for e2e tests: a page that keeps moving after
 * a step or form change also moves whatever sits under the pointer, so a
 * click started during the animation can land on a different element. Test
 * runners opt into the instant path by launching the browser with reduced
 * motion enabled (e.g. Playwright's `reducedMotion: 'reduce'`).
 *
 * The preference is applied per call rather than through a global
 * `scroll-behavior: smooth` stylesheet rule, because such a rule also
 * animates the browser's own `scrollIntoView` / `scrollBy` calls that
 * Cypress relies on for its actionability checks and breaks them.
 * Replaces the vue-scrollto plugin, which always animated on the main thread.
 */
export function useScrollTo() {
	/**
	 * Whether the user asked the OS/browser for reduced motion.
	 *
	 * Evaluated on every call rather than once at startup so the setting can
	 * change while the page is open (e.g. Playwright's `page.emulateMedia`).
	 *
	 * @return {boolean}
	 */
	function prefersReducedMotion() {
		return (
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

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
		const behavior = prefersReducedMotion() ? 'instant' : 'smooth';
		const top = el.getBoundingClientRect().top + offset;
		if (container) {
			container.scrollTo({
				top: container.scrollTop + top - container.getBoundingClientRect().top,
				behavior,
			});
			return;
		}
		window.scrollTo({top: window.scrollY + top, behavior});
	}

	return {scrollTo};
}
