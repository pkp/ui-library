
Use this component to display anything from simple lists to complex management panels.

[View Source](https://github.com/NateWr/pkp-lib/blob/i2163_js_with_api/js/controllers/list/ListPanel.vue)

## Implementations
- [SubmissionsListPanel](https://github.com/NateWr/pkp-lib/blob/i2163_js_with_api/js/controllers/list/submissions/SubmissionsListPanel.vue)
- [SelectSubmissionsListPanel](https://github.com/NateWr/pkp-lib/blob/i2163_js_with_api/js/controllers/list/submissions/SelectSubmissionsListPanel.vue)
- [CatalogSubmissionsListPanel](https://github.com/NateWr/omp/blob/i2163_js_with_api/js/controllers/list/submissions/CatalogSubmissionsListPanel.vue) (OMP)

## <a name="rest-api"></a>Using the REST API

This component can fetch, search, filter and load more list items by making GET requests to an API endpoint. Make a request with the `get` method, and use the `filterParams`, `searchPhrase`, `offset` and `count` properties to modify the request.

When you update the `searchPhrase` or `filterParams` data properties on the component, it will automatically compile the params and make a GET request to the `apiPath`.

**Never modify the `getParams` property.** These params represent the component's default state. Instead, use `filterParams` or `searchPhrase` to dynamically filter the list.

### Accessibility

The items list must contain the `aria-live="polite"` attribute. When a list is updated, this will alert the user in an non-intrusive way.

## Searching

Add the `ListPanelSearch` component when a user wants to find one or more items by typing in a search phrase. Some examples:

- Find a submission by title or author
- Find a user by name, surname, email or username

[View Source](https://github.com/NateWr/pkp-lib/blob/i2163_js_with_api/js/controllers/list/ListPanelSearch.vue)

### Accessibility

The search input field **must** include a `<label>` that usefully describes the control in the absence of visual icons. A `placeholder` attribute is not sufficient.

## Filtering

**This sub-component is in early draft stages. Expect the base pattern to be refined as more use-cases are implemented.**

Add the `ListPanelFilter` component when a user wants to find all items in a group. Some examples:

- Find a submission by section, series or category
- Find all declined submissions
- Find all submissions that are incomplete or on a given stage in the workflow
- Find all users of a role

[View Source](https://github.com/NateWr/pkp-lib/blob/i2163_js_with_api/js/controllers/list/ListPanelFilter.vue)

### Implementations

- [CatalogSubmissionsListPanel](https://github.com/NateWr/omp/blob/i2163_js_with_api/js/controllers/list/submissions/CatalogSubmissionsListPanel.vue) (OMP)

### Accessibility

When `isFilterVisible` is false, filter buttons must have `tabindex="-1"` to prevent them from receiving focus. Remove this attribute when visible to let them be focused.

Filters should always include a `.pkpListPanel__filterHeader` element which describes the filter set. When visible, the element should have `tabindex="0"` so that it can be focused. When `isFilterVisible` is changed to true, the focus will be shifted to this element.

## Ordering

This component will support item ordering by drag-and-drop and via keyboard controls. This feature requires the following:.

1. The `ListPanelItem` component has a sub-component of `ListPanelItemOrderer` as the first part of the item's template.
2. The `ListPanel` component wraps the `ListPanelItem` sub-components in a `draggable` sub-component. (See [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable))
3. Action buttons exist to toggle ordering on/off using the `toggleOrdering` method, and cancel the ordering changes using the `cancelOrdering` method.
4. A `.pkpListPanel__notice` element with `tabindex="0"` containing instructions on how to use the ordering controls.

When ordering the list, the user should be able to do nothing else with the `ListPanel`. Unnecessary sub-components like `ListPanelSearch` and `ListPanelFilter` are hidden whenever the `-isOrdering` class is added to the `ListPanel`. Use this class to hide any other elements which are not useful during sorting, including those within the `ListItem`.

### Accessibility

When ordering items, set `tabindex="-1"` on any unnecessary elements which could otherwise receive focus. A keyboard user should focus on *only* the up/down buttons.

Exceptions can be made in cases where contextual information may be important. For example, the link to the catalog entry's three elements as they navigate through the list: the title of the item and the up/down buttons.

Use the <kbd>TAB</kbd> key to navigate the list with your keyboard to test.
