import React from "react";
import Chats from "../components/MyProfile/Chats";
import SEO from "../components/SEO/SEO";

const Message = () => {
  return (
    <>
      <SEO title="Messages" description="Your messages on Sheetal Property Nepal." path="/my-profile/messages" noindex />
      <Chats />
    </>
  );
};

export default Message;
