// types/nav.ts
export type SubSubNavItem = {
  title: string;
  stableId: string;
};

export type SubNavItem = {
  title: string;
  stableId: string;
  subSub: SubSubNavItem[];
};

export type NavItem = {
  titleAr: string;
  titleEn: string;
  stableId: string;
  subAr: SubNavItem[];
  subEn: SubNavItem[];
};