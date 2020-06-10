## Data

| Key | Description |
| --- | --- |
| `apiUrl` | URL to the REST API endpoint to retrieve stats. |
| `dateStart` | Current start date in the format `YYYY-MM-DD`. |
| `dateEnd` | Current start date in the format `YYYY-MM-DD`. |
| `dateEndMax` | Current start date in the format `YYYY-MM-DD`. |
| `dateRangeOptions` | Array of objects representing preset date range options, such as the last 90 days. |
| `filters` | Array of filters. |
| `itemsOfTotalLabel` | A label to display the count of the current page. |
| `tableColumns` | An array of objects representing columns in the table. See [Table](#/component/Table). |
| `timeline` | Array of usage stats by month/day (see `timelineInterval`) used in the chart. **Only in [StatsPublicationsPage](#/component/StatsPage/publication-stats).** |
| `timelineType` | The type of stats displayed in the chart. Either `abstract` or `galley`. **Only in [StatsPublicationsPage](#/component/StatsPage/publication-stats).** |
| `timelineInterval` | Whether the `timeline` stats are broken down by `day` or `month`. **Only in [StatsPublicationsPage](#/component/StatsPage/publication-stats).** |
| `items` | Publications to display in the table. **Only in [StatsPublicationsPage](#/component/StatsPage/publication-stats).** |
| `itemsMax` | Total number of publications with usage stats. **Only in [StatsPublicationsPage](#/component/StatsPage/publication-stats).** |
| `tableRows` | An array of objects representing rows in the table. See [Table](#/component/Table). **Only in [StatsEditorialPage](#/component/StatsPage/editorial-stats).** |
| `activeByStage` | Array of submisson stages with current count of submissions in each stage and the color to display in the doughnut chart. **Only in [StatsEditorialPage](#/component/StatsPage/editorial-stats).** |
| `percentageStats` | Array of keys in `tableRows` which should be displayed as percentages. **Only in [StatsEditorialPage](#/component/StatsPage/editorial-stats).** |

## Usage

The `StatsPage` extends the [`Container`](/#/pages/container) app. Use this app to show a page of statistics with a chart and a table.

## Template

The `StatsPage` app is a template-less component. You must write the template in Smarty on the server-side and it will be compiled at run time.

The examples here provide sample templates for two use-cases.
