import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import About from "../components/findAgent/SingleAgent/About";
import ContactForm from "../components/findAgent/SingleAgent/ContactForm";
import PersonalInfo from "../components/findAgent/SingleAgent/PersonalInfo";
import Loader from "../components/Loader";

const SingleAgent = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const fetchAgentDetail = async () => {
    setLoading(true);
    await axios
      .get(`${process.env.REACT_APP_API_LINK}/agent-detail/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAgentDetail();

    // eslint-disable-next-line
  }, []);
  return (
    <React.Fragment>
      {loading && (
        <div className="py-16 flex justify-center items-center">
          <Loader />
        </div>
      )}
      {!loading && data && (
        <div className="p-5 lg:p-10 grid gap-10 lg:gap-20 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <PersonalInfo data={data} />
            <About data={data} />
          </div>
          <div>
            <ContactForm data={data} />
          </div>
        </div>
      )}
      {!loading && data === null && (
        <div>
          <p className="text-center font-bold py-16">
            Agent Information not found!!
          </p>{" "}
          <Link to="/agents">View All Agents</Link>
        </div>
      )}
    </React.Fragment>
  );
};

export default SingleAgent;
