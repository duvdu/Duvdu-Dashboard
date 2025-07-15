// Category CRUD Types
export type Tag = {
  _id: string;
  ar: string;
  en: string;
};

export type SubCategory = {
  _id?: string;
  title: {
    ar: string;
    en: string;
  };
  tags: Tag[];
};

export type JobTitle = {
  _id?: string;
  ar: string;
  en: string;
};

export type Category = {
  _id?: string;
  title: {
    ar: string;
    en: string;
  };
  jobTitles: JobTitle[];
  cycle: string;
  subCategories: SubCategory[];
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  trend?: boolean;
  isRelated?: boolean;
  insurance?: boolean;
  creativesCounter?: number;
};
