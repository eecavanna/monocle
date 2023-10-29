import Alert, { AlertProps } from "react-bootstrap/Alert";

interface Props extends AlertProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const WelcomeAlert = ({ isVisible, onDismiss, ...rest }: Props) => {
  return (
    <Alert
      variant={"info"}
      show={isVisible}
      onClose={onDismiss}
      dismissible
      {...rest}
    >
      <Alert.Heading>Welcome to Monocle</Alert.Heading>
      <p>
        Monocle is a Makefile visualizer for the web. You can use it to generate
        a diagram of a Makefile's targets and their dependencies.
      </p>
      <hr />
      <p>
        To get started, you can drop a Makefile into the editor below. When you
        press the "Update diagram" button, Monocle will generate a diagram of
        the Makefile's targets and their dependencies.
      </p>
    </Alert>
  );
};

export default WelcomeAlert;
