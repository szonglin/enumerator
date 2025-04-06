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
  Select,
  Flex,
  Popover,
} from "@mantine/core";
import { EnumResult } from "../en/enResult";
import { ResultList } from "./ResultList";
import { conditionList } from "../en/condition";

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
  const [withRepetitions, setWithRepetitions] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      Util.validateString(inputString);
      _enumerator.current.setInput(inputString);
      _enumerator.current.setLength(inputLength);
      _enumerator.current.setRepeats(withRepetitions);
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

  const [idCounter, setIdCounter] = useState(0);

  const [showPopover, setShowPopover] = useState(false);
  const handleAdd = (e: string) => {
    setConditions([..._conditions, { id: idCounter.toString(), condition: e }]);
    setIdCounter(idCounter + 1);
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
          spellCheck="false"
          value={inputString}
          onChange={handleInputChange}
          placeholder="enter a string or space-separated list"
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
        <SegmentedControl
          data={["without repetitions", "with repetitions"]}
          value={withRepetitions ? "with repetitions" : "without repetitions"}
          onChange={(e) => {
            if (e === "with repetitions") setWithRepetitions(true);
            else setWithRepetitions(false);
          }}
        />
        {_conditions.length && <div>{" where"}</div>}
      </Group>
      <ConditionList
        onChange={handleConditionChange}
        selectedConditions={_conditions}
      />
      <Flex justify="space-between" align="center">
        <div>
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
          <Button
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            onClick={handleSubmit}
            loading={isLoading}
          >
            Run
          </Button>
        </div>
        {/* TODO: <Select data={["normal", "circle", "necklace", "words"]} maw="7em" /> */}
      </Flex>
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
          href="https://github.com/szonglin/enumerator/blob/main/other/examples.md"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          underline="hover"
          target="_blank"
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
