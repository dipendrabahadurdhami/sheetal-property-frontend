import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FaExclamationCircle, FaUpload, FaSpinner, FaBriefcase, FaArrowLeft,
  FaBuilding, FaMapMarkerAlt, FaRegUser, FaUsers, FaRegCalendarAlt,
  FaInfoCircle, FaCheckCircle,
} from "react-icons/fa";
import jobApi from "../utils/jobApi";
import "../index.css";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

const salaryLabel = (job) => {
  if (!job.show_salary || (!job.min_salary && !job.max_salary)) return null;
  const cur = job.salary_currency || "NPR";
  if (job.min_salary && job.max_salary) return `${cur} ${Number(job.min_salary).toLocaleString()} - ${Number(job.max_salary).toLocaleString()}`;
  if (job.min_salary) return `${cur} ${Number(job.min_salary).toLocaleString()}+`;
  return `Up to ${cur} ${Number(job.max_salary).toLocaleString()}`;
};

// Accepts whatever someone actually types — "facebook.com/x", "www.x.com",
// "linkedin.com/in/x" — and turns it into a real, clickable URL. Without
// this, a bare domain (no http/https) fails backend URL validation and
// the application silently gets rejected on submit.
const normalizeUrl = (raw) => {
  const v = (raw || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v.replace(/^\/+/, "")}`;
};

const asParagraphs = (text) =>
  (text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const ApplyForm = ({ job, onSuccess }) => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", cover_letter: "",
    portfolio_url: "", linkedin_url: "", expected_salary: "", experience_years: "",
  });
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setError("Resume must be under 5MB.");
      return;
    }
    setError("");
    setResume(f);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!resume) { setError("Please attach your resume (PDF or Word doc)."); return; }
    setSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      const fd = new FormData();
      const cleaned = {
        ...form,
        portfolio_url: normalizeUrl(form.portfolio_url),
        linkedin_url: normalizeUrl(form.linkedin_url),
      };
      Object.entries(cleaned).forEach(([k, v]) => { if (v) fd.append(k, v); });
      fd.append("resume", resume);

      const res = await jobApi.apply(job.slug, fd);
      if (res.data?.status === 200) {
        onSuccess();
      } else {
        setError(res.data?.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setFieldErrors(err.response.data.errors || {});
        setError("Please check the highlighted fields.");
      } else {
        setError(err.response?.data?.message || "Something went wrong submitting your application. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="af-form" onSubmit={onSubmit}>
      {error && <div className="af-error"><FaExclamationCircle /> {error}</div>}

      <div className="af-row">
        <div className="af-field">
          <label>Full Name *</label>
          <input required value={form.name} onChange={update("name")} placeholder="Your full name" />
          {fieldErrors.name && <span className="af-field-err">{fieldErrors.name[0]}</span>}
        </div>
        <div className="af-field">
          <label>Email *</label>
          <input required type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
          {fieldErrors.email && <span className="af-field-err">{fieldErrors.email[0]}</span>}
        </div>
      </div>

      <div className="af-row">
        <div className="af-field">
          <label>Phone *</label>
          <input required value={form.phone} onChange={update("phone")} placeholder="98XXXXXXXX" />
          {fieldErrors.phone && <span className="af-field-err">{fieldErrors.phone[0]}</span>}
        </div>
        <div className="af-field">
          <label>Years of Experience</label>
          <input type="number" min="0" value={form.experience_years} onChange={update("experience_years")} placeholder="e.g. 3" />
        </div>
      </div>

      <div className="af-row">
        <div className="af-field">
          <label>Expected Salary</label>
          <input type="number" min="0" value={form.expected_salary} onChange={update("expected_salary")} placeholder="Optional" />
        </div>
        <div className="af-field">
          <label>LinkedIn Profile <small>any format works</small></label>
          <input value={form.linkedin_url} onChange={update("linkedin_url")} placeholder="linkedin.com/in/yourname" />
        </div>
      </div>

      <div className="af-field">
        <label>Portfolio / Website <small>optional — any format works</small></label>
        <input value={form.portfolio_url} onChange={update("portfolio_url")} placeholder="yourwebsite.com" />
      </div>

      <div className="af-field">
        <label>Cover Letter</label>
        <textarea rows="4" value={form.cover_letter} onChange={update("cover_letter")} placeholder="Tell us why you're a great fit (optional)" />
      </div>

      <div className="af-field">
        <label>Resume / CV * <small>PDF or Word, max 5MB</small></label>
        <div className="af-file-wrap">
          <input type="file" id="resumeInput" accept=".pdf,.doc,.docx" onChange={onFile} required />
          <label htmlFor="resumeInput" className="af-file-btn">
            <FaUpload /> {resume ? resume.name : "Choose file"}
          </label>
        </div>
        {fieldErrors.resume && <span className="af-field-err">{fieldErrors.resume[0]}</span>}
      </div>

      <button type="submit" className="af-submit" disabled={submitting}>
        {submitting ? <><FaSpinner className="icon-spin" /> Submitting...</> : "Submit Application"}
      </button>
      <p className="af-note">No account needed — we'll reach out by email or phone.</p>
    </form>
  );
};

const JobDetails = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setShowApply(false);
    setApplied(false);
    jobApi.getBySlug(slug)
      .then((res) => setJob(res.data?.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="ab">
        <div className="jd-page"><div className="jd-loading"><FaSpinner className="icon-spin" /> Loading job details...</div></div>
        <style>{JD_CSS}</style>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="ab">
        <div className="jd-page">
          <div className="jd-notfound">
            <FaBriefcase style={{ fontSize: 28, display: "block", marginBottom: 12, color: "#9ca3af" }} />
            <h2>Job posting not found</h2>
            <p>It may have been closed or removed.</p>
            <Link to="/careers" className="jd-back-link">&larr; Back to all openings</Link>
          </div>
        </div>
        <style>{JD_CSS}</style>
      </div>
    );
  }

  const isOpen = job.status === "published" &&
    (!job.application_deadline || new Date(job.application_deadline) >= new Date(new Date().toDateString()));

  return (
    <div className="ab">
      <Helmet>
        <title>{job.title} | Careers</title>
        <meta name="description" content={(job.description || "").slice(0, 155)} />
      </Helmet>

      <style>{JD_CSS}</style>

      <div className="jd-page">
        <Link to="/careers" className="jd-back"><FaArrowLeft /> Back to all openings</Link>

        <div className="jd-layout">
          <div className="jd-main">
            <div className="jd-head">
              <span className="jd-type">{job.job_type?.replace("-", " ")}</span>
              <h1 className="jd-title">{job.title}</h1>
              <div className="jd-meta-row">
                {job.department && <span><FaBuilding /> {job.department}</span>}
                <span><FaMapMarkerAlt /> {job.is_remote ? "Remote" : (job.location || "Not specified")}</span>
                {job.experience_level && <span><FaRegUser /> {job.experience_level} level</span>}
                <span><FaUsers /> {job.vacancies} opening{job.vacancies > 1 ? "s" : ""}</span>
                {job.application_deadline && <span><FaRegCalendarAlt /> Apply by {fmtDate(job.application_deadline)}</span>}
              </div>
            </div>

            {job.description && (
              <div className="jd-section">
                <h3>About the Role</h3>
                <p style={{ whiteSpace: "pre-line" }}>{job.description}</p>
              </div>
            )}

            {job.responsibilities && (
              <div className="jd-section">
                <h3>Responsibilities</h3>
                <ul>{asParagraphs(job.responsibilities).map((l, i) => <li key={i}>{l.replace(/^[-*•]\s*/, "")}</li>)}</ul>
              </div>
            )}

            {job.requirements && (
              <div className="jd-section">
                <h3>Requirements</h3>
                <ul>{asParagraphs(job.requirements).map((l, i) => <li key={i}>{l.replace(/^[-*•]\s*/, "")}</li>)}</ul>
              </div>
            )}

            {job.benefits && (
              <div className="jd-section">
                <h3>Benefits</h3>
                <ul>{asParagraphs(job.benefits).map((l, i) => <li key={i}>{l.replace(/^[-*•]\s*/, "")}</li>)}</ul>
              </div>
            )}

            {job.skills_array?.length > 0 && (
              <div className="jd-section">
                <h3>Skills</h3>
                <div className="jd-skills">{job.skills_array.map((s) => <span key={s} className="jd-skill-pill">{s}</span>)}</div>
              </div>
            )}
          </div>

          <div className="jd-side">
            <div className="jd-side-card">
              {job.agency_logo && (
                <div className="jd-side-agency">
                  <img
                    src={job.agency_logo}
                    alt={job.agency_name || "Agency logo"}
                    onError={(e) => { e.currentTarget.closest(".jd-side-agency").style.display = "none"; }}
                  />
                  {job.agency_name && <span>{job.agency_name}</span>}
                </div>
              )}
              {salaryLabel(job) && (
                <div className="jd-side-salary">{salaryLabel(job)}</div>
              )}
              <div className="jd-side-row"><FaBuilding /> {job.department || "General"}</div>
              <div className="jd-side-row"><FaMapMarkerAlt /> {job.is_remote ? "Remote" : (job.location || "Not specified")}</div>
              <div className="jd-side-row"><FaUsers /> {job.vacancies} opening{job.vacancies > 1 ? "s" : ""}</div>
              {job.application_deadline && (
                <div className="jd-side-row"><FaRegCalendarAlt /> Apply by {fmtDate(job.application_deadline)}</div>
              )}

              {!isOpen && (
                <div className="jd-closed-banner">
                  <FaInfoCircle /> No longer accepting applications.
                </div>
              )}

              {isOpen && !showApply && (
                <button
                  className="jd-apply-btn"
                  onClick={() => setShowApply(true)}
                >
                  Apply Now
                </button>
              )}

              {isOpen && showApply && (
                <div className="jd-apply-inline" id="apply-section">
                  {applied ? (
                    <div className="af-success">
                      <FaCheckCircle />
                      <h3>Application Submitted!</h3>
                      <p>Thanks for applying to <strong>{job.title}</strong>. We'll be in touch if you're a good fit.</p>
                      <Link to="/careers" className="jd-back-link">Browse more openings &rarr;</Link>
                    </div>
                  ) : (
                    <>
                      <h3>Apply for this role</h3>
                      <ApplyForm job={job} onSuccess={() => setApplied(true)} />
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JD_CSS = `
  .jd-page { max-width: 1240px; margin: 0 auto; padding: 32px 16px 90px; font-family: 'Outfit', sans-serif; }
  @media(min-width: 640px) { .jd-page { padding: 40px 24px 100px; } }
  .jd-loading, .jd-notfound { text-align: center; padding: 100px 20px; color: #6b7280; font-size: 13.5px; }
  .jd-notfound h2 { color: #0F172A; font-size: 18px; margin: 0 0 8px; }
  .jd-back-link { color: var(--r); font-weight: 700; text-decoration: none; }
  .jd-back { color: #9ca3af; font-size: 12.5px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 24px; transition: color .2s; }
  .jd-back:hover { color: var(--r); }

  .jd-layout { display: grid; grid-template-columns: 1fr; gap: 28px; align-items: start; }
  @media(min-width: 920px) { .jd-layout { grid-template-columns: minmax(0, 1fr) 420px; } }

  .jd-head { border-bottom: 0.5px solid #E9EAEC; padding-bottom: 24px; margin-bottom: 26px; }
  .jd-type { display: inline-block; font-size: 10px; font-weight: 700; text-transform: capitalize; letter-spacing: 0.06em; padding: 4px 11px; border-radius: 4px; background: var(--r06); color: var(--r); margin-bottom: 14px; }
  .jd-title { font-size: 26px; font-weight: 800; margin: 0 0 16px; color: #0F172A; letter-spacing: -0.5px; }
  @media(min-width: 640px) { .jd-title { font-size: 32px; } }
  .jd-meta-row { display: flex; flex-wrap: wrap; gap: 18px; font-size: 13px; color: #6b7280; margin-bottom: 0; }
  .jd-meta-row span { display: flex; align-items: center; gap: 6px; }
  .jd-meta-row svg { color: var(--r); }

  .jd-side { position: relative; }
  @media(min-width: 920px) { .jd-side-card { position: sticky; top: 24px; } }
  .jd-side-card { background: #fff; border: 0.5px solid #E9EAEC; border-radius: 4px; padding: 24px; }
  .jd-side-agency { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 0.5px solid #E9EAEC; }
  .jd-side-agency img { width: 36px; height: 36px; border-radius: 4px; object-fit: contain; background: #fff; border: 0.5px solid #E9EAEC; padding: 3px; flex-shrink: 0; }
  .jd-side-agency span { font-size: 12.5px; font-weight: 700; color: #0F172A; }
  .jd-side-salary { font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 0.5px solid #E9EAEC; }
  .jd-side-row { display: flex; align-items: center; gap: 9px; font-size: 12.5px; color: #4b5563; margin-bottom: 11px; }
  .jd-side-row svg { color: var(--r); flex-shrink: 0; }
  .jd-closed-banner { background: var(--r06); color: #991b1b; padding: 12px 16px; border-radius: 4px; font-size: 13px; font-weight: 600; margin-top: 16px; }
  .jd-apply-btn { width: 100%; background: var(--r); color: #fff; border: none; border-radius: 4px; padding: 13px 30px; font-weight: 700; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; margin-top: 16px; transition: background .2s; font-family: 'Outfit', sans-serif; }
  .jd-apply-btn:hover { background: var(--rd); }
  .jd-apply-btn:disabled { background: #d1d5db; cursor: not-allowed; }

  .jd-section { margin-bottom: 28px; }
  .jd-section h3 { font-size: 15px; font-weight: 800; margin: 0 0 12px; color: #0F172A; letter-spacing: -0.2px; }
  .jd-section p, .jd-section li { font-size: 13.5px; line-height: 1.8; color: #4b5563; }
  .jd-section ul { padding-left: 20px; margin: 0; }
  .jd-skills { display: flex; flex-wrap: wrap; gap: 8px; }
  .jd-skill-pill { background: #F5F6F8; border: 0.5px solid #E9EAEC; color: #4b5563; font-size: 11.5px; font-weight: 600; padding: 5px 12px; border-radius: 4px; }

  .jd-apply-inline { margin-top: 18px; padding-top: 18px; border-top: 0.5px solid #E9EAEC; scroll-margin-top: 20px; }
  .jd-apply-inline h3 { font-size: 15px; font-weight: 800; margin: 0 0 18px; color: #0F172A; }

  .af-form { display: flex; flex-direction: column; gap: 16px; }
  .af-row { display: grid; grid-template-columns: 1fr; gap: 16px; }
  @media(min-width: 380px) { .af-row { grid-template-columns: 1fr 1fr; } }
  .af-field label { display: block; font-size: 12.5px; font-weight: 700; margin-bottom: 6px; color: #0F172A; min-height: 32px; line-height: 1.4; }
  .af-field label small { font-weight: 400; color: #9ca3af; }
  .af-field input, .af-field textarea { width: 100%; border: 1px solid #E9EAEC; border-radius: 4px; padding: 10px 12px; font-size: 13px; outline: none; background: #F5F6F8; font-family: 'Outfit', sans-serif; transition: border-color .2s, background .2s; }
  .af-field input:focus, .af-field textarea:focus { border-color: var(--r); background: #fff; }
  .af-field-err { color: #991b1b; font-size: 11px; margin-top: 4px; display: block; }
  .af-file-wrap input[type=file] { display: none; }
  .af-file-btn { display: inline-flex; align-items: center; gap: 8px; border: 1px dashed #d1d5db; border-radius: 4px; padding: 12px 16px; font-size: 13px; color: #4b5563; cursor: pointer; width: 100%; box-sizing: border-box; transition: border-color .2s, color .2s; }
  .af-file-btn:hover { border-color: var(--r); color: var(--r); }
  .af-error { background: var(--r06); color: #991b1b; padding: 10px 14px; border-radius: 4px; font-size: 12.5px; display: flex; align-items: center; gap: 8px; }
  .af-submit { background: var(--r); color: #fff; border: none; border-radius: 4px; padding: 13px; font-weight: 700; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; transition: background .2s; font-family: 'Outfit', sans-serif; }
  .af-submit:hover { background: var(--rd); }
  .af-submit:disabled { background: #d1d5db; cursor: not-allowed; }
  .af-note { text-align: center; font-size: 11.5px; color: #9ca3af; margin: 0; }

  .af-success { text-align: center; padding: 30px 10px; }
  .af-success svg { font-size: 38px; color: #16a34a; display: block; margin: 0 auto 14px; }
  .af-success h3 { font-size: 17px; margin: 0 0 8px; color: #0F172A; }
  .af-success p { font-size: 13px; color: #6b7280; }
  .icon-spin { animation: jd-spin 0.8s linear infinite; }
  @keyframes jd-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

export default JobDetails;