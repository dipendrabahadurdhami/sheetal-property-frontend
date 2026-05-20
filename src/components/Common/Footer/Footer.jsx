import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaPhone, FaChevronDown } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import { BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import "./Footer.css";

/* ── Accordion section (collapses on mobile, always open on desktop) ── */
const FooterSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`ft-section${open ? " ft-section--open" : ""}`}>
      <button className="ft-section__toggle" onClick={() => setOpen(!open)}>
        <span className="ft-section__label">
          <span className="ft-lbl-line" />
          {title}
        </span>
        <FaChevronDown className="ft-section__chevron" />
      </button>
      <div className="ft-section__body">{children}</div>
    </div>
  );
};

/* ── Reusable link list ── */
const FtLinks = ({ links }) => (
  <ul className="ft-links">
    {links.map(({ label, to, href, external }, i) =>
      to ? (
        <li key={i}><Link to={to} className="ft-link">{label}</Link></li>
      ) : (
        <li key={i}>
          <a
            href={href}
            className="ft-link"
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {label}
          </a>
        </li>
      )
    )}
  </ul>
);

/* ── Main Footer ── */
const Footer = () => {
  const year = new Date().getFullYear();

  const propertyLinks = [
    { label: "Property in Nepal",     href: "/productSearch?district=kathmandu,lalitpur,bhaktapur" },
    { label: "Property in Kathmandu", href: "/productSearch?keyword=kathmandu" },
    { label: "Property in Lalitpur",   href: "/productSearch?keyword=lalitpur" },
    { label: "Property in Bhaktapur",      href: "/productSearch?keyword=bhaktapur" },
    { label: "Property in Chitwan",     href: "/productSearch?keyword=chitwan" },
  ];
  const quickLinks = [
    { label: "Home",                 to: "/" },
    { label: "Requirement Form",     to: "/requirementForm" },
    { label: "Property Demands",     to: "/propertyDemand" },
    { label: "Privacy Policy",       to: "/privacy-policy" },
    { label: "Terms and Conditions", to: "/terms-and-conditions" },
  ];
  const serviceLinks = [
    { label: "Sale Properties",      to: "/sale" },
    { label: "Rent Properties",      to: "/rent" },
    { label: "Invest in Properties", to: "/investment" },
    { label: "Find Agent",           to: "/agents" },
    { label: "Technical Services",   href: "https://dhamiplus.com", external: true },
  ];

  return (
    <footer className="ft">
      {/* Red top stripe */}
      <div className="ft-stripe" />

      <div className="ft-body">
        {/* ── Brand + Contact block ── */}
        <div className="ft-brand">
          <img src="/shetallogo.png" alt="Shetal Real Estate" className="ft-logo" />
          

          <div className="ft-contact">
            <a href="tel:9801000434" className="ft-contact__item">
              <span className="ft-contact__icon"><FaPhone /></span>
              +977 9801000434
            </a>
            <a href="mailto:shetalrealestate@gmail.com" className="ft-contact__item">
              <span className="ft-contact__icon"><HiMail /></span>
              shetalrealestate@gmail.com
            </a>
          </div>

          <div className="ft-social">
            {[
              { Icon: BsFacebook,  url: process.env.REACT_APP_FACEBOOK_URL },
              { Icon: BsTwitter,   url: process.env.REACT_APP_TWITTER_URL },
              { Icon: BsInstagram, url: process.env.REACT_APP_INSTAGRAM_URL },
            ].map(({ Icon, url }, i) => (
              <a key={i} href={url} target="_blank" rel="noreferrer" className="ft-social__btn">
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Divider between brand and links (mobile only) */}
        <div className="ft-divider-mob" />

        {/* ── Link columns ── */}
        <div className="ft-cols">
          <FooterSection title="Find Property">
            <FtLinks links={propertyLinks} />
          </FooterSection>
          <FooterSection title="Quick Links">
            <FtLinks links={quickLinks} />
          </FooterSection>
          <FooterSection title="Our Services">
            <FtLinks links={serviceLinks} />
          </FooterSection>
        </div>
      </div>

      <div className="ft-divider" />

      {/* ── Lower bar ── */}
      <div className="ft-lower">
        <p>&copy; {year}. Sheetal Property Pvt. Ltd. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;