import { Tooltip } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export interface NegationSwitcherProps {
  onChange: (e: boolean) => void;
}

export const NegationSwitcher = ({ onChange }: NegationSwitcherProps) => {
  const [negate, setNegate] = useState(false);
  const handleClick = () => {
    const _negate = !negate;
    setNegate(_negate);
    onChange(_negate);
  };
  useEffect(() => {
    onChange(false);
  }, []);

  const tooltip =
    "+ for arrangements satisfying the condition, " +
    "- for arrangements not satisfying the condition " +
    "(click to toggle)";

  return negate ? (
    <Tooltip label={tooltip}>
      <IconMinus onClick={handleClick} color="royalblue" />
    </Tooltip>
  ) : (
    <Tooltip label={tooltip}>
      <IconPlus onClick={handleClick} color="royalblue" />
    </Tooltip>
  );
};
