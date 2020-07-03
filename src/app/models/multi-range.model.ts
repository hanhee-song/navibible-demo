import { ReferenceRange } from './reference-range';
import { flatten } from 'lodash';

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
  
  public size(): number {
    return this.referenceRanges.length;
  }
}

export interface MultiRange {
  referenceRanges: ReferenceRange[];
}