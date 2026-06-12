export const arrayUnique = <T>(arr: T[] | undefined): T[] => [...new Set(arr)];
export const strArrArrUnique = (arr: string[][]) => [...new Set(arr.map((e) => e.join(';')))].map((e) => e.split(';'));

export const arrayIntersect = <T>(arr1: T[], arr2: T[]): T[] => arr1.filter((e) => arr2.includes(e));
