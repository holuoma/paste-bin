import React, { Component } from "react";
import axios from "axios";
import qs from "qs";
import "./styles.css";

class App extends Component {
  state = {
    api_paste_code: "",
    api_paste_expire_date: "",
    api_paste_name: ""
  };

  handleChange = (e) => {
    // Destructuring the values of the target event
    const { name, value } = e.target;

    // Updating the state with dynamic key/value pairs
    this.setState({
      [name]: value
    });

    // Putting the hidden values in the state (one time only)
    for (let child of e.currentTarget.children) {
      const { type, name, value } = child;
      if (type === "hidden" && typeof this.state[name] !== "string") {
        this.setState({
          [name]: value
        });
      }
    }
  };

  handleSubmit = (e) => {
    // Checking if the user entered required values and
    // Preventing the event from refreshing the page on submit
    e.preventDefault();
    if (
      // You could destructure the state here instead of having this.state
      !this.state.api_paste_code.length ||
      !this.state.api_paste_expire_date.length ||
      !this.state.api_paste_name.length
    ) {
      alert("Please enter a filename, an expiration, and a code to continue");
    } else {
      this.createLink();
    }
  };

  // One way of sending the data to the API is to use libraries to help you out
  // Here we're using axios to perform the POST request, and qs to stringify the data
  // https://www.npmjs.com/package/axios
  // https://www.npmjs.com/package/qs
  createLink = () => {
    const url =
      "https://cors-anywhere.herokuapp.com/https://pastebin.com/api/api_post.php";

    const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      data: qs.stringify(this.state),
      url
    };

    axios(options)
      .then((res) => this.setState({ link: res.data }))
      .catch((e) => console.log(`Oh no! ${e}`));
  };

  //////////////////////////////////////////////////////////////////////////////
  // Another way of sending the data is to use the fetch API and vanilla JS  //
  // to encode the parameters that need to be passed through the URL        //
  ///////////////////////////////////////////////////////////////////////////

  // createLink = () => {
  //   const url =
  //     "https://cors-anywhere.herokuapp.com/https://pastebin.com/api/api_post.php";

  //   let body = [];

  //   // As we're sending the data through the url itself, it needs to be encoded:
  //   // https://gomakethings.com/how-to-send-data-to-an-api-with-the-vanilla-js-fetch-method/
  //   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  //   for (let key of Object.keys(this.state)) {
  //     body.push(`${key}=${encodeURIComponent(this.state[key])}`);
  //   }

  //   body = body.join("&");

  //   const options = {
  //     method: "POST",
  //     body,
  //     headers: {
  //       "Content-type": "application/x-www-form-urlencoded"
  //     }
  //   };

  //   fetch(url, options)
  //     .then(res => res.text())
  //     .then(res => this.setState({ link: res }))
  //     .catch(e => console.log(`Oh no! ${e}`));
  // };

  /////////////////////////////////////////////////////////////////////////////////////
  // Instead of having separate this.handleChange & this.handleSubmit methods       //
  // You could use the Submit event on the form itself with this.handleFormSubmit  //
  // (if you want to try this, comment/uncomment the necessary event handlers)    //
  /////////////////////////////////////////////////////////////////////////////////

  // handleFormSubmit = event => {
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

  //   // this.setState is asynchronous; you can pass a callback
  //   // to get the updated value right after setting the state
  //   // https://dev.to/dance2die/accessing-react-state-right-after-setting-it-2kc8
  //   this.setState(data, () => {
  //     if (
  //       !this.state.api_paste_code.length ||
  //       !this.state.api_paste_expire_date.length ||
  //       !this.state.api_paste_name.length
  //     ) {
  //       alert("Please enter a filename, an expiration, and a code to continue");
  //     } else {
  //       this.createLink();
  //     }
  //   });
  // };

  render() {
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
          onChange={this.handleChange}
          // onSubmit={this.handleFormSubmit}
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
            value="10d0f6cee26d024fa57e968ab041a14a"
          />
          <div className="form-group">
            <button
              type="submit"
              onClick={this.handleSubmit}
              className="btn btn-info"
            >
              Submit
            </button>
          </div>
          <p>
            Your link is:{" "}
            {this.state.link ? (
              <a
                href={this.state.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {this.state.link}
              </a>
            ) : (
              "~~~~"
            )}
          </p>
        </form>
      </div>
    );
  }
}

export default App;
