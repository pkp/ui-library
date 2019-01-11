
Use this wrapper component when selecting items in a form that has not been converted to Vue components. Pass `inputName` and `inputType` values to configure the form controls.

This component extends [ListPanel](#/component/ListPanel) and supports all of the features of that component.

The example below demonstrates how a `SelectListPanel` is displayed on the new discussion form in OJS and OMP.

```html
{assign var="uuid" value=""|uniqid|escape}
<div id="queryParticipants-{$uuid}">
	<script type="text/javascript">
		pkp.registry.init('queryParticipants-{$uuid}', 'SelectListPanel', {$queryParticipantsListData|json_encode});
	</script>
</div>
```

## Extended Item Descriptions

When a `SelectListPanelItem` displays more than a simple label, make sure that the whole item can be clicked or tapped to select it. There should be no "gaps" where a click or tap will not perform an action.

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
