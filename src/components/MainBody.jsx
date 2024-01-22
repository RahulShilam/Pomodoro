//This is a clone of https://pomofocus.io/ website. It is developed on react v 18 using React Hooks.
//developed by Rahul S

import React, { useState, useEffect } from "react";
import song from "../Assets/alarm.mp3";
import "./MainBody.scss";
import pomoicon from "../images/pomoicon.png";
import reporticon from "../images/graph-white.png";
import settingsicon from "../images/config-white.png";
import loginicon from "../images/login.png";
import redfav from "../images/favicons/red-favicon.ico";
import bluefav from "../images/favicons/favicon-green.ico";
import greenfav from "../images/favicons/favicon-blue.ico";

export default function MainBody() {
  const [mins, setMins] = useState(25);
  const [secs, setSecs] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [bgcolor, setBgColor] = useState("red");
  const [btnState, setBtnState] = useState("pause");
  const [statusbarWidth, setStatusbarWidth] = useState(0);
  const [widthPerSecond, setWidthPerSecond] = useState(0);
  let audio = new Audio(song);
  //gets called when timer reaches end
  const start = () => {
    audio.play();
  };

  //dynamically change favicon based on state of the timer
  const changeFavicon = (newFaviconUrl) => {
    const head = document.querySelector("head");
    const favicon =
      document.querySelector('link[rel="icon"]') ||
      document.createElement("link");

    favicon.rel = "icon";
    favicon.href = newFaviconUrl;

    if (!document.querySelector('link[rel="icon"]')) {
      head.appendChild(favicon);
    }
  };

  //gets called when pomodoro button is clicked and resets the timer and also it is the defaut behaviour
  const handlePomoClick = (e) => {
    if (btnState == "pause" && clicked) setClicked(!clicked);
    changeFavicon(redfav);
    setStatusbarWidth(0);
    setWidthPerSecond(0);
    e.preventDefault();
    setSecs(0);
    setMins(25);
    setBgColor("red");
    document.title = "25" + ":" + "00" + " - " + "Time to focus!";
  };

  //gets called when short break button is clicked and resets the timer
  const handleShortBreakClick = (e) => {
    e.preventDefault();
    setStatusbarWidth(0);
    setWidthPerSecond(0);
    if (btnState == "pause" && clicked) setClicked(!clicked);
    setSecs(0);
    setMins(5);
    changeFavicon(bluefav);
    setBgColor("blue");
    document.title = "05" + ":" + "00" + " - " + "Time for a break!";
  };

  //gets called when long break button is clicked and resets the timer
  const handleLongBreakClick = (e) => {
    if (btnState == "pause" && clicked) setClicked(!clicked);
    changeFavicon(greenfav);
    e.preventDefault();
    setSecs(0);
    setMins(15);
    setStatusbarWidth(0);
    setWidthPerSecond(0);
    setBgColor("green");
    document.title = "15" + ":" + "00" + " - " + "Time for a break!";
  };

  useEffect(() => {
    document.title =
      (mins < 10 ? "0" + (mins < 0 ? 0 : mins) : mins) +
      ":" +
      (secs < 10 ? "0" + (secs < 0 ? 0 : secs) : secs == 60 ? "0" + 0 : secs) +
      " - " +
      (bgcolor == "red" ? "Time to focus!" : "Time for a break!");
    if (mins === 0 && secs === 0) {
      if (clicked) setClicked(false);
      start();
      bgcolor == "red"
        ? setMins(25)
        : bgcolor == "blue"
        ? setMins(5)
        : setMins(15);
    }
    if (secs == 0 && clicked) {
      setSecs(60);
    } else if (secs == 59 && clicked) {
      setMins((mins) => mins - 1);
    }
    //calculate the widthpersecond based on total minutes

    if (mins > 0 && widthPerSecond == 0 && clicked) {
      let x = 100 / (mins * 60);
      x = x.toFixed(2);
      setWidthPerSecond(Number(x));
    }
    //widthpersecond is added for everysecond to the status bar's width
    let formattedWidth = statusbarWidth + widthPerSecond;
    formattedWidth.toFixed(2);
    setStatusbarWidth(formattedWidth);
  }, [secs]);

  //change button name based on click
  useEffect(() => {
    clicked ? setBtnState("pause") : setBtnState("start");
  }, [clicked]);

  //start the timer if the btnState is clicked
  useEffect(() => {
    let timerId;
    if (mins === 0 && secs === 0) {
      setMins(bgcolor == "red" ? 25 : bgcolor == "blue" ? 5 : 15);
      start();
    } else {
      if (clicked) {
        if (secs === 0) {
          setSecs(60);
        }
        timerId = setInterval(() => {
          setSecs((secs) => secs - 1);
        }, 1000);
        return () => {
          clearInterval(timerId);
        };
      }
    }
  }, [btnState]);

  //gets called only once on click of start/pause button
  const handleClick = (e) => {
    e.preventDefault();
    clicked ? setClicked(false) : setClicked(true);
  };

  return (
    <div className="main-body">
      <div
        className="main-container"
        style={{
          backgroundColor:
            bgcolor == "red"
              ? "rgb(186, 73, 73)"
              : bgcolor == "blue"
              ? "rgb(56, 133, 138)"
              : "rgb(57, 112, 151)",
        }}
      >
        <div>
          <div className="header">
            <div className="header-objects">
              <h1 className="header-logo">
                <a href="/" className="header-items-align">
                  <img
                    src={pomoicon}
                    alt="pomofocus icon"
                    className="img-size"
                  ></img>
                  <div>Pomofocus</div>
                </a>
              </h1>
              <span className="header-items-right">
                <button id="report-button" className="header-button">
                  <img
                    src={reporticon}
                    alt="graph icon"
                    className="img-header-right"
                  />
                  <div className="header-button-text">Report</div>
                </button>
                <button id="setting-button" className="header-button">
                  <img
                    src={settingsicon}
                    alt="config icon"
                    className="img-header-right"
                  />{" "}
                  <div className="header-button-text">Setting</div>
                </button>
                <div style={{ position: "relative" }}>
                  {/* <a href=""> */}
                  <button id="login-button" className="header-button">
                    <img src={loginicon} className="img-header-right" />
                    <div className="header-button-text">Login</div>
                  </button>
                  {/* </a> */}
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="section-body">
          <div className="section-body-align">
            <div className="section-body-hr-spr">
              <div
                className="section-body-hr-spr-white-statusbar"
                style={{
                  width: statusbarWidth + "%",
                  height: statusbarWidth == 0 ? "unset" : "3px",
                }}
              ></div>
            </div>

            <div className="section-body-content">
              <div className="section-body-content-area">
                <div className="section-header">
                  <button
                    id="pomo-button"
                    className="section-btn"
                    onClick={handlePomoClick}
                    style={{
                      background:
                        bgcolor == "red" ? "rgba(0, 0, 0, 0.15)" : "none",
                      fontWeight: bgcolor == "red" ? "bold" : "300",
                    }}
                  >
                    Pomodoro
                  </button>
                  <button
                    id="s-break-btn"
                    className="section-btn"
                    onClick={handleShortBreakClick}
                    style={{
                      background:
                        bgcolor == "blue" ? "rgba(0, 0, 0, 0.15)" : "none",
                      fontWeight: bgcolor == "blue" ? "bold" : "300",
                    }}
                  >
                    Short Break
                  </button>
                  <button
                    id="l-break-btn"
                    className="section-btn"
                    onClick={handleLongBreakClick}
                    style={{
                      background:
                        bgcolor == "green" ? "rgba(0, 0, 0, 0.15)" : "none",
                      fontWeight: bgcolor == "green" ? "bold" : "300",
                    }}
                  >
                    Long Break
                  </button>
                </div>
                <div className="timer-size">
                  {mins < 10 ? "0" + (mins < 0 ? 0 : mins) : mins}:
                  {secs < 10
                    ? "0" + (secs < 0 ? 0 : secs)
                    : secs == 60
                    ? "0" + 0
                    : secs}
                </div>
                <div className="start-btn">
                  <button
                    id="start-btn"
                    onClick={handleClick}
                    //disabled={clicked}
                    className="start-btn-styles"
                    style={{
                      color:
                        bgcolor == "red"
                          ? "rgb(186, 73, 73)"
                          : bgcolor == "blue"
                          ? "rgb(56, 133, 138)"
                          : "rgb(57, 112, 151)",
                      textTransform: "uppercase",
                    }}
                  >
                    {btnState}
                  </button>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
