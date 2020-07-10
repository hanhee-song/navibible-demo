import { Reference } from './reference';

export class ReferenceRange {
  public fromReference: Reference;
  public toReference: Reference;

  constructor();
  constructor(fromReference: Reference, toReference: Reference);
  constructor(fromReference?: Reference, toReference?: Reference) {
    this.fromReference = fromReference;
    this.toReference = toReference;
  }

  /**
   * Merges overlapping reference ranges into one reference range
   * This is some leetcode hard material
   * runtime: nlog(n)
   */
  public static merge(refRanges: ReferenceRange[]): ReferenceRange[] {
    const res: ReferenceRange[] = [];
    const sortedRefRanges = ReferenceRange.sort(refRanges);
    let currentLower: Reference;
    let currentUpper: Reference;
    for (let i = 0; i < sortedRefRanges.length; i++) {
      const refRange = sortedRefRanges[i];
      if (!currentLower && !currentUpper) {
        currentLower = refRange.fromReference;
        currentUpper = refRange.toReference;
      } else {
        if (refRange.fromReference.index <= currentUpper.index + 1) {
          currentUpper = currentUpper.index > refRange.toReference.index ? currentUpper : refRange.toReference;
        } else {
          res.push(new ReferenceRange(currentLower, currentUpper));
          currentLower = refRange.fromReference;
          currentUpper = refRange.toReference;
        }
      }
      if (i === sortedRefRanges.length - 1 && currentLower) {
        res.push(new ReferenceRange(currentLower, currentUpper));
      }
    }
    return res;
  }

  // /**
  //  * Makes a map of all the reference ranges where the book is the same. WARNING: Excludes all two-book ranges!
  //  */
  // public static groupSingleBookRangesByBook(refRanges: ReferenceRange[]): { [book: string]: ReferenceRange[] } {
  //   const bookMap: { [book: string]: ReferenceRange[] } = {};
  //   refRanges
  //     .filter(refRange => refRange.isOneBook())
  //     .forEach(refRange => {
  //       !bookMap[refRange.fromReference.book]
  //         ? bookMap[refRange.fromReference.book] = [refRange]
  //         : bookMap[refRange.fromReference.book].push(refRange);
  //     });
  //   return bookMap;
  // }
  
  /**
   * Stringifies an array of reference ranges, merging and sorting as needed
   * [(Joshua 2-3), (Joshua 9-10), (Joshua 4-5), (Judges 9-10), (Deut 3-Judges 1)] => (Deuteronomy 3-Judges 1, 9-10)
   */
  public static toString(refRanges: ReferenceRange[]): string {
    const sortedRefRanges = ReferenceRange.sort(ReferenceRange.merge(refRanges));
    const str: string[] = [];
    sortedRefRanges.forEach((refRange, i) => {
      const prev = sortedRefRanges[i - 1];
      const prevBook = prev && prev.toReference.book;
      str.push(refRange.toString(prevBook === refRange.fromReference.book));
    });
    return str.join(', ');
  }
  
  public static sort(refRanges: ReferenceRange[]): ReferenceRange[] {
    return refRanges.sort((range1, range2) => range1.fromReference.compareTo(range2.fromReference));
  }

  public isOneBook() {
    return this.fromReference.isSameBook(this.toReference);
  }

  public toString(noBook?: boolean): string {
    // genesis 1:1-exodus 40:end -> genesis 1-exodus 40
    if (!this.fromReference.isSameBook(this.toReference)) {
      return this.fromReference.toString(true) + '-' + this.toReference.toString(false);
    }

    // genesis 1:1-genesis 1:1 -> genesis 1:1
    if (this.fromReference.isSameVerse(this.toReference)) {
      return (noBook ? this.fromReference.toChapterVerseString() : this.fromReference.toString());
    }

    // genesis 1:1-genesis 1:4 -> genesis 1:1-4
    // genesis 1:1-genesis 1:end -> genesis 1
    if (this.fromReference.isSameChapter(this.toReference)) {
      // const hideToVerse = !this.fromReference.isSameVerse(this.toReference) && !this.toReference.isLastVerse ? false : undefined
      const hideVerses = this.fromReference.verse === 1 && this.toReference.isLastVerse ? true : undefined;
      return (noBook ? this.fromReference.toChapterVerseString(hideVerses) : this.fromReference.toString(hideVerses))
        + (hideVerses ? '' : '-:' + (this.toReference.isLastVerse ? '' : this.toReference.verse));
    }

    // genesis 1:1-genesis 2:4 -> genesis 1-genesis 2:4
    // genesis 1:1-genesis 2:end -> genesis 1-2
    return (noBook ? this.fromReference.toChapterVerseString(true) : this.fromReference.toString(true))
      + '-' + this.toReference.toChapterVerseString(false);
  }

}