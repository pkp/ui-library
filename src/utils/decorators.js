export const withLocalStorage = (key, value) => (storyFn) => {
	// save the original value so we can restore it later
	const originalValue = localStorage.getItem(key);

	// set the localStorage item to the desired value
	localStorage.setItem(key, value);

	// return a wrapper component that renders the story
	const story = storyFn();

	// restore the original localStorage value when the story is unmounted
	story.beforeDestroy = () => {
		if (originalValue === null) {
			localStorage.removeItem(key);
		} else {
			localStorage.setItem(key, originalValue);
		}
	};

	return story;
};
