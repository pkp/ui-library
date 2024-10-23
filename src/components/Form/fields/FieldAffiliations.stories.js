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
          <FieldAffiliations v-bind="args"/>

		  <div style="margin-top: 10px; padding: 10px; border: 1px solid #ccc;">
			  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel accumsan neque, ac tincidunt
				  risus. Sed vulputate augue ut quam ultricies elementum. In pretium euismod ipsum nec
				  consectetur. In eleifend sapien id porta lobortis. Fusce faucibus pharetra rutrum. Etiam
				  sagittis iaculis placerat. Donec ut faucibus nibh, a auctor erat. Orci varius natoque penatibus
				  et magnis dis parturient montes, nascetur ridiculus mus. Proin porttitor, nulla ac auctor
				  bibendum, urna leo dignissim arcu, id viverra justo quam vel ligula. Fusce a tincidunt justo.
				  Nulla vulputate accumsan massa, nec vulputate erat semper non.
			  </p>
			  <p> &nbsp; </p>
			  <p>Nunc auctor mattis quam eu tempus. Integer ornare est libero, quis sollicitudin tortor commodo
				  ac. Integer nisi mauris, pellentesque quis vehicula vitae, aliquet in ex. Praesent mattis metus
				  non fermentum convallis. Integer lobortis libero ac malesuada eleifend. In consectetur felis
				  efficitur nunc tempus luctus. Cras cursus mi non ipsum suscipit, non placerat purus interdum.
				  Nulla blandit ultricies condimentum. Proin interdum nunc lacus, et gravida libero interdum
				  nec.
			  </p>
		  </div>
		`
    })
};

export const Base = {
    args: {...FieldAffiliationsMock},
};
