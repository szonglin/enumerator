import { Box } from "@mantine/core";
import { EnumResult } from "../en/enResult";
import { ResultDisplay } from "./ResultDisplay";

export interface ResultListProps {
  results: EnumResult[];
}

export const ResultList = ({ results }: ResultListProps) => {
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "400px",
        overflowY: "auto",
      }}
    >
      {results.map((e) => (
        <ResultDisplay key={e.id} result={e} />
      ))}
    </Box>
  );
};
