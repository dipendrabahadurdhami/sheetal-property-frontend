const headTag = ({ title, content }) => {
  document.title = title;
  const metaContent = document.querySelector("head meta[name='description'");
  metaContent && (metaContent.content = content);
};

export default headTag;
