import { AngularFirestore } from '@angular/fire/firestore';
import { User } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { SectionsParentList } from './../../models/sections-parent-list.model';
import { SectionInterface } from './../../models/section.model';
import { MultiRange } from './../../models/multi-range.model';
import { ReferenceFactory } from './../bible/reference-factory';
import { ReferenceRange } from './../../models/reference-range';
import { BibleDataService } from './../bible/bible-data.service';
import { Injectable } from '@angular/core';
import { Section } from '../../models/section.model';
import { SectionsParent, SectionsParentInterface } from 'src/app/models/sections-parent.model';

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

  public fromSectionsParentListJson(sectionsParentJson: SectionsParentInterface | SectionsParentInterface[]): SectionsParentList {
    if (!Array.isArray(sectionsParentJson)) sectionsParentJson = [sectionsParentJson]; // temp backward compatability code
    const sectionParentList = new SectionsParentList();
    sectionsParentJson.forEach(json => sectionParentList.push(this.fromSectionsParentJson(json)));
    return sectionParentList;
  }
  
  public fromSectionsParentJson(json: SectionsParentInterface): SectionsParent {
    const sectionParent = new SectionsParent();
    if (this.user) {
      sectionParent.authorName = this.user.displayName;
      sectionParent.authorUid = this.user.uid;
    }
    sectionParent.id = json.id || this.firestore.createId();
    if (json.title) sectionParent.title = json.title;
    if (json.authorName) sectionParent.authorName = json.authorName;
    if (json.authorUid) sectionParent.authorUid = json.authorUid;
    if (json.createdDate) sectionParent.createdDate = json.createdDate;
    if (json.lastUpdatedByName) sectionParent.lastUpdatedByName = json.lastUpdatedByName;
    if (json.lastUpdatedByUid) sectionParent.lastUpdatedByUid = json.lastUpdatedByUid;
    if (json.lastUpdatedDate) sectionParent.lastUpdatedDate = json.lastUpdatedDate;
    if (json.sections) {
      sectionParent.sections = json.sections.map(section => this.fromSectionJson(section));
    }
    this.populateVerseFromIds(sectionParent);
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

  private populateVerseFromIds(sectionParent: SectionsParent): void {
    // if (!sectionParent.sections) return;
    
    // const ids = [];
    // sectionParent.sections.forEach(section => this.iterateOverSections(section, (section: Section) => {
    //   if (section.fromReferenceId) ids.push(section.fromReferenceId);
    //   if (section.toReferenceId) ids.push(section.toReferenceId);
    // }));

    // const data = this.bibleDataService.getBible().getVersesByIds(ids);

    // sectionParent.sections.forEach(section => this.iterateOverSections(section, (section: Section) => {
    //   if (section.fromReferenceId && data[section.fromReferenceId]) {
    //     const verse = data[section.fromReferenceId];
    //     section.fromReference = verse.reference;
    //   }
    //   if (section.toReferenceId && data[section.toReferenceId]) {
    //     const verse = data[section.toReferenceId];
    //     section.toReference = verse.reference;
    //   }
    // }));
  };

  private iterateOverSections(section: Section, callback: Function): void {
    callback(section);
    if (section.sections) {
      section.sections.forEach(section => this.iterateOverSections(section, callback));
    }
  }
}
