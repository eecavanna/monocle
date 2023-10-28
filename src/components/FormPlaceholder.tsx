import Placeholder from "react-bootstrap/Placeholder";

const FormPlaceholder = () => {
  return (
    <>
      <Placeholder
        xs={12}
        size={"lg"}
        style={{ height: 40 }}
        className={"mt-5 mb-2 rounded-top-1"}
      />
      <Placeholder
        xs={12}
        size={"lg"}
        style={{ height: 200 }}
        className={"rounded-bottom-1"}
      />
    </>
  );
};

export default FormPlaceholder;
