import AgentListItem from "./ListItem";

const AgentList = ({ agents }) => {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {agents && agents.length > 0 ? (
        agents.map((agent) => (
          <AgentListItem key={agent.id} data={agent} />
        ))
      ) : (
        <div style={{ textAlign:"center", padding:"60px 20px", background:"#fff", borderRadius:16, border:"1px dashed #e5e7eb" }}>
          <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
          <p style={{ fontSize:16, fontWeight:700, color:"#374151" }}>No agents found</p>
          <p style={{ fontSize:14, color:"#9ca3af" }}>Try a different search</p>
        </div>
      )}
    </div>
  );
};

export default AgentList;