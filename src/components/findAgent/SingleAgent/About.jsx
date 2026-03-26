import React from "react";
import {
  IoMailOutline,
  IoCallOutline,
  IoPhonePortraitOutline,
  IoLocationOutline,
  IoCalendarOutline,
} from "react-icons/io5";

const About = ({ data }) => {
  const rows = [
    { icon: IoLocationOutline, label: "Address Line 1",  value: data.address_1  },
    { icon: IoLocationOutline, label: "Address Line 2",  value: data.address_2  },
    { icon: IoMailOutline,     label: "Email Address",   value: data.email      },
    { icon: IoPhonePortraitOutline, label: "Mobile",     value: data.mobile     },
    { icon: IoCallOutline,     label: "Phone",           value: data.phone      },
    { icon: IoCalendarOutline, label: "Member Since",    value: data.created_at },
  ].filter(function(r){ return !!r.value; });

  return (
    <div className="space-y-6 w-full max-w-2xl">
      <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Agent Information
          </p>
          <h2 className="text-base font-bold text-gray-900 mt-0.5">
            Contact Details
          </h2>
        </div>

        <ul className="divide-y divide-gray-100">
          {rows.map(function(row, i){
            var Icon = row.icon;
            return (
              <li key={i} className="flex items-start gap-3 px-5 py-3.5">
                <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-3.5 h-3.5 text-gray-500" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
                    {row.label}
                  </p>
                  <p className="text-sm text-gray-700 font-medium break-all">
                    {row.value}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

      </div>
    </div>
  );
};

export default About;