<template>
	<div class="docTable">
		<table v-if="rows.length">
			<tr v-if="headers.length">
				<th v-for="header in headers" :key="header">{{ header }}</th>
			</tr>
			<tr v-for="row in rows" :key="row.key">
				<td class="docTable__key">{{ row.key }}</td>
				<td v-if="headers.includes('Type')">{{ getType(row.value) }}</td>
				<td class="docTable__value" v-if="headers.includes('Value')">
					<pre><code v-html="formatValue(row.value)" /></pre>
				</td>
				<td class="docTable__description" v-html="convertMarkdown(row.description)"></td>
			</tr>
		</table>
		<p v-else>
			<template v-if="title === 'Events'">
				This component does not emit events.
			</template>
			<template v-else-if="title === 'Props'">
				This component does not accept props.
			</template>
			<template v-else>
				This component does not have {{ title }}.
			</template>
		</p>
	</div>
</template>

<script>
import marked from 'marked';
import {AllHtmlEntities} from 'html-entities';

export default {
	props: ['headers', 'rows'],
	methods: {
		/**
		 * Get the type of a value
		 *
		 * JS considers many things an object.
		 */
		getType(value) {
			let type = typeof value;
			if (type !== 'object') {
				return type;
			}
			if (value === null) {
				return 'null';
			} else if (Array.isArray(value)) {
				return 'array';
			}
			return type;
		},

		/**
		 * Format the value in a way that indicates type
		 */
		formatValue(value) {
			if (value === null) {
				return 'null';
			} else if (typeof value === 'string') {
				return '"' + AllHtmlEntities.encode(value) + '"';
			} else {
				return value;
			}
		},

		/**
		 * Convert markdown in item descriptions
		 */
		convertMarkdown(markdown) {
			return marked(markdown);
		}
	}
};
</script>

<style lang="less">
@import '../styles/_import';

.docTable {
	font-size: @font-sml;
	line-height: 1.5em;

	table {
		border: @bg-border-light;
		border-bottom: none;
		border-collapse: collapse;
		width: 100%;
	}

	tr {
		border-bottom: @bg-border-light;
	}

	th:not(:last-child),
	td:not(:last-child) {
		border-right: @bg-border-light;
	}

	th,
	td {
		padding: 0.5rem 1rem;
		text-align: left;
		vertical-align: top;
	}

	th {
		font-weight: @bold;
	}

	.docTable__value {
		padding: 0;

		pre {
			margin: 0;
			padding: 0.5rem 1rem;
			max-width: 300px;
			max-height: 300px;
			overflow-x: auto;
		}
	}
}

.docTable__key,
.docTable__value {
	font-family: monospace;
	font-size: @font-tiny;
}

.docTable__description {
	code {
		border: 1px solid #d3e9d8;
		background: #f9f9f9;
		border-radius: @radius;
		padding: 0.125em 0.25em;
		color: #3fab5c;
		font-size: @font-tiny;
	}
}

.docTable__description p:first-child {
	margin-top: 0;
}

.docTable__description p:last-child {
	margin-bottom: 0;
}
</style>
