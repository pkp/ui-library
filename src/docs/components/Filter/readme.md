
Use this component when the user wants to narrow the items in a list by some criteria.

## Using Filter Params and Values

The filter `param` usually corresponds to a query parameter that will be sent to the REST API. For example, filtering submissions by those in the Review stage will use the `stageIds` parameter for the REST API endpoint.

More than one `Filter` may share the same `param`, but not the same `value`. For example, filtering by the Review and Copyediting stages will use two filters.

```html
<pkp-filter
  label="Review"
  param="stageIds"
  value="2
  ...
/>
<pkp-filter
  label="Copyediting"
  param="stageIds"
  value="3
  ...
/>
```

## Managing Active Filters

A parent component must manage which filters are active. By convention, this should be in an `activeFilters` object. See the [ListPanel](/#/component/ListPanel) for an example.

Most filters should be able to be combined with other filters, so there may be more than one filter active at a time. The following shows what the `activeFilters` object might look like when stage and section filters are applied at the same time:

```json
{
  stageIds: [2, 3],
  sectionIds: [1]
}
```