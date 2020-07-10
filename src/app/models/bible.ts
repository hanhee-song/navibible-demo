import { cloneDeep, startCase } from 'lodash';
import { Book } from './book';
import { Reference, ReferenceInterface } from './reference';
import { ReferenceRange } from './reference-range';

export class Bible {
  private CHAPTER_VERSE_MAP: { [book: string]: Book } = {};
  private BOOK_MAP_ARR: string[] = [];
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
    return this.BOOK_MAP_ARR[this.getIndexByReference(ref)];
  }

  public getVersesByReferenceRange(refRange: ReferenceRange, limit?: number): { ref: ReferenceInterface, text: string }[] {
    const startingIndex = this.getIndexByReference(refRange.fromReference);
    const endIndex = Math.min(this.getIndexByReference(refRange.toReference) + 1, limit + startingIndex);
    return this.BOOK_MAP_ARR.slice(
      startingIndex,
      endIndex
    ).map((verse, i) => {
      return {
        ref: this.getReferenceByIndex(i + startingIndex),
        text: verse
      }
    });
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
  
  public getReferenceByIndex(index: number): ReferenceInterface {
    const bookArr = Book.getOrderedBooks();
    const book = bookArr.find((book, i) => this.VERSE_INDEX_ARR[book][1] <= index && index < (this.VERSE_INDEX_ARR[bookArr[i + 1]][1] || 999999999))
    const bookChapters = this.VERSE_INDEX_ARR[book];
    for (let i = 0; i < bookChapters.length; i++) {
      if (index <= bookChapters[i + 1]) {
        return {
          index,
          book,
          chapter: i,
          verse: index - bookChapters[i]
        };
      }
    }
  }
}

