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
import { comparisonOption } from "../en/condition";
import { conditionData } from "../en/conditionData";
import { ComparisonSwitcher } from "./ComparisonSwitcher";
import { NegationSwitcher } from "./NegationSwitcher";

export interface ConditionDisplayProps {
  conditionValues: Record<string, any>;
  onDelete: (id: string) => void;
  onChange: (id: string, newValues: Record<string, any>) => void;
}

interface OptionsProps {
  conditionValues: Record<string, any>;
  onChange: (id: string, newValues: Record<string, any>) => void;
}

export const ConditionDisplay = ({
  conditionValues,
  onChange,
  onDelete,
}: ConditionDisplayProps) => {
  const getOptions = (cond: string) => {
    const argType = conditionData.find((e) => e.condition === cond)?.argType;
    if (!argType) throw new Error("Unrecognised condition");
    switch (argType) {
      case "strictness":
        return (
          <IncDecOptions
            conditionValues={conditionValues}
            onChange={onChange}
          />
        );
      case "subInput":
        return (
          <SubArgOptions
            conditionValues={conditionValues}
            onChange={onChange}
          />
        );
      case "subInputComparison":
        return (
          <SubArgWithNumOptions
            conditionValues={conditionValues}
            onChange={onChange}
          />
        );
      case "numerical":
        return (
          <NumArgOptions
            conditionValues={conditionValues}
            onChange={onChange}
          />
        );
      case "none":
        return (
          <Text fs="italic" c="gray">
            (no options)
          </Text>
        );
      default:
        throw new Error("Unrecognised argType");
    }
  };

  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card
      withBorder
      style={{ maxWidth: "200px", flexShrink: 0 }}
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
        <NegationSwitcher
          onChange={(e) => {
            conditionValues.negate = e;
          }}
        />
        <Text fw={"bold"}>{conditionValues.condition}</Text>
        <Tooltip
          label={
            conditionData.find((e) => e.condition === conditionValues.condition)
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

const SubArgWithNumOptions = ({ conditionValues, onChange }: OptionsProps) => {
  const [arg1, setArg1] = useState("");
  const [arg2, setArg2] = useState("");
  const handleComparisonChange = (e: comparisonOption) => {
    onChange(conditionValues.id, {
      ...conditionValues,
      comparison: e,
    });
  };
  return (
    <>
      <TextInput
        value={arg1}
        onChange={(e) => {
          if (e.target.value !== undefined) {
            setArg1(e.target.value);
            onChange(conditionValues.id, {
              ...conditionValues,
              arg: e.target.value,
            });
          }
        }}
      />
      <Group wrap="nowrap" align="center">
        <ComparisonSwitcher onChange={handleComparisonChange} />
        <TextInput
          value={arg2}
          onChange={(e) => {
            if (e.target.value !== undefined) {
              if (!Number.isNaN(Number(e.target.value))) {
                setArg2(e.target.value);
                onChange(conditionValues.id, {
                  ...conditionValues,
                  arg2: e.target.value,
                });
              } else if (e.target.value.length <= 1) {
                setArg2(e.target.value);
                setArg2(e.target.value);
                onChange(conditionValues.id, {
                  ...conditionValues,
                  arg2: e.target.value,
                });
              }
            }
          }}
        />
      </Group>
    </>
  );
};
