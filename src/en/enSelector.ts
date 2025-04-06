import { Condition } from "./condition";
import {
  Combinations,
  AllPermutations,
  DirectPermutations,
  EnumMethod,
  Permutations,
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
    // trivial permutations
    if (this.length === 0 || this.length > this.input.length) {
      return new Trivial(this.input, this.conditions, this.length);
    } else if (this.enumerationType === "permutation") {
      // permutations with no conditions can be calculated directly
      if (this.input.length === this.length && !this.conditions.length)
        return new DirectPermutations(this.input, this.conditions, this.length);
      // if input length is equal to length, use AllPermutations with less overhead
      if (this.input.length === this.length)
        return new AllPermutations(this.input, this.conditions, this.length);
      // fallback to default perms generator
      return new Permutations(this.input, this.conditions, this.length);
      // if the number of perms exceeds 10^9, give probabilistic answer
    } else {
      // if the number of combs exceeds 10^9, give probabilistic answer
      return new Combinations(this.input, this.conditions, this.length);
    }
  };
}
