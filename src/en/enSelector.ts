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
  PrPermutations,
  PrPermutationsRp,
  PrCombinations,
  PrCombinationsRp,
} from "./enMethod";
import { enumerationType, Util } from "./util";

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

  static readonly MAX_COMPLEXITY = 1 << 30;

  private isDistinct = (): boolean => {
    return new Set(this.input).size === this.input.length;
  };

  private upperBound = (): number => {
    if (this.repeats && this.enumerationType === "permutation")
      return new DirectPermutationsRp(this.input, [], this.length).enValue();
    if (this.repeats && this.enumerationType === "combination")
      return new DirectCombinationsRp(this.input, [], this.length).enValue();
    if (!this.repeats && this.enumerationType === "permutation")
      return Math.min(
        new DirectPermutations(this.input, [], this.length).enValue(),
        Util.nPr(this.input.length, this.length)
      );
    if (!this.repeats && this.enumerationType === "combination")
      return Util.nCr(this.input.length, this.length);
    throw new Error("Unexpected error");
  };

  private estimate = (): number => {
    return (
      this.upperBound() *
      this.conditions.reduce((a, b) => a + b.estimateScale(), 1)
    );
  };

  private noConds = (): boolean => {
    return this.conditions.length === 0;
  };

  private handleNoRepeatPerms = (): EnumMethod => {
    /* fast cases */
    // permutations with no conditions can be calculated directly
    if (this.input.length === this.length && this.noConds())
      return new DirectPermutations(this.input, this.conditions, this.length);
    if (this.isDistinct() && !this.conditions.length)
      return new DirUnqPermutations(this.input, this.conditions, this.length);

    /* brute force methods */
    if (this.estimate() > EnSelector.MAX_COMPLEXITY)
      return new PrPermutations(this.input, this.conditions, this.length);

    // if input length is equal to length, use AllPermutations with less overhead
    if (this.input.length === this.length)
      return new AllPermutations(this.input, this.conditions, this.length);
    // fallback to default perms generator
    return new Permutations(this.input, this.conditions, this.length);
  };

  private handleRepeatPerms = (): EnumMethod => {
    /* fast cases */
    if (this.noConds())
      return new DirectPermutationsRp(this.input, this.conditions, this.length);

    /* brute force methods */
    if (this.estimate() > EnSelector.MAX_COMPLEXITY)
      return new PrPermutationsRp(this.input, this.conditions, this.length);
    return new PermutationsRp(this.input, this.conditions, this.length);
  };

  private handleNoRepeatCombs = (): EnumMethod => {
    /* fast cases */
    if (this.isDistinct() && this.noConds())
      return new DirUnqCombinations(this.input, this.conditions, this.length);

    /* brute force methods */
    if (this.estimate() > EnSelector.MAX_COMPLEXITY)
      return new PrCombinations(this.input, this.conditions, this.length);
    return new Combinations(this.input, this.conditions, this.length);
  };

  private handleRepeatCombs = (): EnumMethod => {
    /* fast cases */
    if (this.conditions.length === 0)
      return new DirectCombinationsRp(this.input, this.conditions, this.length);

    /* brute force methods */
    if (this.estimate() > EnSelector.MAX_COMPLEXITY)
      return new PrCombinationsRp(this.input, this.conditions, this.length);
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
