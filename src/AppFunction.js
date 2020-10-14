import React, { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";
import "./styles.css";

const AppFunction = () => {
  const [paste, setPaste] = useState({
    api_paste_code: "",
    api_paste_expire_date: "",
    api_paste_name: ""
  });

  const updatePaste = ({ name, value }) => {
    // Updating the state with dynamic key/value pairs
    setPaste((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  useEffect(() => {
    // Putting the hidden values in the state (one time only)
    for (let child of document.forms[0].children) {
      const { type, name, value } = child;
      if (type === "hidden") {
        updatePaste({ name, value });
      }
    }
  }, []);

  const handleChange = (e) => {
    updatePaste(e.target);
  };

  const handleSubmit = (e) => {
    // Preventing the submit event from refreshing the page on submit
    if (e) e.preventDefault();

    // Checking if the user entered all required values and
    let errors = false;
    for (let key in paste) {
      if (key !== "api_user_key" && !paste[key]) {
        errors = true;
      }
    }
    if (errors)
      return console.log(
        "Please enter a filename, an expiration, and some code to continue"
      );

    createLink();
  };

  // One way of sending the data to the API is to use libraries to help you out
  // Here we're using axios to perform the POST request, and qs to serialize the data into a URL
  // https://www.npmjs.com/package/axios
  // https://www.npmjs.com/package/qs
  const createLink = () => {
    const url =
      "https://cors-anywhere.herokuapp.com/https://pastebin.com/api/api_post.php";

    // How to encode the data ? https://dev.to/getd/x-www-form-urlencoded-or-form-data-explained-in-2-mins-5hk6
    // Option 1: Using x-www-form-urlencoded
    const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify(paste),
      url
    };

    // Option 2: Using FormData
    // const pasteFormData = new FormData();
    // for (let key in paste) {
    //   pasteFormData.append(key, paste[key]);
    // }

    // const options = {
    //   method: "POST",
    //   headers: { "content-type": "multipart/form-data" },
    //   data: pasteFormData,
    //   url
    // };

    // Option 3 (not for this API)
    // Using Json: with'Content-Type': 'application/json'

    axios(options)
      .then((res) => updatePaste({ name: "link", value: res.data }))
      .catch((e) => console.log(`Oh no! ${e}`));
  };

  /////////////////////////////////////////////////////////////////////////////////////
  // Instead of having separate handleChange & handleSubmit methods                 //
  // You could use the Submit event on the form itself with handleFormSubmit       //
  // (if you want to try this, comment/uncomment the necessary event handlers)    //
  /////////////////////////////////////////////////////////////////////////////////

  // const handleFormSubmit = (event) => {
  //   event.preventDefault();
  //   const form = event.target;
  //   // https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData
  //   const formData = new FormData(form);
  //   console.log(formData);

  //   let data = {};

  //   for (let name of formData.keys()) {
  //     const input = form.elements[name];
  //     data = { ...data, [input.name]: input.value };
  //   }

  //   console.log(data);

  //   setPaste(data);
  // };

  // useEffect(() => {
  //   if (paste.api_dev_key) handleSubmit();
  // }, [paste, handleSubmit]);

  return (
    <div className="App">
      <img
        className="logo"
        src="http://www.userlogos.org/files/logos/inductiveload/Pastebin.png"
        alt="pastebin"
        width="200px"
      />
      <h1>
        <a href="/instructions.html"> instructions </a>
      </h1>
      <br />
      <form
        className="col-10 offset-1"
        onChange={handleChange}
        // If you want to use the alternative handleFormSubmit function
        // onSubmit={handleFormSubmit}
      >
        <div className="form-group">
          <label htmlFor="api_paste_name">Filename</label>
          <input
            type="text"
            className="form-control"
            id="api_paste_name"
            name="api_paste_name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="api_paste_expire_date">Expiration</label>
          <select
            className="custom-select"
            id="api_paste_expire_date"
            name="api_paste_expire_date"
            defaultValue="choose"
          >
            <option value="choose" disabled>
              Please select
            </option>
            <option value="10M">10 Minutes</option>
            <option value="1H">1 Hour</option>
            <option value="1D">1 Day</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="api_paste_code">Code</label>
          <textarea
            className="form-control"
            id="api_paste_code"
            name="api_paste_code"
            rows="3"
          />
        </div>
        <input type="hidden" name="api_paste_private" value="0" />
        <input type="hidden" name="api_option" value="paste" />
        <input type="hidden" name="api_user_key" value="" />
        <input
          type="hidden"
          name="api_dev_key"
          // value="10d0f6cee26d024fa57e968ab041a14a"
          value="UfE_u9upiZ_QiNetFmqKl0sORiMtDrtq"
        />
        <div className="form-group">
          {/* For the handleFormSubmit alternative method to be triggered */}
          {/* <button type="submit" className="btn btn-info"> */}
          <button type="submit" onClick={handleSubmit} className="btn btn-info">
            Submit
          </button>
        </div>
        <p>
          Your link is:{" "}
          {paste.link ? (
            <a href={paste.link} target="_blank" rel="noopener noreferrer">
              {paste.link}
            </a>
          ) : (
            "~~~~"
          )}
        </p>
      </form>
    </div>
  );
};

export default AppFunction;
