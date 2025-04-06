import { useState } from "react";
import { EnumResult } from "../en/enResult";
import { Card, Grid, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";

export interface ResultDisplayProps {
  result: EnumResult;
}

export const ResultDisplay = ({ result }: ResultDisplayProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const setNumberSize = (val: number) => {
    const size = Intl.NumberFormat().format(val).length;
    if (size < 15) return "lg";
    if (size < 22) return "md";
    else return "sm";
  };
  return (
    <Card shadow="sm" withBorder style={{ margin: "5px", flexShrink: 0 }}>
      <Grid>
        <Grid.Col span={2}>
          <Text fw={700} size={setNumberSize(result.value)}>
            {Intl.NumberFormat().format(result.value)}
          </Text>
        </Grid.Col>
        <Grid.Col span={5}>
          <Text>{result.description}</Text>
        </Grid.Col>
        <Grid.Col span={4} fs="italic" c="gray">
          <Text>{result.request}</Text>
        </Grid.Col>
        <Grid.Col span={1}>
          <Text
            ta="right"
            onClick={() => {
              setShowDetail(!showDetail);
            }}
          >
            {showDetail ? (
              <IconMinus color="royalblue" />
            ) : (
              <IconPlus color="royalblue" />
            )}
          </Text>
        </Grid.Col>
        {showDetail && (
          <>
            <Grid.Col span={2}></Grid.Col>
            <Grid.Col span={8}>
              <Text fs={"italic"} c={"gray"}>
                {result.detail}
              </Text>
            </Grid.Col>{" "}
          </>
        )}
      </Grid>
    </Card>
  );
};
