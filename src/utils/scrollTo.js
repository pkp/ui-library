import VueScrollTo from 'vue-scrollto';

/**
 * Register vue-scrollto and expose it as `$scrollTo`, with the animation
 * replaced by an instant jump when the user prefers reduced motion.
 *
 * vue-scrollto always animates (500ms by default and at every call site).
 * When `prefers-reduced-motion: reduce` is set we honour it (WCAG 2.3.3) by
 * scrolling instantly instead. Besides accessibility this matters for e2e
 * tests: a page that keeps moving for half a second after a step or form
 * change also moves whatever sits under the pointer, so a click started
 * during the animation can land on a different element and be lost. Test
 * runners can opt into the instant path by launching the browser with
 * reduced motion enabled (e.g. Playwright's `reducedMotion: 'reduce'`).
 *
 * The plugin's own `duration` default cannot be used for this because an
 * explicit duration passed by the caller always wins over the defaults.
 *
 * @param {import('vue').App} app
 */
export function installScrollTo(app) {
	app.use(VueScrollTo);
	const animatedScrollTo = app.config.globalProperties.$scrollTo;

	app.config.globalProperties.$scrollTo = function (
		target,
		duration,
		options = {},
	) {
		if (typeof duration === 'object' && duration !== null) {
			options = duration;
		}

		if (!prefersReducedMotion()) {
			return animatedScrollTo(target, duration, options);
		}

		const element = resolveElement(target);
		if (!element) {
			return;
		}

		const offset = typeof options.offset === 'number' ? options.offset : 0;
		window.scrollBy(0, element.getBoundingClientRect().top + offset);
		if (typeof options.onDone === 'function') {
			options.onDone(element);
		}
	};
}

/**
 * Whether the user asked the OS/browser for reduced motion.
 *
 * Evaluated on every call rather than once at startup so the setting can
 * change while the page is open.
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
 * Resolve a vue-scrollto target (selector, element or component) to an element.
 *
 * @param {string|Element|{$el: Element}} target
 * @return {?Element}
 */
function resolveElement(target) {
	const element =
		typeof target === 'string' ? document.querySelector(target) : target;
	const el = element && element.$el ? element.$el : element;
	return el && typeof el.getBoundingClientRect === 'function' ? el : null;
}
