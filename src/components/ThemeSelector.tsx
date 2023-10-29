import { Theme } from "../constants.ts";
import Button from "react-bootstrap/Button";

interface Props {
  theme: Theme;
  onSelect: (t: Theme) => void;
}

export const ThemeSelector = ({ onSelect, theme }: Props) => {
  const onClick = () => {
    if (theme === Theme.Dark) {
      onSelect(Theme.Light);
    } else {
      onSelect(Theme.Dark);
    }
  };

  const iconClassName =
    theme === Theme.Dark ? "bi-moon-stars-fill" : "bi bi-sun-fill";

  return (
    <Button
      variant={"link"}
      className={"text-muted"}
      onClick={onClick}
      title={"Toggle theme"}
    >
      <i className={`bi ${iconClassName}`}></i>
    </Button>
  );
};
