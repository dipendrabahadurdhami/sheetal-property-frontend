import React from 'react';
import SEO from "../components/SEO/SEO";

const DataDeletion = () => {
  return (
    <div className="min-h-screen bg-[#FCFCFC] font-sans antialiased text-slate-900">
      <div className="h-1 bg-[#b91c1c] w-full"></div>
      <SEO
        title="Data Deletion Instructions - Sheetal Property Nepal"
        description="Instructions for requesting deletion of your personal data from Sheetal Property Nepal."
        path="/data-deletion"
      />

      <div className="max-w-[1536px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 h-fit">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-none">
              Data
              <span className="text-[#b91c1c]"> Deletion</span>
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
                <p className="text-slate-600">Sheetal Property Pvt. Ltd.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-px w-20 bg-slate-200"></div>
              <div className="text-sm font-bold tracking-widest text-slate-400">
                Website
                <p className="text-slate-600">https://www.sheetalproperty.com</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 max-w-3xl">
            <div className="prose prose-slate prose-lg">
              <section className="mb-16">
                <p className="text-sm leading-relaxed text-slate-600 font-medium">
                  Sheetal Property Pvt. Ltd. ("Sheetal Real Estate", "Company", "we", "our", or "us")
                  allows any user — including anyone who has connected our Facebook or Instagram
                  integration — to request that we delete the personal information we hold about them.
                  This page explains what data we may hold and how to request its deletion.
                </p>
              </section>

              <div className="space-y-20">
                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    <span>1. &nbsp;</span>
                    What Data We May Hold
                  </h2>
                  <p className="text-slate-600 mb-4 leading-8">
                    Depending on how you've interacted with us — as a website visitor, property
                    inquirer, registered agent, or through a connected Facebook/Instagram account —
                    we may hold:
                  </p>
                  <ul className="space-y-4 text-slate-600 border-l font-bold border-slate-100 pl-6 ml-2">
                    <li>Your name, phone number, and email address</li>
                    <li>Property inquiries or requirement forms you've submitted</li>
                    <li>Your Facebook Page or Instagram Business account connection details, used only to post property listings on your behalf</li>
                    <li>Basic technical data such as IP address and browser type</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    2. &nbsp; How to Request Deletion
                  </h2>
                  <p className="text-slate-600 leading-8 mb-6">
                    To request that we delete your personal data, contact us using either method below.
                    Please include your full name and the email or phone number associated with your
                    account so we can locate your records.
                  </p>
                  <ul className="space-y-4 text-slate-600 font-bold border-l border-slate-100 pl-6 ml-2 mb-6">
                    <li>Email: shetalrealestate@gmail.com</li>
                    <li>Phone: +977 9801000434</li>
                  </ul>
                  <p className="text-slate-600 leading-8 mb-6">
                    If you connected your Facebook Page through our agent dashboard, you can also
                    remove that connection at any time from within your account by disconnecting
                    social media, and separately revoke our app's access from your own Facebook
                    settings under Settings &amp; Privacy → Settings → Business Integrations.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    3. &nbsp; What Happens Next
                  </h2>
                  <p className="text-slate-600 leading-8 mb-4">
                    Once we receive your request, we will verify your identity and delete or
                    anonymize the personal data we hold about you within a reasonable time frame,
                    except where we are required by law to retain certain records (for example,
                    transaction or tax records).
                  </p>
                  <p className="text-slate-600 leading-8 mb-6">
                    We will confirm with you once the deletion has been completed.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                    4. &nbsp; Contact Information
                  </h2>
                  <p className="text-slate-600 leading-8 mb-12">
                    If you have any questions about this data deletion process, please contact us
                    using the details below.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-slate-200">
                    <div>
                      <p className="text-slate-700 font-bold tracking-tight">
                        Sheetal Property Pvt. Ltd.
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        We are committed to protecting user privacy and maintaining transparency in
                        all our digital operations and real estate services.
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

export default DataDeletion;