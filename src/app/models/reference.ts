import { Book } from './book';

export class Reference implements ReferenceInterface {
  public readonly book: string;
  public readonly chapter: number;
  public readonly verse: number;
  public readonly index: number;
  public readonly isLastChapter: boolean;
  public readonly isLastVerse: boolean;

  constructor(book: string, chapter: number, verse: number, index: number, isLastChapter: boolean, isLastVerse: boolean) {
    this.book = book;
    this.chapter = chapter;
    this.verse = verse;
    this.index = index;
    this.isLastChapter = isLastChapter;
    this.isLastVerse = isLastVerse;
  }

  public toString();
  public toString(isFrom: boolean);
  public toString(isFrom?: boolean): string {
    if (!this.book || !this.chapter || !this.verse) return 'Invalid';
    return `${this.book} ${this.toChapterVerseString(isFrom)}`;
  }

  public toChapterVerseString(isFrom?: boolean): string {
    if (!this.book || !this.chapter || !this.verse) return 'Invalid';
    if ((this.verse === 1 && isFrom === true) || (this.isLastVerse && isFrom === false)) {
      return `${this.chapter}`;
    }
    return `${this.chapter}:${this.verse}`;
  }

  public isSameBook(ref: Reference): boolean {
    return Book.compare(this.book, ref.book) === 0;
  }

  public isSameChapter(ref: Reference): boolean {
    return this.isSameBook(ref) && this.chapter === ref.chapter;
  }

  public isSameVerse(ref: Reference): boolean {
    return this.isSameChapter(ref) && this.verse === ref.verse;
  }

  public compareTo(ref: Reference): number {
    return this.index < ref.index ? -1 : this.index === ref.index ? 0 : 1;
  }
  
  public equals(ref: Reference): boolean {
    return this.book === ref.book && this.chapter === ref.chapter && this.verse === ref.verse;
  }
}

export interface ReferenceInterface {
  book: string;
  chapter: number;
  verse: number;
  index?: number;
}