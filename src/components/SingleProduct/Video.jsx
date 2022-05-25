import React from "react";
import GetYoutubeIdByUrl from "../../utils/getYoutubeIdByUrl";


const YoutubeVideo = ({url}) => {
  const youtubeId=GetYoutubeIdByUrl(url)
  if(!youtubeId || youtubeId ==="null" ) return <div></div>
  return (
    <div className="py-10 px-5 lg:px-0">

        {youtubeId && 
        <div className='relative' style={{paddingTop:'56.67%'}}>
            <iframe width="100%" className="absolute top-0 left-0 w-full h-full" height="100%" src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        }
        
    </div>
  );
};

export default YoutubeVideo;
