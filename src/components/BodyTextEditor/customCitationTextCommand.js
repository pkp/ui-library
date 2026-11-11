const installedEditors = new WeakSet();

/**
 * Overrides the `updateCitationNode` command to set `citationMode: 'custom'` when the citation content changes.
 * This is necessary because SciFlow does not expose a public API for this, and we need to ensure that custom citations are handled correctly,
 * in particular for manually edited citations we don't apply automatic reference number formatting during conversion to HTML and PDF
 */
export function installCustomCitationTextCommand(editor) {
	if (installedEditors.has(editor)) return;
	let prototype = Object.getPrototypeOf(editor);
	let descriptor;
	while (prototype && !descriptor) {
		descriptor = Object.getOwnPropertyDescriptor(prototype, 'commands');
		prototype = Object.getPrototypeOf(prototype);
	}
	if (!descriptor?.get) {
		throw new Error('SciFlow does not expose its command interface.');
	}
	const runners = new WeakMap();
	// Decorate only this editor instance's public command interface. Read the
	// original getter each time so feature reconfiguration uses the new runner.
	Object.defineProperty(editor, 'commands', {
		configurable: true,
		get() {
			const runner = descriptor.get.call(this);
			if (!runner) return runner;
			if (!runners.has(runner)) {
				runners.set(
					runner,
					new Proxy(runner, {
						get(target, property, receiver) {
							const value = Reflect.get(target, property, receiver);
							if (property !== 'commands' || !value.updateCitationNode)
								return value;
							return {
								...value,
								updateCitationNode: (position, options) =>
									updateCitationNode(
										editor,
										value.updateCitationNode,
										position,
										options,
									),
							};
						},
					}),
				);
			}
			return runners.get(runner);
		},
	});
	installedEditors.add(editor);
}

function updateCitationNode(editor, original, position, options) {
	const state = editor.editorView.state;
	let citation = state.doc.nodeAt(position);
	if (citation?.type.name !== 'citation') {
		// SciFlow also accepts a position inside the citation, not just its start.
		const resolved = state.doc.resolve(position);
		citation = null;
		for (let depth = resolved.depth; depth > 0; depth--) {
			if (resolved.node(depth).type.name === 'citation') {
				citation = resolved.node(depth);
				break;
			}
		}
	}
	if (!citation) return original(position, options);

	const content =
		typeof options.content === 'string'
			? citation.type.create(
					citation.attrs,
					options.content ? state.schema.text(options.content) : undefined,
				).content
			: options.content;
	// A text or formatting edit is intentional, even if it looks like a
	// reference number. Changing only reference details is not a text edit.
	const contentChanged = !citation.content.eq(content);
	return original(position, {
		...options,
		attrs: {
			...options.attrs,
			...(contentChanged ? {citationMode: 'custom'} : {}),
		},
	});
}
