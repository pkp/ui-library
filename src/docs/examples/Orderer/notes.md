
A helper component that adds accessible controls to change the order of items.

[View Source](https://github.com/pkp/ui-library/tree/master/src/components/Orderer/Orderer.vue)

## <a name="usage"></a>Usage Guide

The `Orderer` component can be used inside list items. In the parent component, you will need to listen for `up` and `down` events from the component and modify your list accordingly.

## <a name="draggable"></a> Drag and Drop

Orderable items will _usually_ be used within a `draggable` component for drag-and-drop support. When doing so, items in the list should have a left padding of `4em` to accommodate the grab handle.

If you do not want your items to be draggable, set the `Orderer`'s `isDraggable` prop to `false` to hide the grab handle.

## <a name="keys"></a> Loops and Keys

Orderable items will _usually_ be printed with a `v-for` loop, like this:

```
<li v-for="item in items" :key="item.id">
	...
</li>
```

When doing so, you _must_ use the `:key` attribute to provide a unique key or the keyboard focus can not travel with the item as it moves.
