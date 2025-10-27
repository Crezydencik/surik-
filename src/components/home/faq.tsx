'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {ChevronDown, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const { t } = useTranslation();

  const toggleOpenIndex = (id: string) => {
    setOpenIndex((prev) => (prev === id ? null : id));
  };

  const faqsColumn1 = t('faq.column1', { returnObjects: true }) as Array<{ question: string; answer: string }>;
  const faqsColumn2 = t('faq.column2', { returnObjects: true }) as Array<{ question: string; answer: string }>;

  return (
    <section id='faq' className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-mono text-center mb-16 font-bold text-white">FIND THE ANSWERS TO YOUR QUESTIONS </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Первый столбец */}
          <div>
            {faqsColumn1.map((faq, index) => {
              const id = `column1-${index}`;
              return (
                <div key={id} className="border-b border-gray-800">
                  <button
                    onClick={() => toggleOpenIndex(id)}
                    className="w-full py-4 flex justify-between items-center text-left"
                  >
                    <span className="text-lg font-mono text-white pr-4">{faq.question}</span>
                    <div className="flex-shrink-0">
                      {openIndex === id ? (
                        <div className=" p-2 rounded-[4px]">
                          <ChevronDown  className="w-5 h-5 text-[#394DFF]" />
                        </div>
                      ) : (
                        <div >
                          <ChevronRight className="w-5 h-5 text-[#394DFF]" />
                        </div>
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openIndex === id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-400 pb-4 font-mono">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Второй столбец */}
          <div>
            {faqsColumn2.map((faq, index) => {
              const id = `column2-${index}`;
              return (
                <div key={id} className="border-b border-gray-800">
                  <button
                    onClick={() => toggleOpenIndex(id)}
                    className="w-full py-4 flex justify-between items-center text-left"
                  >
                    <span className="text-lg font-mono text-white pr-4">{faq.question}</span>
                    <div className="flex-shrink-0">
                    {openIndex === id ? (
                        <div className=" p-2 rounded-[4px]">
                          <ChevronDown  className="w-5 h-5 text-[#394DFF]" />
                        </div>
                      ) : (
                        <div >
                          <ChevronRight className="w-5 h-5 text-[#394DFF]" />
                        </div>
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openIndex === id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-400 pb-4 font-mono">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
