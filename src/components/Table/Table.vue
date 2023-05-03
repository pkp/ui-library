<template>
	<table class="pkpTable">
		<caption v-if="$slots.caption">
			<slot name="caption" />
		</caption>
		<thead v-if="$slots.head">
			<tr>
				<slot name="head" />
			</tr>
		</thead>
		<tbody>
			<slot />
		</tbody>
	</table>
</template>

<style lang="less">
@import '../../styles/_import';

.pkpTable {
	width: 100%;
	max-width: 100%;
	border: @grid-border;
	border-collapse: collapse;
	border-radius: @radius;
	font-size: @font-sml;
	line-height: 1.2em;

	td,
	th {
		padding: 0.75rem;
		font-weight: @normal;
		text-align: inherit;

		&:focus {
			outline: 0;
			box-shadow: inset 0 0 0 1px @primary;
		}
	}

	tr {
		border-bottom: @grid-border;

		&:nth-child(even) {
			background: @bg-very-light;
		}
	}

	caption {
		padding: 0.5rem 0;
		border-top-left-radius: @radius;
		border-top-right-radius: @radius;
		text-align: inherit;

		/**
		* Override padding for Header components inside
		* the caption
		*/
		.pkpHeader {
			padding: 0;
		}
	}

	thead {
		th {
			font-size: @font-tiny;
			font-weight: @semibold;
			text-transform: uppercase;
		}
	}
}

[dir='rtl'] {
	.pkpTable {
		thead {
			.pkpTable__sortIcon {
				right: auto;
				left: 4px;
			}
		}
	}
}

.pkpTable + .pkpPagination {
	margin-top: 1rem;
}
</style>
