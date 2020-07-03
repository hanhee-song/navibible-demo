import { Book } from './book';
import { Verse } from './verse.model';
import { startCase, cloneDeep } from 'lodash';
import { Reference } from './reference';
import { ReferenceRange } from './reference-range';

export class Bible {
  private CHAPTER_VERSE_MAP: { [book: string]: Book } = {};
  private BOOK_MAP_ARR: { [book: string]: string[][] } = {};
  private VERSE_INDEX_ARR: { [book: string]: number[] } = {};

  constructor(bookMapArray, chapterVerseMap: { [book: string]: number[] } ) {
    this.BOOK_MAP_ARR = bookMapArray;

    for (const bookName in chapterVerseMap) {
      if (chapterVerseMap.hasOwnProperty(bookName)) {
        this.CHAPTER_VERSE_MAP[bookName] = new Book(bookName, chapterVerseMap[bookName], this);
      }
    }

    const chapterVerseClone = cloneDeep(chapterVerseMap);

    const books: string[] = Object.keys(chapterVerseClone);
    let current = 0;
    let sum = 0;
    for (let i = 0; i < books.length; i++) {
      const chapterArr = chapterVerseClone[books[i]];
      for (let j = 0; j < chapterArr.length; j++) {
        if (j === 0) continue;
        current = chapterArr[j];
        sum += current;
        chapterArr[j] = sum - current;
      }
    }
    this.VERSE_INDEX_ARR = chapterVerseClone;
  }

  public getVerseByReference(ref: Reference): string {
    return this.BOOK_MAP_ARR[ref.book][ref.chapter][ref.verse];
  }

  public getVersesByReferenceRange(refRange: ReferenceRange): { [ref: string]: string } {
    const verses: { [ref: string]: string } = {};
    return verses;
  }

  public getBookByInput(input: string): Book {
    if (!input || !input.trim()) return undefined;
    input = startCase(input.toLowerCase());

    for (const book in this.CHAPTER_VERSE_MAP) {
      if (this.CHAPTER_VERSE_MAP.hasOwnProperty(book)) {
        if (book.startsWith(input)) return this.CHAPTER_VERSE_MAP[book];
      }
    }
    return undefined;
  }

  public getIndexByBookChapterVerse(book: string, chapter: number, verse: number): number {
    return this.VERSE_INDEX_ARR[book][chapter] + verse;
  }

  public getIndexByReference(ref: Reference): number {
    return this.getIndexByBookChapterVerse(ref.book, ref.chapter, ref.verse);
  }
}