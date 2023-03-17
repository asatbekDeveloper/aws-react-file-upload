import './App.css';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone'

const UserProfiles = () => {

  const [userProfiles, setUserProfiles] = useState([]);

  const fetchUserProfiles = () => {
    axios.get("http://localhost:6565/api/v1/user_profile")
      .then(res => {
        setUserProfiles(res.data);
      });
  }

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  return userProfiles.map((userProfile, index) => {
    return (
      <div key={index}>
        {userProfile.userProfileImageLink ?
          // eslint-disable-next-line jsx-a11y/alt-text
          <img src={`http://localhost:6565/api/v1/user_profile/${userProfile.userProfileId}/image/download`}
            width='100px' height='100px' style={{ borderRadius: '50%' }} />
          : null
        }
        <br />
        <h1>{userProfile.username}</h1>
        <p>{userProfile.userProfileId}</p>
        <Dropzone {...userProfile} />
        <br />
      </div>
    )
  });

};



function Dropzone({ userProfileId }) {
  const onDrop = useCallback(acceptedFiles => {

    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append("file", file);

    axios.post("http://localhost:6565/api/v1/user_profile/" + userProfileId + "/image/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    ).then(res => {
      console.log("success");
    });

  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the image here ...</p> :
          <p>Drag 'n' drop profile image here, or click to select profile image</p>
      }
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <UserProfiles />
    </div>
  );
}

export default App;
