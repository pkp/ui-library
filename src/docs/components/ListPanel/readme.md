
Use this component to display anything from simple lists to complex management panels.

## </a>Using the REST API

When an `apiUrl` is provided, this component will fetch, search, filter and load list items by making GET requests to the `apiURL`. The `activeFilters`, `searchPhrase`, `offset` and `count` properties will be used when making the request.

When you update the `searchPhrase` or `count` properties, it will automatically make a new GET request to the `apiUrl` and update the `items` in the list.

**Never modify the `getParams` property.** These params represent the component's default state. Instead, use `activeFilters` or `searchPhrase` to filter the list.

## Loading Spinner

Include a [`Spinner`](/#/component/Spinner) next to the title of the list whenever it is updating.

```html
<pkp-header>
	{{ title }}
	<spinner v-if="isLoading" />
</pkp-header>
```

## Accessibility

When items in the list can be updated by filtering, searching or loading more, `.pkpListPanel__content` must have the `aria-live="polite"` attribute. This will alert someone using assistive technology when the list is changed.

## Filtering

The `ListPanel` manages active filters in the `activeFilters` property. Listen to events emitted from a [`Filter`](/#/component/Filter) component and pass them to the `addFilter` and `removeFilter` methods.

```html
<pkp-filter
	@add-filter="addFilter"
	@remove-filter="removeFilter"
	...
/>
```

If the filter only supports a single value for its `param`, use the `setFilter` and `removeParamFilters` methods:

```html
<pkp-filter
	@add-filter="setFilter"
	@remove-filter="removeParamFilters"
	...
/>
```

Use the `isFilterActive` method to pass the prop to `Filter`.

```html
<pkp-filter
	:isFilterActive="isFilterActive"
	...
/>
```

Learn more about the [`Filter`](/#/component/Filter) component.

### Filter Accessibility

When the sidebar includes a `<pkp-header>` component that describes the filters, it should be given a `tabindex` attribute that allows it to be focused when it is visible.

```html
<pkp-header :tabindex="isSidebarVisible ? 0 :-1" class="pkpListPanel__sidebarHeader">
	Filters
</pkp-header>
```

When the sidebar is opened, the focus will be moved to this element.

## Ordering

This component will support item ordering by drag-and-drop and via keyboard controls. This feature requires the following:.

1. The `ListPanelItem` component has a sub-component of `Orderer` as the first part of the item's template.
2. The `ListPanel` component wraps the `ListPanelItem` sub-components in a `draggable` sub-component. (See [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable))
3. The `isOrdering` data key is set to `true`.
4. To persist the changed order to the database, override the `setItemOrderSequence` method to fire off a post request.
5. To cancel ordering and reset the order from the current database values, use the `cancelOrdering` method. It will call the `get` method to repopulate the list.
6. To toggle ordering on and off, use the `toggleOrdering` method.

When ordering can be switched on and off, the list panel should hide any unnecessary details during ordering. The user should be able to do nothing else with the `ListPanel` when ordering. Common components like `Search` and `Filter` are hidden whenever the `-isOrdering` class is added to the `ListPanel`. Use this class to hide any other elements which are not useful during sorting, including those within the `ListItem`.

### Ordering Accessibility

When ordering items, set `tabindex="-1"` on any unnecessary elements which could otherwise receive focus. A keyboard user should focus on *only* the up/down buttons.

Exceptions can be made in cases where contextual information may be important. For example, when ordering catalog entries, the link to the item remains visible.

Use the <kbd>TAB</kbd> key to navigate the list with your keyboard to test your work.
