
Use the `Pagination` component when users can not view all items at once.

## Hide When Unused

Pagination should be hidden when only one page of results exists. This can be done in a parent component with the following code.

```html
<pagination
	v-if="lastPage > 1" <!-- hide pagination for single page results -->
	:current-page="currentPage"
	:last-page="lastPage"
	:i18n="i18n"
	@set-page="set-page"
/>
```

## Accessibility

All keys in the `i18n` prop should be present. Several of these are used to ensure that the component has accessible labelling for screen readers.

Sometimes the `paginationLabel` should indicate the type of items for which paged results are available. Examples:

- "View additional pages of article stats"
- "View additional pages of notifications"
- "View additional pages of submissions"

This should be done in the following circumstances:

- When the `Pagination` component does not come directly after the items it is paginating in the DOM.
- When the `Pagination` component is not contained under the same heading as the items it is paginating.
- When there are many `Pagination` components on the same page.

## Adjacent Pages

Leave `showAdjacentPages` set to the default unless you have a good reason to change it. It may be changed when the user is likely to want to "skip" the next or previous page, but not jump to the end.
