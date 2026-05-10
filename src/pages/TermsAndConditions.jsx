import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[#FCFCFC] font-sans antialiased text-slate-900">
      <div className="h-1 bg-[#b91c1c] w-full"></div>

      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 h-fit">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-none">
              Terms &
              <span className="text-[#b91c1c]"> Conditions</span>
            </h1>
            <div className="space-y-4">
              <div className="h-px w-20 bg-slate-200"></div>
              <div className="text-sm font-bold tracking-widest text-slate-400">
                Effective Date
                <p className="text-lg font-medium text-slate-600">February 25, 2026</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-px w-20 bg-slate-200"></div>
              <div className="text-sm font-bold tracking-widest text-slate-400">
                Company
                <p className=" text-slate-600">Sheetal Property Pvt. Ltd.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-px w-20 bg-slate-200"></div>
              <div className="text-sm font-bold tracking-widest text-slate-400">
                Website
                <p className=" text-slate-600">https://www.sheetalproperty.com</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 max-w-3xl">
            <div className="prose prose-slate prose-lg">
              <section className="mb-16">
                <p className="text-sm leading-relaxed text-slate-600 font-medium">
                  These Terms and Conditions govern the use of the website, services, and digital platforms
                  operated by Sheetal Property Pvt. Ltd. (“Sheetal Property”, “Sheetal Real Estate”, “we”, “our”,
                  or “us”). <br /><br />
                  By accessing, browsing, or using the website <a href="https://www.sheetalproperty.com" className="text-[#b91c1c] underline underline-offset-4">https://www.sheetalproperty.com</a>, submitting
                  property inquiries, communicating with agents, or interacting with our services in any form, you
                  acknowledge that you have read, understood, and agreed to comply with these Terms and
                  Conditions. <br /><br />
                  If you do not agree with any part of these Terms and Conditions, you should refrain from using
                  our website and services. <br /><br />
                  These terms apply to all users including:
                </p>
                <ul className="space-y-2 text-sm font-bold text-slate-600 mt-6 list-disc pl-5">
                  <li>Website visitors</li>
                  <li>Property buyers</li>
                  <li>Property sellers</li>
                  <li>Property owners</li>
                  <li>Tenants and landlords</li>
                  <li>Property investors</li>
                  <li>Real estate agents</li>
                  <li>Individuals submitting inquiries or requirement forms</li>
                </ul>
              </section>
              {/* 1. Purpose of the Platform */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">1. &nbsp; </span>
                  Purpose of the Platform
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  Sheetal Property operates an online real estate platform designed to help users explore property
                  opportunities across Nepal. The platform may be used for the following purposes:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Browsing property listings</li>
                  <li>Searching for properties available for sale or rent</li>
                  <li>Submitting property inquiries</li>
                  <li>Posting property requirements</li>
                  <li>Connecting buyers, sellers, tenants, and property agents</li>
                  <li>Exploring property investment opportunities</li>
                  <li>Requesting real estate consultation services</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Our platform is intended to facilitate communication and information exchange between
                  interested parties within the real estate market. <br /><br />
                  Sheetal Property does not act as the legal owner of listed properties unless explicitly stated.
                </p>
              </section>

              {/* 2. Eligibility to Use the Website */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">2. &nbsp; </span>
                  Eligibility to Use the Website
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  By using this website, you confirm that you are legally capable of entering into binding
                  agreements under the laws of Nepal. Users must:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Be at least 18 years of age</li>
                  <li>Provide accurate information when submitting forms</li>
                  <li>Use the platform for lawful purposes only</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  The website must not be used for any illegal, fraudulent, or misleading activities. <br /><br />
                  If we believe that a user has violated these conditions, we reserve the right to restrict or terminate
                  access to our services.
                </p>
              </section>
              {/* 3. Property Listings and Information Accuracy */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">3. &nbsp; </span>
                  Property Listings and Information Accuracy
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  Sheetal Property publishes property listings submitted by property owners, agents, or third-party
                  contributors. While we make reasonable efforts to ensure that listings are accurate and updated,
                  we do not guarantee that property details are completely free from errors. <br /><br />
                  Property information may include:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Property price</li>
                  <li>Property size</li>
                  <li>Property location</li>
                  <li>Property availability</li>
                  <li>Property description</li>
                  <li>Facilities and amenities</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Users should understand that:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Property prices may change without prior notice</li>
                  <li>Property availability may change</li>
                  <li>Property information may sometimes be outdated</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Users are strongly advised to perform independent verification before making financial
                  commitments. Recommended verification steps may include:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Physical property inspection</li>
                  <li>Ownership verification</li>
                  <li>Legal document verification</li>
                  <li>Consultation with legal professionals</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Sheetal Property shall not be held responsible for financial decisions made based on listing
                  information.
                </p>
              </section>

              {/* 4. User Responsibilities */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">4. &nbsp; </span>
                  User Responsibilities
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  Users interacting with our website must follow responsible and lawful practices.
                  Users agree to:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Provide truthful and accurate information</li>
                  <li>Avoid submitting misleading inquiries</li>
                  <li>Respect communication guidelines when contacting agents</li>
                  <li>Use the platform for legitimate property purposes</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Users must not:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Submit fraudulent property inquiries</li>
                  <li>Attempt to manipulate property listings</li>
                  <li>Harass property owners or agents</li>
                  <li>Use the platform for spam or promotional abuse</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Violation of these conditions may result in suspension of platform access.
                </p>
              </section>
              {/* 5. Submission of Property Requirements */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">5. &nbsp; </span>
                  Submission of Property Requirements
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  Users may submit property requirement forms on our website to describe their property needs.
                  These requirements may include:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Preferred location</li>
                  <li>Budget range</li>
                  <li>Property type</li>
                  <li>Facilities and amenities</li>
                  <li>Additional notes</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  By submitting this information, users acknowledge that:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>The information may be used to identify suitable properties</li>
                  <li>Our agents may contact users regarding property options</li>
                  <li>Submitted data may be stored for service purposes</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Submitting a requirement form does not guarantee that a property match will be found.
                </p>
              </section>

              {/* 6. Communication and Contact Consent */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">6. &nbsp; </span>
                  Communication and Contact Consent
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  When users submit their contact information through forms, advertisements, or direct
                  communication, they provide consent to be contacted by Sheetal Property.
                  Communication may occur through:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Phone calls</li>
                  <li>Email communication</li>
                  <li>Messaging applications</li>
                  <li>Marketing notifications</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Communication purposes may include:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Responding to property inquiries</li>
                  <li>Providing property details</li>
                  <li>Scheduling site visits</li>
                  <li>Providing consultation regarding real estate services</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Users may request to stop receiving marketing communication at any time.
                </p>
              </section>

              {/* 7. Advertising and Marketing Activities */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">7. &nbsp; </span>
                  Advertising and Marketing Activities
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  Sheetal Property may promote its services and property listings through digital marketing
                  channels including:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Facebook advertisements</li>
                  <li>Instagram advertisements</li>
                  <li>Search engine marketing</li>
                  <li>Website promotions</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Users who interact with our advertisements may be redirected to our website or lead forms.
                  Information submitted through advertisements may be used to:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Respond to property inquiries</li>
                  <li>Provide property recommendations</li>
                  <li>Improve marketing campaigns</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Advertising platforms may collect interaction data according to their own privacy policies.
                </p>
              </section>
              {/* 8. Intellectual Property Rights */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">8. &nbsp; </span>
                  Intellectual Property Rights
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  All content displayed on the Sheetal Property website is protected by intellectual property laws.
                  This includes:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Company branding</li>
                  <li>Logos</li>
                  <li>Property images</li>
                  <li>Website design</li>
                  <li>Written content</li>
                  <li>Software code</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  These materials are the exclusive property of Sheetal Property Pvt. Ltd. unless otherwise
                  stated. Users are not permitted to:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Copy website content</li>
                  <li>Reproduce property images for commercial use</li>
                  <li>Republish listing data on other platforms without permission</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Unauthorized use of content may lead to legal action under applicable laws.
                </p>
              </section>

              {/* 9. Third-Party Links and External Services */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">9. &nbsp; </span>
                  Third-Party Links and External Services
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  Our website may contain links to third-party websites or external services.
                  These may include:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Property partner websites</li>
                  <li>Social media platforms</li>
                  <li>External service providers</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  These external websites operate independently and have their own policies.
                  Sheetal Property is not responsible for the content, privacy practices, or services offered by third-party websites. <br /><br />
                  Users should review external website policies before interacting with those platforms.
                </p>
              </section>

              {/* 10. Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">10. &nbsp; </span>
                  Limitation of Liability
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  Sheetal Property provides property information and consultation services but does not guarantee
                  the outcome of property transactions. We shall not be liable for:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Disputes between buyers and sellers</li>
                  <li>Financial losses related to property investments</li>
                  <li>Incorrect information submitted by third parties</li>
                  <li>Changes in property market conditions</li>
                  <li>Temporary website downtime</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  All users are responsible for conducting proper due diligence before entering into property
                  agreements.
                </p>
              </section>

              {/* 11. Website Availability */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">11. &nbsp; </span>
                  Website Availability
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  We aim to maintain continuous access to our website and services.
                  However, the website may occasionally be unavailable due to:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Technical maintenance</li>
                  <li>Server issues</li>
                  <li>Security upgrades</li>
                  <li>External service interruptions</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Sheetal Property does not guarantee uninterrupted access to the website.
                </p>
              </section>
              {/* 12. Data Security and Platform Protection */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">12. &nbsp; </span>
                  Data Security and Platform Protection
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  Users must not attempt to interfere with the security of our website.
                  Prohibited actions include:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Attempting to hack the platform</li>
                  <li>Injecting malicious software</li>
                  <li>Accessing restricted areas of the website</li>
                  <li>Attempting to extract data using automated tools</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Any attempt to compromise website security may result in legal action.
                </p>
              </section>

              {/* 13. Account Registration (If Applicable) */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">13. &nbsp; </span>
                  Account Registration (If Applicable)
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  If the website allows users to create accounts in the future, users will be responsible for:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Maintaining password confidentiality</li>
                  <li>Protecting account credentials</li>
                  <li>Preventing unauthorized access</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Users must notify us immediately if they suspect unauthorized access to their account.
                </p>
              </section>

              {/* 14. Modifications to the Website */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">14. &nbsp; </span>
                  Modifications to the Website
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  Sheetal Property reserves the right to modify or update the website and services at any time.
                  This may include:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>Adding new property features</li>
                  <li>Updating property listing systems</li>
                  <li>Improving website functionality</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Users acknowledge that services may evolve over time.
                </p>
              </section>

              {/* 15. Changes to Terms and Conditions */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">15. &nbsp; </span>
                  Changes to Terms and Conditions
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  These Terms and Conditions may be updated periodically to reflect changes in services,
                  technology, legal regulations, or business operations. When updates occur:
                </p>
                <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2 mb-6">
                  <li>The updated Terms will be published on this page</li>
                  <li>The effective date will be revised</li>
                </ul>
                <p className="text-slate-600 mb-4 leading-8">
                  Continued use of the website indicates acceptance of updated terms.
                </p>
              </section>

              {/* 16. Governing Law */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="">16. &nbsp; </span>
                  Governing Law
                </h2>
                <p className="text-slate-600 mb-4 leading-8">
                  These Terms and Conditions are governed by the laws of Nepal. <br /><br />
                  Any disputes arising from the use of this website shall fall under the jurisdiction of the courts
                  located in Kathmandu, Nepal.
                </p>
              </section>

              {/* 17. Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  11. Contact Information
                </h2>
                <p className="text-slate-600 leading-8 mb-12">
                  If you have questions regarding these Terms and Conditions, please contact us.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-200">
                  <div>
                    <p className="text-slate-700 font-bold tracking-tight">
                      Sheetal Property Pvt. Ltd.
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      We are committed to maintaining transparency, professionalism, and trust in all real estate
                      services provided through our platform.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-slate-900 font-bold text-lg underline decoration-[#b91c1c] underline-offset-4">
                      shetalrealestate@gmail.com
                    </p>
                    <p className="text-slate-900 font-bold text-lg">
                      +977 9801000434
                    </p>
                    <p className="text-slate-600 text-sm">
                      https://www.sheetalproperty.com
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;