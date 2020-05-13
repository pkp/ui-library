## Props

| Key | Description |
| --- | --- |
| `icon` | Which <a href="https://fontawesome.com/">FontAwesome</a> icon to use. Drop the `fa-` prefix from the class name. If you want to use `fa-bug`, the value of this prop should be `bug`. |
| `inline` | Use when an icon sits alongside text to ensure adequate spacing between the icon and text. |

## Events

This component does not emit any events

## Usage

Use this component to display a [FontAwesome v4.7](https://fontawesome.com/v4.7.0) icon. See [all icons](https://fontawesome.com/v4.7.0/icons/).

Use icons when you want to visually connect two parts of the UI that are not otherwise connected. For example, the [ListPanel](#/component/ListPanel) filters use an icon to link the button with the panel it controls.

### Be careful when using icon-only labels

You may want to use icon-only labels when fitting a lot of information into a small space. Such icon-based display can be useful for presenting dense information, but these patterns tend to favor experienced users over novice ones. Use with caution.

### Avoid decorative icons

When adding buttons or other controls, do not add an icon when the text label sufficiently describes the action.

## Help Icon

The `info-circle` icon (<span class="fa fa-info-circle" aria-hidden="true"></span>) is reserved for providing help on how to use the software.

## Warning Icon

The `exclamation-triangle` icon (<span class="fa fa-exclamation-triangle" aria-hidden="true"></span>) is reserved for warning the user about an error, urgent information, or a serious consequence of an expected action.
