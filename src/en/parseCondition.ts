import {
  comparisonOption,
  Condition,
  Contains,
  Decreasing,
  Distinct,
  EndsWith,
  Increasing,
  Maximum,
  Minimum,
  Palindrome,
  StartsWith,
  Subarray,
  Subsequence,
  Sum,
} from "./condition";
import { Enumerator } from "./enumerator";
import { Util } from "./util";

const getInputArg = (arg?: string): number[] => {
  if (!arg) throw new Error("Missing condition argument");
  return Util.inputToArray(arg);
};

const getComparisonArg = (
  numberOnly: boolean,
  arg?: string,
  comparison?: string
): [number, comparisonOption] => {
  if (!arg || !comparison) throw new Error("Missing condition argument");
  if (numberOnly && Number.isNaN(Number(arg)))
    throw new Error("Condition argument must be a number");
  if (!["less", "more", "equal"].includes(comparison))
    throw new Error("Unrecognised condition argument");
  if (!Number.isNaN(Number(arg)))
    return [Number(arg), comparison as comparisonOption];
  else if (arg.length > 1)
    throw new Error("Condition argument must be a number or single character");
  return [arg.charCodeAt(0), comparison as comparisonOption];
};

export class ParseCondition {
  private en: Enumerator;
  constructor(en: Enumerator) {
    this.en = en;
  }
  public createCondition = (condition: Record<string, string>): Condition => {
    console.log("parsing", condition);
    let arg: number[];
    let nArg: number;
    let comparison: comparisonOption;
    switch (condition.condition) {
      // boolean arg type
      case "increasing":
        if (condition.strict === "true" || condition.strict === "false")
          return new Increasing(this.en, condition.strict === "true");
        else throw new Error("Unrecognised condition argument");
      case "decreasing":
        if (condition.strict === "true" || condition.strict === "false")
          return new Decreasing(this.en, condition.strict === "true");
        else throw new Error("Unrecognised condition argument");
      // input arg type
      case "subarray":
        arg = getInputArg(condition.arg);
        return new Subarray(this.en, arg);
      case "subsequence":
        arg = getInputArg(condition.arg);
        return new Subsequence(this.en, arg);
      case "contains":
        arg = getInputArg(condition.arg);
        return new Contains(this.en, arg);
      case "startsWith":
        arg = getInputArg(condition.arg);
        return new StartsWith(this.en, arg);
      case "endsWith":
        arg = getInputArg(condition.arg);
        return new EndsWith(this.en, arg);
      // no arg type
      case "distinct":
        return new Distinct(this.en);
      case "palindrome":
        return new Palindrome(this.en);
      // number input type
      case "sum":
        [nArg, comparison] = getComparisonArg(
          true,
          condition.arg,
          condition.comparison
        );
        return new Sum(this.en, nArg, comparison);
      // number or character input type
      case "maximum":
        [nArg, comparison] = getComparisonArg(
          false,
          condition.arg,
          condition.comparison
        );
        return new Maximum(this.en, nArg, comparison);
      case "minimum":
        [nArg, comparison] = getComparisonArg(
          false,
          condition.arg,
          condition.comparison
        );
        return new Minimum(this.en, nArg, comparison);
      default:
        throw new Error("Unrecognised Condition");
    }
  };
}
