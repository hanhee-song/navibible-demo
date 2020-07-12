import { Section, SectionInterface } from './section.model';
import { ReferenceRange } from './reference-range';

export class SectionsParent extends Section implements SectionsParentInterface {
  public authorUid: string;
  public sortNo: number;
  public authorName: string;
  public lastUpdatedByUid: string;
  public lastUpdatedByName: string;
  public lastUpdatedDate: Date;
  public createdDate: Date;
  public lastActive: number;
  public sections: Section[] = [];
  public isExpanded = true;
  public isPublic: boolean = false;
  public collaborators: { [id: string]: string } = { };

  constructor() {
    super(null, null, null);
    this.title = 'Untitled';
  }
}

export interface SectionsParentInterface extends SectionInterface {
  authorName?: string,
  authorUid?: string,
  lastUpdatedByUid?: string,
  lastUpdatedByName?: string,
  lastUpdatedDate?: Date,
  createdDate?: Date,
  date?: Date,
  sections?: Section[],
  isPublic?: boolean,
  collaborators?: { [id: string]: string },
}