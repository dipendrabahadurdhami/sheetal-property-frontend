import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { FaSpinner, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import KhaltiCheckout from "khalti-checkout-web";

const PaymentFormModal = ({
  data,
  open,
  setOpen,
  action,
  onPaymentFormClose,
  loading,
}) => {
  const onFormSubmit = async (e) => {
    e.preventDefault();
  };

  const [paymentMode, setPaymentMode] = useState("");

  let amount;

  if (data.tenant_option === "Rent") amount = 300;
  if (data.tenant_option === "Sale") amount = 500;
  if (data.tenant_option === "Invest") amount = 500;

  let config = {
    // replace this key with yours
    publicKey: process.env.REACT_APP_KHALTI_PUBLIC_KEY,
    productIdentity: "ShetalRealState",
    productName: "Shetal Property Requirement Form ",
    productUrl: "https://sheetalproperty-nine.vercel.app/",
    eventHandler: {
      onSuccess(payload) {
        // hit merchant api for initiating verfication
        action("khalti", payload);
      },
      onError(error) {
        // handle errors
        toast.error("There's an error paying with Khalti");
        onPaymentFormClose();
      },
      onClose() {
        onPaymentFormClose();
      },
    },
    paymentPreference: ["KHALTI"],
  };

  const payWithKhalti = () => {
    setPaymentMode("khalti");
    let checkout = new KhaltiCheckout(config);
    checkout.show({ amount: 100 * 100 });
  };

  const payWithQrCode = () => {
    setPaymentMode("");
    action("");
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        onClose={() => setOpen(false)}
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
                    <h2>
                      Property Purpose: <strong>{data.tenant_option}</strong>
                    </h2>
                    <p>
                      Amount: Rs. <strong>{amount}</strong>
                    </p>

                    <div>
                      <div
                        className={`w-full cursor-pointer bg-red-700 py-2 font-semibold text-white flex items-center justify-center rounded-lg`}
                        onClick={payWithKhalti}
                      >
                        {loading && paymentMode === "khalti" ? (
                          <FaSpinner className="spin" />
                        ) : (
                          "Pay Online"
                        )}
                      </div>
                    </div>

                    {/* Qr Code */}
                    <div className="text-center text-sm space-y-2">
                      <div>Or,</div>
                      <div className="font-medium">
                        Pay through QR code and our agent will contact you.
                      </div>
                      <div className="flex justify-center pt-2">
                        <div className="border w-40 h-40">
                          <img
                            src="/fone-pay-qr.png"
                            alt=""
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div
                        className={`w-full cursor-pointer bg-red-700 py-2 font-semibold text-white flex items-center justify-center rounded-lg`}
                        onClick={payWithQrCode}
                      >
                        {loading && paymentMode === "" ? (
                          <FaSpinner className="spin" />
                        ) : (
                          "Paid Through Qr Code"
                        )}
                      </div>
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
