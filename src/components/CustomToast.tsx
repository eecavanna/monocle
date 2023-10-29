import Toast, { ToastProps } from "react-bootstrap/Toast";

interface Props {
  onClose: () => void;
  isVisible: boolean;
  title?: string;
  body: string;
  variant?: ToastProps["bg"];
}

// Get an explicit reference to the globally-injected public base path.
//
// Note: This is to work around the fact that vite does not seem to automatically prepend the base path to
//       `<img src="..."/>` paths, which breaks those paths when deployed to a subdirectory (of a domain).
//
// Reference: https://vitejs.dev/guide/build.html#public-base-path
//
const BASE_URL = import.meta.env.BASE_URL;

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
          src={`${BASE_URL}/logo-512x512.png`}
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
