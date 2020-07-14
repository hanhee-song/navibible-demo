export interface SectionParentDtoV1 {
  id?: string;
  title?: string;
  dtoVersion?: number,
  versionList?: number[],
  isSavedToCloud?: boolean,
  authorName?: string,
  authorUid?: string,
  lastUpdatedByUid?: string,
  lastUpdatedByName?: string,
  lastUpdatedDate?: number,
  createdDate?: number,
  // date?: Date,
  sections?: string;
  isPublic?: boolean,
  collaborators?: { [id: string]: string },
}