import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { FaSpinner, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const ContactModel = ({ data, open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    terms: false,
  });

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios
      .post(`${process.env.REACT_APP_API_LINK}/contact-owner`, {
        name: form.name,
        email: form.email,
        mobile_number: "+977" + form.phone,
        property_id: data?.id,
        terms_agrement: form.terms ? "yes" : "no",
      })
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          toast.success("Your details has been sent to the agent.");
          setForm({ name: "", email: "", mobile_number: "", terms: false });
          setOpen(false);
        } else {
          setLoading(false);
          toast.error("Something went wrong. Please try again later");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      {/* ↓ z-[99999] ensures this always sits above navbar, UserHead, TabNav */}
      <Dialog
        as="div"
        className="fixed z-[99999] inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom bg-white rounded-lg pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
              {/* Close button */}
              <div className="hidden sm:block absolute top-0 right-0 mr-3 mt-4">
                <button
                  type="button"
                  className="text-white hover:text-red-500 focus:outline-none"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-8 w-8" aria-hidden="true" />
                </button>
              </div>

              {/* Header */}
              <div className="bg-gray-300 flex space-x-3 items-center p-3 w-full">
                <FaUserCircle className="text-gray-700 w-10 h-10" />
                <div className="flex flex-col">
                  <div>{data?.posted_by}</div>
                  <div className="text-sm">
                    Posted on: <strong>{data?.posted_date}</strong>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="p-5">
                <form className="space-y-5" onSubmit={onFormSubmit}>
                  <input
                    type="text"
                    className="border-b w-full p-2 text-xl"
                    placeholder="Name"
                    name="name"
                    value={form.name}
                    required
                    onChange={(e) =>
                      setForm({ ...form, [e.target.name]: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    className="border-b w-full p-2 text-xl"
                    placeholder="Email"
                    name="email"
                    value={form.email}
                    required
                    onChange={(e) =>
                      setForm({ ...form, [e.target.name]: e.target.value })
                    }
                  />
                  <div className="flex space-x-5">
                    <select className="border-b p-2">
                      <option>Npl +977</option>
                    </select>
                    <input
                      type="text"
                      className="border-b w-full p-2 text-xl"
                      placeholder="Mobile number"
                      name="phone"
                      value={form.phone}
                      required
                      onChange={(e) =>
                        setForm({ ...form, [e.target.name]: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex space-x-4 items-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5"
                      value={form.terms}
                      checked={form.terms}
                      onChange={() =>
                        setForm({ ...form, terms: !form.terms })
                      }
                    />
                    <div>
                      <div>I wish to be contacted by Sheetal Property expert.</div>
                      <div>I agree Sheetal Property Terms and Policy.</div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={!form.terms || loading}
                    className={`w-full bg-red-700 py-2 text-lg font-bold text-white flex items-center justify-center rounded-lg ${
                      !form.terms || loading ? "opacity-50" : ""
                    }`}
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : "Contact Owner"}
                  </button>
                </form>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ContactModel;