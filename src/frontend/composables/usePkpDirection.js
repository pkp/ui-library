import {ref} from 'vue';

let dirRef = null;
let observerStarted = false;

function getDir() {
	if (typeof document === 'undefined') return 'ltr';
	return document.documentElement.dir || document.body.dir || 'ltr';
}

function startObserver() {
	if (observerStarted || typeof document === 'undefined') return;
	observerStarted = true;

	const observer = new MutationObserver(() => {
		dirRef.value = getDir();
	});
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['dir'],
	});
	observer.observe(document.body, {attributes: true, attributeFilter: ['dir']});
}

export function usePkpDirection() {
	if (!dirRef) {
		dirRef = ref(getDir());
		startObserver();
	}
	return dirRef;
}
