/**
 * Adjust SciFlow's drag-and-drop behavior for citations to work with our export.
 * This if for citations that are dragged onto existing text, which SciFlow does not handle correctly.
 * Keep existing text unchanged when the user drags a reference onto it.
 * If the action inserts or combines numbered citations, update their numbers
 * during export. SciFlow handles the drag-and-drop action; this adapter only
 * tells export which case occurred. We check what was replaced, not the
 * numbers in the citation:
 * "2021" could be either a year or a reference ID.
 */
export function adaptCitationDragDropFeature(feature) {
	return {
		...feature,
		addPlugins(...args) {
			return feature.addPlugins(...args).map((plugin) => {
				const drop = plugin.props.handleDOMEvents?.drop;
				if (!drop) return plugin;
				// Use SciFlow's own plugin class so our version works with
				// the bundled editor without importing another copy of ProseMirror.
				return new plugin.constructor({
					...plugin.spec,
					props: {
						...plugin.spec.props,
						handleDOMEvents: {
							...plugin.props.handleDOMEvents,
							drop(view, event) {
								// give SciFlow’s drag-and-drop handler a temporary wrapper around the editor.
								// That wrapper corrects the citation mode before SciFlow’s changes are applied
								const dropView = new Proxy(view, {
									get(target, property) {
										if (property === 'dispatch') {
											return (tr) => target.dispatch(setDropCitationModes(tr));
										}
										const value = Reflect.get(target, property, target);
										return typeof value === 'function'
											? value.bind(target)
											: value;
									},
								});
								return drop.call(this, dropView, event);
							},
						},
					},
				});
			});
		},
	};
}

function setDropCitationModes(tr) {
	const modes = new Map();
	/**
	 * A single drag-and-drop action can contain several changes - for example, updating one citation and removing another.
	 * The code first examines those changes to decide the correct citation mode - "custom" or "generated".
	 * Only after that update those citations' citationMode attributes.
	 */
	tr.steps.forEach((step, index) => {
		let insertsCitation = false;
		step.slice?.content.descendants((node) => {
			if (node.type.name === 'citation') insertsCitation = true;
		});
		if (!insertsCitation) return;
		step.getMap().forEach((from, to, newFrom, newTo) => {
			const before = tr.docs[index];
			let replacesCitation = false;
			if (to > from) {
				before.nodesBetween(from, to, (node) => {
					if (node.type.name === 'citation') replacesCitation = true;
				});
			}
			const wrapsText =
				to > from &&
				!replacesCitation &&
				before.textBetween(from, to).length > 0;
			/**
			 * When you drag one citation onto another, SciFlow combines them and removes the citation you dragged.
			 * Removing it can shift the combined citation’s position in the document.
			 * The code therefore finds its updated position before setting citationMode, so it changes the right citation.
			 */
			const remaining = tr.mapping.slice(index + 1);
			const start = remaining.map(newFrom, 1);
			const end = remaining.map(newTo, -1);
			if (end <= start) return;
			tr.doc.nodesBetween(start, end, (node, position) => {
				if (node.type.name !== 'citation') return;
				modes.set(position, wrapsText ? 'custom' : 'generated');
				return false;
			});
		});
	});
	for (const [position, citationMode] of modes) {
		const node = tr.doc.nodeAt(position);
		if (node.attrs.citationMode !== citationMode) {
			tr.setNodeMarkup(position, undefined, {...node.attrs, citationMode});
		}
	}
	return tr;
}
