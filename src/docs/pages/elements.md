# Elements

Elements are composed of HTML and represent the building blocks of components, such as typography, icons and buttons.

## Icons

<div class="pkpul-element">
	<div class="pkpul-element__preview">
		<span class="fa fa-search" aria-hidden="true"></span>
		<span class="fa fa-chevron-up" aria-hidden="true"></span>
		<span class="fa fa-chevron-down" aria-hidden="true"></span>
	</div>
```
<span class="fa fa-search" aria-hidden="true"></span>
<span class="fa fa-chevron-up" aria-hidden="true"></span>
<span class="fa fa-chevron-down" aria-hidden="true"></span>
```
</div>

We use [FontAwesome](http://fontawesome.io/) icons. See [all icons](http://fontawesome.io/icons/).

### Inline icons

<div class="pkpul-element">
	<div class="pkpul-element__preview">
		<span class="fa fa-search pkpIcon--inline" aria-hidden="true"></span> Search
	</div>
```
<span class="fa fa-search pkpIcon--inline" aria-hidden="true"></span> Search
```
</div>

Use `.pkpIcon--inline` when an icon sits alongside text to ensure adequate spacing between the icon and text.

### Help Icon

<div class="pkpul-element">
	<div class="pkpul-element__preview">
		<span class="fa fa-info-circle" aria-hidden="true"></span>
	</div>
```
<span class="fa fa-info-circle" aria-hidden="true"></span>
```
</div>

The `.fa-info-circle` icon is reserved for providing help on how to use the software.

### Warning Icon

<div class="pkpul-element">
	<div class="pkpul-element__preview">
		<span class="fa fa-exclamation-triangle" aria-hidden="true"></span>
	</div>
```
<span class="fa fa-exclamation-triangle" aria-hidden="true"></span>
```
</div>

The `.fa-exclamation-triangle` icon is reserved for warning the user about an error or a serious consequence of an expected action.

### How to use icons

Use icons when you want to visually connect two parts of the UI that are not otherwise connected. For example, the [ListPanel](/#/components/ListPanel) filters use an icon to link the button with the panel it controls.

### Be careful when using icon-only labels

You may want to use icon-only labels when fitting a lot of information into a small space. Such icon-based display can be useful for presenting dense information, but these patterns tend to favor experienced users over novice ones. Use with caution.

### Avoid decorative icons

When adding buttons or other controls, do not add an icon when the text label sufficiently describes the action.

## Spinner

<div class="pkpul-element">
	<div class="pkpul-element__preview">
		<span class="pkpSpinner" aria-hidden="true"></span>
	</div>
```
	<span class="pkpSpinner" aria-hidden="true"></span>
```
</div>

Use the spinner to indicate when a request is pending, a component is loading or the user must wait for some activity to complete.
