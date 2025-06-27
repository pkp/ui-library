export function focusFirst(container, event) {
	if (!container.value) {
		return;
	}
	const candidates = getTabbableCandidates(container.value);
	const closeBtnIndex = candidates.findIndex((el) =>
		el.classList.contains('DialogClose'),
	);
	if (closeBtnIndex !== -1) {
		if (closeBtnIndex < candidates.length - 1) {
			// focus first element after the close button if available
			candidates[closeBtnIndex + 1].focus();
		} else {
			// focus close button
			candidates[closeBtnIndex].focus();
		}
		event.preventDefault();
	}
	// otherwise stick with default reka-ui behaviour
}

export function getTabbableCandidates(container) {
	const nodes = [];
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
		acceptNode: (node) => {
			const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden';
			if (node.disabled || node.hidden || isHiddenInput)
				return NodeFilter.FILTER_SKIP;
			// `.tabIndex` is not the same as the `tabindex` attribute. It works on the
			// runtime's understanding of tabbability, so this automatically accounts
			// for any kind of element that could be tabbed to.
			return node.tabIndex >= 0
				? NodeFilter.FILTER_ACCEPT
				: NodeFilter.FILTER_SKIP;
		},
	});
	while (walker.nextNode()) nodes.push(walker.currentNode);
	// we do not take into account the order of nodes with positive `tabIndex` as it
	// hinders accessibility to have tab order different from visual order.

	// filter links for consistency with reka-ui
	return nodes.filter((item) => item.tagName !== 'A');
}
