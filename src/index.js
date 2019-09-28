// import React from "react";
import ReactDOM from "react-dom";
import React, { useEffect, useRef } from "react";
import "./styles.css";

import TextToSVG from "text-to-svg";
// const font = 'https://fonts.googleapis.com/css?family=Allerta+Stencil&display=swap'
const font = "SairaStencilOne-Regular.ttf";

console.log("loaded");

//source https://codepen.io/pen/?editors=1111
let svg;
let SvgEl;
let MySvg;

TextToSVG.load(font, function(err, textToSVG) {
  console.log("loaded", err + "");

  const attributes = { fill: "red", stroke: "black" };
  const options = {
    x: 0,
    y: 0,
    fill: "white",
    stroke: "black",
    fontSize: 20,
    anchor: "top",
    attributes: attributes
  };
  console.log("convert");
  svg = textToSVG.getSVG("Revolution 1x1"); //, options);
  var domparser = new DOMParser();
  const svgDoc = domparser.parseFromString(svg, "text/html");
  SvgEl = svgDoc.querySelector("svg");
  console.log(SvgEl);
  const pathEl = SvgEl.querySelector("path");
  const pathAttr = pathEl.getAttribute("d");
  console.log("svg", SvgEl);

  MySvg = () => {
    return (
      <div
        style={{
          border: "1px black solid",
          // height: "100%",
          // width: "100%",
          position: "relative",
          fill: "white",
          stroke: "black"
          // overflow: "visible"
        }}
      >
        <svg
          id="hello"
          viewBox="0 0 350.6 100"
          overflow="visible"
          xmlns="http://www.w3.org/2000/svg"
          // xmlns:xlink="http://www.w3.org/1999/xlink"
          // stroke="black"
          // fill="red"
        >
          <g transform="translate(0, 110)">
            <path id="hello-path" d={pathAttr} />
          </g>
        </svg>
      </div>
    );
  };
  console.log(MySvg());
});
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
let pathLength, path;
function App() {
  let [count, setCount] = React.useState(0);

  useInterval(() => {
    // Your custom logic here
    if (count >= 100) {
      setCount(0);
      return;
    }
    setCount(count + 1);
  }, 50);
  if (!path) path = document.querySelector("#hello-path");
  if (path) {
    // Get length of path... ~577px in this case
    if (!pathLength) {
      console.log(pathLength);
      pathLength = path.getTotalLength();
      console.log(pathLength);
    }

    // Make very long dashes (the length of the path itself)
    path.style.strokeDasharray = pathLength + " " + pathLength;

    // Offset the dashes so the it appears hidden entirely
    path.style.strokeDashoffset = pathLength;

    // Jake Archibald says so
    // https://jakearchibald.com/2013/animated-line-drawing-svg/
    path.getBoundingClientRect();
    var scrollPercentage = count / 1000;

    // Length to offset the dashes
    var drawLength = pathLength * scrollPercentage;

    // Draw in reverse
    path.style.strokeDashoffset = pathLength - drawLength;
    // path.setAttribute("fill", "red");
    // When complete, remove the dash array, otherwise shape isn't quite sharp
    // Accounts for fuzzy math
    if (scrollPercentage >= 0.99) {
      path.style.strokeDasharray = "none";
    } else {
      path.style.strokeDasharray = pathLength + " " + pathLength;
    }
  }
  return (
    <div className="App">
      {<h1>{count}</h1>}
      div#svgcontainer
      {MySvg ? <MySvg /> : ""}
      {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 285 80">
        <text fill="green" x="0" y="66">Kauai</text>
      </svg> */}
      {/* <div dangerouslySetInnerHTML={{ __html: svg }} /> */}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
