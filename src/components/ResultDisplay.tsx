import { useState } from "react";
import { EnumResult } from "../en/enResult";
import { Card, Grid, Group, Text, Tooltip } from "@mantine/core";
import { IconAlertHexagon, IconMinus, IconPlus } from "@tabler/icons-react";

export interface ResultDisplayProps {
  result: EnumResult;
}

export const ResultDisplay = ({ result }: ResultDisplayProps) => {
  const [showDetail, setShowDetail] = useState(false);

  const numberDisplay = (value: number, approx: boolean) => {
    const approxPrefix = approx || value > Number.MAX_SAFE_INTEGER ? "~" : "";
    return (
      approxPrefix +
      (value > Math.pow(10, 10)
        ? value.toExponential(4).replace("e+", " x 10^")
        : Intl.NumberFormat().format(value))
    );
  };

  const detailDisplay = (value: number, detail: string) => {
    const addWarning =
      value > Number.MAX_SAFE_INTEGER
        ? ", this value exceeded the max safe integer limit - it may be inaccurate"
        : "";
    return detail + addWarning;
  };
  return (
    <Card shadow="sm" withBorder style={{ margin: "5px", flexShrink: 0 }}>
      <Grid>
        <Grid.Col span={2.5}>
          <Group>
            <Text fw={700} size="lg">
              {numberDisplay(result.value, result.isApproximation)}
            </Text>
            {(result.isApproximation ||
              result.value > Number.MAX_SAFE_INTEGER) && (
              <Tooltip
                label={
                  "This value may be inaccurate, check the details for more information"
                }
              >
                <IconAlertHexagon size="1.1rem" color="royalblue" />
              </Tooltip>
            )}
          </Group>
        </Grid.Col>
        <Grid.Col span={4.5}>
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
            <Grid.Col span={2.5}></Grid.Col>
            <Grid.Col span={8}>
              <Text fs={"italic"} c={"gray"}>
                {detailDisplay(result.value, result.detail)}
              </Text>
            </Grid.Col>{" "}
          </>
        )}
      </Grid>
    </Card>
  );
};
