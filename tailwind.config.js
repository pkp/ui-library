/** @type {import('tailwindcss').Config} */

const colors = {
	primary: 'var(--color-primary)',
	hover: 'var(--color-hover)',
	attention: 'var(--color-attention)',
	success: 'var(--color-success)',
	negative: 'var(--color-negative)',
	'stage-desk-review': 'var(--color-stage-desk-review)',
	'stage-in-review': 'var(--color-stage-in-review)',
	'stage-in-internal-review': 'var(--color-stage-in-internal-review)',
	'stage-copyediting': 'var(--color-stage-copyediting)',
	'stage-production': 'var(--color-stage-production)',
	'stage-scheduled-for-publishing':
		'var(--color-stage-scheduled-for-publishing)',
	'stage-incomplete-submission': 'var(--color-stage-incomplete-submission)',
	'stage-published': 'var(--color-stage-published)',
	'stage-declined': 'var(--color-stage-declined)',
	'profile-1': 'var(--color-profile-1)',
	'profile-2': 'var(--color-profile-2)',
	'profile-3': 'var(--color-profile-3)',
	'profile-4': 'var(--color-profile-4)',
	'profile-5': 'var(--color-profile-5)',
	'profile-6': 'var(--color-profile-6)',
	transparent: 'var(--color-transparent)',
};

export default {
	content: [
		'./index.html',
		'./lib/ui-library/src/**/*.js',
		'./**/*.vue',
		'./**/*stories.js',
		'./**/*.tpl',
	],
	theme: {
		backgroundColor: {
			...colors,
			default: 'var(--background-color-default)',
			secondary: 'var(--background-color-secondary)',
			tertiary: 'var(--background-color-tertiary)',
			blur: 'var(--background-color-blur)',
			'selection-light': 'var(--background-color-selection-light)',
			'selection-dark': 'var(--background-color-selection-dark)',
			disabled: 'var(--background-color-disabled)',
		},
		textColor: {
			...colors,
			default: 'var(--text-color-default)',
			secondary: 'var(--text-color-secondary)',
			heading: 'var(--text-color-heading)',
			disabled: 'var(--text-color-disabled)',
			'on-dark': 'var(--text-color-on-dark)',
		},
		borderColor: {
			...colors,
			dark: 'var(--border-color-dark)',
			light: 'var(--border-color-light)',
			'form-fields': 'var(--border-color-form-fields)',
			transparent: 'var(--color-transparent)',
		},
		borderRadius: {
			DEFAULT: 'var(--radius)',
			full: 'var(--radius-full)',
		},
		boxShadow: {
			DEFAULT: 'var(--shadow)',
		},
		colors: {
			...colors,
		},
		fontFamily: {
			// this sets default font
			sans: 'var(--font-sans)',
		},
		fontSize: {
			'xs-normal': [
				'var(--text-xs-normal)' /** 10px */,
				{
					lineHeight: 'var(--text-xs-normal--line-height)',
					fontWeight: 'var(--text-xs-normal--font-weight)',
				},
			],
			'sm-light': [
				'var(--text-sm-light)' /** 11px */,
				{
					lineHeight: 'var(--text-sm-light--line-height)',
					fontWeight: 'var(--text-sm-light--font-weight)',
				},
			],
			'sm-normal': [
				'var(--text-sm-normal)' /** 11px */,
				{
					lineHeight: 'var(--text-sm-normal--line-height)',
					fontWeight: 'var(--text-sm-normal--font-weight)',
				},
			],
			'base-light': [
				'var(--text-base-light)' /** 12px */,
				{
					lineHeight: 'var(--text-base-light--line-height)',
					fontWeight: 'var(--text-base-light--font-weight)',
				},
			],
			'base-normal': [
				'var(--text-base-normal)' /** 12px */,
				{
					lineHeight: 'var(--text-base-normal--line-height)',
					fontWeight: 'var(--text-base-normal--font-weight)',
				},
			],
			'base-bold': [
				'var(--text-base-bold)' /** 12px */,
				{
					lineHeight: 'var(--text-base-bold--line-height)',
					fontWeight: 'var(--text-base-bold--font-weight)',
				},
			],
			'lg-normal': [
				'var(--text-lg-normal)' /** 14px */,
				{
					lineHeight: 'var(--text-lg-normal--line-height)',
					fontWeight: 'var(--text-lg-normal--font-weight)',
				},
			],
			'lg-medium': [
				'var(--text-lg-medium)' /** 14px */,
				{
					lineHeight: 'var(--text-lg-medium--line-height)',
					fontWeight: 'var(--text-lg-medium--font-weight)',
				},
			],
			'lg-semibold': [
				'var(--text-lg-semibold)' /** 14px */,
				{
					lineHeight: 'var(--text-lg-semibold--line-height)',
					fontWeight: 'var(--text-lg-semibold--font-weight)',
				},
			],
			'lg-bold': [
				'var(--text-lg-bold)' /** 14px */,
				{
					lineHeight: 'var(--text-lg-bold--line-height)',
					fontWeight: 'var(--text-lg-bold--font-weight)',
				},
			],
			'xl-bold': [
				'var(--text-xl-bold)' /** 16px */,
				{
					lineHeight: 'var(--text-xl-bold--line-height)',
					fontWeight: 'var(--text-xl-bold--font-weight)',
				},
			],
			'2xl-bold': [
				'var(--text-2xl-bold)' /** 18px */,
				{
					lineHeight: 'var(--text-2xl-bold--line-height)',
					fontWeight: 'var(--text-2xl-bold--font-weight)',
				},
			],
			'3xl-normal': [
				'var(--text-3xl-normal)' /** 20px */,
				{
					lineHeight: 'var(--text-3xl-normal--line-height)',
					fontWeight: 'var(--text-3xl-normal--font-weight)',
				},
			],
			'3xl-medium': [
				'var(--text-3xl-medium)' /** 20px */,
				{
					lineHeight: 'var(--text-3xl-medium--line-height)',
					fontWeight: 'var(--text-3xl-medium--font-weight)',
				},
			],
			'3xl-bold': [
				'var(--text-3xl-bold)' /** 20px */,
				{
					lineHeight: 'var(--text-3xl-bold--line-height)',
					fontWeight: 'var(--text-3xl-bold--font-weight)',
				},
			],
			'4xl-bold': [
				'var(--text-4xl-bold)' /** 24px */,
				{
					lineHeight: 'var(--text-4xl-bold--line-height)',
					fontWeight: 'var(--text-4xl-bold--font-weight)',
				},
			],
			'5xl-bold': [
				'var(--text-5xl-bold)' /** 36px */,
				{
					lineHeight: 'var(--text-5xl-bold--line-height)',
					fontWeight: 'var(--text-5xl-bold--font-weight)',
				},
			],
		},
	},
	plugins: [],
};
