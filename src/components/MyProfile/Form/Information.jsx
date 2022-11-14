import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserInformation } from "../../../features/slices/userInformation";
import apiClient from "../../../utils/apiClient";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
const Information = ({ data }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    user_name: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  useEffect(() => {
    setForm({
      user_name: data?.user_name,
      email: data?.email,
      first_name: data?.first_name,
      last_name: data?.last_name,
    });
  }, [data]);

  const onInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    const newData = { ...data, ...form };

    Object.entries(newData).map((item) => {
      formData.append(item[0], item[1]);
    });

    try {
      await apiClient.post("update-profile", formData).then((res) => {
        if (res.status === 200) {
          dispatch(fetchUserInformation());
          setLoading(false);
          toast.success(`Profile Information updated successfully.`);
        } else {
          setLoading(false);
          toast.error(res.message);
        }
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error(
        `There's an error updating profile information. Please contact admin`
      );
    }
  };
  return (
    <div className="space-y-5 md:space-y-10">
      <div className="max-w-7xl mx-auto ">
        <h1 className="text-2xl font-semibold text-gray-900">Information</h1>
      </div>
      <form
        className="grid md:grid-cols-2 gap-5 md:gap-10"
        onSubmit={handleFormSubmit}
      >
        <label className="flex flex-col space-y-2">
          <span>Username</span>
          <input
            type="text"
            name="user_name"
            placeholder="ramparajuli"
            disabled
            value={form.user_name}
            className="border-gray-500 bg-gray-200 rounded border p-2"
            onChange={onInputChange}
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onInputChange}
            className="border p-2 border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span>First Name</span>
          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={onInputChange}
            className=" border p-2 border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span>Last Name</span>
          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={onInputChange}
            className="border p-2 border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>

        <div></div>
        <div className="flex w-100 justify-end">
          <button
            className="text-white font-medium bg-red-700 rounded px-5 py-2"
            type="submit"
            disabled={loading}
          >
            {loading ? <FaSpinner className="spin" /> : "Update Information"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Information;
