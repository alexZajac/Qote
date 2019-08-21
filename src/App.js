import React, { Component } from "react";
import "./App.css";
import axios from "axios";

//Quote services
const API_BASE_URL = "https://favqs.com/api";
const API_KEY = process.env.REACT_APP_FAVQS_API_KEY;
console.log(API_KEY);

const requestConfig = {
  headers: {
    Authorization: `Token token="${API_KEY}"`
  }
};

const LoadingIndicator = props => {
  if (props.isFetching)
    return (
      <div id="squareContainer">
        <div className="square" id="square1" />
        <div className="square" id="square2" />
        <div className="square" id="square3" />
        <div className="square" id="square4" />
      </div>
    );
  else return null;
};

const randomColorQuotes = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "pink",
  "grey",
  "violet"
];

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bgColor: "white",
      colorText: "black",
      quoteQuery: "",
      qotd: [],
      quotes: [],
      btnSelected: localStorage.getItem("btnSelected") || "Words",
      isFetching: false,
      inputDimensions: ["70px", "67vw", "30px"] //height, width, fontSize
    };

    this.queryAPi = this.queryAPi.bind(this);
    this.fetchQuoteOfTheDay = this.fetchQuoteOfTheDay.bind(this);
    this.fetchQuotes = this.fetchQuotes.bind(this);
  }

  componentWillMount() {
    const rndGrad = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    ];
    let colorTxt = "white";
    const firstCoef =
      rndGrad[0] * 0.299 + rndGrad[1] * 0.587 + rndGrad[2] * 0.114;
    if (firstCoef > 186) {
      colorTxt = "black";
    }
    this.setState({
      isFetching: true,
      bgColor: "rgb(" + rndGrad[0] + "," + rndGrad[1] + "," + rndGrad[2] + ")",
      colorText: colorTxt
    });
    this.fetchQuoteOfTheDay();
  }

  // SERVICES

  fetchQuoteOfTheDay = () => {
    const url = `${API_BASE_URL}/qotd`;

    return new Promise((resolve, reject) => {
      axios
        .get(url, requestConfig)
        .then(response =>
          this.setState({ qotd: response.data.quote, isFetching: false })
        )
        .catch(error => {
          console.log(error);
          return reject(error);
        });
    });
  };

  fetchQuotes = filter => {
    const url = `${API_BASE_URL}/quotes/?filter=${filter}`;

    return new Promise(reject => {
      axios
        .get(url, requestConfig)
        .then(response =>
          this.setState({ quotes: response.data.quotes, isFetching: false })
        )
        .catch(error => {
          console.log(error);
          return reject(error);
        });
    });
  };

  fetchQuotesByAuthor = author => {
    const url = `${API_BASE_URL}/quotes/?filter=${author}&type=author`;

    return new Promise(reject => {
      axios
        .get(url, requestConfig)
        .then(response =>
          this.setState({ quotes: response.data.quotes, isFetching: false })
        )
        .catch(error => {
          console.log(error);
          return reject(error);
        });
    });
  };

  fetchQuotesByTag = tag => {
    const url = `${API_BASE_URL}/quotes/?filter=${tag}&type=tag`;

    return new Promise(reject => {
      axios
        .get(url, requestConfig)
        .then(response =>
          this.setState({ quotes: response.data.quotes, isFetching: false })
        )
        .catch(error => {
          console.log(error);
          return reject(error);
        });
    });
  };

  queryAPi = (value, typeOfFilter) => {
    //colors
    if (value !== "") {
      const rndGrad = [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
      ];
      let colorTxt = "white";
      const firstCoef =
        rndGrad[0] * 0.299 + rndGrad[1] * 0.587 + rndGrad[2] * 0.114;
      if (firstCoef > 186) {
        colorTxt = "black";
      }

      this.setState({
        quoteQuery: value,
        isFetching: true,
        bgColor:
          "linear-gradient(to right, rgb(" +
          rndGrad[0] +
          "," +
          rndGrad[1] +
          "," +
          rndGrad[2] +
          "), rgb(" +
          rndGrad[3] +
          "," +
          rndGrad[4] +
          "," +
          rndGrad[5] +
          ")",
        colorText: colorTxt
      });

      if (typeOfFilter === "Words") {
        this.fetchQuotes(value);
      } else if (typeOfFilter === "Tags") {
        this.fetchQuotesByTag(value);
      } else {
        this.fetchQuotesByAuthor(value);
      }
    }
  };

  handleChange = value => {
    this.setState({ quoteQuery: value });
  };

  selectWords = () => {
    this.fetchQuotes(this.state.quoteQuery);
    this.setState(
      { btnSelected: "Words" },
      localStorage.setItem("btnSelected", "Words")
    );
  };

  selectTags = () => {
    this.fetchQuotesByTag(this.state.quoteQuery);
    this.setState(
      { btnSelected: "Tags" },
      localStorage.setItem("btnSelected", "Tags")
    );
  };

  selectAuthor = () => {
    this.fetchQuotesByAuthor(this.state.quoteQuery);
    this.setState(
      { btnSelected: "Author" },
      localStorage.setItem("btnSelected", "Author")
    );
  };

  enlargeInput = () => {
    this.setState({ inputDimensions: ["10%", "75vw", "30px"] });
  };

  reduceInput = () => {
    this.setState({ inputDimensions: ["70px", "67vw", "30px"] });
  };

  handleKeyPress = (e, quoteQuery, btnSelected) => {
    if (e.key === "Enter") {
      this.queryAPi(quoteQuery, btnSelected);
    }
  };

  render() {
    const {
      bgColor,
      colorText,
      quoteQuery,
      quotes,
      qotd,
      btnSelected,
      isFetching,
      inputDimensions
    } = this.state;
    let quoteToDisplay = [];
    const tagAndBracketsColor =
      randomColorQuotes[Math.floor(Math.random() * 8)];
    if (quotes.length === 0 && qotd)
      quoteToDisplay = (
        <div
          id="quoteWrapper"
          style={{
            color: colorText === "white" ? "black" : "white",
            background: colorText
          }}
        >
          <div id="quoteBody">
            <span
              className="quoteSymbol"
              style={{ color: tagAndBracketsColor }}
            >
              {" "}
              “{" "}
            </span>
            {qotd.body}
            <span
              className="quoteSymbol"
              style={{ color: tagAndBracketsColor }}
            >
              {" "}
              ”{" "}
            </span>
          </div>
          <div id="bottomWrapper">
            <div id="tags">
              {qotd.tags
                ? qotd.tags.map(tag => {
                    return (
                      <div
                        key={Math.random() * 80}
                        style={{ color: tagAndBracketsColor }}
                        id="tagQuotes"
                      >
                        {" "}
                        #{tag}
                      </div>
                    );
                  })
                : null}
            </div>
            <div id="quoteAuthor">- {qotd.author}</div>
          </div>
        </div>
      );
    else if (quotes.length === 1 && quotes[0].body === "No quotes found") {
      quoteToDisplay = (
        <div
          id="quoteWrapper"
          style={{
            color: "white",
            background: "rgba(0,0,0,0.667)",
            paddingBottom: "30px"
          }}
        >
          <div id="quoteBody">No quotes found, please try again.</div>
        </div>
      );
    } else {
      const rndIndex = Math.floor(Math.random() * quotes.length);
      quoteToDisplay = (
        <div key={quotes[rndIndex].id} id="quoteWrapper">
          <div id="quoteBody">
            <span
              className="quoteSymbol"
              style={{ color: tagAndBracketsColor }}
            >
              {" "}
              “{" "}
            </span>
            {quotes[rndIndex].body}
            <span
              className="quoteSymbol"
              style={{ color: tagAndBracketsColor }}
            >
              {" "}
              ”{" "}
            </span>
          </div>
          <div id="bottomWrapper">
            <div id="tags">
              {quotes[rndIndex].tags
                ? quotes[rndIndex].tags.map(tag => {
                    return (
                      <div
                        key={Math.random() * 800}
                        style={{ color: tagAndBracketsColor }}
                        id="tagQuotes"
                      >
                        {" "}
                        #{tag}
                      </div>
                    );
                  })
                : null}
            </div>
            <div id="quoteAuthor">- {quotes[rndIndex].author}</div>
          </div>
        </div>
      );
    }

    const btnSelectedStyle = { background: "black", color: "white" };
    const queryWhite = {
      background:
        colorText === "white"
          ? "linear-gradient(to right, black, transparent)"
          : "linear-gradient(to right, white, transparent)"
    };
    const bgStyle = { background: bgColor };
    const qoteColor = { color: colorText };
    const inputSize = {
      height: inputDimensions[0],
      width: inputDimensions[1],
      fontSize: inputDimensions[2]
    };
    const inputStyle = {
      ...inputSize,
      ...qoteColor,
      ...bgStyle,
      ...queryWhite
    };

    //MAIN

    return (
      <div id="App-wrapper" style={bgStyle} onClick={this.handleKeyPress}>
        <img
          id="Qote"
          style={qoteColor}
          src={require("./Images/qote" + colorText + ".png")}
        />
        <div id="btnContainer">
          <div
            className="choiceBtn"
            onClick={this.selectWords}
            style={btnSelected === "Words" ? btnSelectedStyle : null}
          >
            Words
          </div>
          <div
            className="choiceBtn"
            onClick={this.selectTags}
            style={btnSelected === "Tags" ? btnSelectedStyle : null}
          >
            Tags
          </div>
          <div
            className="choiceBtn"
            onClick={this.selectAuthor}
            style={btnSelected === "Author" ? btnSelectedStyle : null}
          >
            Author
          </div>
        </div>
        <input
          type="search"
          id="quoteQuery"
          style={queryWhite}
          onKeyPress={e => this.handleKeyPress(e, quoteQuery, btnSelected)}
          onClick={this.enlargeInput}
          onBlur={this.reduceInput}
          style={inputStyle}
          onChange={e => this.handleChange(e.target.value)}
          placeholder="Type here..."
        />
        <div
          id="submitValue"
          onClick={() => this.queryAPi(quoteQuery, btnSelected)}
        >
          Search
        </div>
        <div id="quotesContainer">
          {isFetching ? <LoadingIndicator isFetching={true} /> : quoteToDisplay}
        </div>
      </div>
    );
  }
}
