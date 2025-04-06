import {
  ActionIcon,
  Card,
  Group,
  Select,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { IconHelpHexagon, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { comparisonOption, conditionList } from "../en/condition";
import { ComparisonSwitcher } from "./ComparisonSwitcher";

export interface ConditionDisplayProps {
  conditionValues: Record<string, string>;
  onDelete: (id: string) => void;
  onChange: (id: string, newValues: Record<string, string>) => void;
}

interface OptionsProps {
  conditionValues: Record<string, string>;
  onChange: (id: string, newValues: Record<string, string>) => void;
}

export const ConditionDisplay = ({
  conditionValues,
  onChange,
  onDelete,
}: ConditionDisplayProps) => {
  const getOptions = (cond: string) => {
    // :<
    switch (cond) {
      case "increasing":
      case "decreasing":
        return (
          <IncDecOptions
            conditionValues={conditionValues}
            onChange={onChange}
          />
        );
      case "subarray":
      case "subsequence":
      case "startsWith":
      case "endsWith":
      case "contains":
        return (
          <SubArgOptions
            conditionValues={conditionValues}
            onChange={onChange}
          />
        );
      case "palindrome":
      case "distinct":
        return (
          <Text fs="italic" c="gray">
            (no options)
          </Text>
        );
      case "sum":
      case "maximum":
      case "minimum":
        return (
          <NumArgOptions
            conditionValues={conditionValues}
            onChange={onChange}
          />
        );
      default:
        console.log("Unexpected condition type:", cond);
        return <div>Error</div>;
    }
  };

  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card
      withBorder
      style={{ maxWidth: "180px", flexShrink: 0 }}
      shadow="sm"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isHovering && (
        <ActionIcon
          size="sm"
          radius="sm"
          style={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
          onClick={() => {
            onDelete(conditionValues.id);
          }}
        >
          <IconX />
        </ActionIcon>
      )}
      <Group gap="0.2em">
        <Text fw={"bold"}>{conditionValues.condition}</Text>
        <Tooltip
          label={
            conditionList.find((e) => e.condition === conditionValues.condition)
              ?.description || "Error"
          }
        >
          <IconHelpHexagon size="1.2rem" color="royalblue" />
        </Tooltip>
      </Group>
      {getOptions(conditionValues.condition)}
    </Card>
  );
};

const IncDecOptions = ({ conditionValues, onChange }: OptionsProps) => {
  return (
    <Group>
      <Select
        data={[
          { value: "true", label: "strictly" },
          { value: "false", label: "non-strictly" },
        ]}
        style={{ width: "120px", flexShrink: 0 }}
        onChange={(e) => {
          if (e)
            onChange(conditionValues.id, { ...conditionValues, strict: e });
        }}
      />
    </Group>
  );
};

const SubArgOptions = ({ conditionValues, onChange }: OptionsProps) => {
  const [arg, setArg] = useState("");
  return (
    <Group>
      <TextInput
        value={arg}
        onChange={(e) => {
          if (e.target.value !== undefined) {
            setArg(e.target.value);
            onChange(conditionValues.id, {
              ...conditionValues,
              arg: e.target.value,
            });
          }
        }}
      />
    </Group>
  );
};

const NumArgOptions = ({ conditionValues, onChange }: OptionsProps) => {
  const [arg, setArg] = useState("");
  const handleComparisonChange = (e: comparisonOption) => {
    onChange(conditionValues.id, {
      ...conditionValues,
      comparison: e,
    });
  };

  return (
    <Group wrap="nowrap" align="center">
      <ComparisonSwitcher onChange={handleComparisonChange} />
      <TextInput
        value={arg}
        onChange={(e) => {
          if (e.target.value !== undefined) {
            if (!Number.isNaN(Number(e.target.value))) {
              setArg(e.target.value);
              onChange(conditionValues.id, {
                ...conditionValues,
                arg: e.target.value,
              });
            } else if (e.target.value.length <= 1) {
              setArg(e.target.value);
              setArg(e.target.value);
              onChange(conditionValues.id, {
                ...conditionValues,
                arg: e.target.value,
              });
            }
          }
        }}
      />
    </Group>
  );
};
