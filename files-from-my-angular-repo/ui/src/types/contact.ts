// Slim public Contact + CustomerContact shapes consumed by the shared
// `<ui-contact-picker>` and `<ui-contact-form>` components. Deliberately NOT
// the Prisma-generated types — keep `@lazar/ui` decoupled from the schema so
// app types can be mapped in.

export interface ContactPublic {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneMain?: string | null;
  phoneExt?: string | null;
  phoneMobile?: string | null;
  jobTitle?: string | null;
  companyName?: string | null;
  mailingList?: boolean | null;
}

export interface CustomerContactLinkPublic {
  contact?: string | null;
  primary?: boolean | null;
  secondary?: boolean | null;
  accounting?: boolean | null;
  sales?: boolean | null;
}

// Form payload emitted by `<ui-contact-form>` on Save. The parent maps this
// to its create / update API call.
export interface CompanyContactFormDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneMain?: string;
  phoneExt?: string;
  phoneMobile?: string;
  jobTitle?: string;
  companyName?: string;
  mailingList?: boolean;
  setPrimary?: boolean;
}
