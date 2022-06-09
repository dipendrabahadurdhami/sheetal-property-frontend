import React, { useEffect, useState } from "react";
import AgentListItem from "./ListItem";

// const applications = [
//   {
//     applicant: {
//       name: "Ricardo Cooper",
//       phone: "+977 9818273645",
//       address: "Golfutar, Kathmandu",
//       email: "ricardo.cooper@example.com",
//       imageUrl:
//         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     },
//     date: "2020-01-07",
//     phone: "+977 9818273645",
//     dateFull: "January 7, 2020",
//     stage: "No local reviews yet.",
//     href: "/singleAgent",
//   },
//   {
//     applicant: {
//       name: "Kristen Ramos",
//       phone: "+977 9818273645",
//       address: "Golfutar, Kathmandu",
//       email: "kristen.ramos@example.com",
//       imageUrl:
//         "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     },
//     date: "2020-01-07",
//     dateFull: "January 7, 2020",
//     phone: "+977 9818273645",
//     stage: "Completed phone screening",
//     href: "/singleAgent",
//   },
//   {
//     applicant: {
//       name: "Ted Fox",
//       phone: "+977 9818273645",
//       email: "ted.fox@example.com",
//       address: "Golfutar, Kathmandu",
//       imageUrl:
//         "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//     },
//     date: "2020-01-07",
//     dateFull: "January 7, 2020",
//     stage: "Completed phone screening",
//     href: "/singleAgent",
//   },
// ];
const AgentList = ({agents}) => {
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
 
        
        {agents && agents.length > 0 && agents.map((agent)=>
          <li key={agent.id}>
            <AgentListItem data={agent}/>
          </li>
          )
        }
        {agents && agents.length === 0 && <li><p>No Agent Found</p></li>}
      </ul>
    </div>
  );
};

export default AgentList;
