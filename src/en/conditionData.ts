export const conditionData = [
  {
    condition: "subarray",
    description:
      "contains the argument as adjacent values, eg. 'sparkler' contains 'park'",
  },
  {
    condition: "subsequence",
    description:
      "contains the argument as a subsequence, eg. 'category' contains 'coy'",
  },
  {
    condition: "count",
    description:
      "number of appearances of the first argument (as a subarray) compared with the second with only distinct (non-overlapping)" +
      " terms counted, eg. 'banana' has 1 copy of 'ana'",
  },
  {
    condition: "contains",
    description:
      "contains the elements of the argument in any order, in the sense that the set of elements is a super(multi)set of the argument, eg. 'trace' contains 'art'",
  },
  {
    condition: "excludes",
    description:
      "does not contain any of the elements of the argument in any order, eg. 'warm' excludes 'hot'",
  },
  {
    condition: "startsWith",
    description: "begins with the argument, eg. 'teacher' starts with 'tea'",
  },
  {
    condition: "endsWith",
    description: "ends with the argument, eg. 'yellow' ends with 'low'",
  },
  {
    condition: "increasing",
    description:
      "values are in increasing order, strictly increasing requires each value to be strictly greater than the previous",
  },
  {
    condition: "decreasing",
    description:
      "values are in decreasing order, strictly decreasing requires each value to be strictly less than the previous",
  },
  {
    condition: "palindrome",
    description: "is the same as its reverse, eg. 'radar'",
  },
  {
    condition: "distinct",
    description: "has all elements distinct, eg. 'copyright'",
  },
  {
    condition: "countDistinct",
    description:
      "number of distinct elements compared with the argument, eg '1, 2, 2, 3' = '3'",
  },
  {
    condition: "derangement",
    description:
      "no value is in the same place as it was originally, eg. 'idea' is a derangement of 'aide'",
  },
  {
    condition: "sum",
    description:
      "sum of elements compared with the argument, eg. '1, 2, 3' = '6'",
  },
  {
    condition: "maximum",
    description:
      "largest element compared with the argument, eg. '1, 2, 3' < '4' or 'fazed' = 'z'",
  },
  {
    condition: "minimum",
    description:
      "smallest element compared with the argument, eg. '1, 2, 3' > '0' or 'glass' = 'a'",
  },
  {
    condition: "minFrequency",
    description:
      "lowest frequency of any element compared with the argument, eg. 'breeze' = '1'",
  },
  {
    condition: "maxFrequency",
    description:
      "highest frequency of any element compared with the argument, eg. 'breeze' = '3'",
  },
  {
    condition: "average",
    description:
      "average of elements compared with the argument, eg. '1, 2, 3' = '2'",
  },
  {
    condition: "median",
    description:
      "median of elements compared with the argument, eg. '1, 2, 3, 4' = '2.5'",
  },
  {
    condition: "countOverlap",
    description:
      "number of appearances of the first argument (as a subarray) compared with the second, including overlapping" +
      " terms, eg. 'banana' has 2 copies of 'ana'",
  },
  {
    condition: "subseqCount",
    description:
      "number of appearances of the first argument (as a subsequence) compared with the second, eg. 'banana' has 4" +
      " subsequences of 'ana'",
  },
];
