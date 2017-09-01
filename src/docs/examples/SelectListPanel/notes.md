Use this component when selecting items in a form using a checkbox or radio control. Pass `inputName` and `inputType` values to configure the form controls.

This component extends [ListPanel](/#/components/ListPanel). Consult the documentation for that component to see the full range of features and sub-components supported.

[View Source](#) (todo)

## Implementations
- SelectSubmissionsListPanel

## Extended Item Descriptions

When a `SelectListPanelItem` includes more than a simple label, make sure that the whole item can be clicked or tapped to select it. There should be no "gaps" where a click or tap will not perform an action.

### Accessibility

Every `input` field must have a single matching `label` which clearly describes that selection. Someone using a screen reader will hear the matching `label` read out as they navigate through the `input` fields. Multiple `label` fields will not be read out.

If the item description is clear when read together, you can include all the content in the `label`:

```html
<label :for="inputId">
	<div>{{ item.author.authorString }}</div>
	<div >{{ item.title }}</div>
</label>
```

If the text in the `label` does not read well together, consider using a separate `label` for screen readers:

```html
<div>{{ item.id }}</div>
<div>{{ item.publishedDate }}</div>
<div>{{ item.author.authorString }}</div>
<div>{{ item.title }}</div>
<label :for="inputId" class="-screenReader">
	Select: {{ item.title }}
</label>
```
