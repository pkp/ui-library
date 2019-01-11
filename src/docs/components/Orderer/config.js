export let props = {
	itemId: 1,
	itemTitle: 'One',
	isDraggable: false,
	i18n: {
		orderUp: 'Increase position of {$itemTitle}',
		orderDown: 'Decrease position of {$itemTitle}'
	}
};

export const propDocs = [
	{
		key: 'itemId',
		description:
			"A unique id for the item to be ordered. This will be emitted in the `up` and `down` events. It may be a string or number, and does not correspond to the item's order in the list."
	},
	{
		key: 'itemTitle',
		description:
			'The name of the item. This is used in an accessible label for the up and down buttons. See the `i18n` prop.'
	},
	{
		key: 'isDraggable',
		description:
			'Whether or not to provide drag-and-drop controls for this item. When `isDraggable` is true, the items to be ordered must be wrapped in a `<draggable>` component.'
	},
	{
		key: 'i18n',
		description: 'Translation strings required to display this component.'
	}
];

export const emitDocs = [
	{
		key: 'up',
		description:
			"This event will be emitted when the up arrow is pressed on an item. The value will be the item's `id`.",
		value: 1
	},
	{
		key: 'down',
		description:
			"This event will be emitted when the down arrow is pressed on an item. The value will be the item's `id`.",
		value: 1
	}
];

export default {
	props,
	propDocs,
	emitDocs
};
