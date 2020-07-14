import { Section, SectionInterface } from './section.model';
import { ReferenceRange } from './reference-range';

export class SectionParent extends Section implements SectionParentInterface {
  public id: string;
  public dtoVersion: number = 1;
  public authorUid: string;
  public sortNo: number;
  public versionList: number[] = [0.1];
  public isSavedToCloud: boolean = false;
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
  
  public static compare(sp1: SectionParent, sp2: SectionParent): number {
    const hash1 = sp1.versionList[sp1.versionList.length - 1];
    const hash2 = sp2.versionList[sp2.versionList.length - 1];
    if (hash1 === hash2) return 0;
    if (sp1.versionList.find(e => e === hash2)) {
      return -1;
    } else if (sp2.versionList.find(e => e === hash1)) {
      return 1;
    } else {
      return null;
    }
  }
  
  public numberOfCollaborators(): number {
    return Object.keys(this.collaborators).length;
  }
  
  public incrementVersion(): void {
    const currentVersion = Math.floor(this.versionList[this.versionList.length - 1]);
    this.versionList.push(currentVersion + 1 + Math.random());
    if (this.versionList.length > 100) this.versionList.shift();
  }
}

export interface SectionParentInterface extends SectionInterface {
  id?: string,
  dtoVersion?: number,
  authorName?: string,
  authorUid?: string,
  versionList?: number[],
  isSavedToCloud?: boolean;
  lastUpdatedByUid?: string,
  lastUpdatedByName?: string,
  lastUpdatedDate?: Date,
  createdDate?: Date,
  date?: Date,
  sections?: Section[],
  isPublic?: boolean,
  collaborators?: { [id: string]: string },
}