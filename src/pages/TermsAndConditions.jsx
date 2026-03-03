import React from 'react';

const TermsAndService = () => {
  return (
    <div className="min-h-screen bg-[#FCFCFC] font-sans antialiased text-slate-900">
      <div className="h-1 bg-[#b91c1c] w-full"></div>

      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-4 lg:sticky lg:top-20 h-fit">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-none">
              Terms of
              <span className="text-[#b91c1c]"> Service</span>
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
                  By accessing the Sheetal Property platform, you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service. These terms govern all professional interactions, property listings, and consultancy services provided through our digital infrastructure.
                </p>
              </section>

              <div className="space-y-20">
                
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <span className="text-[#b91c1c] mr-4 text-sm font-black italic">01/</span>
                    Authorized Use of Platform
                  </h2>
                  <p className="text-slate-600 mb-4 leading-8">
                    Our platform is designed to facilitate transparent real estate transactions. Users are granted a limited license to browse listings and utilize our inquiry tools. Prohibited activities include:
                  </p>
                  <ul className="space-y-4 text-slate-600 border-l border-slate-100 pl-6 ml-2">
                    <li><span className="text-slate-900 font-bold">Automated Data Mining:</span> The use of "bots" or scraping tools to extract property data is strictly forbidden.</li>
                    <li><span className="text-slate-900 font-bold">Fraudulent Representation:</span> Submitting false information through requirement forms or agent inquiries.</li>
                    <li><span className="text-slate-900 font-bold">Security Interference:</span> Any attempt to circumvent our digital security protocols or API integrity.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <span className="text-[#b91c1c] mr-4 text-sm font-black italic">02/</span>
                    Property Listings & Accuracy
                  </h2>
                  <p className="text-slate-600 leading-8">
                    While Sheetal Real Estate performs rigorous due diligence on all "Verified" listings, we do not warrant that property descriptions, pricing, or availability are error-free. Users are advised to perform independent physical inspections and legal title verifications before entering into binding financial agreements.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <span className="text-[#b91c1c] mr-4 text-sm font-black italic">03/</span>
                    Intellectual Property Rights
                  </h2>
                  <p className="text-slate-600 leading-8 mb-6">
                    All content, including photography, branding, architectural data, and proprietary code, remains the exclusive property of Sheetal Property Pvt. Ltd. Unauthorized reproduction of our marketing materials or digital assets for commercial use will result in legal escalation under Nepalese copyright statutes.
                  </p>
                  <a 
                    href="mailto:info@sheetalproperty.com" 
                    className="inline-block bg-slate-900 text-white text-xs font-bold px-6 py-3 tracking-widest hover:bg-[#b91c1c] transition-all duration-300 uppercase"
                  >
                    Report Infringement
                  </a>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <span className="text-[#b91c1c] mr-4 text-sm font-black italic">04/</span>
                    Limitation of Liability
                  </h2>
                  <p className="text-slate-600 leading-8">
                    Sheetal Real Estate shall not be held liable for indirect, incidental, or consequential damages resulting from property market volatility, failed negotiations between third parties, or the temporary unavailability of our digital services. These terms are governed by the laws of Nepal and any disputes shall be resolved in the courts of Kathmandu.
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

export default TermsAndService;