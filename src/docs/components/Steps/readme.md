## Props

| Key              | Description                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `current`        | The `id` of the current step.                                                                                                        |
| `label`          | A localized string describing the steps for assistive technology.                                                                    |
| `progressLabel`  | A localized string with `{$current}` and `{$total}` that describes the current and total steps. Example: `{$current}/{$total} steps` |
| `scrollTo`       | The DOM element to scroll into view when changing steps. This is expected to be a ref from the parent component.                     |
| `showStepsLabel` | A localized string for the button to show all steps when the steps are viewed on a small device.                                     |
| `startedSteps`   | An array of step `id`s that have already been started.                                                                               |

## Events

| Key         | Description                                          |
| ----------- | ---------------------------------------------------- |
| `step:open` | Emitted when a new step is opened with payload of the step `id`. |

## Usage

Use the `<Steps>` and `<Step>` components to display a step-by-step wizard. When using this component, track the current and started steps in the parent component and pass these down as props. This ensures that any interactions between steps can be handled correctly. For example, if a form in step 3 needs to change based on a selection in step 2, the parent component can coordinate this dependency.

Use this component alongside a [ButtonRow](#/component/ButtonRow) to implement next/previous buttons.
