import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './Faq.css';

const Faq = () => {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState(null);

  // We hardcode simple english FAQ data for now
  const faqs = [
    {
      q: "How do I update my study program or preferred arrival date?",
      a: "Currently, you can update your profile information by heading to the 'My Profile' tab in the sidebar and saving your new inputs."
    },
    {
      q: "What is the UHIP and why do I need it?",
      a: "The University Health Insurance Plan (UHIP) is mandatory for all international students. It covers basic medical care in Ontario. You should receive your UHIP card via your uOttawa email."
    },
    {
      q: "Who do I contact if I am late for the Welcome Week?",
      a: "If your flight was delayed or you encountered visa issues, please directly contact the International Mentoring Centre (mentoring@uottawa.ca) so they can assist you remotely."
    },
    {
      q: "Can I switch my language preferences permanently?",
      a: "Yes! Use the EN/FR button located at the bottom of the sidebar. The whole application interface and content will switch dynamically."
    }
  ];

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--primary)', textAlign: 'center' }}>Admin FAQ</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-muted)' }}>
        Here are the most common questions our administrators receive from international students.
      </p>

      <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className="card faq-item" 
            style={{ padding: '1.25rem', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)' }}>{faq.q}</h2>
              {openIndex === idx ? <ChevronUp size={20} color="var(--primary)" /> : <ChevronDown size={20} color="var(--text-muted)" />}
            </div>
            {openIndex === idx && (
              <p style={{ marginTop: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
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
