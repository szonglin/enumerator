import { Condition } from "./condition";
import { EnumResult } from "./enResult";
import { Util } from "./util";

type _EnumResult = Pick<EnumResult, "value" | "description" | "detail">;

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
}

// default for full length permutations
export class AllPermutations extends EnumMethod {
  public enumerate(): _EnumResult {
    let total = 0;
    let res = 0;
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
    };
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
      };
    } else {
      return {
        value: this.evaluate([]) ? 1 : 0,
        description: "trivial case",
        detail: "input is empty",
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
    };
  }
}

// any length combinations with no conditions
// TODO: update to distinguish by value not index
// also im pretty sure this is not working...
export class AllCombinations extends EnumMethod {
  enumerate(): _EnumResult {
    let total = 0;
    let res = 0;
    const mask = Util.mask(this.input.length, this.length);
    do {
      total++;
      const selection = this.input.filter((_, i) => mask[i]);
      if (this.evaluate(selection)) res++;
    } while (Util.nextPermutation(mask));
    return {
      value: res,
      description: "via brute force evaluation",
      detail: `of ${total} checked combinations, ${res} satisfied the conditions (${(
        (100 * res) /
        total
      ).toPrecision(4)}%)`,
    };
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

// approximates the number of permutations using probabilities
// TODO:
export class ProbabilisticPermutations extends EnumMethod {
  enumerate(): _EnumResult {
    // throw new Error("Not implemented");
    const numTrials = 1000000;
    return {
      value: 0,
      description: "via approximation",
      detail:
        "this result was determined probabilistically as the input was too large, it may be inaccurate",
    };
  }
}
