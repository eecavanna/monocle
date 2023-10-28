import Toast, { ToastProps } from "react-bootstrap/Toast";

interface Props {
  onClose: () => void;
  isVisible: boolean;
  title?: string;
  body: string;
  variant?: ToastProps["bg"];
}

const CustomToast = ({
  onClose,
  isVisible,
  title = "Monocle",
  body,
  variant,
}: Props) => {
  return (
    <Toast onClose={onClose} show={isVisible} autohide bg={variant}>
      <Toast.Header>
        <img
          src={"/logo-512x512.png"}
          className={"rounded me-2"}
          style={{ height: 16, width: 16 }}
          alt={"Monocle logo"}
        />
        <strong className="me-auto">{title}</strong>
        <small>Just now</small>
      </Toast.Header>
      <Toast.Body>{body}</Toast.Body>
    </Toast>
  );
};

export default CustomToast;
