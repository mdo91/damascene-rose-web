export type PageSubsection = {
  title: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
  orderedList?: readonly string[];
};

export type PolicyTable = {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
};

export type PageSection = {
  title: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
  orderedList?: readonly string[];
  subsections?: readonly PageSubsection[];
  table?: PolicyTable;
  variant?: 'contact-box';
};

export type LegalPageContent = {
  filename: string;
  path: string;
  documentTitle: string;
  mascot: string;
  heading: string;
  subtitle: string;
  layout?: 'default' | 'long-form';
  meta?: {
    lastUpdated: string;
    effectiveDate: string;
  };
  sections: readonly PageSection[];
};
