import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, XIcon } from "@heroicons/react/outline";
import { FaSpinner, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import KhaltiCheckout from "khalti-checkout-web";

const PaymentFormModal = ({
  data,
  open,
  setOpen,
  tenants,
  action,
  onPaymentFormClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
  });
  const onFormSubmit = async (e) => {
    e.preventDefault();
  };

  let amount;

  if (data.tenant_option === "Rent") amount = 300;
  if (data.tenant_option === "Sale") amount = 500;
  if (data.tenant_option === "Invest") amount = 500;
  let config = {
    // replace this key with yours
    publicKey: "test_public_key_df3b7db67f2e4517837f0e502b9d444c",
    productIdentity: "ShetalRealState",
    productName: "Shetal Property Requirement Form ",
    productUrl: "https://sheetalproperty-nine.vercel.app/",
    eventHandler: {
      onSuccess(payload) {
        // hit merchant api for initiating verfication
        toast.success("Khalti payment successfull. Please wait for a minute");
        setTimeout(() => {
          action();
        }, 2000);
      },
      // onError handler is optional
      onError(error) {
        // handle errors
        toast.error("There's an error paying with Khalti");
        onPaymentFormClose();
      },
      onClose() {
        toast.info("Khalti widget closed");
        onPaymentFormClose();
      },
    },
    paymentPreference: ["KHALTI"],
  };

  const payWithKhalti = () => {
    let checkout = new KhaltiCheckout(config);
    checkout.show({ amount: amount * 100 });
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
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

          {/* This element is to trick the browser into centering the modal contents. */}
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
              <div className="hidden sm:block absolute top-0 right-0 mr-3 mt-4">
                <button
                  type="button"
                  className="text-white hover:text-red-500 focus:outline-none "
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-8 w-8" aria-hidden="true" />
                </button>
              </div>
              <div className="">
                <div className="sm:flex sm:items-start ">
                  <div className="bg-gray-300 flex space-x-3 items-center p-3 w-full">
                    <div>
                      <FaUserCircle className="text-gray-700 w-10 h-10" />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-sm">
                        Pay with <strong>Khalti</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <form className="space-y-5" onSubmit={onFormSubmit}>
                    {/* <select name="" className="border-b w-full p-2 text-xl" >
                        <option value="">Property Type</option>
                        {tenants && tenants.map(purpose=>{
                            return <option key={purpose.id} value={purpose.name} selected={data?.tenant_option === purpose.name}>{purpose.name}</option>
                        })}
                        
                      </select> */}
                    {/* <input
                      type="text"
                      className="border-b w-full p-2 text-xl"
                      placeholder="Name"
                      name="name"
                      value={form.name}
                      required={true}
                      onChange={(e)=>setForm({...form, [e.target.name]: e.target.value})}
                    /> */}

                    <h2>
                      Property Purpose: <strong>{data.tenant_option}</strong>
                    </h2>
                    <p>
                      Amount: Rs. <strong>{amount}</strong>
                    </p>

                    <div>
                      <button
                        className={`w-full bg-red-700 py-2 text-lg font-bold text-white flex items-center justify-center rounded-lg`}
                        onClick={payWithKhalti}
                      >
                        {loading ? <FaSpinner className="spin" /> : "Pay Now"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PaymentFormModal;
