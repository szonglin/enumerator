import { Box, Button, Popover, Select } from "@mantine/core";
import { useState } from "react";
import { ConditionDisplay } from "./ConditionDisplay";
import { conditionList } from "../en/condition";

export interface ConditionListProps {
  selectedConditions: Record<string, string>[];
  onChange: (conditions: Record<string, string>[]) => void;
}

export const ConditionList = ({
  selectedConditions,
  onChange,
}: ConditionListProps) => {
  let idCounter = 0;
  const [showPopover, setShowPopover] = useState(false);

  const handleAdd = (e: string) => {
    onChange([
      ...selectedConditions,
      { id: (idCounter++).toString(), condition: e },
    ]);
  };

  const handleDelete = (id: string) => {
    const newSelectedConditions = selectedConditions.filter((e) => e.id !== id);
    onChange(newSelectedConditions);
  };

  const handleChange = (id: string, newValues: Record<string, string>) => {
    const newSelectedConditions = selectedConditions.map((e) => {
      return e.id === id ? newValues : e;
    });
    onChange(newSelectedConditions);
  };

  return (
    <>
      <Box
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          padding: "10px",
        }}
      >
        {selectedConditions.map((e) => (
          <ConditionDisplay
            conditionValues={e}
            key={idCounter++}
            onChange={handleChange}
            onDelete={handleDelete}
          />
        ))}
      </Box>
      <Popover
        position="bottom-start"
        opened={showPopover}
        onDismiss={() => setShowPopover(false)}
      >
        <Popover.Target>
          <Button
            onClick={() => setShowPopover((e) => !e)}
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            style={{ margin: "5px" }}
          >
            Add Condition
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <Select
            placeholder="Choose a condition"
            searchable={true}
            data={conditionList.map((e) => e.condition)}
            onChange={(e) => {
              if (e) handleAdd(e);
              setShowPopover(false);
            }}
            comboboxProps={{ withinPortal: false }}
          />
        </Popover.Dropdown>
      </Popover>
    </>
  );
};
