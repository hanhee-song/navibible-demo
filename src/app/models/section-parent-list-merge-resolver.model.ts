import { SectionParent } from 'src/app/models/section-parent.model';
import { SectionParentList } from './section-parent-list.model';

export class SectionParentListMergeResolver {
  private local: SectionParentList;
  private cloud: SectionParentList;
  private onResolve: (list1, list2) => {};
  public merged: SectionParentList;
  public conflicts: {
    id: string,
    title: string,
    local: SectionParent,
    cloud: SectionParent,
    error: string,
    resolution: {
      text: string,
      fn: () => any,
      cssClass: string,
    }[]
  }[] = [];
  
  constructor(local: SectionParentList, cloud?: SectionParentList, onResolve?: (list1, list2) => {}) {
    this.local = local;
    this.cloud = cloud;
    this.onResolve = onResolve;
    
    this.merge();
  }
  
  public getFirst(): SectionParent {
    return this.merged.get(0);
  }
  
  private merge(): void {
    if (!this.cloud) {
      this.merged = this.local;
      return;
    }
    
    this.merged = new SectionParentList;
    const map: {
      [id: string]: {
        local?: SectionParent,
        cloud?: SectionParent,
      }
    } = {};
    
    this.local.foreach(sp => {
      if (!map[sp.id]) map[sp.id] = {};
      map[sp.id].local = sp;
    });
    this.cloud.foreach(sp => {
      if (!map[sp.id]) map[sp.id] = {};
      map[sp.id].cloud = sp;
    });
    for (const id in map) {
      if (map.hasOwnProperty(id)) {
        const pair = map[id];
        if (pair.local && !pair.cloud && !pair.local.isSavedToCloud) {
          this.merged.push(pair.local);
          continue;
        }
        
        if (+!pair.cloud ^ +!pair.local) { // exists in cloud but not local or vice verse
          let error = 'Conflict: ';
          const project = pair.local || pair.cloud;
          error += `${project.title} (last edited ${project.lastUpdatedDate}) exists in ${pair.local ? 'local' : 'cloud'} but not on ${!pair.local ? 'local' : 'cloud'}`
          this.conflicts.push({
            id,
            title: project.title,
            local: pair.local,
            cloud: pair.cloud,
            error,
            resolution: [
              {
                text: `Delete project ${project.title}`,
                fn: () => {},
                cssClass: 'background-color-subtle-red',
              }, {
                text: `Keep file ${project.title}`,
                fn: () => this.merged.push(project),
                cssClass: 'background-color-subtle-green',
              }
            ]
          });
          continue;
        }
        const compare = SectionParent.compare(pair.cloud, pair.local);
        if (compare === 0 || compare === -1) {
          this.merged.push(pair.cloud);
        } else if (compare === 1) {
          this.merged.push(pair.local);
        } else if (compare === null) {
          let error = 'Conflict: ';
          this.conflicts.push({
            id,
            title: pair.local.title === pair.cloud.title ? pair.local.title : pair.local.title + '/' + pair.cloud.title,
            local: pair.local,
            cloud: pair.cloud,
            error,
            resolution: [
              {
                text: `Choose local version (last edited ${pair.local.lastUpdatedDate})`,
                fn: () => this.merged.push(pair.local),
                cssClass: 'background-color-subtle-red',
              }, {
                text: `Choose cloud version (last edited ${pair.cloud.lastUpdatedDate})`,
                fn: () => this.merged.push(pair.cloud),
                cssClass: 'background-color-subtle-red',
              }, {
                text: `Keep both (rename local version to ${pair.local.title + ' (local)'})`,
                fn: () => {
                  this.merged.push(pair.local);
                  pair.local.title += ' (local)';
                  this.merged.push(pair.cloud);
                },
                cssClass: 'background-color-subtle-green',
              }
            ],
          });
        }
      }
    }
    
    this.conflicts.forEach(conflict => {
      conflict.resolution.forEach(res => {
        const func = res.fn;
        res.fn = () => {
          func();
          this.conflicts = this.conflicts.filter(c => c !== conflict);
        }
      });
    });
  }
}