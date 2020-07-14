import { SectionParentDtoV1 } from './../../models/section-parent-dto-1.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { SectionParentList } from './../../models/section-parent-list.model';
import { SectionInterface } from './../../models/section.model';
import { MultiRange } from './../../models/multi-range.model';
import { ReferenceFactory } from './../bible/reference-factory';
import { ReferenceRange } from './../../models/reference-range';
import { BibleDataService } from './../bible/bible-data.service';
import { Injectable } from '@angular/core';
import { Section } from '../../models/section.model';
import { SectionParent, SectionParentInterface } from 'src/app/models/section-parent.model';

@Injectable({
  providedIn: 'root'
})
export class SectionFactory {
  
  private user: User;

  constructor(
    private bibleDataService: BibleDataService,
    private referenceFactory: ReferenceFactory,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    Section.bibleDataService = bibleDataService;
    
    auth.authState.subscribe(user => this.user = user);
  }

  public create(title: string, comment: string, multiRange: MultiRange);
  public create(title: string, comment: string, refRange: ReferenceRange);
  public create(title: string, comment: string, multiRanges: MultiRange[]);
  public create(title: string, comment: string, arg1: MultiRange | MultiRange[] | ReferenceRange): Section {
    if (arg1 instanceof ReferenceRange) {
      arg1 = [this.referenceFactory.createMultiRange(arg1)];
    } else if (arg1 instanceof MultiRange) {
      arg1 = [arg1]
    }
    return new Section(title, comment, arg1);
  }
  
  public merge(sp1: SectionParent, sp2: SectionParent): SectionParent {
    return null;
  }

  public fromSectionParentListJson(sectionParentJson: SectionParentInterface | SectionParentInterface[]): SectionParentList {
    if (!Array.isArray(sectionParentJson)) sectionParentJson = [sectionParentJson]; // temp backward compatability code
    const sectionParentList = new SectionParentList();
    sectionParentJson.forEach(json => sectionParentList.push(this.fromSectionParentJson(json)));
    return sectionParentList;
  }
  
  public fromSectionParentJson(json: SectionParentInterface): SectionParent {
    const sectionParent = new SectionParent();
    if (this.user) {
      sectionParent.authorName = this.user.displayName;
      sectionParent.authorUid = this.user.uid;
    }
    sectionParent.id = json.id || this.firestore.createId();
    if (json.dtoVersion) sectionParent.dtoVersion = json.dtoVersion;
    if (json.versionList) sectionParent.versionList = json.versionList;
    if (json.isSavedToCloud) sectionParent.isSavedToCloud = json.isSavedToCloud;
    if (json.title) sectionParent.title = json.title;
    if (json.authorName) sectionParent.authorName = json.authorName;
    if (json.authorUid) sectionParent.authorUid = json.authorUid;
    if (json.createdDate) sectionParent.createdDate = new Date(json.createdDate);
    if (json.lastUpdatedByName) sectionParent.lastUpdatedByName = json.lastUpdatedByName;
    if (json.lastUpdatedByUid) sectionParent.lastUpdatedByUid = json.lastUpdatedByUid;
    if (json.lastUpdatedDate) sectionParent.lastUpdatedDate = new Date(json.lastUpdatedDate);
    if (json.sections) {
      sectionParent.sections = json.sections.map(section => this.fromSectionJson(section));
    }
    return sectionParent;
  }

  private fromSectionJson(json): Section {
    if (!json) return null;
    const section = this.create(json.title, json.comment, this.referenceFactory.createMultiRangeFromJson(json.multiRanges));
    if (json.sections) {
      section.sections = json.sections.map(section => this.fromSectionJson(section));
    }
    return section;
  }
}
