import { Condition } from "./condition";
import {
  AllCombinations,
  AllPermutations,
  DirectPermutations,
  EnumMethod,
  Trivial,
} from "./enMethod";
import { enumerationType } from "./util";

export class EnSelector {
  private input: number[];
  private enumerationType: enumerationType;
  private length: number;
  private conditions: Condition[];
  constructor(
    input: number[],
    enumerationType: enumerationType,
    length: number,
    conditions: Condition[]
  ) {
    this.input = input;
    this.length = length;
    this.conditions = conditions;
    this.enumerationType = enumerationType;
  }
  private testlog(): void {
    console.log("select");
    console.log(
      "input length",
      this.input.length,
      "length",
      this.length,
      "etype",
      this.enumerationType,
      "conditions",
      this.conditions.length
    );
  }
  public select = (): EnumMethod => {
    this.testlog();
    if (this.length === 0 || this.length > this.input.length) {
      return new Trivial(this.input, this.conditions, this.length);
    } else if (this.enumerationType === "permutation") {
      if (this.input.length === this.length && !this.conditions.length)
        return new DirectPermutations(this.input, this.conditions, this.length);
      // fallback to all perms - if the number of perms exceeds 10^9, give probabilistic answer
      return new AllPermutations(this.input, this.conditions, this.length);
    } else {
      // fallback to all combs - if the number of combs exceeds 10^9, give probabilistic answer
      return new AllCombinations(this.input, this.conditions, this.length);
    }
    throw new Error("Unexpected error");
  };
}
