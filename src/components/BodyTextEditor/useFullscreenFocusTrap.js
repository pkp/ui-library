import {watch, onBeforeUnmount, nextTick} from 'vue';

/**
 * Layered focus trap for the editor's fullscreen mode.
 *
 * The editor lives inside a reka-ui DialogContent whose FocusScope already
 * traps focus to the modal. When fullscreen is engaged we need a *nested*
 * trap scoped to the fullscreen container only. We cannot use reka-ui's
 * <FocusScope> directly: v-if'ing it would remount the sciflow web component
 * (losing undo history), and mounting it unconditionally would permanently
 * pause the modal's outer trap via the global focus-scope stack.
 *
 * Instead we attach capture-phase listeners on document while active. Capture
 * runs before reka-ui's bubble-phase handlers (FocusScope.vue:139-140), and
 * stopImmediatePropagation() prevents them from firing — so the modal's trap
 * sits inert while ours owns focus, and reactivates verbatim once we detach.
 *
 * Same technique as SideModalBody.vue:108-140 (TinyMCE / jQuery-UI escape).
 *
 * @param {Object}   options
 * @param {Ref<HTMLElement|null>} options.containerRef  Fullscreen container.
 * @param {Ref<boolean>}          options.active        Reactive on/off switch.
 * @param {() => void}            [options.onEscape]    Called on Escape keydown.
 */
export function useFullscreenFocusTrap({containerRef, active, onEscape}) {
	let lastFocusedInside = null;
	// Set on Tab keydown when we hand off to the browser; consumed by the
	// focusout handler if focus escapes the container (browser failed to reach
	// the next candidate, typically a shadow-DOM tab stop inside a <details>).
	let pendingTabDirection = null;

	function isInside(node) {
		const container = containerRef.value;
		return !!(container && node && container.contains(node));
	}

	function focusElement(el) {
		if (!el || typeof el.focus !== 'function') return;
		try {
			el.focus({preventScroll: false});
		} catch {
			el.focus();
		}
	}

	function focusFallback() {
		const container = containerRef.value;
		if (!container) return;
		const [first] = getTabbableEdges(container);
		focusElement(first ?? container);
	}

	function handleFocusInCapture(event) {
		const target = event.target;
		if (isInside(target)) {
			lastFocusedInside = target;
			// Tab successfully landed inside; the keydown handoff worked.
			pendingTabDirection = null;
			return;
		}
		event.stopImmediatePropagation();
		if (lastFocusedInside && isInside(lastFocusedInside)) {
			focusElement(lastFocusedInside);
		} else {
			focusFallback();
		}
	}

	function handleFocusOutCapture(event) {
		const next = event.relatedTarget;
		if (next === null) return;
		if (isInside(next)) {
			pendingTabDirection = null;
			return;
		}
		event.stopImmediatePropagation();
		// If focus escaped DURING a Tab handoff (we let the browser handle it
		// but it skipped past the next in-container candidate — e.g. shadow-DOM
		// tab stop the browser can't reach), redirect to the next candidate in
		// our list. Otherwise refocus the last-known position.
		if (pendingTabDirection && lastFocusedInside) {
			const candidates = getTabbableCandidates(containerRef.value);
			const idx = candidates.indexOf(lastFocusedInside);
			let target = null;
			if (idx !== -1) {
				if (pendingTabDirection === 'forward') {
					target = candidates[idx + 1] ?? candidates[0];
				} else {
					target = candidates[idx - 1] ?? candidates[candidates.length - 1];
				}
			}
			pendingTabDirection = null;
			if (target) {
				focusElement(target);
				return;
			}
		}
		if (lastFocusedInside && isInside(lastFocusedInside)) {
			focusElement(lastFocusedInside);
		} else {
			focusFallback();
		}
	}

	function handleKeyDownCapture(event) {
		if (event.key === 'Escape') {
			event.stopImmediatePropagation();
			event.preventDefault();
			onEscape?.();
			return;
		}
		if (event.key !== 'Tab') return;
		if (event.altKey || event.ctrlKey || event.metaKey) return;

		const container = containerRef.value;
		if (!container) return;
		const [first, last] = getTabbableEdges(container);
		if (!first || !last) {
			event.preventDefault();
			focusElement(container);
			return;
		}

		// Shadow-DOM-aware: descend through shadow roots to find the truly
		// focused element. Without this, focus inside <sciflow-formatbar>'s
		// shadow root looks like the host element from outside, and our edge
		// comparison fires for every Tab — breaking native intra-toolbar Tab.
		const focused = getDeepActiveElement();
		if (!event.shiftKey && focused === last) {
			event.preventDefault();
			event.stopImmediatePropagation();
			focusElement(first);
			pendingTabDirection = null;
		} else if (event.shiftKey && focused === first) {
			event.preventDefault();
			event.stopImmediatePropagation();
			focusElement(last);
			pendingTabDirection = null;
		} else {
			// Mid-cycle: let the browser handle the Tab. Remember direction so
			// the focusout handler can recover if the browser fails to reach
			// the next in-container candidate (some shadow-DOM tab stops are
			// unreachable via native Tab, e.g. inside sciflow-outline under a
			// <details>).
			pendingTabDirection = event.shiftKey ? 'backward' : 'forward';
		}
	}

	function activate() {
		document.addEventListener('focusin', handleFocusInCapture, true);
		document.addEventListener('focusout', handleFocusOutCapture, true);
		document.addEventListener('keydown', handleKeyDownCapture, true);

		nextTick(() => {
			const container = containerRef.value;
			if (!container) return;
			if (isInside(document.activeElement)) {
				lastFocusedInside = document.activeElement;
				return;
			}
			focusFallback();
		});
	}

	function deactivate() {
		document.removeEventListener('focusin', handleFocusInCapture, true);
		document.removeEventListener('focusout', handleFocusOutCapture, true);
		document.removeEventListener('keydown', handleKeyDownCapture, true);
		lastFocusedInside = null;
		pendingTabDirection = null;
	}

	watch(
		active,
		(isActive, wasActive) => {
			if (isActive && !wasActive) activate();
			else if (!isActive && wasActive) deactivate();
		},
		{immediate: true},
	);

	onBeforeUnmount(() => {
		if (active.value) deactivate();
	});
}

/**
 * Locate the first and last tabbable descendants of `container`, descending
 * through open shadow roots so custom-element internals (sciflow-formatbar,
 * sciflow-editor) are included in the tab order.
 */
function getTabbableEdges(container) {
	const candidates = getTabbableCandidates(container);
	if (candidates.length === 0) return [null, null];
	return [candidates[0], candidates[candidates.length - 1]];
}

function getTabbableCandidates(root) {
	const nodes = [];
	walkTabbable(root, nodes);
	// Drop elements that are not in the render tree — e.g. tabbable items
	// inside a closed <details>, or shadow-DOM descendants of a custom element
	// nested under such a closed accordion. Without this filter the walker's
	// `last` edge can point at an invisible element, and the Tab-wrap from the
	// last visible tabbable fails because we never recognise the edge.
	return nodes.filter(isVisible);
}

function isVisible(el) {
	if (typeof el.checkVisibility === 'function') return el.checkVisibility();
	return el.getClientRects().length > 0;
}

function walkTabbable(root, out) {
	const doc = root.ownerDocument ?? document;
	const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
	let node = walker.nextNode();
	while (node) {
		const shadowRoot = node.shadowRoot;
		if (shadowRoot && shadowRoot.mode === 'open') {
			// Recurse into open shadow roots — the browser includes their
			// tabbable contents in the natural Tab order (verified live for
			// sciflow-formatbar's buttons). For cases where the browser fails
			// to reach a particular candidate (some shadow-in-<details> quirks
			// with sciflow-outline), the focusout handler redirects manually.
			walkTabbable(shadowRoot, out);
		} else if (isTabbable(node)) {
			out.push(node);
		}
		node = walker.nextNode();
	}
}

function isTabbable(node) {
	const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden';
	if (node.disabled || node.hidden || isHiddenInput) return false;
	return node.tabIndex >= 0;
}

/**
 * Returns the deepest active element across open shadow roots. Mirrors
 * reka-ui's shared/getActiveElement.ts.
 */
function getDeepActiveElement() {
	let el = document.activeElement;
	while (el && el.shadowRoot && el.shadowRoot.activeElement) {
		el = el.shadowRoot.activeElement;
	}
	return el;
}
