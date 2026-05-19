import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import FormFilter from "./FormFilter";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline, IoCloseOutline, IoOptionsOutline } from "react-icons/io5";

const Model = ({ setFilterModal, filterModal }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearchClick = (data) => {
    const p = new URLSearchParams();
    if (search)                      p.set("keyword",                search);
    if (data?.advertisement_purpose) p.set("advertisement_purpose", data.advertisement_purpose);
    if (data?.property_type)         p.set("property_type",         data.property_type);
    if (data?.min_price)             p.set("min_price",             data.min_price);
    if (data?.max_price)             p.set("max_price",             data.max_price);
    if (data?.date_from)             p.set("date_from",             data.date_from);
    if (data?.date_to)               p.set("date_to",               data.date_to);
    navigate({ pathname: "/productSearch", search: `?${p.toString()}` });
  };

  return (
    <Transition.Root show={filterModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={setFilterModal}
      >
        {/* ── Backdrop ── */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* ── Panel ── */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-350"
          enterFrom="opacity-0 translate-y-6"
          enterTo="opacity-100 translate-y-0"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-6"
        >
          <div className="relative min-h-screen flex items-start justify-center pt-10 pb-20 px-4">
            <div
              className="relative w-full max-w-2xl bg-white shadow-2xl"
              style={{ borderRadius: 2 }}
            >

              {/* ── Header ── */}
              <div
                className="flex items-center justify-between px-7 py-5"
                style={{ borderBottom: "0.5px solid #f0f0f0" }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center w-8 h-8"
                    style={{ background: "var(--r06)" }}
                  >
                    <IoOptionsOutline style={{ color: "var(--r)", width: 16, height: 16 }} />
                  </span>
                  <div>
                    <p
                      className="font-semibold text-sm tracking-tight"
                      style={{ color: "var(--d)" }}
                    >
                      Filter Properties
                    </p>
                    <p className="text-xs" style={{ color: "var(--d)", opacity: 0.45 }}>
                      Narrow your search
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFilterModal(false)}
                  className="flex items-center justify-center w-8 h-8 transition-colors"
                  style={{ border: "0.5px solid #e5e7eb", borderRadius: 2 }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--r)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                >
                  <IoCloseOutline style={{ width: 18, height: 18, color: "var(--d)" }} />
                </button>
              </div>

              {/* ── Search input ── */}
              <div className="px-7 pt-6 pb-4">
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                  style={{ color: "var(--r)" }}
                >
                  Keyword
                </p>
                <div className="relative">
                  <IoSearchOutline
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ width: 16, height: 16, color: "var(--d)", opacity: 0.35 }}
                  />
                  <input
                    type="text"
                    name="search"
                    placeholder="City, locality, landmark…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      paddingLeft: 38,
                      borderRadius: 2,
                      fontSize: 13,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                </div>
              </div>

              {/* ── Divider with label ── */}
              <div className="px-7 pb-2 flex items-center gap-3">
                <div className="lbl-line" />
                <span className="lbl-txt">Filters</span>
                <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
              </div>

              {/* ── FormFilter ── */}
              <div className="px-7 pb-7">
                <FormFilter
                  setFilterModal={setFilterModal}
                  setAction={handleSearchClick}
                />
              </div>

            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default Model;