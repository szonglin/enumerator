import {
  comparisonOption,
  Condition,
  Contains,
  Count,
  SubseqCount,
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
  CountOverlap,
  Derangement,
  Average,
  Median,
  MaxFrequency,
  Excludes,
  CountDistinct,
  MinFrequency,
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
  comparison?: string,
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

const getINCArg = (
  arg?: string,
  arg2?: string,
  comparison?: string,
): [number[], number, comparisonOption] => {
  if (!arg || !arg2 || !comparison)
    throw new Error("Missing condition argument");
  if (!["less", "more", "equal"].includes(comparison))
    throw new Error("Unrecognised condition argument");
  if (Number.isNaN(arg2)) throw new Error("Count must be a number");
  const _arg = Util.inputToArray(arg);
  if (_arg.some((e) => Number.isNaN(e)))
    throw new Error("Invalid characters in condition argument");
  return [_arg, Number(arg2), comparison as comparisonOption];
};

export class ParseCondition {
  private en: Enumerator;
  constructor(en: Enumerator) {
    this.en = en;
  }
  public createCondition = (condition: Record<string, any>): Condition => {
    let arg: number[];
    let arg2: number;
    let nArg: number;
    let comparison: comparisonOption;
    const negate = condition.negate;
    switch (condition.condition) {
      // boolean arg type
      case "increasing":
        if (condition.strict === "true" || condition.strict === "false")
          return new Increasing(this.en, negate, condition.strict === "true");
        else throw new Error("Unrecognised condition argument");
      case "decreasing":
        if (condition.strict === "true" || condition.strict === "false")
          return new Decreasing(this.en, negate, condition.strict === "true");
        else throw new Error("Unrecognised condition argument");
      // input arg type
      case "subarray":
        arg = getInputArg(condition.arg);
        return new Subarray(this.en, negate, arg);
      case "subsequence":
        arg = getInputArg(condition.arg);
        return new Subsequence(this.en, negate, arg);
      case "contains":
        arg = getInputArg(condition.arg);
        return new Contains(this.en, negate, arg);
      case "excludes":
        arg = getInputArg(condition.arg);
        return new Excludes(this.en, negate, arg);
      case "startsWith":
        arg = getInputArg(condition.arg);
        return new StartsWith(this.en, negate, arg);
      case "endsWith":
        arg = getInputArg(condition.arg);
        return new EndsWith(this.en, negate, arg);
      // no arg type
      case "distinct":
        return new Distinct(this.en, negate);
      case "palindrome":
        return new Palindrome(this.en, negate);
      case "derangement":
        return new Derangement(this.en, negate);
      // number input type
      case "countDistinct":
        [nArg, comparison] = getComparisonArg(
          true,
          condition.arg,
          condition.comparison,
        );
        return new CountDistinct(this.en, negate, nArg, comparison);
      case "sum":
        [nArg, comparison] = getComparisonArg(
          true,
          condition.arg,
          condition.comparison,
        );
        return new Sum(this.en, negate, nArg, comparison);
      case "average":
        [nArg, comparison] = getComparisonArg(
          true,
          condition.arg,
          condition.comparison,
        );
        return new Average(this.en, negate, nArg, comparison);
      case "median":
        [nArg, comparison] = getComparisonArg(
          true,
          condition.arg,
          condition.comparison,
        );
        return new Median(this.en, negate, nArg, comparison);
      // number or character input type
      case "maximum":
        [nArg, comparison] = getComparisonArg(
          true,
          condition.arg,
          condition.comparison,
        );
        return new Maximum(this.en, negate, nArg, comparison);
      case "minimum":
        [nArg, comparison] = getComparisonArg(
          true,
          condition.arg,
          condition.comparison,
        );
        return new Minimum(this.en, negate, nArg, comparison);
      case "minFrequency":
        [nArg, comparison] = getComparisonArg(
          true,
          condition.arg,
          condition.comparison,
        );
        return new MinFrequency(this.en, negate, nArg, comparison);
      case "maxFrequency":
        [nArg, comparison] = getComparisonArg(
          true,
          condition.arg,
          condition.comparison,
        );
        return new MaxFrequency(this.en, negate, nArg, comparison);
      // input, number, comparison type
      case "count":
        [arg, arg2, comparison] = getINCArg(
          condition.arg,
          condition.arg2,
          condition.comparison,
        );
        return new Count(this.en, negate, arg, arg2, comparison);
      case "subseqCount":
        [arg, arg2, comparison] = getINCArg(
          condition.arg,
          condition.arg2,
          condition.comparison,
        );
        return new SubseqCount(this.en, negate, arg, arg2, comparison);
      case "countOverlap":
        [arg, arg2, comparison] = getINCArg(
          condition.arg,
          condition.arg2,
          condition.comparison,
        );
        return new CountOverlap(this.en, negate, arg, arg2, comparison);
      default:
        throw new Error("Unrecognised Condition");
    }
  };
}
