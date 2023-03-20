# Usage

The `fetch` mixin provides helpers to get data from most REST API endpoints in the application. With a few props it can make requests to the API with support for filters, searching, and pagination. Any component that uses this mixin must define a `setItems()` method.


```js
import fetch from '@/mixins/fetch';

export default {
	mixins: [fetch]
	methods: {
		/**
		 * Save the `items` and `itemsMax` properties
		 * returned by the request to the REST API to
		 * the component's local data.
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

Call the `get()` method to fetch the items.

```html
<template>
	<button @click="getItems">Load</button>
</template>

<script>
export default {
	methods: {
		getItems() {
			this.get();
		}
	}
}
</script>
```

The `get()` method will be called automatically when the `activeFilters` and `searchPhrase` are changed.

```html
<template>
	<button @click="getItems">
		Filter by items in section 1 with the
		phrase "lorem"
	</button>
</template>

<script>
export default {
	methods: {
		getItems() {
			this.activeFilters = {
				sectionIds: [1]
			};
			this.searchPhrase = 'lorem';
		}
	}
}
</script>
```

## Props

All components implementing this mixin have the following props.

| Key | Description |
| --- | --- |
| `apiUrl` | **Required** The URL to the API endpoint to use when retrieving items. |
| `count` | The number of items to return with each request. Default: `30` |
| `getParams` | Any query params that should be added to every request. For example, if you are showing a list of declined submissions, use `{statusIds: [pkp.const.STATUS_DECLINED]}`. |
| `lazyLoad` | Pass `true` to load the items as soon as the component is mounted. Default: `false` |

## Data

All components implementing this mixin have the following data.

| Key | Description |
| --- | --- |
| `activeFilters` | An object describing any filters that are currently active. These are the query params that should be added to the `GET` request. Whenever `activeFilters` is modified, the list will be reloaded. |
| `isLoading` | Are new items currently being loaded? |
| `itemsMax` | The number of possible items in the list for calculating pagination. |
| `offset` | Used with `count` to support pagination. |
| `searchPhrase` | A search phrase to add to the query params when requesting items. Whenever the search phrase changes, the list will be reloaded. |

## Computed Properties

All components implementing this mixin have the following computed properties.

| Key | Description |
| --- | --- |
| `currentPage` | The current page being shown, based on `offset` and `count`. |
| `lastPage` | The last page available, based on `count` and `itemsMax`. |

## Methods

All components implementing this mixin can use the following methods.

| Name | Description |
| --- | --- |
| `get()` | Call this method whenever the list should be reloaded. It is called automatically when `activeFilters` or `searchPhrase` are changed. |
| `setPage(page)` | Change the current page being shown in the list. |
| `setSearchPhrase(searchPhrase)` | Change the value of the search phrase. |

## Search

Use a [`Search`](#/component/Search) component when implementing search with this mixin.

```html
<template>
	<div>
		<search
			:searchPhrase="searchPhrase"
			@search-phrase-changed="setSearchPhrase"
		/>
	</div>
</template>
```

See an example of a [List Panel with Search](#/component/ListPanel/with-search)

## Filters

Filters are used to change which items appear in a list. They interact with the REST API query params and the `activeFilters` prop should always reflect the query params you wish to use. In the example below, a component will toggle the view from all submissions to overdue submissions by adding and removing an active filter.

```js
export default {
	methods: {
		addOverdueFilter() {
			this.activeFilters = {
				...this.activeFilters,
				isOverdue: true
			};
		}
		removeOverdueFilter() {
			let activeFilters = {...this.activeFilters);
			delete activeFilters.isOverdue;
			this.activeFilters = activeFilters;
		}
	}
}
```

See an example of a [List Panel with Filters](#/component/ListPanel/with-filter).

## Pagination

Use the [`Pagination`](#/component/Pagination) component to break long lists of results into pages.

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

See an example of a [List Panel with Pagination](#/component/ListPanel/with-pagination).

## Lazy-load

You may wish to wait to load the items until a component has been mounted. In this case, set the `lazyLoad` prop to `true` and the items will be lazy-loaded. In most cases you should pre-populate your list from the server. Only use the `lazyLoad` prop when you want to reduce the time it takes for the initial page load, and the list items are not the first priority on the page.
