import { Condition, EndsWith, StartsWith } from "./condition";
import { EnumResult } from "./enResult";
import { Util } from "./util";

type _EnumResult = Pick<
  EnumResult,
  "value" | "description" | "detail" | "isApproximation"
>;

export abstract class EnumMethod {
  input: number[];
  conditions: Condition[];
  length: number;
  constructor(input: number[], conditions: Condition[], length: number) {
    input.sort((a, b) => a - b);
    this.input = input;
    this.conditions = conditions;
    this.length = length;
  }
  protected evaluate(test: number[]): boolean {
    for (const cond of this.conditions) {
      if (!cond.evaluate(test)) return false;
    }
    return true;
  }
  public abstract enumerate(): _EnumResult;
  public enValue(): number {
    return this.enumerate().value;
  }
}

/* Without Repetition Enumerators */

// brute force permutations with less overhead when the permutation is on the full input
export class AllPermutations extends EnumMethod {
  public enumerate(): _EnumResult {
    let [res, total] = [0, 0];
    const _input = [...this.input];
    do {
      total++;
      if (this.evaluate(_input)) res++;
    } while (Util.nextPermutation(_input));
    return {
      value: res,
      description: "via brute force evaluation",
      detail: `of ${total} checked permutations, ${res} satisfied the conditions (${(
        (100 * res) /
        total
      ).toPrecision(4)}%)`,
      isApproximation: false,
    };
  }
}

// default for permutations
export class Permutations extends EnumMethod {
  public enumerate(): _EnumResult {
    const [res, total] = this.enumerate_helper(this.input, []);
    return {
      value: res,
      description: "via brute force evaluation",
      detail: `of ${total} checked permutations, ${res} satisfied the conditions (${(
        (100 * res) /
        total
      ).toPrecision(4)}%)`,
      isApproximation: false,
    };
  }

  private enumerate_helper(from: number[], on: number[]): [number, number] {
    // base case: the permutation is generated
    if (on.length === this.length) return [this.evaluate(on) ? 1 : 0, 1];
    // recursive: choose a value to add (avoiding duplicates by not recursing on
    //            any seen sets)
    let [res, total] = [0, 0];
    const used = new Set<number>();
    for (let i = 0; i < from.length; i++) {
      const selected = from[i];
      if (used.has(selected)) continue;
      used.add(selected);
      const nextFrom = from.filter((_, _i) => _i !== i);
      const nextOn = on.concat([selected]);
      const [recRes, recTotal] = this.enumerate_helper(nextFrom, nextOn);
      res += recRes;
      total += recTotal;
    }
    return [res, total];
  }
}

// trivial cases: length > input.length, length = 0, input = []
export class Trivial extends EnumMethod {
  public enumerate(): _EnumResult {
    if (this.length !== 0) {
      return {
        value: 0,
        description: "trivial case",
        detail: "length exceeds length of input",
        isApproximation: false,
      };
    } else {
      return {
        value: this.evaluate([]) ? 1 : 0,
        description: "trivial case",
        detail: "input is empty",
        isApproximation: false,
      };
    }
  }
}

// full length permutations with no conditions
export class DirectPermutations extends EnumMethod {
  public enumerate(): _EnumResult {
    const multiSet = new Map<number, number>();
    this.input.forEach((e) => {
      multiSet.set(e, (multiSet.get(e) || 0) + 1);
    });
    const multiSetPairs = Array.from(multiSet.entries())
      .filter((e) => e[1] > 1)
      .sort((a, b) => a[1] - b[1]);

    const totalPerms = Util.factorial(this.input.length);
    const reduceDuplicates = multiSetPairs.reduce(
      (a, b) => a * Util.factorial(b[1]),
      1
    );
    let description = `via direct calculation: ${this.length}!`;
    if (multiSetPairs.length) {
      description += ` divided by ${multiSetPairs.reduce(
        (a, b) => a + b[1].toString() + "!",
        ""
      )}`;
    }
    let detail = `input of length ${this.input.length}`;
    if (multiSetPairs.length) {
      detail +=
        " with repeats " +
        multiSetPairs.reduce(
          (a, b) => a + ` '${Util.permElementToString(b[0])}' (${b[1]} times)`,
          ""
        );
    } else {
      detail += " with no repeats";
    }
    return {
      value: Util.roundDivision(totalPerms, reduceDuplicates),
      description,
      detail,
      isApproximation: false,
    };
  }
}

// non-multiset permutations with no conditions
export class DirUnqPermutations extends EnumMethod {
  public enumerate(): _EnumResult {
    return {
      value: Util.nPr(this.input.length, this.length),
      description: `via direct calculation: ${this.length} values permuted from ${this.input.length} unique elements`,
      detail: `there are ${this.input.length} distinct values, so we permute ${this.length} of them`,
      isApproximation: false,
    };
  }
}

// non-multiset combinations with no conditions
export class DirUnqCombinations extends EnumMethod {
  public enumerate(): _EnumResult {
    return {
      value: Util.nCr(this.input.length, this.length),
      description: `via direct calculation: ${this.length} values chosen from ${this.input.length} unique elements`,
      detail: `there are ${this.input.length} distinct values, so we choose ${this.length} of them`,
      isApproximation: false,
    };
  }
}

// default for combinations
export class Combinations extends EnumMethod {
  public enumerate(): _EnumResult {
    const [res, total] = this.enumerate_helper(this.input, []);
    return {
      value: res,
      description: "via brute force evaluation",
      detail: `of ${total} checked combinations, ${res} satisfied the conditions (${(
        (100 * res) /
        total
      ).toPrecision(4)}%)`,
      isApproximation: false,
    };
  }

  // essentially we generate all sorted permutations
  // does not recurse once a permutation becomes unsorted, but there are some sorted permutation
  // prefixes that cannot lead to a sorted permutation so this will consider more than nCk combinations
  private enumerate_helper(from: number[], on: number[]): [number, number] {
    // base case: the combination is generated
    if (on.length === this.length) return [this.evaluate(on) ? 1 : 0, 1];
    // recursive: choose a larger value to add
    let [res, total] = [0, 0];
    const used = new Set<number>();
    for (let i = 0; i < from.length; i++) {
      const selected = from[i];
      if (used.has(selected)) continue;
      if (on.length && selected < on[on.length - 1]) continue;
      used.add(selected);
      const nextFrom = from.filter((_, _i) => _i !== i);
      const nextOn = on.concat([selected]);
      const [recRes, recTotal] = this.enumerate_helper(nextFrom, nextOn);
      res += recRes;
      total += recTotal;
    }
    return [res, total];
  }
}

// reduces an all Contains perm to a Direct one
export class ContainsPermutations extends EnumMethod {
  enumerate(): _EnumResult {
    throw new Error("Method not implemented.");
  }
}

export class DerangementPermutations extends EnumMethod {
  public enumerate(): _EnumResult {
    const count = Array(this.input.length + 1).fill(0);
    [count[0], count[1]] = [1, 0];
    for (let i = 2; i <= this.input.length; i++)
      count[i] = (i - 1) * (count[i - 1] + count[i - 2]);
    return {
      value: count[this.input.length],
      description: "via direct calculation",
      detail: "using the recurrence for derangements",
      isApproximation: false,
    };
  }
}

// reduces a starts/ends with permutation to a smaller permutation
export class StartEndPermutations extends EnumMethod {
  public enumerate(): _EnumResult {
    let prefix: number[] = [];
    let suffix: number[] = [];

    for (const c of this.conditions) {
      if (c instanceof StartsWith && c.arg.length > prefix.length)
        prefix = c.arg;
      if (c instanceof EndsWith && c.arg.length > suffix.length) suffix = c.arg;
    }

    for (const c of this.conditions) {
      if (
        (c instanceof StartsWith && !Util.isPrefix(c.arg, prefix)) ||
        (c instanceof EndsWith && !Util.isSuffix(c.arg, suffix))
      )
        return {
          value: 0,
          description: "via direct calculation",
          detail: "the starts with or ends with conditions are contradictory",
          isApproximation: false,
        };
    }

    // TODO:
    // case 1: start and end define the permutation (start + end )

    return {
      value: 0,
      description: "",
      detail: "",
      isApproximation: false,
    };
  }
}

/* With Repetition Enumerators */
export class PermutationsRp extends EnumMethod {
  public enumerate(): _EnumResult {
    // we can ignore repetitions from the input
    const uniqueInput = Util.removeDuplicates(this.input);
    const [res, total] = this.enumerate_helper(uniqueInput, []);
    return {
      value: res,
      description: "via brute force evaluation",
      detail: `of ${total} checked permutations, ${res} satisfied the conditions (${(
        (100 * res) /
        total
      ).toPrecision(4)}%)`,
      isApproximation: false,
    };
  }

  private enumerate_helper(from: number[], on: number[]): [number, number] {
    // base case: the permutation is generated
    if (on.length === this.length) return [this.evaluate(on) ? 1 : 0, 1];
    // recursive: choose a value to add
    let [res, total] = [0, 0];
    for (let i = 0; i < from.length; i++) {
      const selected = from[i];
      const nextOn = on.concat([selected]);
      const [recRes, recTotal] = this.enumerate_helper(from, nextOn);
      res += recRes;
      total += recTotal;
    }
    return [res, total];
  }
}

export class DirectPermutationsRp extends EnumMethod {
  public enumerate(): _EnumResult {
    const uniqueInput = Util.removeDuplicates(this.input);
    const res = Math.pow(uniqueInput.length, this.length);
    return {
      value: res,
      description: `via direct calculation: ${uniqueInput.length} to the power of ${this.length}`,
      detail: `for each of the ${this.length} elements, we can choose from ${uniqueInput.length} unique values`,
      isApproximation: false,
    };
  }
}

export class CombinationsRp extends EnumMethod {
  public enumerate(): _EnumResult {
    const uniqueInput = Util.removeDuplicates(this.input);
    const [res, total] = this.enumerate_helper(uniqueInput, []);
    return {
      value: res,
      description: "via brute force evaluation",
      detail: `of ${total} checked combinations, ${res} satisfied the conditions (${(
        (100 * res) /
        total
      ).toPrecision(4)}%)`,
      isApproximation: false,
    };
  }

  // essentially just the permutation algorithm but we force the result to be sorted
  private enumerate_helper(from: number[], on: number[]): [number, number] {
    // base case: the combination is generated
    if (on.length === this.length) return [this.evaluate(on) ? 1 : 0, 1];
    // recursive: choose a value to add, must be not less than the previous value
    let [res, total] = [0, 0];
    for (let i = 0; i < from.length; i++) {
      const selected = from[i];
      if (on.length && selected < on[on.length - 1]) continue;
      const nextOn = on.concat([selected]);
      const [recRes, recTotal] = this.enumerate_helper(from, nextOn);
      res += recRes;
      total += recTotal;
    }
    return [res, total];
  }
}

export class DirectCombinationsRp extends EnumMethod {
  public enumerate(): _EnumResult {
    const uniqueInput = Util.removeDuplicates(this.input);
    const res = Util.nCr(uniqueInput.length + this.length - 1, this.length);
    return {
      value: res,
      description: `via direct calculation: choice of ${this.length} from ${
        this.length
      } + ${uniqueInput.length - 1}`,
      detail: `consider ${this.length} stars and ${
        uniqueInput.length - 1
      } bars, where the bars separate the ${
        uniqueInput.length
      } unique elements and the stars represent the amount of each element we choose`,
      isApproximation: false,
    };
  }
}

abstract class PrEnumMethod extends EnumMethod {
  static readonly PROB_RUNS: number = 1 << 21;
  static readonly PROB_ACCEPTABLE: number = 24;
  static readonly PROB_WARNING: string =
    "this result was determined probabilistically as the input was too large, so it may be inaccurate: ";
}

/* Probabilistic Enumerators */
// todo: these need to be tested more
// approximates the number of permutations using probabilities
// the two no-repeat methods are very wasteful, but it seems there isnt a good
// way around it. they dont work well for inputs which are very long
export class PrPermutations extends PrEnumMethod {
  enumerate(): _EnumResult {
    // are the distributions the same? they seem to be, empirically, but...
    const noDupInput = Util.removeDuplicates(this.input);
    let [passed, valid] = [0, 0];
    for (let i = 0; i < PrEnumMethod.PROB_RUNS; i++) {
      const g = Util.randPermRp(noDupInput, this.length);
      if (Util.subMultiset(g, this.input)) {
        valid++;
        if (this.evaluate(g)) passed++;
      }
    }
    if (valid < PrEnumMethod.PROB_ACCEPTABLE)
      return {
        value: NaN,
        description: "the input was too large",
        detail:
          "attempted to approximate but the input was too large to run in time, sorry :< - you can get an upper bound for the value by allowing repeats, as the generator for that option is much more efficient",
        isApproximation: false,
      };
    const rate = passed / valid;
    const total =
      (valid / PrEnumMethod.PROB_RUNS) *
      Math.pow(noDupInput.length, this.length);
    const expect = Math.round(rate * total);
    return {
      value: expect,
      description: "via approximation",
      detail: `${PrEnumMethod.PROB_WARNING}of approximately ${Math.round(
        total
      )} permutations, ${(100 * rate).toPrecision(
        4
      )}% are expected to satisfy the conditions`,
      isApproximation: true,
    };
  }
}

export class PrPermutationsRp extends PrEnumMethod {
  enumerate(): _EnumResult {
    const noDupInput = Util.removeDuplicates(this.input);
    let passed = 0;
    for (let i = 0; i < PrEnumMethod.PROB_RUNS; i++) {
      const g = Util.randPermRp(noDupInput, this.length);
      if (this.evaluate(g)) passed++;
    }
    const rate = passed / PrEnumMethod.PROB_RUNS;
    const total = new DirectPermutationsRp(
      this.input,
      [],
      this.length
    ).enValue();
    const expect = Math.round(rate * total);

    return {
      value: expect,
      description: "via approximation",
      detail: `${PrEnumMethod.PROB_WARNING}of ${total} permutations, ${(
        rate * 100
      ).toPrecision(4)}% are expected to satisfy the conditions`,
      isApproximation: true,
    };
  }
}

export class PrCombinations extends PrEnumMethod {
  enumerate(): _EnumResult {
    const noDupInput = Util.removeDuplicates(this.input);
    let [passed, valid] = [0, 0];
    for (let i = 0; i < PrEnumMethod.PROB_RUNS; i++) {
      const g = Util.randChoiceRp(noDupInput, this.length);
      if (Util.subMultiset(g, this.input)) {
        valid++;
        if (this.evaluate(g)) passed++;
      }
    }
    if (valid < PrEnumMethod.PROB_ACCEPTABLE)
      return {
        value: NaN,
        description: "the input was too large",
        detail:
          "attempted to approximate but the input was too large to run in time, sorry :< - you can get an upper bound for the value by allowing repetitions as the generator for that option is much more efficient",
        isApproximation: false,
      };
    const rate = passed / valid;
    const total =
      (valid / PrEnumMethod.PROB_RUNS) *
      Util.nCr(noDupInput.length + this.length - 1, this.length);
    const expect = Math.round(rate * total);
    return {
      value: expect,
      description: "via approximation",
      detail: `${PrEnumMethod.PROB_WARNING}of approximately ${Math.round(
        total
      )} combinations, ${(100 * rate).toPrecision(
        4
      )}% are expected to satisfy the conditions`,
      isApproximation: true,
    };
  }
}

export class PrCombinationsRp extends PrEnumMethod {
  enumerate(): _EnumResult {
    const noDupInput = Util.removeDuplicates(this.input);
    let passed = 0;
    for (let i = 0; i < PrEnumMethod.PROB_RUNS; i++) {
      const g = Util.randChoiceRp(noDupInput, this.length);
      if (this.evaluate(g)) passed++;
    }
    const rate = passed / PrEnumMethod.PROB_RUNS;
    const total = new DirectCombinationsRp(
      this.input,
      [],
      this.length
    ).enValue();
    const expect = Math.round(rate * total);

    return {
      value: expect,
      description: "via approximation using probability",
      detail: `${PrEnumMethod.PROB_WARNING}of ${total} combinations, ${(
        rate * 100
      ).toPrecision(4)}% are expected to satisfy the conditions`,
      isApproximation: true,
    };
  }
}
