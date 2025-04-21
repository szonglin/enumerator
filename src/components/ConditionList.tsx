import { Box } from "@mantine/core";
import { ConditionDisplay } from "./ConditionDisplay";

export interface ConditionListProps {
  selectedConditions: Record<string, any>[];
  onChange: (conditions: Record<string, any>[]) => void;
}

export const ConditionList = ({
  selectedConditions,
  onChange,
}: ConditionListProps) => {
  const handleDelete = (id: string) => {
    const newSelectedConditions = selectedConditions.filter((e) => e.id !== id);
    onChange(newSelectedConditions);
  };

  const handleChange = (id: string, newValues: Record<string, any>) => {
    const newSelectedConditions = selectedConditions.map((e) => {
      return e.id === id ? newValues : e;
    });
    onChange(newSelectedConditions);
  };

  return (
    <Box
      style={{
        display: "flex",
        gap: "1rem",
        overflowX: "auto",
        padding: "10px",
      }}
    >
      {selectedConditions.map((e) => {
        return (
          <ConditionDisplay
            conditionValues={e}
            key={e.id}
            onChange={handleChange}
            onDelete={handleDelete}
          />
        );
      })}
    </Box>
  );
};
