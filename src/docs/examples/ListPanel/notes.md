
Use this component to display anything from simple lists to complex management panels.

[View Source](https://github.com/pkp/ui-library/blob/master/src/components/ListPanel/ListPanel.vue)

## <a name="rest-api"></a>Using the REST API

This component can fetch, search, filter and load more list items by making GET requests to an API endpoint. Make a request with the `get` method, and use the `filterParams`, `searchPhrase`, `offset` and `count` properties to modify the request.

When you update the `searchPhrase` or `filterParams` data properties on the component, it will automatically compile the params and make a GET request to the `apiPath`.

**Never modify the `getParams` property.** These params represent the component's default state. Instead, use `filterParams` or `searchPhrase` to dynamically filter the list.

### Loading Spinner

When the list is updating, you should include a loading spinner next to the title of the list. You can display this whenever the `isLoading` flag is true by using the following structure for your list title:

```
	<div class="pkpListPanel__title">
		{{ i18n.title }}
		<span v-if="isLoading" class="pkpSpinner" aria-hidden="true"></span>
	</div>
```

### Accessibility

The items list can be updated (eg - searching, filtering, loading more, or adding to the list). When using one of these features, the `.pkpListPanel__items` element must contain the `aria-live="polite"` attribute. When a list is updated, this will alert the user in an non-intrusive way.

## Searching

Add the `ListPanelSearch` component when a user wants to find one or more items by typing in a search phrase. Some examples:

- Find a submission by title or author
- Find a user by name, surname, email or username

### Accessibility

The search input field **must** include a `<label>` that usefully describes the control in the absence of visual icons. A `placeholder` attribute is not sufficient.

## Filtering

Add the `ListPanelFilter` component when a user wants to find all items in a group. Some examples:

- Find a submission by section, series or category
- Find all submissions that are incomplete or on a given stage in the workflow
- Find all users of a role

When using filters, the `ListPanel` component expects to receive a `filters` key with an object containing the filters. Consult the example data for the complete specification.

When selected filters change, `ListPanelFilter` will fire a `filterList` event and pass all `activeFilters`. A `ListPanel` is expected to respond to this event by updating the `filterParams` and firing the `get()` method to refresh the list. At the moment, filtering is only available on `ListPanel` components with a working `get()` method.

### Accessibility

When `isFilterVisible` is false, filter buttons must have `tabindex="-1"` to prevent them from receiving focus. Remove this attribute when visible to let them be focused.

Filters should always include a `.pkpListPanel__filterHeader` element which describes the filter set. When visible, the element should have `tabindex="0"` so that it can be focused. When `isFilterVisible` is changed to true, the focus will be shifted to this element.

## Ordering

This component will support item ordering by drag-and-drop and via keyboard controls. This feature requires the following:.

1. The `ListPanelItem` component has a sub-component of `Orderer` as the first part of the item's template.
2. The `ListPanel` component wraps the `ListPanelItem` sub-components in a `draggable` sub-component. (See [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable))
3. The `isOrdering` data key is set to `true`.
4. To persist the changed order to the database, override the `setItemOrderSequence` method to fire off a post request.
5. To cancel ordering and reset the order from the current database values, use the `cancelOrdering` method. It will call the `get` method to repopulate the list.
6. To toggle ordering on and off, use the `toggleOrdering` method.

When ordering can be switched on and off, the list panel should hide any unnecessary details during ordering. The user should be able to do nothing else with the `ListPanel` when ordering. Unnecessary sub-components like `ListPanelSearch` and `ListPanelFilter` are hidden whenever the `-isOrdering` class is added to the `ListPanel`. Use this class to hide any other elements which are not useful during sorting, including those within the `ListItem`.

### Accessibility

When ordering items, set `tabindex="-1"` on any unnecessary elements which could otherwise receive focus. A keyboard user should focus on *only* the up/down buttons.

Exceptions can be made in cases where contextual information may be important. For example, when ordering catalog entries, the link to the item remains visible.

Use the <kbd>TAB</kbd> key to navigate the list with your keyboard to test your work.

## Expanding and Collapsing

A `ListPanelItem` can have a summary and detailed view with a button to open the detailed view. The **With Expander** example shows how to create this effect. It requires a `ListPanelItem` with the following markup:

```html
<!-- Add the .pkpListPanelItem--hasSummary class to the outer wrapper -->
<li class="pkpListPanelItem pkpListPanelItem--hasSummary">

	<!-- Nest the summary view in a .pkpListPanelItem__summary class -->
	<div class="pkpListPanelItem__summary">
		<div class="pkpListPanelItem__item">
			{{ item.title }}
		</div>

		<!-- Add a .pkpListPanelItem__expander button as the last child of the summary -->
		<button
			@click="toggleExpanded"
			class="pkpListPanelItem__expander"
		>
			<icon v-if="isExpanded" icon="angle-up" />
			<icon v-else icon="angle-down" />
			<span v-if="isExpanded" class="-screenReader">View less</span>
			<span v-else class="-screenReader">View More</span>
		</button>
	</div>

	<!-- Add the details panel in a .pkpListPanelItem__details class -->
	<div
		v-if="isExpanded"
		class="pkpListPanelItem__details"
	>
		Here are the expanded details about this item.
	</div>
</li>
```
