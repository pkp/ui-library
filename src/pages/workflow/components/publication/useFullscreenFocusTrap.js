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
		if (isInside(next)) return;
		event.stopImmediatePropagation();
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
		} else if (event.shiftKey && focused === first) {
			event.preventDefault();
			event.stopImmediatePropagation();
			focusElement(last);
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
	return nodes;
}

function walkTabbable(root, out) {
	const doc = root.ownerDocument ?? document;
	// No acceptNode filter here: a custom-element host typically has tabIndex
	// < 0, but its shadow root may contain tabbable buttons (sciflow-formatbar
	// is exactly this case). If we filter at walker time, the host is dropped
	// before we get a chance to descend into its shadow root.
	const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
	let node = walker.nextNode();
	while (node) {
		const shadowRoot = node.shadowRoot;
		if (shadowRoot && shadowRoot.mode === 'open') {
			// Host with open shadow DOM: real tab stops live inside. Skip the
			// host itself (delegatesFocus / inner-focus behaviour means focus
			// lands on a descendant) and recurse into the shadow tree.
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
