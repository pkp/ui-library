# Fetch

The `fetch` mixin can be used to interact with a REST API endpoint. It provides a component with props, data and methods to implement lazy-load, filters, search and pagination for a collection of items.

```js
import fetch from '@/mixins/fetch';

export default {
	mixins: [fetch]
}
```

Load items with the `get()` method.

```js
export default {
	...
	methods: {
		refreshList() {
			this.get();
		}
	}
}
```

All components that implement the `fetch` mixin must add a `setItems()` method which receives the items from the API and stores them in local data.

```js
export default {
	...
	methods: {
		/**
		 * Update the list of items
		 *
		 * @param {Array} items
		 * @param {Number} itemsMax
		 */
		setItems(items, itemsMax) {
			this.items = items;
			this.itemsMax = itemsMax;
		}
	}
}
```

## Props

| Key | Description |
| --- | --- |
| `apiUrl` | The URL to the API endpoint to use when retrieving items. |
| `count` | The number of items to return with each request. Default: `30` |
| `getParams` | Any query params that should be added to every request. For example, if you are showing a list of declined submissions, use `{statusIds: [pkp.const.STATUS_DECLINED]}` |
| `lazyLoad` | Pass `true` to fire off a request for items after the component is mounted. Default: `false` |

## Data

| Key | Description |
| --- | --- |
| `activeFilters` | An object describing any filters that are currently active. These are `getParams` that may be added or removed. |
| `isLoading` | Are new items currently being loaded? |
| `offset` | Used with `count` to support pagination. |
| `searchPhrase` | A search phrase to add to the query params when requesting items. |

## Computed Properties

| Key | Description |
| --- | --- |
| `currentPage` | The current page being shown, based on `offset` and `count`. |
| `lastPage` | The last page available, based on `count` and `itemsMax`. |

## Search

Endpoints in PKP's REST API which return a list of items, such as `/submissions`, typically support a `searchPhrase` query param to return items that match the search phrase.

Add a [`Search`](#/component/Search) component to take advantage of this.

```html
<template>
	<div>
		...
		<search
			:searchPhrase="searchPhrase"
			@search-phrase-changed="setSearchPhrase"
		/>
	</div>
</template>
```

When the `searchPhrase` is changed, the items will automatically be retrieved from the API. The `searchPhrase` will be converted to a query param and the API request will look like `http://.../api-url-endpoint?searchPhrase=<search-phrase-value>`.

See an example of a [List Panel with Search](#/component/ListPanel/with-search)

## Filters

Filters are used to change which items appear in a list. They interact with the REST API query params and the `activeFilters` prop should always reflect the query params you wish to use.

In the example below, a component will toggle the view from all submissions to overdue submissions by adding and removing an active filter.

```js
export default {
	methods: {
		addOverdueFilter() {
			let activeFilters = {...this.activeFilters};
			activeFilters.isOverdue = true;
			this.activeFilters = activeFilters;
		}
		removeOverdueFilter() {
			let activeFilters = {...this.activeFilters};
			delete activeFilters.isOverdue;
			this.activeFilters = activeFilters;
		}
	}
}
```

When the `activeFilters` are changed, the items will automatically be retrieved from the API. The `isOverdue` filter will be converted to a query param and the API request will look like `http://.../api-url-endpoint?isOverdue=1`.

See an example of a [List Panel with Filters](#/component/ListPanel/with-filter).

## Pagination

This mixin provides computed properties and methods to help manage pagination. Add the [`Pagination`](#/component/Pagination) component to take advantage of them.

```html
<template>
	<div>
		...
		<pagination
			v-if="lastPage > 1"
			:currentPage="currentPage"
			:isLoading="isLoading"
			:lastPage="lastPage"
			@set-page="setPage"
		/>
	</div>
</template>
```

When the page is changed, new items will automatically be retrieved from the API. The page request will be converted `count` and `offset` query params and an API request will look like `http://.../api-url-endpoint?count=30&offset=30`.

See an example of a [List Panel with Pagination](#/component/ListPanel/with-pagination).

## Lazy-load

You may wish to wait to load the items until a component has been mounted. In this case, set the `lazyLoad` prop to `true` and the items will be lazy-loaded.

In most cases you should pre-populate your list from the server. Only use the `lazyLoad` prop when you want to reduce the time it takes for the initial page load, and the list items are not the first priority on the page.