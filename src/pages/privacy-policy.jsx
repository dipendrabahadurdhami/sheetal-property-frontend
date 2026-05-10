import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FCFCFC] font-sans antialiased text-slate-900">
      <div className="h-1 bg-[#b91c1c] w-full"></div>

      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 h-fit">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-none">
              Privacy
              <span className="text-[#b91c1c]"> Policy</span>
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
                  Sheetal Property Pvt. Ltd. (“Sheetal Real Estate”, “Company”, “we”, “our”, or “us”) respects
                  the privacy of all individuals who interact with our website, services, property listings,
                  marketing campaigns, and real estate consultation activities. <br /><br />
                  This Privacy Policy explains how we collect, use, process, store, and protect personal
                  information when you use our website, submit property inquiries, communicate with
                  our agents, or interact with our digital advertisements including Facebook and
                  Instagram lead generation campaigns <br /><br />
                  By accessing our website or submitting any information through forms,
                  advertisements, or communication channels, you acknowledge that you have read
                  and understood this Privacy Policy and agree to the practices described in this
                  document. <br /><br />
                  This Privacy Policy applies to all users including property buyers, sellers, tenants,
                  investors, website visitors, agents, and any person interacting with Sheetal Property
                  services.
                </p>
              </section>

              <div className="space-y-20">
                {/* 01. Purpose of This Privacy Policy */}
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <span className="">1. &nbsp; </span>
                    Purpose of This Privacy Policy
                  </h2>
                  <p className="text-slate-600 mb-4 leading-8">
                    The purpose of this Privacy Policy is to clearly explain how Sheetal Property collects and uses personal information in order to provide real estate services, respond to property inquiries, facilitate property transactions, and improve our marketing and customer communication systems. This policy ensures transparency regarding:
                  </p>
                  <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2">
                    <li>What personal information is collected </li>
                    <li>Why the information is collected </li>
                    <li>How the information is used </li>
                    <li>How information may be shared with third-party services</li>
                    <li>How users can access or control their personal information</li>
                  </ul>
                </section>

                {/* 02. Information We Collect */}
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">

                    2. Information We Collect
                  </h2>
                  <p className="text-slate-600 leading-8 mb-6">
                    When users interact with our website or services, we may collect different types of
                    information depending on how the user communicates with us. <br /> <br />
                    The information collected may include both personal information provided by users
                    and technical information automatically collected by our systems.
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">  2.1 Personal Information Provided by Users:</h3>
                  <ul className="space-y-4 text-slate-600  font-bold pl-6 ml-2 mb-6">
                    <li>Full name</li>
                    <li>Phone number or mobile number</li>
                    <li>Email address</li>
                    <li>Temporary address</li>
                    <li>Permanent address</li>
                    <li>Occupation or profession</li>
                    <li>Property preferences (buy, sell, rent, invest)</li>
                    <li>Preferred location for property search</li>
                    <li>Budget range (minimum and maximum)</li>
                    <li>Property requirements such as land, house, flat, or commercial space</li>
                    <li>Additional notes or messages submitted through inquiry forms</li>
                  </ul><br />
                  <p className="text-slate-600 leading-8 mb-6">
                    &nbsp; These details are typically collected through the following channels:
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">2.2 Property Inquiry and Requirement Information</h3>
                  <p className="text-slate-600 leading-8 mb-4">
                    When users submit a Property Requirement Form, additional details may be collected to help match users with appropriate properties. This may include:
                  </p>
                  <ul className="space-y-4 text-slate-600 font-bold border-l border-slate-100 pl-6 ml-2 mb-6">
                    <li>Preferred property location</li>
                    <li>Property type (house, land, flat, commercial property)</li>
                    <li>Budget range</li>
                    <li>Rental or purchase preferences</li>
                    <li>Required facilities such as water supply, electricity, internet, parking, etc.</li>
                    <li>Description or additional requests</li>
                  </ul>
                  <p className="text-slate-600 leading-8 mb-6">
                    This information allows our team to identify suitable properties and respond effectively to client needs.
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mb-4">2.3 Automatically Collected Technical Information</h3>
                  <p className="text-slate-600 leading-8 mb-4">
                    When users visit our website, certain technical information may automatically be
                    collected through cookies, analytics tools, and tracking technologies.
                    This may include:
                  </p>
                  <ul className="space-y-4 text-slate-600 font-bold border-l border-slate-100 pl-6 ml-2 mb-6">
                    <li>IP address</li>
                    <li>Device type</li>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages visited on our website</li>
                    <li>Time spent on pages</li>
                    <li>Interaction with property listings</li>
                    <li>Referring website or advertising source</li>
                  </ul>
                  <p className="text-slate-600 leading-8 mb-6">
                    This data helps us analyze website traffic, improve user experience, and understand
                    visitor behavior.
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">2.4 Data Collected Through Advertising Platforms</h3>
                  <p className="text-slate-600 leading-8 mb-4">
                    Sheetal Property may run digital advertising campaigns on platforms such as
                    Facebook and Instagram to promote property listings and real estate services.
                    When users interact with these advertisements or submit lead forms, the following
                    information may be collected:
                  </p>
                  <ul className="space-y-4 text-slate-600 font-bold border-l border-slate-100 pl-6 ml-2 mb-6">
                    <li>Name</li>
                    <li>Phone number</li>
                    <li>Email address</li>
                    <li>Property interest</li>
                    <li>Location preference</li>
                  </ul>
                  <p className="text-slate-600 leading-8 mb-4">
                    This information is used solely to respond to user inquiries and provide relevant
                    property details.
                  </p>
                  <p className="text-slate-600 leading-8 mb-6">
                    Advertising platforms may also collect certain interaction data according to their
                    own privacy policies.
                  </p>

                </section>


                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    3. Purpose of Data Collection
                  </h2>
                  <p className="text-slate-600 leading-8 mb-6">
                    The information collected by Sheetal Property is used for legitimate business
                    purposes related to real estate services and communication with potential clients.
                    The main purposes include:
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">3.1 Property Inquiry Management</h3>
                  <p className="text-slate-600 leading-8 mb-6">
                    Information submitted through forms allows us to respond to inquiries regarding
                    property listings, property availability, pricing, and property details.
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">3.2 Property Matching</h3>
                  <p className="text-slate-600 leading-8 mb-6">
                    User preferences such as location, property type, and budget help us match users
                    with appropriate property listings.
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">3.3 Client Communication</h3>
                  <p className="text-slate-600 leading-8 mb-6">
                    Contact information allows our team to communicate with users regarding property
                    options, site visits, negotiations, and real estate consultation.
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">3.4 Customer Support</h3>
                  <p className="text-slate-600 leading-8 mb-6">
                    Personal information helps us respond to customer questions, provide guidance, and
                    resolve inquiries related to property services.
                  </p>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">3.5 Marketing and Advertising</h3>
                  <p className="text-slate-600 leading-8 mb-4">
                    User data may also be used to support digital marketing activities, including
                    advertising campaigns designed to promote property listings and real estate
                    services. Marketing purposes may include:
                  </p>
                  <ul className="space-y-4 text-slate-600 font-bold border-l border-slate-100 pl-6 ml-2 mb-6">
                    <li>Showing relevant property advertisements</li>
                    <li>Retargeting website visitors with property offers</li>
                    <li>Improving advertisement performance</li>
                    <li>Measuring the effectiveness of marketing campaigns</li>
                  </ul>
                  <p className="text-slate-600 leading-8 mb-6">
                    Advertising and marketing activities may involve the use of analytics tools and
                    advertising technologies.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">

                    4. Advertising Technologies and Tracking
                  </h2>
                  <p className="text-slate-600 leading-8 mb-4">
                    Sheetal Property may use advertising technologies such as Meta Pixel (Facebook
                    Pixel) and other tracking tools to measure and improve advertising performance.
                    Meta Pixel helps us understand how users interact with our website after viewing or
                    clicking on our advertisements.
                  </p>
                  <p className="text-slate-600 leading-8 mb-4">
                    These technologies help us:
                  </p>
                  <ul className="space-y-4 text-slate-600 font-bold border-l border-slate-100 pl-6 ml-2 mb-6">
                    <li>Measure the effectiveness of Facebook and Instagram advertisements</li>
                    <li>Understand which advertisements generate property inquiries</li>
                    <li>Improve advertisement targeting</li>
                    <li>Deliver more relevant advertisements to interested users</li>
                  </ul>
                  <p className="text-slate-600 leading-8 mb-4">
                    These tracking technologies may collect information such as page visits, browsing
                    behavior, and interactions with property listings.
                  </p>
                  <p className="text-slate-600 leading-8 mb-4">
                    Meta may process this information according to its own privacy policy.
                  </p>
                  <p className="text-slate-600 leading-8 mb-6">
                    Meta Privacy Policy: <br />
                    <a href="https://www.facebook.com/privacy/policy" className="text-[#b91c1c] underline underline-offset-4">https://www.facebook.com/privacy/policy</a>
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">

                    5. Cookies and Website Analytics
                  </h2>
                  <p className="text-slate-600 leading-8 mb-4">
                    Our website may use cookies and similar technologies to improve website
                    functionality and analyze user behavior.
                    Cookies are small data files stored on your device that help websites remember user
                    preferences and improve browsing experience.
                  </p>
                  <p className="text-slate-600 leading-8 mb-4">
                    Cookies may be used for the following purposes:
                  </p>
                  <ul className="space-y-4 text-slate-600 font-bold border-l border-slate-100 pl-6 ml-2 mb-6">
                    <li>Maintaining website functionality</li>
                    <li>Understanding user navigation patterns</li>
                    <li>Improving website performance</li>
                    <li>Supporting advertising analytics</li>
                  </ul>
                  <p className="text-slate-600 leading-8 mb-4">
                    Users may disable cookies through their browser settings if they prefer not to allow
                    cookies.
                  </p>
                  <p className="text-slate-600 leading-8 mb-6">
                    However, disabling cookies may affect certain website features.
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                   
                   6. How We Store and Protect Your Data
                  </h2>
                  <p className="text-slate-600 leading-8 mb-4">
                    Sheetal Property takes reasonable steps to protect personal information from
                    unauthorized access, misuse, alteration, or disclosure.
                    Security measures may include:
                  </p>
                  <ul className="space-y-4 text-slate-600 font-bold border-l border-slate-100 pl-6 ml-2 mb-6">
                    <li>Secure server hosting</li>
                    <li>Access restrictions for internal systems</li>
                    <li>Controlled access to customer information</li>
                    <li>Technical monitoring and security protocols</li>
                  </ul>
                  <p className="text-slate-600 leading-8 mb-4">
                    Although we strive to protect user data, no online platform can guarantee complete
                    security.
                  </p>
                  <p className="text-slate-600 leading-8 mb-6">
                    Users are encouraged to share information responsibly when interacting with any
                    online platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                   
                    7. Data Sharing and Third-Party Services
                  </h2>
                  <p className="text-slate-600 leading-8 mb-4">
                    Sheetal Property does not sell or trade personal information to third parties.
                    However, in certain circumstances information may be shared with trusted service
                    providers who assist us in operating our business.
                  </p>
                  <p className="text-slate-600 leading-8 mb-4">
                    These service providers may include:
                  </p>
                  <ul className="space-y-4 text-slate-600 font-bold border-l border-slate-100 pl-6 ml-2 mb-6">
                    <li>Website hosting providers</li>
                    <li>Cloud service providers</li>
                    <li>Customer relationship management (CRM) systems</li>
                    <li>Marketing and advertising platforms</li>
                    <li>Analytics service providers</li>
                  </ul>
                  <p className="text-slate-600 leading-8 mb-6">
                    These partners are required to maintain confidentiality and use information only for
                    service-related purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    
                    8.Legal Compliance and Disclosure
                  </h2>
                  <p className="text-slate-600 leading-8 mb-4">
                    We may disclose personal information when required to comply with legal
                    obligations. This may occur if information is requested by:
                  </p>
                  <ul className="space-y-4 text-slate-600 font-bold border-l border-slate-100 pl-6 ml-2 mb-6">
                    <li>Government authorities</li>
                    <li>Law enforcement agencies</li>
                    <li>Courts of law</li>
                    <li>Regulatory authorities</li>
                  </ul>
                  <p className="text-slate-600 leading-8 mb-6">
                    Such disclosure will only occur when legally required.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    
                    9. User Rights and Control Over Personal Information
                  </h2>
                  <p className="text-slate-600 leading-8 mb-4">
                    Users have certain rights regarding their personal information. These rights may include:
                  </p>
                  <ul className="space-y-4 text-slate-600 font-bold border-l border-slate-100 pl-6 ml-2 mb-6">
                    <li>Requesting access to personal data stored by our company</li>
                    <li>Requesting correction of inaccurate information</li>
                    <li>Requesting deletion of personal data</li>
                    <li>Requesting to stop marketing communication</li>
                  </ul>
                  <p className="text-slate-600 leading-8 mb-4">
                    Users may contact us to exercise these rights.
                  </p>
                  <p className="text-slate-600 leading-8 mb-6">
                    Requests will be processed within a reasonable time frame.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  
                   10. Data Retention
                  </h2>
                  <p className="text-slate-600 leading-8 mb-4">
                    Personal information may be retained for as long as necessary to fulfill business
                    purposes, respond to property inquiries, and maintain communication with clients.
                  </p>
                  <p className="text-slate-600 leading-8 mb-4">
                    Information may also be retained for record-keeping purposes or to comply with
                    legal obligations.
                  </p>
                  <p className="text-slate-600 leading-8 mb-6">
                    When personal information is no longer necessary, it may be securely deleted or
                    anonymized.
                  </p>
                </section>
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  
                    11. Third-Party Links                  </h2>
                  <p className="text-slate-600 leading-8 mb-4">
                    Our website may contain links to external websites including property listings, partner
                    services, or advertising platforms.
                  </p>
                  <p className="text-slate-600 leading-8 mb-4">
                    These external websites operate independently and have their own privacy policies.
                    Sheetal Property is not responsible for the privacy practices of third-party websites.
                  </p>
                  <p className="text-slate-600 leading-8 mb-6">
                    Users are encouraged to review the privacy policies of external websites before
                    providing personal information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    
                    12.Policy Updates
                  </h2>
                  <p className="text-slate-600 leading-8 mb-4">
                    Sheetal Property may update this Privacy Policy from time to time in order to reflect
                    changes in services, technology, legal requirements, or advertising standards.
                  </p>
                  <p className="text-slate-600 leading-8 mb-4">
                    When updates are made, the revised policy will be published on this page with an
                    updated effective date.
                  </p>
                  <p className="text-slate-600 leading-8 mb-6">
                    Users are encouraged to review this page periodically.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                   
                    13. Contact Information
                  </h2>
                  <p className="text-slate-600 leading-8 mb-12">
                    If you have any questions regarding this Privacy Policy or the way your personal
                    information is handled, please contact us using the details below.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-200">
                    <div>
                      <p className="text-slate-700 font-bold tracking-tight">
                        Sheetal Property Pvt. Ltd.
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        We are committed to protecting user privacy and maintaining transparency in all our
                        digital operations and real estate services.
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
    </div>
  );
};

export default PrivacyPolicy;