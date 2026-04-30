import React, { useEffect, useState } from "react";
import UserHead from "../components/SingleProduct/UserHead";
import Description from "../components/SingleProduct/Description";
import ScheduleTour from "../components/scheduleTour/ScheduleTour";
import ContactModel from "../components/SingleProduct/ContactModel";
import ProductLocation from "../components/SingleProduct/ProductLocation";
import ImageGallery from "../components/SingleProduct/ImageGallery";
import PropertyHighlight from "../components/SingleProduct/PropertyHighlight";
import Details from "../components/SingleProduct/Details";
import ToolsWidget from "../components/SingleProduct/ToolsWidget";
import RelatedProperties from "../components/SingleProduct/RelatedProperties";
import BlogStrip from "../components/SingleProduct/BlogStrip";
import ProductMap from "../components/SingleProduct/Details/ProductMap";
import YoutubeVideo from "../components/SingleProduct/Video";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import headTag from "../headTag";
import { FaMapMarkerAlt } from "react-icons/fa";

const SingleProduct = () => {
  const [open, setOpen] = useState(false);
  window.scrollTo(0, 0);
  const { id } = useParams();

  const [property, setProperty] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    FetchData();
    // eslint-disable-next-line
  }, [id]);

  async function FetchData() {
    setLoading(true);
    let isApiEnabled = true;
    try {
      await axios
        .get(`${process.env.REACT_APP_API_LINK}/property-detail/${id}`)
        .then((res) => {
          if (res.status === 200 && isApiEnabled) {
            setProperty(res.data.data);
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    } catch {
      setLoading(false);
    }
  }

  const { name, property_description } = property;

  useEffect(() => {
    name && headTag({ title: name, content: property_description });
  }, [name, property_description]);

  return (
    <>
      {loading && Object.keys(property).length === 0 ? (
        <div className="py-40 flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {!loading && Object.keys(property).length > 0 && (
            <>
              <UserHead setOpen={setOpen} property={property} />

              <div
                style={{ marginTop: "50px" }}
                className="px-5 lg:px-10 py-10 container mx-auto"
              >
                {/* ── Full-width top section ── */}
                <ProductLocation property={property} />
                <ImageGallery property={property} />

                {/* ── Two-column layout ── */}
                <div className="sp-layout" style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 360px",
                  gap: "32px",
                  alignItems: "start",
                  marginTop: "8px",
                }}>

                  {/* ════ LEFT COLUMN ════ */}
                  <div style={{ minWidth: 0 }}>

                    {property?.property_description && (
                      <Description data={property} />
                    )}

                    {property?.property_highlights && (
                      <PropertyHighlight data={property.property_highlights} />
                    )}

                    {/* Details WITHOUT the map (map is in right sidebar) */}
                    <Details data={property} hideMap />

                    {property?.youtube_url && (
                      <YoutubeVideo url={property.youtube_url} />
                    )}

                    <ToolsWidget property={property} />
                    <RelatedProperties property={property} />
                    <BlogStrip />

                  </div>
                  {/* ════ END LEFT COLUMN ════ */}

                  {/* ════ RIGHT COLUMN (sticky sidebar) ════ */}
                  <div className="sp-sidebar" style={{
                    position: "sticky",
                    top: "90px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}>

                    {/* ── Map Card ── */}
                    {property?.latitude && property?.longitude && (
                      <div style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "14px",
                        overflow: "hidden",
                        background: "#fff",
                      }}>
                        {/* Card header */}
                        <div style={{
                          padding: "13px 16px",
                          borderBottom: "1px solid #f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}>
                          <span style={{
                            width: "4px", height: "18px",
                            background: "var(--r, #e53935)",
                            borderRadius: "2px",
                            display: "inline-block",
                          }} />
                          <span style={{
                            fontWeight: "700",
                            fontSize: "15px",
                            color: "var(--d, #111827)",
                          }}>
                            Location on Map
                          </span>
                        </div>

                        {/* Map */}
                        <div style={{ height: "220px", overflow: "hidden" }}>
                          <ProductMap
                            latitude={property.latitude}
                            longitude={property.longitude}
                            data={property}
                          />
                        </div>

                        {/* Address footer */}
                        {property?.property_location && (
                          <div style={{
                            padding: "9px 14px",
                            borderTop: "1px solid #f3f4f6",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "12px",
                            color: "#6b7280",
                          }}>
                            <FaMapMarkerAlt style={{
                              color: "var(--r, #e53935)",
                              fontSize: "11px",
                              flexShrink: 0,
                            }} />
                            <span style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}>
                              {property.property_location}
                              {property.district ? `, ${property.district}` : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── Schedule Tour Card ── */}
                    <div style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      overflow: "hidden",
                      background: "#fff",
                    }}>
                      <ScheduleTour property={property} sidebar />
                    </div>

                  </div>
                  {/* ════ END RIGHT COLUMN ════ */}

                </div>
                {/* ── End two-column ── */}

              </div>

              <ContactModel data={property} open={open} setOpen={setOpen} />
            </>
          )}
        </>
      )}

      {/* Responsive: collapse to single column on tablet/mobile */}
      <style>{`
        @media (max-width: 1024px) {
          .sp-layout {
            grid-template-columns: 1fr !important;
          }
          .sp-sidebar {
            position: static !important;
            top: auto !important;
          }
        }
      `}</style>
    </>
  );
};

export default SingleProduct;