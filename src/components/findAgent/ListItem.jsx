import React, { useState }  from 'react';
import fallBackSrc from '../../assets/images/noUser.png';
import { ChevronRightIcon } from "@heroicons/react/solid";
import { FaStar } from "react-icons/fa";
import { Link } from 'react-router-dom';
const AgentListItem = ({data}) => {
    const [imageError, setImageError] = useState(false);
    
    return(
        <div className="flex items-center px-4 py-4 sm:px-6">
            <div className="min-w-0 flex-1 flex items-center">
                <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                    <img
                        className="h-full w-full object-cover object-center rounded-full"
                        src={imageError ? fallBackSrc : data.photo }
                        // alt={data.first_name +' '+ data.last_name}
                        onError={()=>setImageError(true)}
                    />
                </div>
                <div className="min-w-0 flex-1 px-4 md:grid lg:grid-cols-3 items-center md:gap-4">
                <div className="space-y-1">
 
                    <Link
                    to="/singleAgent"
                    className="text-sm font-medium text-red-600 truncate"
                    >
                    {data.first_name} {data.last_name}
                    </Link>
                 
                    {/* <p className="flex items-center text-sm text-gray-500">
                    <FaStar
                        className="flex-shrink-0 mr-0.5 h-4 w-4 text-red-700"
                        aria-hidden="true"
                    />
                    <FaStar
                        className="flex-shrink-0 mr-0.5 h-4 w-4 text-red-700"
                        aria-hidden="true"
                    />
                    <FaStar
                        className="flex-shrink-0 mr-0.5 h-4 w-4 text-red-700"
                        aria-hidden="true"
                    />
                    <FaStar
                        className="flex-shrink-0 mr-0.5 h-4 w-4 text-red-700"
                        aria-hidden="true"
                    />
                    <FaStar
                        className="flex-shrink-0 mr-0.5 h-4 w-4 text-red-700"
                        aria-hidden="true"
                    />
                    </p> */}
                    {/* <p className="text-sm text-gray-500 truncate">
                    {application.applicant.address}
                    </p> */}
                </div>
                { (data.address_1 || data.address_2) &&
                <div className="lg:block">
                    <p className="text-sm text-gray-500 truncate">
                        Address: <br/>
                        <strong>{data.address_1}</strong> <br/>
                        <strong>{data.address_2}</strong>
                    </p>
                </div>
                }
                <div className="hidden md:block">
                    <div>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                            {data.email} <br/> {data.website}
                        </p>
                    </div>
                </div>
                </div>
            </div>
            <div>
                <Link to="/singleAgent">
                <ChevronRightIcon
                    className="h-7 w-7 text-red-700"
                    aria-hidden="true"
                />
                </Link>
            </div>
        </div>
    )
}

export default AgentListItem;