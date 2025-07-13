export function findLongestIncreasingSubstrings(name: string): {
  substrings: string[];
  startIndices: number[];
  endIndices: number[];
} {
  const lowerName = name.toLowerCase();
  const substrings: string[] = [];
  const startIndices: number[] = [];
  const endIndices: number[] = [];

  for (let i = 0; i < lowerName.length; i++) {
    let currentSubstring = "";
    for (let j = i; j < lowerName.length; j++) {
      const currentChar = lowerName[j];
      if (currentSubstring === "") {
        currentSubstring = currentChar;
      } else {
        const lastChar = currentSubstring[currentSubstring.length - 1];
        if (currentChar > lastChar) {
          currentSubstring += currentChar;
        } else {
          break;
        }
      }
    }
    substrings.push(currentSubstring);
    startIndices.push(i);
    endIndices.push(i + currentSubstring.length - 1);
  }

  const maxLength = Math.max(...substrings.map((s) => s.length));
  const maxSubstrings = substrings.filter((s) => s.length === maxLength);
  const maxStartIdx = startIndices.filter(
    (_, i) => substrings[i].length === maxLength
  );
  const maxEndIdx = endIndices.filter(
    (_, i) => substrings[i].length === maxLength
  );

  return {
    substrings: maxSubstrings,
    startIndices: maxStartIdx,
    endIndices: maxEndIdx,
  };
}
