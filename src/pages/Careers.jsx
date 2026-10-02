import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  FaSearch, FaBuilding, FaMapMarkerAlt, FaRegUser, FaArrowRight,
  FaBriefcase, FaChevronLeft, FaChevronRight, FaSpinner,
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

const isNew = (createdAt) => {
  if (!createdAt) return false;
  const days = (Date.now() - new Date(createdAt).getTime()) / 86400000;
  return days <= 7;
};

const Lbl = ({ text }) => (
  <div className="lbl">
    <div className="lbl-line" />
    <span className="lbl-txt">{text}</span>
  </div>
);

const JobCard = ({ job }) => (
  <Link to={`/careers/${job.slug}`} className="jc-card">
    {isNew(job.created_at) && <span className="jc-new-badge">New</span>}
    <div className="jc-top">
      <div className="jc-icon">
        {job.agency_logo ? (
          <img
            src={job.agency_logo}
            alt=""
            className="jc-icon-logo"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = ""; }}
          />
        ) : null}
        <FaBriefcase style={job.agency_logo ? { display: "none" } : undefined} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 className="jc-title">{job.title}</h3>
        <span className={`jc-type jc-type-${job.job_type}`}>{job.job_type.replace("-", " ")}</span>
      </div>
    </div>
    <div className="jc-meta">
      {job.department && <span><FaBuilding /> {job.department}</span>}
      <span><FaMapMarkerAlt /> {job.is_remote ? "Remote" : (job.location || "Not specified")}</span>
      {job.experience_level && <span><FaRegUser /> {job.experience_level}</span>}
    </div>
    <div className="jc-bottom">
      {salaryLabel(job) && <span className="jc-salary">{salaryLabel(job)}</span>}
      {job.application_deadline && <span className="jc-deadline">Apply by {fmtDate(job.application_deadline)}</span>}
      <span className="jc-arrow">View role <FaArrowRight /></span>
    </div>
  </Link>
);

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState(null);
  const [filters, setFilters] = useState({ departments: [], job_types: [] });
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [jobType, setJobType] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    jobApi.getFilters().then((res) => setFilters(res.data?.data || { departments: [], job_types: [] })).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await jobApi.getAll({
        search: search || undefined,
        department: department || undefined,
        job_type: jobType || undefined,
        page,
        per_page: 9,
      });
      const data = res.data?.data;
      setJobs(data?.data || []);
      setMeta(data);
    } catch (e) {
      setError("Couldn't load job openings right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }, [search, department, jobType, page]);

  useEffect(() => { load(); }, [load]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  return (
    <div className="ab careers-page">
      <Helmet>
        <title>Careers | Join Our Team</title>
        <meta name="description" content="Explore open positions and apply — no account required." />
      </Helmet>

      <style>{`
        .careers-page { font-family: 'Outfit', sans-serif; }

        /* ── Hero ── */
        .cp-hero { border-bottom: 1px solid #E9EAEC; padding: 64px 16px 40px; }
        @media (min-width: 640px) { .cp-hero { padding: 84px 24px 48px; } }
        .cp-hero-inner { max-width: 1240px; margin: 0 auto; }
        .cp-hero h1 { margin: 0 0 12px; }
        .cp-hero p { font-size: 14px; line-height: 1.75; color: #6b7280; max-width: 520px; margin: 0; }

        /* ── Body container ── */
        .cp-body { max-width: 1240px; margin: 0 auto; padding: 32px 16px 90px; }
        @media (min-width: 640px) { .cp-body { padding: 40px 24px 100px; } }

        /* ── Filters (mobile-first: stacked, full-width; inline from tablet up) ── */
        .cp-filters {
          display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px;
          background: #fff; border: 0.5px solid #E9EAEC; border-radius: 4px; padding: 14px;
        }
        .cp-search { flex: 1 1 100%; position: relative; }
        @media (min-width: 640px) { .cp-search { flex: 1 1 220px; } }
        .cp-search input {
          width: 100%; height: 44px; border-radius: 4px; border: 1px solid #E9EAEC;
          padding: 0 16px 0 40px; font-size: 13.5px; outline: none; font-family: 'Outfit', sans-serif;
          background: #F5F6F8; transition: border-color .2s, background .2s;
        }
        .cp-search input:focus { border-color: var(--r); background: #fff; }
        .cp-search svg { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 13px; }
        .cp-select {
          height: 44px; border-radius: 4px; border: 1px solid #E9EAEC; padding: 0 12px;
          font-size: 13.5px; background: #F5F6F8; font-family: 'Outfit', sans-serif;
          color: #0F172A; transition: border-color .2s, background .2s;
          flex: 1 1 calc(50% - 5px); min-width: 0;
        }
        @media (min-width: 640px) { .cp-select { flex: 0 1 160px; } }
        .cp-select:focus { border-color: var(--r); background: #fff; outline: none; }
        .cp-search-btn {
          height: 44px; padding: 0 26px; background: var(--r); color: #fff; border: none;
          border-radius: 4px; font-weight: 700; font-size: 12px; letter-spacing: 0.06em;
          text-transform: uppercase; cursor: pointer; transition: background .2s;
          font-family: 'Outfit', sans-serif; flex: 1 1 100%;
        }
        @media (min-width: 640px) { .cp-search-btn { flex: 0 0 auto; } }
        .cp-search-btn:hover { background: var(--rd); }

        /* ── Grid ── */
        .cp-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 680px) { .cp-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 992px) { .cp-grid { grid-template-columns: 1fr 1fr 1fr; } }

        .jc-card {
          display: block; position: relative; background: #fff; border: 0.5px solid #E9EAEC;
          border-radius: 4px; padding: 22px; text-decoration: none; color: inherit;
          transition: border-color .25s, transform .25s, box-shadow .25s;
        }
        .jc-card:hover {
          border-color: var(--r); transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(15,23,42,0.08); text-decoration: none; color: inherit;
        }
        .jc-new-badge {
          position: absolute; top: 16px; right: 16px; background: #0F172A; color: #fff;
          font-size: 9px; font-weight: 800; padding: 4px 9px; border-radius: 4px;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .jc-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
        .jc-icon {
          flex-shrink: 0; width: 38px; height: 38px; border-radius: 4px; background: var(--r06);
          color: var(--r); display: flex; align-items: center; justify-content: center; font-size: 15px;
          overflow: hidden;
        }
        .jc-icon-logo { width: 100%; height: 100%; object-fit: contain; padding: 6px; box-sizing: border-box; }
        .jc-title { font-size: 16px; font-weight: 800; color: #0F172A; margin: 0 0 6px; line-height: 1.3; letter-spacing: -0.2px; }
        .jc-type {
          flex-shrink: 0; font-size: 10px; font-weight: 700; text-transform: capitalize;
          padding: 4px 10px; border-radius: 4px; background: var(--r06); color: var(--r);
          white-space: nowrap; letter-spacing: 0.02em;
        }
        .jc-meta { display: flex; flex-direction: column; gap: 6px; font-size: 12.5px; color: #6b7280; margin-bottom: 16px; }
        .jc-meta svg { width: 13px; color: #9ca3af; margin-right: 2px; }
        .jc-bottom { display: flex; flex-direction: column; gap: 6px; padding-top: 14px; border-top: 0.5px solid #E9EAEC; }
        .jc-salary { font-size: 13px; font-weight: 700; color: #0F172A; }
        .jc-deadline { font-size: 11.5px; color: #9ca3af; }
        .jc-arrow { font-size: 12px; font-weight: 700; color: var(--r); margin-top: 4px; letter-spacing: 0.02em; }

        /* ── States ── */
        .cp-empty, .cp-error, .cp-loading {
          text-align: center; padding: 70px 20px; color: #6b7280; font-size: 13.5px;
          background: #fff; border: 0.5px solid #E9EAEC; border-radius: 4px;
        }
        .cp-error { color: #991b1b; }

        /* ── Pagination ── */
        .cp-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 36px; }
        .cp-page-btn {
          width: 38px; height: 38px; border-radius: 4px; border: 0.5px solid #E9EAEC; background: #fff;
          cursor: pointer; font-weight: 700; font-size: 12.5px; color: #0F172A; transition: all .2s;
          font-family: 'Outfit', sans-serif;
        }
        .cp-page-btn:hover:not(:disabled) { border-color: var(--r); color: var(--r); }
        .cp-page-btn.active { background: var(--r); color: #fff; border-color: var(--r); }
        .cp-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .icon-spin { animation: cp-spin 0.8s linear infinite; }
        @keyframes cp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <section className="cp-hero">
        <div className="cp-hero-inner">
          <Lbl text="Careers" />
          <h1 className="h-lg">Join Our Team</h1>
          <p>We're always looking for talented people. Browse open roles below — you can apply directly, no account needed.</p>
        </div>
      </section>

      <div className="cp-body">
        <form className="cp-filters" onSubmit={onSearchSubmit}>
          <div className="cp-search">
            <FaSearch />
            <input
              type="text"
              placeholder="Search job title, department, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="cp-select" value={department} onChange={(e) => { setDepartment(e.target.value); setPage(1); }}>
            <option value="">All Departments</option>
            {filters.departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="cp-select" value={jobType} onChange={(e) => { setJobType(e.target.value); setPage(1); }}>
            <option value="">All Job Types</option>
            {filters.job_types.map((t) => <option key={t} value={t}>{t.replace("-", " ")}</option>)}
          </select>
          <button type="submit" className="cp-search-btn">Search</button>
        </form>

        {loading && <div className="cp-loading"><FaSpinner className="icon-spin" /> Loading open positions...</div>}

        {!loading && error && <div className="cp-error">{error}</div>}

        {!loading && !error && jobs.length === 0 && (
          <div className="cp-empty">
            <FaBriefcase style={{ fontSize: 26, display: "block", margin: "0 auto 12px", color: "#9ca3af" }} />
            No open positions match your search right now. Check back soon!
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <>
            <div className="cp-grid">
              {jobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>

            {meta && meta.last_page > 1 && (
              <div className="cp-pagination">
                <button className="cp-page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  <FaChevronLeft />
                </button>
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((n) => (
                  <button key={n} className={`cp-page-btn ${n === page ? "active" : ""}`} onClick={() => setPage(n)}>{n}</button>
                ))}
                <button className="cp-page-btn" disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Careers;