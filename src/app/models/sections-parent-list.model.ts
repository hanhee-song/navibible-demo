import { SectionsParent } from './sections-parent.model';
export class SectionsParentList {
  private list: SectionsParent[];
  
  constructor(sp?: SectionsParent);
  constructor(list?: SectionsParent[]);
  constructor(arg1?: SectionsParent | SectionsParent[]) {
    if (!arg1) arg1 = [];
    if (!Array.isArray(arg1)) arg1 = [arg1];
    this.list = arg1;
  }
  
  public merge(spl: SectionsParentList): SectionsParentList {
    return this;
  }
  
  public push(sp: SectionsParent): SectionsParentList {
    this.list.push(sp);
    return this;
  }
  
  public get(index: number): SectionsParent {
    return this.list[0];
  }
  
  public length(): number {
    return this.list.length;
  }
  
  public *[Symbol.iterator]() {
    yield *this.list;
  }
}