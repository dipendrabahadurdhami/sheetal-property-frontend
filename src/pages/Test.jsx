// import React, { useEffect } from 'react';
// import axios from 'axios';

// const findAllCustomerData = async () => {
//     try{
//         var baseURL = 'https://ktwjky3ybe.execute-api.us-east-1.amazonaws.com';
//         const response = await axios.post('customers', {}, { baseURL: baseURL });
//         const customerResArray = [];
//         response.data.customerIds.map(function (customerId) {
//           customerResArray.push(axios.get('customers/' + customerId, { baseURL: baseURL }));
//         });
//         return axios.all(customerResArray).then(axios.spread((...responses)=>{
//             return responses;
//         })).catch(err=> console.log("Responses Error:"+ err.toString()))
//     }catch(error){
//         console.log(error);
//     }
// }

// const Test = () => {
//     useEffect(()=>{
//         findAllCustomerData()
//         .then((customers) => {
//             customers.map(customer=>{
//                 const {id, first_name, last_name} =  customer.data;
//                 console.log(`${id} : ${first_name} : ${last_name}`)
//             })
//         })
//         .catch((err) => {
//             console.error(err);
//         });
//     },[])
//     return(
//         <div></div>
//     );
// }

// export default Test;


import * as React from 'react';

const CoworkerList = (props) => {
  // Todo
  // Add your code here
  // Should return your JSX
  const [workerStatus, setWorkerStatus] = React.useState([]);
  const [token] = React.useState(()=>{
    return 'test'
  })
  const toggleStatus = (index) => {
    const isPresent = workerStatus.includes(index);
    if(isPresent){
        const filtered = workerStatus.filter(ind => ind != index);
        setWorkerStatus(filtered)
    }else{
        setWorkerStatus([...workerStatus, index])
    }
  }
  console.log(props);
  return(
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

                  {props.coworkers.map((worker,i)=>{
                      return  (
                        <tr key={i}>
                            <td>{worker.first_name}</td>
                            <td>{worker.last_name}</td>
                            <td> {workerStatus.includes(i)? 'In Office':'Out Of Office'}</td>
                            <td> <button type='button' onClick={()=>toggleStatus(i)}>Attendance</button> </td>
                        </tr>
                      )
                  })}
                 
   
          </tbody>
      </table>
      </>
  )
};

CoworkerList.defaultProps = {
  coworkers: [
    { first_name: 'Max', last_name: 'Mustermann' },
    { first_name: 'Vladimir', last_name: 'Leles' },
    { first_name: 'Tobias', last_name: 'Anhalt' },
  ],
};

export default CoworkerList;