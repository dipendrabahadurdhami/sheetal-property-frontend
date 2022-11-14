import * as React from "react";

const CoworkerList = (props) => {
  const [workerStatus, setWorkerStatus] = React.useState([]);
  const [token] = React.useState(() => {
    return "test";
  });
  const toggleStatus = (index) => {
    const isPresent = workerStatus.includes(index);
    if (isPresent) {
      const filtered = workerStatus.filter((ind) => ind != index);
      setWorkerStatus(filtered);
    } else {
      setWorkerStatus([...workerStatus, index]);
    }
  };
  return (
    <>
      {token}
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.coworkers.map((worker, i) => {
            return (
              <tr key={i}>
                <td>{worker.first_name}</td>
                <td>{worker.last_name}</td>
                <td>
                  {" "}
                  {workerStatus.includes(i) ? "In Office" : "Out Of Office"}
                </td>
                <td>
                  {" "}
                  <button type="button" onClick={() => toggleStatus(i)}>
                    Attendance
                  </button>{" "}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

CoworkerList.defaultProps = {
  coworkers: [
    { first_name: "Max", last_name: "Mustermann" },
    { first_name: "Vladimir", last_name: "Leles" },
    { first_name: "Tobias", last_name: "Anhalt" },
  ],
};

export default CoworkerList;
