import { DefaultEdit } from '../default';

const Edit = (props) => {
  return (
    <DefaultEdit
      {...props}
      data={{
        ...props.data,
        menuPointing: true,
        menuSecondary: true,
        menuFluid: false,
        menuText: false,
      }}
    />
  );
};

export default Edit;
