"use client";
import React, { useState, useRef } from "react";
import { FormControl, Stack, Spinner } from "react-bootstrap";
import Image from "next/image";
import "@styles/globals.css";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import ButtonComponent from "./shared/button/ButtonComponent";
import { Box } from "@mui/material";

/**
 * Renders a chat interface that allows users to ask questions and receive answers from an AI server.
 *
 * @param {Object} handleLogout - A function that logs the user out of the chat interface.
 * @return {JSX.Element} The rendered chat interface.
 */
export default function MainContainer({ handleLogout }) {
  const [chat, setChat] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  chatRef.current = chat;

  /**
   * Sets the value of the "question" state to the value of the input element.
   * Also adjusts the height of the input element to match its content.
   *
   * @param {Event} e - The input change event.
   * @return {void}
   */
  const handleInputChanges = (e) => {
    setQuestion(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  /**
   * An asynchronous function that sends a question to an AI server and updates the chat history with the result.
   *
   * @return {void}
   */
  const askAI = async () => {
    if (question === "") {
      toast.configure();
      toast.error("Please enter valid input and try again.");
    } else {
      setLoading(true);
      let getQuestion = question;
      setChat((chat) => [...chat, { isBot: false, msg: question }]);
      setQuestion("");
      try {
        const response = await fetch("https://naasa-chat-bak.waterflowtechnology.net/get_answer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(question),
        });

        if (!response.ok) {
          response.text().then((text) => {
            toast.error("Error getting data." + text);
          });
          setLoading(false);
        } else {
          const data = await response.json();
          setChat([
            ...chatRef.current,
            {
              isBot: true,
              msg: data.answer,
              source: data.source,
            },
          ]);
          setLoading(false);
        }
      } catch (error) {
        // toast.configure();
        // toast.error("Error Fetching Answer. Please try again.");
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Box width={"5%"} display={"flex"} justifyItems={"flex-end"}>
        <ButtonComponent
          variant="contained"
          handlesubmit={handleLogout}
          label={"logout"}
          fullWidth
        />
      </Box>
      <Stack>
        <div className=" mx-2 px-md-5 py-sm-4 chat-scroll">
          {chat.length > 0 ? (
            chat.map((msg) => (
              <Stack direction="vertical" gap={3}>
                <div
                  className={
                    msg.isBot
                      ? " p-4 text-start w-100 position-relative bot-msg mb-3"
                      : " p-4 text-start w-100 position-relative user-msg mb-3"
                  }
                >
                  <div>
                    {msg.isBot ? (
                      <span style={{ fontSize: "12px" }}>WFTChat</span>
                    ) : (
                      <span style={{ fontSize: "12px" }}>User</span>
                    )}
                  </div>
                  <div className="w-100">
                    <div>
                      {msg.isBot ? (
                        <>
                          {msg.msg == null ? (
                            <div>
                              <span class="blinking-cursor"> █</span>
                            </div>
                          ) : (
                            <Stack direction="vertical" gap={3}>
                              <span>{msg.msg}</span>
                              <span style={{ fontSize: "12px" }}>
                                {msg.source != null && msg.source != ""
                                  ? "Source: " + msg.source[0]["name"]
                                  : ""}
                              </span>
                            </Stack>
                          )}
                        </>
                      ) : (
                        msg.msg
                      )}
                    </div>
                  </div>
                </div>
              </Stack>
            ))
          ) : (
            <Stack
              className="align-items-center ms-sm-5 ps-sm-3"
              gap={1}
              style={{ color: "black" }}
            >
              <h1 className="mt-sm-5">
                <small>NaasaChat by WFT</small>
              </h1>
              <h3 style={{ color: "gray" }}>
                Ask your Question related to Naasa Securities?
              </h3>
            </Stack>
          )}
          {loading ? (
            <Stack gap={2} direction="horizontal" className="loading">
              <Spinner size="sm" animation="grow" />
              <Spinner size="sm" animation="grow" />
              <Spinner size="sm" animation="grow" />
            </Stack>
          ) : (
            ""
          )}
        </div>
        <div className="px-4 justify-content-center align-items-center">
          <div className="d-flex justify-content-center align-items-center mb-sm-0">
            <FormControl
              rows={1}
              className="chat-input p-2"
              as="textarea"
              value={question}
              onChange={(e) => handleInputChanges(e)}
              onKeyDown={(e) => {
                if (e.code == "Enter" && !e.shiftKey) {
                  e.preventDefault(); // prevent moving to next line
                  askAI(); // call function ask
                }
              }}
            />

            <div
              className="d-flex flex-column mx-2 justify-content-end align-items-center"
              style={{ height: "100%", cursor: "pointer", color: "#4e4e4e" }}
              onClick={askAI}
            >
              <Image
                src="/send-icon.svg"
                alt="Send"
                width={20}
                height={20}
                priority
              />
            </div>
          </div>
        </div>
      </Stack>
    </>
  );
}
