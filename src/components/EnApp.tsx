import { useRef, useState } from "react";
import { Enumerator } from "../en/enumerator";
import { enumerationType, Util } from "../en/util";
import { ConditionList } from "./ConditionList";
import {
  Title,
  Button,
  Text,
  SegmentedControl,
  Group,
  NumberInput,
  Anchor,
} from "@mantine/core";
import { EnumResult } from "../en/enResult";
import { ResultList } from "./ResultList";

export const EnApp = () => {
  const enumerationTypeOptions = [
    { value: "permutation", label: "permutations" },
    { value: "combination", label: "combinations" },
  ];
  const [enumerationType, setEnumerationType] =
    useState<enumerationType>("permutation");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const _enumerator = useRef(new Enumerator(enumerationType));
  const [inputString, setInputString] = useState("");
  const [inputLength, setInputLength] = useState(0);
  const [_conditions, setConditions] = useState<Record<string, string>[]>([]);
  const [results, setResults] = useState<EnumResult[]>([]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      Util.validateString(inputString);
      _enumerator.current.setInput(inputString);
      _enumerator.current.setLength(inputLength);
      _enumerator.current.setEnumerationType(enumerationType);
      _enumerator.current.setConditions(_conditions);
      await new Promise((r) => setTimeout(r, 50));
      const res = _enumerator.current.run();
      setResults([res, ...results]);
    } catch (err) {
      setErrorMessage((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputString(e.target.value);
    const asArray = Util.inputToArray(e.target.value);
    setInputLength(asArray.length);
  };

  const handleConditionChange = (conditions: Record<string, string>[]) => {
    setConditions(conditions);
  };

  return (
    <>
      <Title mb="sm">Enumerator</Title>
      <div>
        {"Calculate the number of "}
        <SegmentedControl
          data={enumerationTypeOptions}
          onChange={(e) => {
            if (e === "permutation" || e === "combination")
              setEnumerationType(e);
          }}
        />
        {" of"}
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <input
          className="input"
          type="text"
          value={inputString}
          onChange={handleInputChange}
          placeholder="enter a string or comma-separated list"
        />
      </div>
      <Group>
        <div>of length </div>
        <NumberInput
          value={inputLength}
          onChange={(e) => {
            if (!Number.isNaN(Number(e))) setInputLength(e as number);
          }}
          allowDecimal={false}
          style={{ width: "65px" }}
          min={0}
        />
        {/* TODO: <SegmentedControl data={["with repetitions", "without repetitions"]} /> */}
        {_conditions.length && <div>{" where"}</div>}
      </Group>
      <ConditionList
        onChange={handleConditionChange}
        selectedConditions={_conditions}
      />
      <Button
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan" }}
        onClick={handleSubmit}
        loading={isLoading}
      >
        Run
      </Button>
      {errorMessage && (
        <Text c="royalblue" fw={"bold"}>
          {errorMessage}
        </Text>
      )}
      <Text fs={"italic"}>
        The conjunction of all conditions is taken. If you want a disjunction,
        you will need to convert it into a sum of conjunctions. Please note that
        some inputs may not run in a reasonable amount of time, especially those
        with a large number of elements and complex conditions. Inputs with
        letters are converted to their ascii codes.
      </Text>
      <ResultList results={results} />
      <Group>
        <Anchor
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          underline="hover"
        >
          Examples
        </Anchor>
        <Anchor
          href="https://github.com/szonglin/enumerator.git"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          underline="hover"
          target="_blank"
        >
          GitHub
        </Anchor>
      </Group>
    </>
  );
};
