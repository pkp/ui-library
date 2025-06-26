// For big side modals, focus the heading following https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/#examples
export function focusFirstHeading(container, event) {
	const firstH1 = container.querySelector('h1');
	if (firstH1) {
		firstH1.focus();
		event.preventDefault();
	}
}
