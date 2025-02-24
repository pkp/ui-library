<template>
	<SideModalBody>
		<template #pre-title>
			{{ workflowStore.submissionId }}
			<span class="ms-3">
				<Spinner
					size-variant="big"
					:message="t('common.refreshingData')"
					:class="
						progressStore.screensInProgress.includes('modal_1')
							? ''
							: 'invisible'
					"
				/>
			</span>
		</template>
		<template #title>
			<span v-if="selectedPublication" class="underline">
				{{ selectedPublication.authorsStringShort }}
			</span>
		</template>
		<template v-if="selectedPublication" #description>
			{{
				localizeSubmission(
					selectedPublication.fullTitle,
					selectedPublication.locale,
				)
			}}
		</template>
		<template v-if="submission" #post-description>
			<StageBubble :extended-stage="workflowStore.extendedStage">
				<span class="text-lg-normal">
					{{ workflowStore.stageLabel }}
				</span>
			</StageBubble>
		</template>
		<template v-if="submission" #actions>
			<div class="flex gap-x-4">
				<component
					:is="workflowStore.Components[item.component] || item.component"
					v-bind="item.props"
					v-for="(item, index) in workflowStore.headerItems"
					:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
				/>
			</div>
		</template>
		<SideModalLayoutMenu2Columns>
			<template #menu>
				<nav>
					<SideMenu v-bind="workflowStore.sideMenuProps"></SideMenu>
				</nav>
			</template>
			<template #heading>
				<h2>{{ workflowStore.menuTitle }}</h2>
			</template>
			<template
				v-if="workflowStore.primaryControlsLeft?.length"
				#publication-controls-left
			>
				<div class="flex flex-col gap-y-2" data-cy="workflow-controls-left">
					<template v-for="(item, index) in workflowStore.primaryControlsLeft">
						<div v-if="Array.isArray(item)" :key="`${index}`">
							<div class="flex gap-x-2">
								<component
									:is="
										workflowStore.Components[subitem.component] ||
										subitem.component
									"
									v-bind="subitem.props"
									v-for="(subitem, subindex) in item"
									:key="`${subindex} - ${subitem.component} - ${subitem?.props?.namespace}`"
								/>
							</div>
						</div>
						<component
							:is="workflowStore.Components[item.component] || item.component"
							v-else
							v-bind="item.props"
							:key="`else ${index} - ${item.component} - ${item?.props?.namespace}`"
						/>
					</template>
				</div>
			</template>
			<template
				v-if="workflowStore.primaryControlsRight?.length"
				#publication-controls-right
			>
				<div class="flex gap-x-3" data-cy="workflow-controls-right">
					<component
						:is="workflowStore.Components[item.component] || item.component"
						v-bind="item.props"
						v-for="(item, index) in workflowStore.primaryControlsRight"
						:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
					/>
				</div>
			</template>

			<template #primary>
				<div
					class="flex flex-col gap-y-5 bg-secondary p-5"
					data-cy="workflow-primary-items"
				>
					<component
						:is="workflowStore.Components[item.component] || item.component"
						v-bind="item.props"
						v-for="(item, index) in workflowStore.primaryItems"
						:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
					/>
				</div>
			</template>
			<template v-if="workflowStore.actionItems?.length" #actions>
				<div
					class="flex flex-col items-start space-y-3 p-4"
					data-cy="workflow-action-items"
				>
					<component
						:is="workflowStore.Components[item.component] || item.component"
						v-for="(item, index) in workflowStore.actionItems"
						v-bind="item.props"
						:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
					></component>
				</div>
			</template>
			<template v-if="workflowStore.secondaryItems?.length" #secondary>
				<div
					class="flex flex-col space-y-4 p-4"
					data-cy="workflow-secondary-items"
				>
					<component
						:is="workflowStore.Components[item.component] || item.component"
						v-for="(item, index) in workflowStore.secondaryItems"
						v-bind="item.props"
						:key="`${index} - ${item.component} - ${item?.props?.namespace}`"
					></component>
				</div>
			</template>
		</SideModalLayoutMenu2Columns>
	</SideModalBody>
</template>

<script setup>
import {storeToRefs} from 'pinia';
import SideMenu from '@/components/SideMenu/SideMenu.vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import StageBubble from '@/components/StageBubble/StageBubble.vue';
import Spinner from '@/components/Spinner/Spinner.vue';
import {useWorkflowStore} from './workflowStore';
import {useProgressStore} from '@/stores/progressStore';
import SideModalLayoutMenu2Columns from '@/components/Modal/SideModalLayoutMenu2Columns.vue';

import {useLocalize} from '@/composables/useLocalize';
const {localizeSubmission} = useLocalize();

const workflowStore = useWorkflowStore();
const progressStore = useProgressStore();

const {submission, selectedPublication} = storeToRefs(workflowStore);
</script>
