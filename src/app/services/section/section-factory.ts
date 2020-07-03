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

  private bibleDataService: BibleDataService;
  private referenceFactory: ReferenceFactory;

  constructor(
    bibleDataService: BibleDataService,
    referenceFactory: ReferenceFactory
  ) {
    this.bibleDataService = bibleDataService;
    this.referenceFactory = referenceFactory;
    Section.bibleDataService = bibleDataService;
  }

  public create(title: string, multiRange: MultiRange);
  public create(title: string, refRange: ReferenceRange);
  public create(title: string, multiRanges: MultiRange[]);
  public create(title: string, arg1: MultiRange | MultiRange[] | ReferenceRange): Section {
    if (arg1 instanceof ReferenceRange) {
      arg1 = [this.referenceFactory.createMultiRange(arg1)];
    } else if (arg1 instanceof MultiRange) {
      arg1 = [arg1]
    }
    return new Section(title, arg1);
  }

  public fromSectionsParentJson(sectionsParentJson: SectionsParentInterface): SectionsParent {
    const sectionParent = new SectionsParent();
    if (sectionsParentJson.author) sectionParent.author = sectionsParentJson.author;
    if (sectionsParentJson.date) sectionParent.date = new Date(sectionsParentJson.date);
    if (sectionsParentJson.sections) {
      sectionParent.sections = sectionsParentJson.sections.map(section => this.fromSectionJson(section));
    }
    this.populateVerseFromIds(sectionParent);

    return sectionParent;
  }

  private fromSectionJson(json): Section {
    if (!json) return null;
    const section = this.create(json.title, this.referenceFactory.createMultiRangeFromJson(json.multiRanges));
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
