## Props

| Key | Description |
| --- | --- |
`itemId` | A unique id for the item to be ordered. This will be emitted in the `up` and `down` events. It may be a string or number, and does not correspond to the item's order in the list. |
`itemTitle` | The name of the item. This is used in an accessible label for the up and down buttons. |
`isDraggable` | Whether or not to provide drag-and-drop controls for this item. When `isDraggable` is true, the items to be ordered must be wrapped in a `<draggable>` component. |

## Events

| Key | Description |
| --- | --- |
| `up` | This event will be emitted when the up arrow is pressed on an item. The value will be the item's `id`. |
| `down` | This event will be emitted when the down arrow is pressed on an item. The value will be the item's `id`. |

## Usage

A helper component that adds accessible controls to change the order of items.

The `Orderer` component can be used inside list items. In the parent component, you will need to listen for `up` and `down` events from the component and modify your list accordingly.

## Drag and Drop

Orderable items will _usually_ be used within a `draggable` component for drag-and-drop support. When doing so, items in the list should have a left padding of `4em` to accommodate the grab handle.

If you do not want your items to be draggable, set the `Orderer`'s `isDraggable` prop to `false` to hide the grab handle.

## Loops and Keys

Orderable items will _usually_ be printed with a `v-for` loop, like this:

```html
<li v-for="item in items" :key="item.id">
	...
</li>
```

When doing so, you _must_ use the `:key` attribute to provide a unique key or the keyboard focus can not travel with the item as it moves.
