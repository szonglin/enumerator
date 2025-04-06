import { IconEqual, IconMathGreater, IconMathLower } from "@tabler/icons-react";
import { comparisonOption } from "../en/condition";
import { ActionIcon } from "@mantine/core";
import { useEffect, useState } from "react";

export interface ComparisonSwitcherProps {
  onChange: (e: comparisonOption) => void;
}

export const ComparisonSwitcher = ({ onChange }: ComparisonSwitcherProps) => {
  const options: comparisonOption[] = ["less", "equal", "more"];
  const [selected, setSelected] = useState<comparisonOption>("equal");
  const handleClick = () => {
    const nextSelected =
      options[(options.findIndex((e) => e === selected) + 1) % options.length];
    setSelected(nextSelected);
    onChange(nextSelected);
  };
  useEffect(() => {
    onChange("equal");
  }, []);
  switch (selected) {
    case "less":
      return (
        <ActionIcon onClick={handleClick}>
          <IconMathLower />
        </ActionIcon>
      );
    case "equal":
      return (
        <ActionIcon onClick={handleClick}>
          <IconEqual />
        </ActionIcon>
      );
    case "more":
      return (
        <ActionIcon onClick={handleClick}>
          <IconMathGreater />
        </ActionIcon>
      );
    default:
  }
};
