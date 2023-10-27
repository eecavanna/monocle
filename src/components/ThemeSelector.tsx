import { Theme } from "../constants.ts";

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
    // TODO: Use a `button` for this, so I don't have to specify an `href`.
    <a className={"icon-link"} onClick={onClick} href={"#"}>
      <i className={`bi ${iconClassName}`}></i>
    </a>
  );
};
