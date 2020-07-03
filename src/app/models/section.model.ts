import { MultiRange } from './multi-range.model';
import { ReferenceRange } from './reference-range';
import { BibleDataService } from './../services/bible/bible-data.service';
import { flatten } from 'lodash';

export class Section implements SectionInterface {
  public static bibleDataService: BibleDataService;

  public title: string;
  public description: string;
  public multiRanges: MultiRange[];
  public isExpanded: boolean = false;
  public sections: Section[] = [];
  public isNew: boolean = false;

  constructor(title: string, multiRanges: MultiRange[]) {
    this.title = title;
    this.multiRanges = multiRanges;
  }

  /**
   * utility method to toggle expanded mode. 
   * @param isExpanded if true, expands only top level. If false, collapses all children
   */
  public toggleExpand(isExpanded: boolean): void {
    this.isExpanded = isExpanded;
    if (!this.isExpanded && this.sections) {
      this.sections.forEach(section => {
        section.toggleExpand(isExpanded);
      });
    }
  }

  public getText(): { [ref: string]: string } {
    return {};
    // return Section.bibleDataService.getBible().getVersesByReferenceRange(this.referenceRange);
  }

  public flashNew() {
    this.isNew = true;
    setTimeout(() => {
      this.isNew = false;
    }, 1000);
  }

  public multiRangeString(): string {
    if (!this.multiRanges.length) {
      return '---';
    }
    if (this.multiRanges.length === 1 && !this.multiRanges[0].isEmpty()) {
      return this.multiRanges[0].toString();
    } else {
      const multiRanges = this.getAllChildMultiRanges();
      const str = MultiRange.merge(multiRanges).toString();
      return this.sections.length && str ? `(${str})` : str;
    }
  }
  
  public getAllChildMultiRanges(): MultiRange[] {
    if (!this.sections.length || (this.multiRanges.length && this.multiRanges.some(multiRange => !multiRange.isEmpty()))) {
      return this.multiRanges;
    } else {
      return flatten(this.sections.map(section => section.getAllChildMultiRanges()));
    }
  }
}

export interface SectionInterface {
  title?: string;
  description?: string;
  multiRanges?: MultiRange[];
  isExpanded?: boolean;
  sections?: Section[];
}