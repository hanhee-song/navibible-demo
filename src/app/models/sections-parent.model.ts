import { Section, SectionInterface } from './section.model';
import { ReferenceRange } from './reference-range';

export class SectionsParent extends Section implements SectionsParentInterface {
  public id: string;
  public authorUid: string;
  public sortNo: number;
  public authorName: string = 'Guest';
  public lastUpdatedByUid: string;
  public lastUpdatedByName: string = 'Guest';
  public lastUpdatedDate: Date = new Date();
  public createdDate: Date = new Date();
  public lastActive: number;
  public sections: Section[] = [];
  public isExpanded = true;
  public isPublic: boolean = false;
  public collaborators: { [id: string]: string } = { };

  constructor() {
    super(null, null, null);
    this.title = 'Untitled';
  }
  
  public equals(sp: SectionsParent): boolean {
    return this.id === sp.id;
  }
  
  public numberOfCollaborators(): number {
    return Object.keys(this.collaborators).length;
  }
}

export interface SectionsParentInterface extends SectionInterface {
  id?: string;
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