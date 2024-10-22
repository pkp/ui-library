import FieldAffiliations from './FieldAffiliations.vue';
import FieldAffiliationsMock from '@/components/Form/mocks/field-affiliations';

const args = {...FieldAffiliationsMock};

export default {
    title: 'Forms/FieldAffiliations',
    component: FieldAffiliations,
    args: {},
    render: (args) => ({
        components: {FieldAffiliations},
        setup() {
            return {
                args,
            }
        },
        template: `
          <FieldAffiliations v-bind="args"/>`
    })
};

export const Base = {
    args: {...FieldAffiliationsMock},
};
