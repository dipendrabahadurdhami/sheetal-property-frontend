import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FCFCFC] font-sans antialiased text-slate-900">
      <div className="h-1 bg-[#b91c1c] w-full"></div>


      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-28">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 lg:sticky lg:top-20 h-fit">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-none">
              Privacy
              <span className="text-[#b91c1c]"> Policy</span>
            </h1>
            <div className="space-y-4">
              <div className="h-px w-20 bg-slate-200"></div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Effective Date
              </p>
              <p className="text-lg font-medium text-slate-600">
                February 25, 2026
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 max-w-3xl">
            <div className="prose prose-slate prose-lg">

              <section className="mb-16">
                <p className="text-xl leading-relaxed text-slate-600 font-medium">
                  Sheetal Real Estate (referred to as "we", "us", or "our") is dedicated to safeguarding the personal data of our clients and website visitors. This document details our protocols for data acquisition, storage, and dissemination.
                </p>
              </section>

              <div className="space-y-20">

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <span className="text-[#b91c1c] mr-4 text-sm font-black italic">01/</span>
                    Data Governance & Collection
                  </h2>
                  <p className="text-slate-600 mb-4 leading-8">
                    During the course of our professional engagement, we collect identifying information essential for real estate transactions. This is categorized as:
                  </p>
                  <ul className="space-y-4 text-slate-600 border-l border-slate-100 pl-6 ml-2">
                    <li><span className="text-slate-900 font-bold">Client Identification:</span> Legal name, contact identifiers, and residential preferences.</li>
                    <li><span className="text-slate-900 font-bold">Transaction Records:</span> Financial documentation and property interaction history.</li>
                    <li><span className="text-slate-900 font-bold">Digital Analytics:</span> System-generated data including IP protocols and behavioral tracking via Meta Pixel and Google Analytics.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <span className="text-[#b91c1c] mr-4 text-sm font-black italic">02/</span>
                    Operational Usage
                  </h2>
                  <p className="text-slate-600 leading-8">
                    Data processing is conducted strictly for operational efficiency. We utilize your information to facilitate property matchings, manage rental portfolios, and execute marketing strategies that align with your expressed interests. Processing is carried out under the legal basis of contractual necessity and legitimate business interest.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <span className="text-[#b91c1c] mr-4 text-sm font-black italic">03/</span>
                    Third-Party Disclosure
                  </h2>
                  <p className="text-slate-600 leading-8 mb-6">
                    We maintain a strict policy against the commercial sale of personal data. Information is only disclosed to authorized service providers (e.g., cloud hosting, CRM systems) under rigorous confidentiality agreements. For insights into how third-party advertising platforms handle your data, please refer to the following:
                  </p>
                  <a
                    href="https://www.facebook.com/privacy-policy"
                    target="_blank"
                    className="inline-block bg-slate-900 text-white text-xs font-bold px-6 py-3 tracking-widest hover:bg-[#b91c1c] transition-all duration-300 uppercase"
                  >
                    Meta Privacy Framework
                  </a>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <span className="text-[#b91c1c] mr-4 text-sm font-black italic">04/</span>
                    Rights of the Data Subject
                  </h2>
                  <p className="text-slate-600 leading-8">
                    In accordance with global data protection standards, you possess the right to access your stored records, request rectification of inaccuracies, or demand the erasure of your data from our active databases. To exercise these rights, please contact our compliance department.
                  </p>
                </section>

                <section className="mt-24 pt-12 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <p className="text-slate-700 font-bold tracking-tight">
                        Sheetal Real Estate Pvt. Ltd.

                      </p>
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold mb-1 text-lg underline decoration-[#b91c1c] underline-offset-4">	shetalrealestate@gmail.com</p>

                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;