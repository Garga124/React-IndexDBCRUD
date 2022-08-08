//import logo from './logo.svg';
//import React, { Component } from 'react';

import React, { Component, useEffect, useState } from "react";
import './App.css';
import raw1 from './lib/byteArrayPdf.txt';
import raw2 from './lib/byteArrayPdf13000pages.txt';
import raw3 from './lib/scannedImages.txt';
import raw4 from './lib/TextOnly.txt';

var stubData = { data: [] };
const idb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

var db = null;

// createDB(idb);
function createDB(idb) {
  const createCollectionsInIndexedDB = () => {
    if (!idb) {
      console.log("This browser doesnt support IndexedDB");
      return;
    }
    console.log(idb);

  }
  const request = idb.open("test-db", 2);
  //This is when we need to create a collection
  request.onupgradeneeded = (event) => {
    db = request.result;
    if (!db.ObjectStoreNames) {
      //if( db.ObjectStoreNames.contains('userData'))
      db.createObjectStore("userData", { keyPath: "id" });
    };
  }

  //On Success
  request.onsuccess = () => {
    db = request.result;
    console.log("Database opened Successfully");
  }
  //On Error
  request.onerror = (event) => {
    console.log("Error", event);
    console.log("An error occured with indexed DB");

  };
}



const App = () => {
  var [firstName, setFirstName] = useState('');
  var [lastName, setLastName] = useState('');
  var [email, setEmail] = useState('');
  var [allUsers, setAllUsersData] = useState([]);
  useEffect(() => {
    createDB(idb);
    getAllData();

  }, []);

  const getAllData = () => {
    const dbPromise = idb.open("test-db", 2);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction('userData', 'readonly');
      const userData = tx.objectStore('userData');
      const users = userData.getAll();
      users.onsuccess = (query) => {
        setAllUsersData(query.srcElement.result);
      };
      users.onerror = (query) => {
        alert("Error occured while loading data");

      };
      tx.oncomplete = () => {
        db.close();
      }
    };

  }

  // id: allUsers ?.length + 1,
  //   //id: j,
  //   firstName,
  //   lastName,
  //   email,
  //   byteArray


  const data = [
    {
      id: allUsers ?.length + 1,
      firstName: 'abc',
      lastName: 'blue',
      email: 'blue',
      byteArray: 'dd'

    },

    {
      id: allUsers ?.length + 1,
      firstName: 'abc',
      lastName: 'blue',
      email: 'blue',
      byteArray: 'dd'

    },
    {
      id: allUsers ?.length + 1,
      firstName: 'abc',
      lastName: 'blue',
      email: 'blue',
      byteArray: 'dd'

    }];




  /*
  const updateData = (event) =>{
    var globalTx;
  // let's say you are selecting data from people
  globalTx = db.transaction(["people"], "read")  // in read access
  // and at same time you are inserting data from employee
  globalTx = db.transaction(["employee"], "readwrite") // in read write
  addMultiple(data);
  
  }
  
  
  function add(data) {
    let request = db.transaction(["people"], "readwrite").objectStore("people").add(data);
  }
  
  // for multiple value
  function addMultiple(datas, callback) {
    const tx = db.transaction(["people"], "readwrite");
  
    datas.forEach(data => {
        let request = tx.objectStore("people").add(data);
    })
  
    tx.oncomplete = function(event) {
        callback();
    }
  };*/

  const handleSubmit = (event) => {
    var byteArray = '';
    const dbPromise = idb.open("test-db", 2);
    if (firstName && lastName && email) {
      dbPromise.onsuccess = () => {

        var rawData = raw1;

        fetch(rawData)
          .then(r => r.text())
          .then(text => {
            //  console.log('text decoded:', text);
            byteArray = text;
            var db = dbPromise.result;
            var tx = db.transaction('userData', 'readwrite');
            var userData = tx.objectStore('userData');
            var users = userData.put({
              id: allUsers ?.length + 1,
              //id: j,
              firstName,
              lastName,
              email,
              //byteArray
            })

            users.onsuccess = () => {
              tx.oncomplete = () => {
                db.close();
              };
              // alert("User Added");
            };

            users.onerror = () => {
              console.log("Error");
              alert("Error");
            };
          });




      }
    }

  };

  function AddData() {
    //createStubData();
    // const tx = db.transaction('userData', 'readwrite');
    // const userData = tx.objectStore('userData');
    // tx.onerror = e => alert("Error:" + e.target.error);
    const data = createStubData();
    //   stubData.data.forEach(item => {
    //     let request = userData.add(item);
    // });



    //userData.add(data.data);
  }
  function createStubData() {
    var count = 0;
    for (var j = 0; j < 200; j++) {
      for (var i = 0; i < 5; i++) {

        console.log("stubData" + i + "*******" + j);
        stubData.data.push({
          //"id":"data" + i,
          "id": "data" + i + "_" + j,
          "firstName": "Firstname__" + i + "_" + j,
          "lastName": "LastName__" + i + "_" + j,
          "email": "email" + i + "_" + j + "@gmail.com",
          // "byteArray" : getByteArrays(i,count)
        });
        count++;
      }
    }


    //return stubData;
  }
  function getByteArrays(i, count) {
    var byteArr = null;
    var rawData = null;
    if (i == 0) {
      rawData = raw1
    } else if (i == 1) {
      rawData = raw2

    } else if (i == 2) {
      rawData = raw3
    } else if (i == 3) {
      rawData = raw4
    } else if (i == 4) {
      rawData = raw4
    }
    fetch(rawData)
      .then(r => r.text())
      .then(text => {
        //  console.log('text decoded:', text);
        byteArr = text;
        stubData.data[count].byteArray = text;
        const tx = db.transaction('userData', 'readwrite');
        const userData = tx.objectStore('userData');

        console.log("stubData.data[i]:" + stubData.data[i].id);
        tx.onerror = e => alert("Error:" + e.target.error);
        userData.add(stubData.data[count]);
        return byteArr;
      });
    return byteArr;
  }


  const handleSubmit1 = (event) => {
    var byteArray = '';
    const dbPromise = idb.open("test-db", 2);
    if (firstName && lastName && email) {
      dbPromise.onsuccess = () => {
        var i = 1;

        //ObjectRow()
        // console.log("raw" + raw1+'"'+i+'"');
        var rawData = raw1;
        firstName = "Name" + i;
        lastName = "LastName" + i;
        email = "email" + i + "@email.com";
        fetch(rawData)
          .then(r => r.text())
          .then(text => {
            //  console.log('text decoded:', text);
            byteArray = text;
            db = dbPromise.result;
            var tx = db.transaction('userData', 'readwrite');
            var userData = tx.objectStore('userData');
            var users = userData.put({
              id: allUsers ?.length + 1,
              //id: j,
              firstName,
              lastName,
              email,
              byteArray
            })

            users.onsuccess = () => {
              tx.oncomplete = () => {
                db.close();
              };
              // alert("User Added");
            };

            users.onerror = () => {
              console.log("Error");
              alert("Error");
            };
          });




      }
    }

  };
  return (
    <div className="row" style={{ padding: 100 }}>
      <div className="col-md-6">
        <button className="btn btn-primary float-end mb-2">Add</button>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              {/* <th>ByteArray</th> */}
            </tr>
          </thead>
          <tbody>
            {allUsers ?.map((user) => {
              return (
                <tr key={user ?.id}>
                  <td>{user ?.firstName}</td>
                  <td>{user ?.lastName}</td>
                  <td>{user ?.email}</td>
                  {/* <td>{user?.byteArray}</td> */}
                  <td>
                    <button
                      className="btn btn-success"
                    // onClick={() => {
                    //   setAddUser(false);
                    //   setEditUser(true);
                    //   setSelectedUser(user);
                    //   setEmail(user?.email);
                    //   setFirstName(user?.firstName);
                    //   setLastName(user?.lastName);
                    // }}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="btn btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="col-md-6">
        <div className="card" style={{ padding: "20px" }}>
          <h3>Add User</h3>
          <div className="card" style={{ padding: '20px' }}>
            <h3>Add user</h3>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                className="form-control"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                className="form-control"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="form-group">
              <button className="btn btn-primary mt-2"
                type="submit"
                onClick={AddData}>
                Add
                {/* {editUser ? "Update" : "Add"} */}
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
