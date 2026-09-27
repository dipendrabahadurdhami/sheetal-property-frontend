import React from 'react';

const GetYoutubeIdByUrl = (_url) =>{
    const url = _url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}
export default GetYoutubeIdByUrl