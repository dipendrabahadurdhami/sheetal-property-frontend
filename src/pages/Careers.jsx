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

const JobCard = ({ job }) => (
  <Link to={`/careers/${job.slug}`} className="jc-card">
    {isNew(job.created_at) && <span className="jc-new-badge">New</span>}
    <div className="jc-top">
      <div className="jc-icon"><FaBriefcase /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 className="jc-title">{job.title}</h3>
        <span className={`jc-type jc-type-${job.job_type}`}>{job.job_type.replace("-", " ")}</span>
      </div>
    </div>
    <div className="jc-meta">
      {job.department && <span><FaBuilding  /> {job.department}</span>}
      <span><FaMapMarkerAlt  /> {job.is_remote ? "Remote" : (job.location || "Not specified")}</span>
      {job.experience_level && <span><FaRegUser  /> {job.experience_level}</span>}
    </div>
    <div className="jc-bottom">
      {salaryLabel(job) && <span className="jc-salary">{salaryLabel(job)}</span>}
      {job.application_deadline && <span className="jc-deadline">Apply by {fmtDate(job.application_deadline)}</span>}
      <span className="jc-arrow">View role <FaArrowRight  /></span>
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
    <div className="careers-page">
      <Helmet>
        <title>Careers | Join Our Team</title>
        <meta name="description" content="Explore open positions and apply — no account required." />
      </Helmet>

      <style>{`
        .careers-page { max-width: 1100px; margin: 0 auto; padding: 40px 16px 80px; }
        .cp-hero {
          text-align: center; padding: 52px 24px; margin: 0 0 32px; border-radius: 18px;
          background: linear-gradient(135deg, #1a1a1a 0%, #3a1315 55%, #E8272A 130%);
          color: #fff; position: relative; overflow: hidden;
        }
        .cp-hero::before {
          content: ""; position: absolute; inset: 0;
          background: radial-gradient(circle at 85% 20%, rgba(255,255,255,0.10), transparent 45%);
        }
        .cp-hero-inner { position: relative; z-index: 1; }
        .cp-hero-badge {
          display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.22); color: #fff; font-size: 12px; font-weight: 600;
          padding: 5px 14px; border-radius: 20px; margin-bottom: 16px;
        }
        .cp-hero h1 { font-size: 28px; font-weight: 800; margin: 0 0 12px; color: #fff; }
        .cp-hero p { font-size: 15px; color: rgba(255,255,255,0.85); max-width: 520px; margin: 0 auto; }
        @media(min-width: 640px) { .cp-hero h1 { font-size: 40px; } .cp-hero { padding: 68px 24px; } }

        .cp-filters { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
        .cp-search { flex: 1 1 260px; position: relative; }
        .cp-search input { width: 100%; height: 46px; border-radius: 8px; border: 1px solid #e2e2e2; padding: 0 16px 0 40px; font-size: 14px; outline: none; }
        .cp-search input:focus { border-color: #E8272A; }
        .cp-search i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #999; }
        .cp-select { height: 46px; border-radius: 8px; border: 1px solid #e2e2e2; padding: 0 12px; font-size: 14px; background: #fff; min-width: 150px; }
        .cp-select:focus { border-color: #E8272A; outline: none; }
        .cp-search-btn { height: 46px; padding: 0 22px; background: #E8272A; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .cp-search-btn:hover { background: #c0392b; }

        .cp-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media(min-width: 680px) { .cp-grid { grid-template-columns: 1fr 1fr; } }
        @media(min-width: 992px) { .cp-grid { grid-template-columns: 1fr 1fr 1fr; } }

        .jc-card { display: block; position: relative; background: #fff; border: 1px solid #eee; border-radius: 14px; padding: 20px; text-decoration: none; color: inherit; transition: box-shadow .2s, transform .2s, border-color .2s; }
        .jc-card:hover { box-shadow: 0 10px 28px rgba(0,0,0,0.09); transform: translateY(-3px); border-color: #f3d3d3; text-decoration: none; color: inherit; }
        .jc-new-badge { position: absolute; top: 14px; right: 14px; background: #27ae60; color: #fff; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; letter-spacing: 0.3px; }
        .jc-top { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; }
        .jc-icon { flex-shrink: 0; width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, #fdeceb, #fbd8d6); color: #E8272A; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .jc-title { font-size: 16px; font-weight: 700; color: #1a1a1a; margin: 0 0 6px; line-height: 1.3; }
        .jc-type { flex-shrink: 0; font-size: 10.5px; font-weight: 700; text-transform: capitalize; padding: 4px 9px; border-radius: 20px; background: #fdeceb; color: #E8272A; white-space: nowrap; }
        .jc-meta { display: flex; flex-direction: column; gap: 5px; font-size: 12.5px; color: #777; margin-bottom: 14px; }
        .jc-meta i { width: 14px; color: #aaa; }
        .jc-bottom { display: flex; flex-direction: column; gap: 6px; padding-top: 12px; border-top: 1px solid #f2f2f2; }
        .jc-salary { font-size: 13px; font-weight: 700; color: #1a1a1a; }
        .jc-deadline { font-size: 11.5px; color: #999; }
        .jc-arrow { font-size: 12.5px; font-weight: 600; color: #E8272A; margin-top: 4px; }

        .cp-empty, .cp-error, .cp-loading { text-align: center; padding: 60px 20px; color: #888; }
        .cp-pagination { display: flex; justify-content: center; gap: 8px; margin-top: 34px; }
        .cp-page-btn { width: 38px; height: 38px; border-radius: 8px; border: 1px solid #e2e2e2; background: #fff; cursor: pointer; font-weight: 600; }
        .cp-page-btn.active { background: #E8272A; color: #fff; border-color: #E8272A; }
        .cp-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .icon-spin { animation: cp-spin 0.8s linear infinite; }
        @keyframes cp-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="cp-hero">
        <div className="cp-hero-inner">
          <span className="cp-hero-badge"><FaBriefcase /> We're hiring</span>
          <h1>Join Our Team</h1>
          <p>We're always looking for talented people. Browse open roles below — you can apply directly, no account needed.</p>
        </div>
      </div>

      <form className="cp-filters" onSubmit={onSearchSubmit}>
        <div className="cp-search">
          <FaSearch  />
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

      {loading && <div className="cp-loading"><FaSpinner className="icon-spin"  /> Loading open positions...</div>}

      {!loading && error && <div className="cp-error">{error}</div>}

      {!loading && !error && jobs.length === 0 && (
        <div className="cp-empty">
          <FaBriefcase style={{ fontSize: 28, display: "block", marginBottom: 10 }}  />
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
                <FaChevronLeft  />
              </button>
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((n) => (
                <button key={n} className={`cp-page-btn ${n === page ? "active" : ""}`} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button className="cp-page-btn" disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>
                <FaChevronRight  />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Careers;
