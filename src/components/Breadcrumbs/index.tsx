"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocale } from "next-intl";


interface Crumb {
  title: string;
  href?: string;
}

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const locale = useLocale(); 
  const allCrumbs: Crumb[] = [
    {
      title: locale === "ar" ? "الرئيسية" : "Home",
      href: `/${locale}`,
    },
    ...crumbs,
  ];

  return (
    <Breadcrumb className="pb-5 container">
      <BreadcrumbList>
        {allCrumbs.map((crumb, index) => (
          <BreadcrumbItem key={index}>
            {crumb.href ? (
              <BreadcrumbLink href={crumb.href} className="text-black">{crumb.title}</BreadcrumbLink>
            ) : (
              <span className="text-black">{crumb.title}</span>
            )}
            
            {index < allCrumbs.length - 1 && <BreadcrumbSeparator className="text-black" />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
