import { flatten } from 'lodash';
import { ReferenceRange } from './reference-range';

export class MultiRange implements MultiRange {
  public referenceRanges: ReferenceRange[] = [];

  constructor();
  constructor(refRange?: ReferenceRange);
  constructor(refRanges?: ReferenceRange[]);
  constructor(arg1?: ReferenceRange | ReferenceRange[]) {
    if (Array.isArray(arg1)) {
      this.referenceRanges = arg1;
    } else if (arg1) {
      this.referenceRanges = [arg1];
    }
  }
  
  public getText(): string {
    return '';
  }

  public isEmpty(): boolean {
    return this.referenceRanges.length === 0;
  }

  public static merge(multiRanges: MultiRange[]): MultiRange {
    return new MultiRange(flatten(multiRanges.map(multi => multi.referenceRanges)));
  }

  public toString(): string {
    if (this.referenceRanges.length === 1) {
      return this.referenceRanges[0].toString();
    } else if (this.referenceRanges.length === 0) {
      return '';
    } else {
      return ReferenceRange.toString(this.referenceRanges);
    }
  }
  
  public add(refRange: ReferenceRange): void {
    this.referenceRanges.push(refRange);
  }
}

export interface MultiRange {
  referenceRanges: ReferenceRange[];
}