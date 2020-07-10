import { flatten } from 'lodash';
import { BibleDataService } from './../services/bible/bible-data.service';
import { Book } from './book';
import { MultiRange } from './multi-range.model';
import { ReferenceInterface } from './reference';
import { ReferenceRange } from './reference-range';

export class Section implements SectionInterface {
  public static bibleDataService: BibleDataService;

  public title: string;
  public comment: string;
  public multiRanges: MultiRange[] = [];
  public isExpanded: boolean = false;
  public isTextExpanded: boolean = false;
  public isCommentExpanded: boolean = false;
  public sections: Section[] = [];
  public isNew: boolean = false;
  public uniqueId: number = Math.random();
  public isSelected: boolean;

  constructor(title: string, comment: string, multiRanges: MultiRange[]) {
    this.title = title;
    this.comment = comment;
    this.multiRanges = multiRanges || [];
  }

  /**
   * utility method to toggle expanded mode. 
   * @param isExpanded if true, expands only top level. If false, collapses all children
   */
  public toggleExpand(isExpanded: boolean): void {
    this.isExpanded = isExpanded;
    if (!this.isExpanded) {
      this.isTextExpanded = false;
      this.forAllDescendents(section => {
        section.isExpanded = false;
        section.isTextExpanded = false;
      });
    }
  }

  public getVersesText(limit?: number): { ref: string, text: string }[] {
    const refRanges = this.getAllChildRefRanges();
    let verses: { ref: ReferenceInterface, text: string }[] = flatten(refRanges.map(refRange => {
      if (limit <= 0) return [];
      const verses = Section.bibleDataService.getBible().getVersesByReferenceRange(refRange, limit);
      limit -= verses.length;
      return verses;
    }));
    return verses.map((verse, i) => {
      let ref = '';
      const prev = verses[i - 1];
      const next = verses[i + 1];
      
      if (i === 0 || prev.ref.book !== verse.ref.book || prev.ref.chapter !== verse.ref.chapter) {
        if (i === 0 || prev.ref.book !== verse.ref.book) ref += Book.abbreviate(verse.ref.book) + ' '
        ref += verse.ref.chapter + ':';
      }
      ref += verse.ref.verse;
      let text = verse.text;
      if (next && (verse.ref.index + 1 !== next.ref.index || next.ref.verse === 1)) text += '\n\n';
      return {
        ref,
        text: text,
      };
    });
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
  
  private getAllChildRefRanges(): ReferenceRange[] {
    const multiRange = MultiRange.merge(this.getAllChildMultiRanges());
    return ReferenceRange.sort(ReferenceRange.merge(multiRange.referenceRanges));
  }
  
  public forAllDescendents(fn: (section: Section) => void): void {
    fn(this);
    this.sections.forEach(section => section.forAllDescendents(fn));
  }
  
  public clearUnsavedFields() {
    delete this.isNew;
    delete this.isExpanded;
    delete this.uniqueId;
    delete this.isSelected;
    delete this.isTextExpanded;
    delete this.isCommentExpanded;
    if (!this.comment) delete this.comment;
    if (!this.title) delete this.title;
  }
}

export interface SectionInterface {
  title?: string;
  comment?: string;
  multiRanges?: MultiRange[];
  isExpanded?: boolean;
  sections?: Section[];
}