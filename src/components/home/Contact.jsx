import { useShop } from '../../context/ShopContext';
import { MessageCircle, Phone } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { waLink } from "../../utils/whatsapp";
import { DISPLAY_PHONE, SOCIAL_HANDLE, SHOW_SOCIAL_HANDLE } from "../../config/restaurant";
import Social from "../ui/Social";
import Reveal from "../ui/Reveal";
export default function Contact() {
  const { t, lang } = useApp();
  useShop();
  const msg =
    lang === "ar"
      ? "مرحبًا منسف طبوش، لدي استفسار عن التوصيل."
      : "Hello Mansaf Taboush, I have a delivery inquiry.";
  return (
    <section id="contact" className="parchment geo py-14 px-4 pb-24">
      <Reveal className="cream-panel mx-auto max-w-3xl p-8 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-burgundy">
          {t("contact.title")}
        </h2>
        <div className="gold-line my-4" />
        <p className="font-semibold text-lg">{t("contact.text")}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            className="btn-burgundy"
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={20} />
            {t("common.whatsapp")}
          </a>
          <a
            className="btn-burgundy"
            href={waLink(msg)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("contact.inquiry")}
          </a>
          <a
            className="btn-outline !text-burgundy !border-burgundy"
            href={`tel:${DISPLAY_PHONE}`}
          >
            <Phone size={18} />
            <bdi dir="ltr">{DISPLAY_PHONE}</bdi>
          </a>
        </div>
        <div className="mt-6 flex flex-col items-center gap-2 text-burgundy">
          <Social />
          {SHOW_SOCIAL_HANDLE && SOCIAL_HANDLE && <bdi dir="ltr" className="font-bold">
            {SOCIAL_HANDLE}
          </bdi>}
        </div>
      </Reveal>
    </section>
  );
}
