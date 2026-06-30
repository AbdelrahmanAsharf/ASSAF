

import { useTranslations } from "next-intl";
import SectionProducts from "../SectionProducts";

export default function Lady({ params }: { params: { locale: string } }) {
  const t = useTranslations("Section");
  const { locale } = params;

  return (
    <section className="section-gap container mx-auto py-8">
      <div className="menu text-center">
        <h1 className="font-semibold text-4xl">{t("bundleOffers")}</h1>
      </div>
      <SectionProducts title={locale === "ar" ? "مجموعةاروقيت" : "Arrogate Collection"} locale={locale} limit={3} />
    </section>
  );
}

