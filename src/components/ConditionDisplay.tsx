import {
  ActionIcon,
  Card,
  Group,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useState } from "react";

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
        return (
          <SubArgOptions
            conditionValues={conditionValues}
            onChange={onChange}
          />
        );
      default:
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
      <Text fw={"bold"}>{conditionValues.condition}</Text>
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
