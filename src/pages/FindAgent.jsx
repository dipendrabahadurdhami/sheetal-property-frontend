import axios from "axios";
import React, { useEffect, useState } from "react";
import AgentSearch from "../components/Common/SearchBox/AgentSearch";
import AgentList from "../components/findAgent/AgentList";
import Loader from '../components/Loader';

const FindAgent = () => {
  const [filter, setFilter] = useState('');

  const [agents,setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterAgents, setFilterAgents] = useState([])

  const fetchAgents = async () => {
    setLoading(true);
    await axios.get(`${process.env.REACT_APP_API_LINK}/agent-list`).then(res=>{
      if(res.status === 200){
        setLoading(false);
        setAgents(res.data.data);
        setFilterAgents(res.data.data);
      }
    }).catch(err=>{
      setLoading(false);
    })
  }

  useEffect(()=>{
    fetchAgents();
  },[])

  useEffect(()=>{
   if(filter){
    const filteredAgents = agents && agents.filter(item=> {
      return(
        (item.address_1 && item.address_1.toLowerCase().includes(filter.toLowerCase())) || 
        (item.address_2 && item.address_2.toLowerCase().includes(filter.toLowerCase())) || 
        (item.first_name && item.first_name.toLowerCase().includes(filter.toLowerCase())) ||
        (item.last_name && item.last_name.toLowerCase().includes(filter.toLowerCase()))
      )
    })
    setFilterAgents(filteredAgents)
   }
   else{
     setFilterAgents(agents)
   }
  },[filter,agents])
  return (
    <div className="py-10 sm:px-5 lg:p-10 space-y-5 md:space-y-10">
      <div className="text-xl font-bold px-5 md:px-0">
        Real Estate Agents in <span className="text-red-600">Shetal Real State</span>{" "}
      </div>
      <AgentSearch filters={filter} onAgentSearch={setFilter}/>
      {/* <NoAgentFound /> */}

      {loading && <div className="flex py-4 justify-center"><Loader/></div> }
      {!loading && <AgentList agents={filterAgents} />}
    </div>
  );
};

export default FindAgent;
