

import { useTranslations } from "next-intl";
import SectionProducts from "../SectionProducts";
import Image from "next/image";


export default function Watches({ params }: { params: { locale: string } }) {
    const t = useTranslations("Section");
    const { locale } = params;

    return (
        <section className="section-gap ">
            <div className="container ">
                <div className="w-full">
                    <Image
                        alt="pinword"
                        src="/img/7xc39hUuGeRdc2GbEL5TNwPsHuQuw4GSfOti90SM.jpg"
                        width={1200}
                        height={800}
                        className="img"
                    />
                </div>
                <div className="menu text-center pt-15">
                    <h1 className="font-semibold text-4xl">{t("Watches")}</h1>
                </div>
                <SectionProducts title={locale === "ar" ? "ساعات" : "Assaf watches"} locale={locale} limit={3} />
            </div>

        </section>
    );
}

