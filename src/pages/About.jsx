import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ─── Animated counter hook ───────────────────────────────────────────────────
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─── Intersection observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ value, suffix = "", label, inView }) {
  const count = useCountUp(value, 2000, inView);
  return (
    <div className="text-center px-6 py-8 border-r border-gray-100 last:border-r-0">
      <div className="text-4xl md:text-5xl font-bold text-red-700 leading-none">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm text-gray-500 uppercase tracking-widest font-medium">{label}</div>
    </div>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────────
function ServiceCard({ icon, title, desc, delay }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.6s ease" }}
      className="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-5 group-hover:bg-red-700 transition-colors duration-300">
        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── Team card ────────────────────────────────────────────────────────────────
function TeamCard({ name, role, image, delay }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.6s ease" }}
      className="group text-center"
    >
      <div className="relative w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-gray-100 group-hover:ring-red-200 transition-all duration-300">
        <img
          src={image || "/noUser.png"}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = "/noUser.png"; }}
        />
      </div>
      <h4 className="font-bold text-gray-900">{name}</h4>
      <p className="text-red-700 text-sm font-medium">{role}</p>
    </div>
  );
}

// ─── Value card ───────────────────────────────────────────────────────────────
function ValueCard({ number, title, desc, delay }) {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, opacity: inView ? 1 : 0, transform: inView ? "translateX(0)" : "translateX(-20px)", transition: "all 0.5s ease" }}
      className="flex gap-5 items-start"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-700 text-white flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

// ─── Main About page ──────────────────────────────────────────────────────────
const About = () => {
  const [statsRef, statsInView] = useInView(0.3);
  const [heroRef, heroInView] = useInView(0.1);

  useEffect(() => {
    document.title = "About Us | Sheetal Real Estate Nepal";
  }, []);

  const services = [
    { icon: "🏠", title: "Buy Property", desc: "Find your dream home from thousands of verified listings across Nepal — houses, apartments, land and more." },
    { icon: "🔑", title: "Rent & Lease", desc: "Flexible rental options for residential and commercial spaces. We match tenants with the right properties." },
    { icon: "📈", title: "Investment", desc: "Smart investment opportunities in Nepal's growing real estate market with expert guidance and analysis." },
    { icon: "🏢", title: "Property Management", desc: "End-to-end property management services so landlords can sit back and earn without the hassle." },
    { icon: "🤝", title: "Agent Network", desc: "A trusted network of experienced local agents who know every neighbourhood, road and colony." },
    { icon: "🔍", title: "Market Analysis", desc: "Data-driven insights and market reports to help you make informed real estate decisions in Nepal." },
  ];

  const values = [
    { number: "01", title: "Trust & Transparency", desc: "We operate with complete honesty — no hidden fees, no misleading listings. What you see is what you get." },
    { number: "02", title: "Client First", desc: "Every decision we make revolves around your best interest, whether you're a first-time buyer or seasoned investor." },
    { number: "03", title: "Deep Local Expertise", desc: "15+ years operating in Nepal means we know the market, the laws, and the land better than anyone." },
    { number: "04", title: "End-to-End Support", desc: "From your first site visit to final paperwork, we are with you at every step of the journey." },
  ];

  const team = [
    { name: "Sheetal Shah", role: "Managing Director", image: "/noUser.png" },
    { name: "Property Expert", role: "Senior Agent", image: "/noUser.png" },
    { name: "Investment Advisor", role: "Investment Lead", image: "/noUser.png" },
    { name: "Legal Consultant", role: "Legal & Compliance", image: "/noUser.png" },
  ];

  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gray-950 overflow-hidden min-h-[520px] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/20 to-transparent" />

        <div
          ref={heroRef}
          className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-24 grid md:grid-cols-2 gap-16 items-center"
        >
          <div style={{ opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(40px)", transition: "all 0.8s ease" }}>
            <div className="inline-flex items-center gap-2 bg-red-700/20 border border-red-700/30 text-red-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Est. 2009 · Kathmandu, Nepal
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Nepal's First<br />
              <span className="text-red-500">Property Management</span><br />
              Company
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              शितलता प्रदान गर्दै — Sheetal Real Estate has been Nepal's most trusted real estate partner since 2009, helping over 10,000 families buy, sell, rent and invest in property.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/productSearch?advertisement_purpose=For Sale"
                className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                Browse Properties
              </Link>
              <a href="tel:+9779801000434"
                className="border border-gray-600 hover:border-red-500 text-gray-300 hover:text-red-400 px-6 py-3 rounded-lg font-semibold transition-all duration-200">
                +977 9801000434
              </a>
            </div>
          </div>

          <div style={{ opacity: heroInView ? 1 : 0, transform: heroInView ? "translateX(0)" : "translateX(40px)", transition: "all 0.8s ease 0.2s" }}
            className="hidden md:grid grid-cols-2 gap-4">
            {[
              { label: "Families Served", value: "10,000+" },
              { label: "Years Experience", value: "15+" },
              { label: "Active Listings", value: "2,400+" },
              { label: "Cities Covered", value: "20+" },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold text-red-400 mb-1">{item.value}</div>
                <div className="text-gray-400 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="bg-white border-y border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          <StatCard value={10000} suffix="+" label="Families Served" inView={statsInView} />
          <StatCard value={15} suffix="+" label="Years Experience" inView={statsInView} />
          <StatCard value={2400} suffix="+" label="Active Listings" inView={statsInView} />
          <StatCard value={20} suffix="+" label="Cities in Nepal" inView={statsInView} />
        </div>
      </section>

      {/* ── OUR STORY ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-red-700 text-sm font-semibold uppercase tracking-widest">Our Story</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6 leading-tight">
            Built on Trust,<br />Driven by Excellence
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Founded in 2009 and headquartered in Bansbari, Kathmandu, Sheetal Real Estate began with a single mission — to bring professionalism, transparency, and trust to Nepal's real estate market.
            </p>
            <p>
              As <strong className="text-gray-900">Nepal's first dedicated property management firm</strong>, we pioneered a new standard of service. While others listed properties, we built relationships. While others closed deals, we opened doors to lifelong partnerships.
            </p>
            <p>
              Today, under the leadership of Managing Director <strong className="text-gray-900">Sheetal Shah</strong>, we operate across 20+ cities in Nepal, offering exclusive Buy, Sell, Rent and Investment services to thousands of happy clients every year.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <img src="/logo.png" alt="Sheetal" className="h-12" onError={(e) => e.target.style.display = "none"} />
            <div>
              <div className="font-bold text-gray-900">Sheetal Real Estate Pvt. Ltd.</div>
              <div className="text-sm text-gray-500">Bansbari, Opposite to Namuna Fashion College, Kathmandu</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <img src="/home-banner1.gif" alt="Property Nepal" className="rounded-2xl w-full h-48 object-cover"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80"; }} />
            <img src="/home-banner2.gif" alt="Kathmandu Real Estate" className="rounded-2xl w-full h-48 object-cover mt-8"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80"; }} />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-4 bg-red-700 text-white rounded-2xl px-6 py-4 shadow-xl">
            <div className="text-2xl font-bold">15+</div>
            <div className="text-xs opacity-80">Years in Nepal</div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <span className="text-red-700 text-sm font-semibold uppercase tracking-widest">What We Do</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Our Services</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Everything you need under one roof — from finding a home to managing your investment portfolio.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <ServiceCard key={s.title} {...s} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-red-700 text-sm font-semibold uppercase tracking-widest">Why Choose Us</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-10 leading-tight">
            The Sheetal Standard
          </h2>
          <div className="space-y-8">
            {values.map((v, i) => (
              <ValueCard key={v.number} {...v} delay={i * 120} />
            ))}
          </div>
        </div>
        <div className="bg-gray-950 rounded-3xl p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-700/20 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="text-5xl mb-6">🏆</div>
            <h3 className="text-2xl font-bold mb-4">Nepal's Most Trusted Real Estate Brand</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              With 15 years of consistent excellence, Sheetal Real Estate has earned the trust of families, investors, landlords and tenants across Nepal.
            </p>
            <div className="space-y-3">
              {["10,000+ Families Served", "Nepal's First Property Management Firm", "20+ Cities Across Nepal", "Verified Listings Only"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-700 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-14">
            <span className="text-red-700 text-sm font-semibold uppercase tracking-widest">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">The People Behind Sheetal</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Experienced professionals dedicated to making your real estate journey smooth and successful.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {team.map((member, i) => (
              <TeamCard key={member.name} {...member} delay={i * 100} />
            ))}
          </div>
          <p className="text-center text-gray-400 text-sm mt-10">* Team photos will be updated with actual staff images</p>
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────────────────────── */}
      <section className="bg-red-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-red-100 text-lg mb-8">Our experts are available 6 days a week. Let's talk about your real estate goals.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+9779801000434"
              className="bg-white text-red-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              📞 Call: +977 9801000434
            </a>
            <a href="mailto:info@sheetalproperty.com"
              className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-red-800 transition-colors duration-200">
              ✉️ info@sheetalproperty.com
            </a>
          </div>
          <p className="text-red-200 text-sm mt-6">
            📍 Bansbari, Opposite to Namuna Fashion College, Kathmandu, Nepal
          </p>
        </div>
      </section>

    </div>
  );
};

export default About;