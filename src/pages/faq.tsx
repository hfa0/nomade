import type { NextPageWithLayout } from './_app';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import Link from 'next/link';
import { ROUTER } from '@/constants/router';

const FAQ_ITEMS = [
  {
    question: 'What kind of events does NOMADE. PRESTIGE offer?',
    answer:
      'NOMADE. PRESTIGE hosts cultural luxury events in Düsseldorf — curated experiences at the intersection of fashion, art and community. Each event brings together runway presentations, exhibitions and live performances in an elevated setting. Think exclusive evenings where heritage meets high fashion.',
  },
  {
    question: 'How do I join an event?',
    answer:
      'Simply select your event on our Book page, choose your ticket tier and complete the purchase via our secure checkout. You will receive your ticket by email shortly after payment. Bring your ticket (PDF with QR code) to the venue for entry.',
  },
  {
    question: 'How do I receive my ticket?',
    answer:
      'After purchasing, your ticket is sent to the email address you provided at checkout. The ticket arrives as a PDF attachment. Please check your inbox and spam folder. If you do not receive it within a few minutes, contact us.',
  },
  {
    question: 'What does my ticket look like?',
    answer:
      'Your ticket is a PDF document containing a unique QR code. Present this QR code — either on your phone or as a printed copy — at the venue entrance for access. Each ticket is valid for one entry only.',
  },
  {
    question: 'Can I get a refund?',
    answer:
      'Refund policies may vary by event. Please refer to the event details at the time of purchase or contact us directly for specific arrangements.',
  },
];

const Faq: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>FAQ — NOMADE. PRESTIGE</title>
        <meta name="description" content="Frequently asked questions about NOMADE. PRESTIGE events, tickets and how to join." />
      </Head>

      <section className="pt-24 pb-16 md:pt-28 md:pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-cooper text-primary text-4xl md:text-5xl font-bold uppercase text-center mb-4">
            FAQ
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Questions about our events and tickets? Find answers below.
          </p>

          <div className="space-y-8">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="border-b border-gray-200 pb-8 last:border-0 last:pb-0"
              >
                <h2 className="font-cooper text-primary text-lg font-bold uppercase mb-3">
                  {item.question}
                </h2>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm mt-12">
            Ready to join?{' '}
            <Link href={ROUTER.book.href} className="text-primary hover:underline font-medium">
              Book your ticket
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

Faq.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Faq;
