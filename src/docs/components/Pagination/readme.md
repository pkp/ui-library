## Props

| Key | Description |
| --- | --- |
| `currentPage` | The page that is currently being displayed. |
| `isLoading` | Is the current page still loading? |
| `lastPage` | The last page that is available. |
| `showAdjacentPages` | 'How many pages to show beside the current one. Default is <code>1</code>. |

## Events

| Key | Description |
| --- | --- |
| `set-page` | The page that should be selected. |

## Usage

Use the `Pagination` component when users can not view all items at once.

## Hide When Unused

Pagination should be hidden when only one page of results exists. This can be done in a parent component with the following code.

```html
<pagination
	v-if="lastPage > 1" <!-- hide pagination for single page results -->
	:current-page="currentPage"
	:last-page="lastPage"
	@set-page="set-page"
/>
```

## Adjacent Pages

Leave `showAdjacentPages` set to the default unless you have a good reason to change it. It may be changed when the user is likely to want to "skip" the next or previous page, but not jump to the end.
