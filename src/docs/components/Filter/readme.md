## Props

| Key | Description |
| --- | --- |
| `isFilterActive` | Whether or not this is filter is currently on or off. |
| `param` | The query parameter to use when submitting API requests for this filter. For example, a filter for getting all submissions in a particular stage would be `stageIds`. |
| `title` | The label for this filter. |
| `value` | The value to use when submitting API requests for this filter. For example, a filter for getting all submissions currently in the Submission stage would have a `param` of `stageIds` and a `value` of `1`. |

## Props (FilterSlider and FilterSliderMultirange)

| Key | Description |
| --- | --- |
| `max` | The highest allowed value. Required. |
| `min` | The lowest allowed value. Required. |
| `useStars` | Whether or not to display the value as a star rating. Default: `false`. |
| `valueLabel` | How to display the value. A label of `At least {$value}` will display as `At least 20`. Default: `{$value}`. |

## Props (FilterSliderMultirange)

| Key | Description |
| --- | --- |
| `lessThanLabel` | An accessible label for the higher value. Typically "Less than". Required. |
| `moreThanLabel` | An accessible label for the lower value. Typically "Higher than". Required. |

## Props (FilterAutosuggest)

| Key | Description |
| --- | --- |
| `autosuggestProps` | Props to be passed to the `FieldAutosuggest` component. Required. |

## Events

| Key | Description |
| --- | --- |
| `add-filter` | Emitted when the filter is activated. Payload: `(param, value)` |
| `remove-filter` | Emitted when the filter is deactivated. Payload: `(param, value)` |

## Usage

Use this component when the user wants to narrow the items in a list by some criteria.

## Using Filter Params and Values

The filter `param` usually corresponds to a query parameter that will be sent to the REST API. For example, filtering submissions by those in the Review stage will use the `stageIds` parameter for the REST API endpoint.

More than one `Filter` may share the same `param`, but not the same `value`. For example, filtering by the Review and Copyediting stages will use two filters.

```html
<pkp-filter
	label="Review"
	param="stageIds"
	value="2"
	...
/>
<pkp-filter
	label="Copyediting"
	param="stageIds"
	value="3"
	...
/>
```

## Managing Active Filters

A parent component must manage which filters are active. By convention, this should be in an `activeFilters` object. See the [ListPanel](#/component/ListPanel) for an example.

Most filters should be able to be combined with other filters, so there may be more than one filter active at a time. The following shows what the `activeFilters` object might look like when stage and section filters are applied at the same time:

```json
{
	stageIds: [2, 3],
	sectionIds: [1]
}
```
