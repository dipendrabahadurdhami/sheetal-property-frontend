import React from 'react';



let KhaltiConfig = {
    // replace this key with yours
    publicKey: process.env.REACT_APP_KHALTI_TEST_KEY,
    productIdentity: "ShetalRealState",
    productName: "Shetal Property Requirement Form ",
    productUrl: "https://sheetalproperty-nine.vercel.app/",
    eventHandler: {
        onSuccess (payload) {
            // hit merchant api for initiating verfication
            console.log(payload);
        },
        // onError handler is optional
        onError (error) {
            // handle errors
            console.log(error);
        },
        onClose () {
            console.log('widget is closing');
        }
    },
    "paymentPreference": ["KHALTI"],
};

let checkout = new KhaltiCheckout(config);
let btn = document.getElementById("payment-button");
btn.onclick = function () {
    // minimum transaction amount must be 10, i.e 1000 in paisa.
    checkout.show({amount: 1000});
}