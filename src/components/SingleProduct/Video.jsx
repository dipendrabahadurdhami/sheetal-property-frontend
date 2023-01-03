import React from "react";
import GetYoutubeIdByUrl from "../../utils/getYoutubeIdByUrl";

const YoutubeVideo = ({ url }) => {
  const youtubeId = GetYoutubeIdByUrl(url);
  if (!youtubeId || youtubeId === "null") return <div></div>;

  return (
    <div className="py-6 lg:py-10">
      {youtubeId && (
        <iframe
          className="w-full h-56 md:h-80 lg:h-96 xl:h-[400px] 2xl:h-[500px]"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video player"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default YoutubeVideo;
