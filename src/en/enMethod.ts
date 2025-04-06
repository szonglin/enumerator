import { Condition } from "./condition";
import { EnumResult } from "./enResult";
import { Util } from "./util";

type _EnumResult = Pick<
  EnumResult,
  "value" | "description" | "detail" | "isApproximation"
>;

export abstract class EnumMethod {
  static readonly PROB_RUNS = 1 << 21;
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
    // recursive: choose a value to add
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

// trivial cases: length > input, length = 0, input = []
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

// export class ContainsPermutations extends EnumMethod {
//   // reduces an all Contains perm to a Direct one
//   static applicable(conditions: Condition[]): boolean {
//     return conditions.every((e) => e instanceof Contains);
//   }
//   enumerate(): _EnumResult {
//     throw new Error("Method not implemented.");
//   }
// }

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

/* Probabilistic Enumerators */
// approximates the number of permutations using probabilities
// TODO:
export class PrPermutations extends EnumMethod {
  enumerate(): _EnumResult {
    return {
      value: 0,
      description: "via approximation",
      detail:
        "this result was determined probabilistically as the input was too large, it may be inaccurate",
      isApproximation: true,
    };
  }
}

export class PrPermutationsRp extends EnumMethod {
  enumerate(): _EnumResult {
    return {
      value: 0,
      description: "via approximation",
      detail:
        "this result was determined probabilistically as the input was too large, it may be inaccurate",
      isApproximation: true,
    };
  }
}

export class PrCombinations extends EnumMethod {
  enumerate(): _EnumResult {
    return {
      value: 0,
      description: "via approximation",
      detail:
        "this result was determined probabilistically as the input was too large, it may be inaccurate",
      isApproximation: true,
    };
  }
}

export class PrCombinationsRp extends EnumMethod {
  enumerate(): _EnumResult {
    return {
      value: 0,
      description: "via approximation",
      detail:
        "this result was determined probabilistically as the input was too large, it may be inaccurate",
      isApproximation: true,
    };
  }
}
