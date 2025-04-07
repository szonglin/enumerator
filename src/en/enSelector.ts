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
  DerangementPermutations,
  SumCombinations,
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
  public setInput(to: number[]) {
    this.input = to;
  }
  public setConditions(to: Condition[]) {
    this.conditions = to;
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

  static readonly MAX_COMPLEXITY = 1 << 28;

  private upperBound = (): number => {
    if (this.repeats && this.enumerationType === "permutation")
      return new DirectPermutationsRp(
        Util.removeDuplicates(this.input),
        [],
        this.length
      ).enValue();
    if (this.repeats && this.enumerationType === "combination")
      // using permutations because the recursion is O(n!)
      return new DirectPermutationsRp(
        Util.removeDuplicates(this.input),
        [],
        this.length
      ).enValue();
    if (!this.repeats && this.enumerationType === "permutation")
      return Math.min(
        new DirectPermutations(this.input, [], this.length).enValue(),
        Util.nPr(this.input.length, this.length)
      );
    if (!this.repeats && this.enumerationType === "combination")
      // this condition is relatively lax compared to the others
      return Util.nCr(this.input.length, this.input.length >> 1);
    throw new Error("Unexpected error");
  };

  private estimate = (): number => {
    console.log(
      "estimator says:",
      this.upperBound() *
        this.conditions.reduce((a, b) => a + b.estimateScale(), 1)
    );
    return (
      this.upperBound() *
      this.conditions.reduce((a, b) => a + b.estimateScale(), 1)
    );
  };

  // options in order of [direct] [reduce] [brute force]
  // last element of brute force must have accepts always true

  private handleNoRepeatPerms = (): EnumMethod => {
    /* fast cases */
    // permutations with no conditions can be calculated directly
    const directOptions = [
      new DirectPermutations(this.input, this.conditions, this.length),
      new DirUnqPermutations(this.input, this.conditions, this.length),
      new DerangementPermutations(this.input, this.conditions, this.length),
    ];
    for (const method of directOptions) if (method.accepts()) return method;

    /* check fall back to probabilistic */
    if (this.estimate() > EnSelector.MAX_COMPLEXITY)
      return new PrPermutations(this.input, this.conditions, this.length);

    /* brute force methods */
    const bfOptions = [
      new AllPermutations(this.input, this.conditions, this.length),
      new Permutations(this.input, this.conditions, this.length),
    ];
    for (const method of bfOptions) if (method.accepts()) return method;

    throw new Error("Failed to find an iterator");
  };

  private handleRepeatPerms = (): EnumMethod => {
    /* fast cases */
    const directOptions = [
      new DirectPermutationsRp(this.input, this.conditions, this.length),
    ];
    for (const method of directOptions) if (method.accepts()) return method;

    /* check fall back to probabilistic */
    if (this.estimate() > EnSelector.MAX_COMPLEXITY)
      return new PrPermutationsRp(this.input, this.conditions, this.length);

    /* brute force methods */
    const bfOptions = [
      new PermutationsRp(this.input, this.conditions, this.length),
    ];
    for (const method of bfOptions) if (method.accepts()) return method;

    throw new Error("Failed to find an iterator");
  };

  private handleNoRepeatCombs = (): EnumMethod => {
    /* fast cases */
    const directOptions = [
      new DirUnqCombinations(this.input, this.conditions, this.length),
      new SumCombinations(this.input, this.conditions, this.length),
    ];
    for (const method of directOptions) if (method.accepts()) return method;

    /* check fall back to probabilistic */
    if (this.estimate() > EnSelector.MAX_COMPLEXITY)
      return new PrCombinations(this.input, this.conditions, this.length);

    /* brute force methods */
    const bfOptions = [
      new Combinations(this.input, this.conditions, this.length),
    ];
    for (const method of bfOptions) if (method.accepts()) return method;

    throw new Error("Failed to find an iterator");
  };

  private handleRepeatCombs = (): EnumMethod => {
    /* fast cases */
    const directOptions = [
      new DirectCombinationsRp(this.input, this.conditions, this.length),
    ];
    for (const method of directOptions) if (method.accepts()) return method;

    /* check fall back to probabilistic */
    if (this.estimate() > EnSelector.MAX_COMPLEXITY)
      return new PrCombinationsRp(this.input, this.conditions, this.length);

    /* brute force methods */
    const bfOptions = [
      new CombinationsRp(this.input, this.conditions, this.length),
    ];
    for (const method of bfOptions) if (method.accepts()) return method;

    throw new Error("failed to find an iterator");
  };

  public select = (): EnumMethod => {
    this.testlog();
    this.estimate();
    // trivial permutations
    if (
      this.length === 0 ||
      (this.length > this.input.length && !this.repeats) ||
      this.input.length === 0
    )
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
