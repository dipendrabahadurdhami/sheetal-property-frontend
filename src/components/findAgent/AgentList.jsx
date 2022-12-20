import AgentListItem from "./ListItem";

const AgentList = ({ agents }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {agents &&
          agents.length > 0 &&
          agents.map((agent) => (
            <li key={agent.id}>
              <AgentListItem data={agent} />
            </li>
          ))}
        {agents && agents.length === 0 && (
          <li>
            <p>No Agent Found</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default AgentList;
