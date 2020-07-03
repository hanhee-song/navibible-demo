import { SectionInterface } from './../../models/section.model';
import { MultiRange } from 'src/app/models/multi-range.model';
import { LogService } from './../../logger/log.service';
import { ReferenceRange } from './../../models/reference-range';
import { BibleDataService } from './bible-data.service';
import { Injectable, OnDestroy } from '@angular/core';
import { LogWrapper } from 'src/app/logger/log-wrapper';
import { Reference } from 'src/app/models/reference';
import { Book } from 'src/app/models/book';

@Injectable({
  providedIn: 'root'
})
export class ReferenceFactory extends LogWrapper implements OnDestroy {
  /**
   * 
   * Valid syntax:
   * Genesis 1:1 - Exodus 40:10
   * Exodus 1 - 1
   * gen 1:1-2:3 
   * 1 co 1:2-2:3
   * psalm 118:1-118
   * gen 1-2
   * ex 2-
   * ex 2:
   * gen 3
   * rev 22
   * gen
   * 2 cor
   * gen 1:1
   * gen 1:2-
   * gen 1-
   * gen 1:
   * gen 2-3:
   * g 1-
   * g-e
   * g -e
   * g - e
   * g-e 1:4
   * g-e :5
   * song-song
   * song of - song of
   * g a
   * a b 1-1
   * gen 1:2-exodus:2
   * 
   * Invalid syntax:
   * cor 2 1-2
   * gen 1:end-2:end
   * gen 1:end-2:3
   * 9 gen
   */
  // private static readonly regex = /^\s*((?:[123] )?[a-zA-Z ]*?)(?: (\d{1,3})(?:(?::?(\d{1,3})?)?(-)?(?:(e|en|end)|(\d{1,3})?(?::?(?:(e|en|end)|(\d{1,3})?))?))?)?\s*$/;
  private static readonly bookRegex = /^\s*((?:[123] )?[a-zA-Z]+[a-zA-Z ]*)(?: ?(\d{1,3})?(?:(?::?(\d{1,3})?)?(?: ?- ?((?:[123] )?[a-zA-Z]+[a-zA-Z ]*))?( ?- ?)?(?:(\d{1,3})?(?:(:)?(?:(\d{1,3})?))?)?)?)?\s*$/;
  private static readonly booklessRegex = /^\s*((?:[123] )?[a-zA-Z]+[a-zA-Z ]*)?(?: ?(\d{1,3})?(?:(?::?(\d{1,3})?)?(?: ?- ?((?:[123] )?[a-zA-Z]+[a-zA-Z ]*))?( ?- ?)?(?:(\d{1,3})?(?:(:)?(?:(\d{1,3})?))?)?)?)?\s*$/;
  
  private readonly bookRegex = ReferenceFactory.bookRegex;
  private readonly booklessRegex = ReferenceFactory.booklessRegex;

  private bibleDataService: BibleDataService;

  constructor(
    logService: LogService,
    bibleDataService: BibleDataService
  ) {
    super(logService);
    this.bibleDataService = bibleDataService;
  }

  ngOnDestroy() { }
  
  public resolveMultiReference(input: string): MultiRange {
    if (!input) return new MultiRange();
    const inputs = input.split(/, */).filter(input => input.trim());
    if (!inputs.length) {
      return new MultiRange();
    }
    const refRanges: ReferenceRange[] = [];
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      if (i === 0) {
        refRanges.push(this.resolve(input, this.bookRegex));
      } else {
        refRanges.push(this.resolve(input, this.booklessRegex, refRanges[refRanges.length - 1].toReference.book));
      }
    }
    return this.createMultiRange(refRanges);
  }

  public resolve(input: string, regex: RegExp): ReferenceRange;
  public resolve(input: string, regex: RegExp, previousBook: string): ReferenceRange;
  public resolve(input: string, regex: RegExp, previousBook?: string): ReferenceRange {
    const bible = this.bibleDataService.getBible();

    if (!regex.test(input)) {
      this.logService.warn('Regex test failed for input ' + input)
      throw 'Invalid';
    }
    const parsedArr = regex.exec(input);
    this.logService.log(parsedArr);

    const fromBookNameInput = parsedArr[1] || previousBook,
      fromChapterInput = parseInt(parsedArr[2] || '0'),
      fromVerseInput = parseInt(parsedArr[3] || '0'),
      toBookNameInput = parsedArr[4],
      dashInput = parsedArr[5],
      // endBookInput = parsedArr[6],
      toChapterInput = parseInt(parsedArr[6] || '0'),
      // endChapterInput = parsedArr[8],
      toVerseColon = parsedArr[7],
      toVerseInput = parseInt(parsedArr[8] || '0');
    

    let fromChapter: number,
      fromVerse: number,
      toChapter: number,
      toVerse: number;

    if (!fromBookNameInput) throw 'Invalid book name';
    const fromBook = bible.getBookByInput(fromBookNameInput);
    if (!fromBook) throw 'Invalid book name';

    const toBook = bible.getBookByInput(toBookNameInput);
    if (toBookNameInput && !toBook) throw 'Invalid book name';

    fromChapter = fromChapterInput || 1;
    fromVerse = fromVerseInput || 1;
    if (!toBook) {
      toChapter = toChapterInput || ((!dashInput || toVerseInput) && fromChapterInput || toVerseColon ? fromChapter : fromBook.getLastChapter());
      toVerse = toVerseInput || (!dashInput && fromVerseInput) || fromBook.getLastVerseOfChapter(toChapter);
    } else {
      if (toVerseInput && !toChapterInput) throw 'Please input chapter';
      toChapter = toChapterInput || toBook.getLastChapter();
      toVerse = toVerseInput || toBook.getLastVerseOfChapter(toChapter);
    }

    return this.createReferenceRange(
      this.__createReference(fromBook.name, fromChapter, fromVerse),
      this.__createReference(toBook ? toBook.name : fromBook.name, toChapter, toVerse)
    );
  }

  public __createReference(bookName: string, chapter: number, verse: number);
  public __createReference(bookName: string, chapter: number, verse: number, index: number, isLastChapter: boolean, isLastVerse: boolean);
  public __createReference(bookName: string, chapter: number, verse: number, index?: number, isLastChapter?: boolean, isLastVerse?: boolean): Reference {
    if (isLastChapter === undefined || isLastVerse === undefined || index === undefined) {
      const bible = this.bibleDataService.getBible();
      const book = bible.getBookByInput(bookName);
      isLastChapter = book.getLastChapter() === chapter;
      isLastVerse = book.getLastVerseOfChapter(chapter) === verse;
      index = bible.getIndexByBookChapterVerse(bookName, chapter, verse);
    }
    return new Reference(bookName, chapter, verse, index, isLastChapter, isLastVerse);
  }

  public createReferenceRange(ref1: Reference, ref2: Reference): ReferenceRange {
    const range = new ReferenceRange(ref1, ref2);
    this.__validateReferenceRange(range);
    return range;
  }

  public createMultiRange(refRange: ReferenceRange): MultiRange;
  public createMultiRange(referenceRanges: ReferenceRange[]);
  public createMultiRange(referenceRanges: string[])
  public createMultiRange(arg1: ReferenceRange | string[] | ReferenceRange[]): MultiRange {
    if (Array.isArray(arg1)) {
      let refRanges: ReferenceRange[];
      if (arg1.length && arg1[0] instanceof ReferenceRange) {
        refRanges = <ReferenceRange[]> arg1;
      } else {
        refRanges = (<string[]> arg1).map(ref => this.resolve(ref, this.bookRegex));
      }
      return new MultiRange(refRanges);
    } else {
      return new MultiRange(arg1);
    }
  }

  public createMultiRangeFromJson(json: MultiRange[]): MultiRange[] {
    if (!json || !json.length) {
      return [];
    } else {
      return json.map(multiRange => {
        return this.createMultiRange(multiRange.referenceRanges.map(refRange => {
          return this.createReferenceRange(
            this.__createReference(refRange.fromReference.book, refRange.fromReference.chapter, refRange.fromReference.verse, refRange.fromReference.index, refRange.fromReference.isLastChapter, refRange.fromReference.isLastVerse),
            this.__createReference(refRange.toReference.book, refRange.toReference.chapter, refRange.toReference.verse, refRange.toReference.index, refRange.toReference.isLastChapter, refRange.toReference.isLastVerse)
          );
        }));
      });
    }
  }

  /**
   * No-validation parsing for clean reference strings. DO NOT USE FOR USER INPUT
   */
  public fromReferenceString(refString: string): Reference {
    if (!this.bookRegex.test(refString)) {
      this.logService.warn('Regex test failed for refString ' + refString)
      throw 'Invalid';
    }
    const parsedArr = this.bookRegex.exec(refString);

    const bookNameInput = parsedArr[1],
      fromChapterInput = parseInt(parsedArr[2] || '0'),
      fromVerseInput = parseInt(parsedArr[3] || '0');

    return this.__createReference(bookNameInput, fromChapterInput, fromVerseInput);
  }

  public __validateReference(ref: Reference): boolean {
    const bible = this.bibleDataService.getBible();
    const book = bible.getBookByInput(ref.book);
    return book && ref && ref.chapter <= book.getLastChapter() && ref.verse <= book.getLastVerseOfChapter(ref.chapter);
  }

  public __validateReferenceRange(refRange: ReferenceRange): boolean {
    if (!refRange || !refRange.fromReference || !refRange.fromReference.book || !refRange.toReference || !refRange.toReference.book) {
      throw 'Reference Range has incomplete data, cannot validate';
    }

    if (!this.__validateReference(refRange.fromReference)) {
      throw refRange.fromReference.toString() + ' DNE';
    }
    if (!this.__validateReference(refRange.toReference)) {
      throw refRange.toReference.toString() + ' DNE';
    }
    if (refRange.fromReference.compareTo(refRange.toReference) === 1) {
      throw 'Ranges cannot go backwards';
    }
    return true;
  }
}