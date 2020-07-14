import { SectionParent } from './section-parent.model';
export class SectionParentList {
  private list: SectionParent[];
  
  constructor(sp?: SectionParent);
  constructor(list?: SectionParent[]);
  constructor(arg1?: SectionParent | SectionParent[]) {
    if (!arg1) arg1 = [];
    if (!Array.isArray(arg1)) arg1 = [arg1];
    this.list = arg1;
  }
  
  public push(sp: SectionParent): SectionParentList {
    this.list.push(sp);
    return this;
  }
  
  public get(index: number): SectionParent {
    return this.list[0];
  }
  
  public length(): number {
    return this.list.length;
  }
  
  public *[Symbol.iterator]() {
    yield *this.list;
  }
  
  public foreach(fn: (sp: SectionParent, index?: number) => any): void {
    this.list.forEach(fn);
  }
}