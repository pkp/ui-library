## Props

| Key | Description |
| --- | --- |
| uniqueId | A unique string to be used in <code>id</code> attributes. These ids are used internally for accessible labeling of the date range fields. This string should be unique on the page where the component is rendered. |
| dateEnd | The current end date value. Expects <code>YYYY-MM-DD</code>. |
| dateEndMax | The latest allowed end date value. Expects <code>YYYY-MM-DD</code>. |
| dateStart | The current start date value. Expects <code>YYYY-MM-DD</code>. |
| dateStartMin | The earliest allowed start date value. <code>YYYY-MM-DD</code>. |
| options | An array of quick options that the user can select instead of setting a custom range. |
| dateRange | Localized label used in the component. |
| dateFormatInstructions | Localized label used in the component. |
| changeDateRange | Localized label used in the component. |
| sinceDate | Localized label used in the component. |
| untilDate | Localized label used in the component. |
| allDates | Localized label used in the component. |
| customRange | Localized label used in the component. |
| fromDate | Localized label used in the component. |
| toDate | Localized label used in the component. |
| apply | Localized label used in the component. |
| invalidDate | Localized label used in the component. |
| dateDoesNotExist | Localized label used in the component. |
| invalidDateRange | Localized label used in the component. |

## Events

| Key | Description |
| --- | --- |
| set-range | The start and end dates for the date range. |
| updated:current-range | A concatenated string describing the date range. |

## Usage
Use the `DateRange` component when you need the user to select a start and end date.

Do not use this component inside of a `<form>`. It contains its own `<form>` element and does not support accessible entry of values for screen readers when completing forms.
