export interface ReviewSeed {
  id: string;
  fieldId: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ReviewModel extends ReviewSeed {
  fieldName: string;
}
