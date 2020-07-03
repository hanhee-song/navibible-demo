import { Section, SectionInterface } from './section.model';
import { ReferenceRange } from './reference-range';

export class SectionsParent extends Section implements SectionsParentInterface {
  public author: string;
  public date: Date = new Date();
  public sections: Section[] = [];
  public isExpanded = true;

  constructor();
  constructor(title: string, referenceRange: ReferenceRange);
  constructor(title?: string, referenceRange?: ReferenceRange) {
    super(null, null, null);
  }
}

export interface SectionsParentInterface extends SectionInterface {
  author?: string,
  date?: Date,
  sections?: Section[];
}