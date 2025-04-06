import { Condition } from "./condition";
import {
  Combinations,
  AllPermutations,
  DirectPermutations,
  EnumMethod,
  Permutations,
  Trivial,
  CombinationsRp,
  DirectPermutationsRp,
  PermutationsRp,
  DirectCombinationsRp,
  DirUnqPermutations,
  DirUnqCombinations,
} from "./enMethod";
import { enumerationType } from "./util";

export class EnSelector {
  private input: number[];
  private enumerationType: enumerationType;
  private length: number;
  private conditions: Condition[];
  private repeats: boolean;
  constructor(
    input: number[],
    enumerationType: enumerationType,
    length: number,
    conditions: Condition[],
    repeats: boolean
  ) {
    this.input = input;
    this.length = length;
    this.conditions = conditions;
    this.enumerationType = enumerationType;
    this.repeats = repeats;
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

  private isDistinct = (): boolean => {
    return new Set(this.input).size === this.input.length;
  };

  private noConds = (): boolean => {
    return this.conditions.length === 0;
  };

  private handleNoRepeatPerms = (): EnumMethod => {
    // permutations with no conditions can be calculated directly
    if (this.input.length === this.length && this.noConds())
      return new DirectPermutations(this.input, this.conditions, this.length);
    if (this.isDistinct() && !this.conditions.length)
      return new DirUnqPermutations(this.input, this.conditions, this.length);

    // if input length is equal to length, use AllPermutations with less overhead
    if (this.input.length === this.length)
      return new AllPermutations(this.input, this.conditions, this.length);
    // fallback to default perms generator
    return new Permutations(this.input, this.conditions, this.length);
    // if the number of perms exceeds 10^9, give probabilistic answer
  };

  private handleRepeatPerms = (): EnumMethod => {
    if (this.noConds())
      return new DirectPermutationsRp(this.input, this.conditions, this.length);
    return new PermutationsRp(this.input, this.conditions, this.length);
  };

  private handleNoRepeatCombs = (): EnumMethod => {
    if (this.isDistinct() && this.noConds())
      return new DirUnqCombinations(this.input, this.conditions, this.length);
    // if the number of combs exceeds 10^9, give probabilistic answer
    return new Combinations(this.input, this.conditions, this.length);
  };

  private handleRepeatCombs = (): EnumMethod => {
    if (this.conditions.length === 0)
      return new DirectCombinationsRp(this.input, this.conditions, this.length);
    return new CombinationsRp(this.input, this.conditions, this.length);
  };

  public select = (): EnumMethod => {
    this.testlog();
    // trivial permutations
    if (this.length === 0 || this.length > this.input.length)
      return new Trivial(this.input, this.conditions, this.length);
    if (this.repeats && this.enumerationType === "permutation")
      return this.handleRepeatPerms();
    if (this.repeats && this.enumerationType === "combination")
      return this.handleRepeatCombs();
    if (!this.repeats && this.enumerationType === "permutation")
      return this.handleNoRepeatPerms();
    if (!this.repeats && this.enumerationType === "combination")
      return this.handleNoRepeatCombs();
    throw new Error("Unexpected error");
  };
}
