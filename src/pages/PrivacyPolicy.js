import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#111827]">
      <div className="h-1.5 bg-[#b91c1c] w-full"></div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-16 border-b border-gray-100 pb-10">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-4">
            Privacy <span className="font-bold">Policy</span>
          </h1>
          <div className="flex items-center text-sm text-gray-500 uppercase tracking-widest">
            <span className="bg-[#b91c1c] text-white px-2 py-0.5 mr-3 text-[10px] font-bold">Official</span>
            Effective Date: February 25, 2026
          </div>
        </header>

        <div className="space-y-12">
          <section>
            <p className="text-lg leading-relaxed text-gray-600 mb-8 italic">
              Sheetal Real Estate respects your privacy and is committed to protecting your personal information.
            </p>
          </section>

          <section className="border-l-2 border-gray-100 pl-8 hover:border-[#b91c1c] transition-colors duration-300">
            <h2 className="text-sm font-bold text-[#b91c1c] uppercase tracking-wider mb-3">01. Information Collection</h2>
            <p className="text-gray-700 leading-7">
              We may collect your name, phone number, email, property preferences, and any details submitted through inquiry or lead forms. 
              We also collect technical data including IP addresses and website interaction data via <strong>cookies and Meta Pixel</strong>.
            </p>
          </section>

          <section className="border-l-2 border-gray-100 pl-8 hover:border-[#b91c1c] transition-colors duration-300">
            <h2 className="text-sm font-bold text-[#b91c1c] uppercase tracking-wider mb-3">02. Purpose of Processing</h2>
            <p className="text-gray-700 leading-7">
              Your information is utilized to respond to inquiries and provide specific property details regarding 
              <strong> sale, rent, or investment opportunities</strong>. We use this data to optimize 
              our advertising campaigns and website performance.
            </p>
          </section>

          <section className="border-l-2 border-gray-100 pl-8 hover:border-[#b91c1c] transition-colors duration-300">
            <h2 className="text-sm font-bold text-[#b91c1c] uppercase tracking-wider mb-3">03. Advertising & Analytics</h2>
            <p className="text-gray-700 leading-7 mb-4">
              We employ Meta Pixel and Google Analytics to measure ad performance. Meta processes 
              this data in accordance with their global privacy standards.
            </p>
            <a 
              href="https://www.facebook.com/privacy-policy" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-bold border-b-2 border-[#b91c1c] pb-0.5 hover:text-[#b91c1c] transition-all"
            >
              EXTERNAL: META PRIVACY POLICY
            </a>
          </section>

          <section className="border-l-2 border-gray-100 pl-8 hover:border-[#b91c1c] transition-colors duration-300">
            <h2 className="text-sm font-bold text-[#b91c1c] uppercase tracking-wider mb-3">04. Data Governance</h2>
            <p className="text-gray-700 leading-7">
              Sheetal Real Estate <strong>does not sell personal data</strong>. Information is shared only with 
              verified hosting and analytics providers. You maintain the right to request access, 
              correction, or deletion of your data at any time.
            </p>
          </section>

          <section className="bg-gray-50 p-8 rounded-sm mt-16 border border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Direct Inquiries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <span className="block text-gray-400 uppercase text-[10px] font-bold">Website</span>
                <span className="font-medium text-gray-800 tracking-tight">www.sheetalproperty.com</span>
              </div>
              <div>
                <span className="block text-gray-400 uppercase text-[10px] font-bold">Official Email</span>
                <span className="font-medium text-[#b91c1c]">info@sheetalproperty.com</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
