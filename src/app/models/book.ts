import { ReferenceRange } from './reference-range';
import { Reference } from './reference';
import { Bible } from 'src/app/models/bible';
export class Book {
  private readonly bible: Bible;
  private readonly chapterVerseMap: number[];
  public readonly name: string;
  public static readonly BOOK_INDEX: { [name: string]: number } = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song Of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
  ].reduce((map, book, index) => {
    map[book] = index;
    return map;
  }, {});

  constructor(name: string, chapterVerseMap: number[], bible: Bible) {
    this.chapterVerseMap = chapterVerseMap;
    this.name = name;
    this.bible = bible;
  }

  public getLastChapter(): number {
    return this.chapterVerseMap.length - 1;
  }

  public getLastVerse(): number {
    return this.chapterVerseMap[this.getLastChapter()];
  }

  public getLastVerseOfChapter(chapter: number): number {
    return this.chapterVerseMap[chapter];
  }

  public static compare(book1: string, book2: string): number {
    const bookIndex1 = Book.BOOK_INDEX[book1];
    const bookIndex2 = Book.BOOK_INDEX[book2];
    return bookIndex1 === bookIndex2 ? 0 : bookIndex1 < bookIndex2 ? -1 : 1;
  }
}