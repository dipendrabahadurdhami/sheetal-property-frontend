import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserInformation } from "../../../features/slices/userInformation";
import apiClient from "../../../utils/apiClient";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
const SocialMedia = ({ data }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    skype: "",
    website_url: "",
    facebook_url: "",
    twitter_url: "",
    linkedin_url: "",
    instagram_url: "",
    googleplus_url: "",
    youtube_url: "",
    pinterest_url: "",
    vimeo_url: "",
  });

  useEffect(() => {
    setForm({
      skype: data?.skype,
      website_url: data?.website_url,
      facebook_url: data?.facebook_url,
      twitter_url: data?.twitter_url,
      linkedin_url: data?.linkedin_url,
      instagram_url: data?.instagram_url,
      googleplus_url: data?.googleplus_url,
      youtube_url: data?.youtube_url,
      pinterest_url: data?.pinterest_url,
      vimeo_url: data?.vimeo_url,
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
    const formData = new FormData();
    const newData = { ...data, ...form };

    Object.entries(newData).map((item) => {
      formData.append(item[0], item[1]);
    });
    setLoading(true);
    try {
      await apiClient.post("update-profile", formData).then((res) => {
        if (res.status === 200) {
          dispatch(fetchUserInformation());
          setLoading(false);
          toast.success(`Profile Social Media updated successfully.`);
        } else {
          setLoading(false);
          toast.error(res.message);
        }
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error(
        `There's an error updating social media. Please contact admin`
      );
    }
  };
  return (
    <div className="space-y-5 md:space-y-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900">Social Link</h1>
      </div>
      <form
        className="grid md:grid-cols-2 gap-5 md:gap-10"
        onSubmit={handleFormSubmit}
      >
        <label className="flex flex-col space-y-2">
          <span>Skype</span>
          <input
            name="skype"
            value={form.skype}
            type="text"
            onChange={onInputChange}
            className="p-2 border border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span>Website URL</span>
          <input
            type="text"
            name="website_url"
            value={form.website_url}
            onChange={onInputChange}
            className="p-2 border border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span>Facebook URL</span>
          <input
            type="text"
            name="facebook_url"
            value={form.facebook_url}
            onChange={onInputChange}
            className="p-2 border border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span>Twitter URL</span>
          <input
            type="text"
            name="twitter_url"
            value={form.twitter_url}
            onChange={onInputChange}
            className="p-2 border border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span>Linkedin URL</span>
          <input
            name="linkedin_url"
            value={form.linkedin_url}
            onChange={onInputChange}
            type="text"
            className="p-2 border border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span>Instagram URL</span>
          <input
            type="text"
            name="instagram_url"
            value={form.instagram_url}
            onChange={onInputChange}
            className="p-2 border border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span>Google Plus URL</span>
          <input
            type="text"
            name="googleplus_url"
            value={form.googleplus_url}
            onChange={onInputChange}
            className="p-2 border border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span>Youtube URL</span>
          <input
            name="youtube_url"
            value={form.youtube_url}
            onChange={onInputChange}
            type="text"
            className="p-2 border border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span>Pinterest URL</span>
          <input
            name="pinterest_url"
            value={form.pinterest_url}
            onChange={onInputChange}
            type="text"
            className="p-2 border border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>
        <label className="flex flex-col space-y-2">
          <span>Vimeo URL</span>
          <input
            name="vimeo_url"
            value={form.vimeo_url}
            onChange={onInputChange}
            type="text"
            className="p-2 border border-gray-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-red-700 focus-visible:ring-offset-2 focus-visible:border-red-700"
          />
        </label>
        <div></div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="text-white font-medium bg-red-700 rounded px-5 py-2"
            disabled={loading}
          >
            {loading ? <FaSpinner className="spin" /> : "Update Social Links"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialMedia;
