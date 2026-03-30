import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useLang } from "../context/LangContext";
import "./Faq.css";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useLang();

  const faqs = [
    {
      q: t("faq.q1"),
      a: t("faq.a1"),
    },
    {
      q: t("faq.q2"),
      a: t("faq.a2"),
    },
    {
      q: t("faq.q3"),
      a: t("faq.a3"),
    },
    {
      q: t("faq.q4"),
      a: t("faq.a4"),
    },
  ];

  return (
    <div
      className="page-container"
      style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}
    >
      <h1
        style={{
          marginBottom: "1.5rem",
          color: "var(--primary)",
          textAlign: "center",
        }}
      >
        {t("faq.title")}
      </h1>
      <p
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "var(--text-muted)",
        }}
      >
        {t("faq.subtitle")}
      </p>

      <div
        className="faq-list"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="card faq-item"
            style={{
              padding: "1.25rem",
              cursor: "pointer",
              transition: "box-shadow 0.2s",
            }}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.05rem",
                  color: "var(--text-main)",
                }}
              >
                {faq.q}
              </h2>
              {openIndex === idx ? (
                <ChevronUp size={20} color="var(--primary)" />
              ) : (
                <ChevronDown size={20} color="var(--text-muted)" />
              )}
            </div>
            {openIndex === idx && (
              <p
                style={{
                  marginTop: "1rem",
                  color: "var(--text-muted)",
                  lineHeight: "1.6",
                }}
              >
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Faq;
