import { Bible } from 'src/app/models/bible';
export class Book {
  private readonly bible: Bible;
  private readonly chapterVerseMap: number[];
  public readonly name: string;
  private static readonly BOOKS: string[][] = [["Genesis", "Gen"],["Exodus", "Ex"],["Leviticus", "Lev"],["Numbers", "Num"],["Deuteronomy", "Deut"],["Joshua", "Josh"],["Judges", "Judg"],["Ruth", "Ruth"],["1 Samuel", "1 Sam"],["2 Samuel", "2 Sam"],["1 Kings", "1 Kings"],["2 Kings", "2 Kings"],["1 Chronicles", "1 Chron"],["2 Chronicles", "2 Chron"],["Ezra", "Ezra"],["Nehemiah", "Neh"],["Esther", "Est"],["Job", "Job"],["Psalms", "Ps"],["Proverbs", "Prov"],["Ecclesiastes", "Ecc"],["Song Of Solomon", "Song"],["Isaiah", "Isa"],["Jeremiah", "Jer"],["Lamentations", "Lam"],["Ezekiel", "Ezek"],["Daniel", "Dan"],["Hosea", "Hos"],["Joel", "Joel"],["Amos", "Amos"],["Obadiah", "Obad"],["Jonah", "Jonah"],["Micah", "Mic"],["Nahum", "Nah"],["Habakkuk", "Hab"],["Zephaniah", "Zeph"],["Haggai", "Hag"],["Zechariah", "Zech"],["Malachi", "Mal"],["Matthew", "Matt"],["Mark", "Mark"],["Luke", "Luke"],["John", "John"],["Acts", "Act"],["Romans", "Rom"],["1 Corinthians", "1 Cor"],["2 Corinthians", "2 Cor"],["Galatians", "Gal"],["Ephesians", "Eph"],["Philippians", "Phil"],["Colossians", "Col"],["1 Thessalonians", "1 Thess"],["2 Thessalonians", "2 Thess"],["1 Timothy", "1 Tim"],["2 Timothy", "2 Tim"],["Titus", "Titus"],["Philemon", "Philem"],["Hebrews", "Heb"],["James", "James"],["1 Peter", "1 Pet"],["2 Peter", "2 Pet"],["1 John", "1 John"],["2 John", "2 John"],["3 John", "3 John"],["Jude", "Jude"],["Revelation", "Rev"]];
  private static readonly ORDERED_BOOKS: string[] = Book.BOOKS.map(bookArr => bookArr[0]);
  public static readonly BOOK_INDEX: { [name: string]: number } = Book.ORDERED_BOOKS.reduce((map, book, index) => {
    map[book[0]] = index;
    return map;
  }, {});
  private static readonly ABBREVIATED_BOOKS: { [name: string]: string } = Book.BOOKS.reduce((map, book) => {
    map[book[0]] = book[1];
    return map
  }, {});

  constructor(name: string, chapterVerseMap: number[], bible: Bible) {
    this.chapterVerseMap = chapterVerseMap;
    this.name = name;
    this.bible = bible;
  }
  
  public static abbreviate(bookName: string): string {
    return this.ABBREVIATED_BOOKS[bookName];
  }
  
  public static getOrderedBooks(): string[] {
    return this.ORDERED_BOOKS;
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