import Edit from '@eeacms/volto-tabs-block/components/variations/default/Edit';
import { accordionSchemaEnhancer } from '@eeacms/volto-tabs-block/components/variations/accordion/schema';
import cx from 'classnames';

const AccordionEdit = (props) => {
  return (
    <Edit
      skipColorOption={true}
      {...props}
      addTabsOptions={(data) => {
        return cx(data?.theme ? `${data?.theme}` : '', {
          RRT__tabs: true,
          'tabs-accordion-icon-right': data.accordionIconRight,
          'tabs-accessibility': true,
          inverted: data.menuInverted,
          pointing: data.menuPointing,
        });
      }}
    />
  );
};

AccordionEdit.schemaEnhancer = accordionSchemaEnhancer;

export default AccordionEdit;
