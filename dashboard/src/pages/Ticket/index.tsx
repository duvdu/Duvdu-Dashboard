import _ from "lodash";
import clsx from "clsx";
import { useEffect, useState } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import { FormInput, FormTextarea } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import { ActionGetTicket } from "../../redux/action/api/ticket/get";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import { StateTicket } from "../../redux/stores/api/ticket";
import dayjs from "dayjs";
import { ActionGetTicketById } from "../../redux/action/api/ticket/getById";
import { formatDistanceToNow } from 'date-fns';
import { ActionDeleteTicket } from "../../redux/action/api/ticket/delete";
import { ActionUpdateTicket } from "../../redux/action/api/ticket/update";

function Main() {
  const [chatBox, setChatBox] = useState(false);
  const [feedback, setfeedback] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const dispatch = useAppDispatch()
  const state = useAppSelector(StateTicket)
  
  useEffect(() => {
    if (state?.data?.message == "success" && !state?.data?.data)
      dispatch(ActionGetTicket({}))
  }, [state?.data?.message == "success"])

  useEffect(() => {
    dispatch(ActionGetTicket({}))
  }, [])

  useEffect(() => {
    // get all tickets 
    if (state?.data?.data[0]?.message) {
      setMessages(state?.data?.data)
      setChatBox(false);
    }
  }, [state?.data?.data?.length])

  useEffect(() => {
    // get ticket by id 
    if (state?.data?.data?.createdAt) {
      setMessage(state?.data?.data)
    }
  }, [state?.data?.data?.createdAt])
  useEffect(() => {
    if (message) {
      setChatBox(true)
    }
  }, [message])

  const getTicket = (id) => {
    dispatch(ActionGetTicketById({ id: id }))
  };
  const deleteTicket = (id) => {
    dispatch(ActionDeleteTicket({ id: id }))
  };
  const sendMessage = () => {
    dispatch(ActionUpdateTicket({
      id: message?.id ?? '',
      formdata: {
        "state": {
          "feedback": feedback
        }
      }
    }));
    setfeedback("")
  };

  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Tickets</h2>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-5 intro-y">
        {/* BEGIN: Chat Side Menu */}
        <Tab.Group className="col-span-12 lg:col-span-4 2xl:col-span-3">
          <div className="pr-1 intro-y">
            <div className="p-2 box hidden">
              <Tab.List variant="pills">
                <Tab>
                  <Tab.Button className="w-full py-2" as="button">
                    Chats
                  </Tab.Button>
                </Tab>
                <Tab>
                  <Tab.Button className="w-full py-2" as="button">
                    Friends
                  </Tab.Button>
                </Tab>
                <Tab>
                  <Tab.Button className="w-full py-2" as="button">
                    Profile
                  </Tab.Button>
                </Tab>
              </Tab.List>
            </div>
          </div>
          <Tab.Panels>
            <Tab.Panel>
              <div className="pt-1 pr-1 overflow-y-auto h-[525px] scrollbar-hidden">
                {messages.map((item, fakerKey) => (
                  <div
                    key={fakerKey}
                    className={clsx({
                      "intro-x cursor-pointer box relative flex items-center p-5":
                        true,
                      "mt-5": fakerKey,
                    })}
                    onClick={() => getTicket(item.id)}
                  >

                    <div className="ml-2 overflow-hidden">
                      <div className="flex items-center">
                        <a  className="font-medium">
                          {item.name}
                        </a>
                        {/* <div className="ml-auto text-xs text-slate-400">
                          {dayjs(data.createdAt).format('hh:mm A')}
                        </div> */}
                      </div>
                      <div className="w-full truncate text-slate-500 mt-0.5">
                        {item.message}
                      </div>
                    </div>
                    {/* {faker.trueFalse[0] && (
                      <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-1 -mr-1 text-xs font-medium text-white rounded-full bg-primary">
                        {faker.notificationCount}
                      </div>
                    )} */}
                    <Menu className="hidden my-auto ml-auto sm:block">
                      <Menu.Button
                        as="a"
                        
                        className="w-4 h-4 text-slate-500"
                      >
                        <Lucide icon="MoreVertical" className="w-4 h-4" />
                      </Menu.Button>
                      <Menu.Items className="w-40">
                        <Menu.Item onClick={() => { deleteTicket(item.id) }}>
                          <Lucide icon="Trash" className="w-4 h-4 mr-2" />{" "}
                          Delete
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                ))}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="pt-1 pr-1 overflow-y-auto h-[525px] scrollbar-hidden">
                <div className="mt-4 text-slate-500">A</div>
                <div className="relative flex items-center p-5 mt-5 cursor-pointer box">
                  <div className="flex-none w-12 h-12 mr-1 image-fit">
                    <img
                      alt="DuvDu Admin DashBoard"
                      className="rounded-full"
                      src={fakerData[0].photos[0]}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="" className="font-medium">
                        {fakerData[0].users[0].name}
                      </a>
                    </div>
                    <div className="w-full truncate text-slate-500 mt-0.5">
                      Last seen 2 hours ago
                    </div>
                  </div>
                  <Menu className="ml-auto">
                    <Menu.Button as="a" className="block w-5 h-5" >
                      <Lucide
                        icon="MoreHorizontal"
                        className="w-5 h-5 text-slate-500"
                      />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item>
                        <Lucide icon="Share2" className="w-4 h-4 mr-2" />
                        Share Contact
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy
                        Contact
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
                <div className="relative flex items-center p-5 mt-5 cursor-pointer box">
                  <div className="flex-none w-12 h-12 mr-1 image-fit">
                    <img
                      alt="DuvDu Admin DashBoard"
                      className="rounded-full"
                      src={fakerData[1].photos[0]}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="" className="font-medium">
                        {fakerData[1]["users"][0]["name"]}
                      </a>
                    </div>
                    <div className="w-full truncate text-slate-500 mt-0.5">
                      Last seen 2 hours ago
                    </div>
                  </div>
                  <Menu className="ml-auto">
                    <Menu.Button as="a" className="block w-5 h-5" >
                      <Lucide
                        icon="MoreHorizontal"
                        className="w-5 h-5 text-slate-500"
                      />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item>
                        <Lucide icon="Share2" className="w-4 h-4 mr-2" />
                        Share Contact
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy
                        Contact
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
                <div className="mt-4 text-slate-500">B</div>
                <div className="relative flex items-center p-5 mt-5 cursor-pointer box">
                  <div className="flex-none w-12 h-12 mr-1 image-fit">
                    <img
                      alt="DuvDu Admin DashBoard"
                      className="rounded-full"
                      src={fakerData[2].photos[0]}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="" className="font-medium">
                        {fakerData[2]["users"][0]["name"]}
                      </a>
                    </div>
                    <div className="w-full truncate text-slate-500 mt-0.5">
                      Last seen 2 hours ago
                    </div>
                  </div>
                  <Menu className="ml-auto">
                    <Menu.Button as="a" className="block w-5 h-5" >
                      <Lucide
                        icon="MoreHorizontal"
                        className="w-5 h-5 text-slate-500"
                      />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item>
                        <Lucide icon="Share2" className="w-4 h-4 mr-2" />
                        Share Contact
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy
                        Contact
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
                <div className="relative flex items-center p-5 mt-5 cursor-pointer box">
                  <div className="flex-none w-12 h-12 mr-1 image-fit">
                    <img
                      alt="DuvDu Admin DashBoard"
                      className="rounded-full"
                      src={fakerData[3].photos[0]}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="" className="font-medium">
                        {fakerData[3]["users"][0]["name"]}
                      </a>
                    </div>
                    <div className="w-full truncate text-slate-500 mt-0.5">
                      Last seen 2 hours ago
                    </div>
                  </div>
                  <Menu className="ml-auto">
                    <Menu.Button as="a" className="block w-5 h-5" >
                      <Lucide
                        icon="MoreHorizontal"
                        className="w-5 h-5 text-slate-500"
                      />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item>
                        <Lucide icon="Share2" className="w-4 h-4 mr-2" />
                        Share Contact
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy
                        Contact
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
                <div className="relative flex items-center p-5 mt-5 cursor-pointer box">
                  <div className="flex-none w-12 h-12 mr-1 image-fit">
                    <img
                      alt="DuvDu Admin DashBoard"
                      className="rounded-full"
                      src={fakerData[4].photos[0]}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="" className="font-medium">
                        {fakerData[4]["users"][0]["name"]}
                      </a>
                    </div>
                    <div className="w-full truncate text-slate-500 mt-0.5">
                      Last seen 2 hours ago
                    </div>
                  </div>
                  <Menu className="ml-auto">
                    <Menu.Button as="a" className="block w-5 h-5" >
                      <Lucide
                        icon="MoreHorizontal"
                        className="w-5 h-5 text-slate-500"
                      />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                      <Menu.Item>
                        <Lucide icon="Share2" className="w-4 h-4 mr-2" />
                        Share Contact
                      </Menu.Item>
                      <Menu.Item>
                        <Lucide icon="Copy" className="w-4 h-4 mr-2" /> Copy
                        Contact
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="pr-1">
                <div className="px-5 py-10 mt-5 box">
                  <div className="flex-none w-20 h-20 mx-auto overflow-hidden rounded-full image-fit">
                    <img
                      alt="DuvDu Admin DashBoard"
                      src={fakerData[0].photos[0]}
                    />
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-lg font-medium">
                      {fakerData[0]["users"][0]["name"]}
                    </div>
                    <div className="mt-1 text-slate-500">
                      Tailwind HTML Admin Template
                    </div>
                  </div>
                </div>
                <div className="p-5 mt-5 box">
                  <div className="flex items-center pb-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <div>
                      <div className="text-slate-500">Country</div>
                      <div className="mt-1">New York City, USA</div>
                    </div>
                    <Lucide
                      icon="Globe"
                      className="w-4 h-4 ml-auto text-slate-500"
                    />
                  </div>
                  <div className="flex items-center py-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <div>
                      <div className="text-slate-500">Phone</div>
                      <div className="mt-1">+32 19 23 62 24 34</div>
                    </div>
                    <Lucide
                      icon="Mic"
                      className="w-4 h-4 ml-auto text-slate-500"
                    />
                  </div>
                  <div className="flex items-center py-5 border-b border-slate-200/60 dark:border-darkmode-400">
                    <div>
                      <div className="text-slate-500">Email</div>
                      <div className="mt-1">
                        {fakerData[0]["users"][0]["email"]}
                      </div>
                    </div>
                    <Lucide
                      icon="Mail"
                      className="w-4 h-4 ml-auto text-slate-500"
                    />
                  </div>
                  <div className="flex items-center pt-5">
                    <div>
                      <div className="text-slate-500">Joined Date</div>
                      <div className="mt-1">{fakerData[0]["dates"][0]}</div>
                    </div>
                    <Lucide
                      icon="Clock"
                      className="w-4 h-4 ml-auto text-slate-500"
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        {/* END: Chat Side Menu */}
        {/* BEGIN: Chat Content */}
        <div className="col-span-12 intro-y lg:col-span-8 2xl:col-span-9">
          <div className="h-[782px] box">
            {/* BEGIN: Chat Active */}
            {chatBox && (
              <div className="flex flex-col h-full">
                <div className="flex flex-col px-5 py-4 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
                  <div className="flex items-center">
                    <div className="relative flex-none w-10 h-10 sm:w-12 sm:h-12 image-fit">
                      {/* <img
                        alt="DuvDu Admin DashBoard"
                        className="rounded-full"
                        src={fakerData[0].photos[0]}
                      /> */}
                    </div>
                    <div className="ml-3 mr-auto">
                      <div className="text-base font-medium">
                        {message.name}
                      </div>
                    </div>
                  </div>

                </div>
                <div className="flex-1 px-5 pt-5 overflow-y-scroll scrollbar-hidden">

                  {
                    message &&

                    <div className="flex items-end float-left mb-4 max-w-[90%] sm:max-w-[49%]">
                      <div className="relative flex-none hidden w-10 h-10 mr-5 sm:block image-fit">
                        {/* <img
                          alt="DuvDu Admin DashBoard"
                          className="rounded-full"
                          src={fakerData[0].photos[0]}
                        /> */}
                      </div>
                      <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 text-slate-500 rounded-r-md rounded-t-md">
                        {message?.message}
                        <div className="mt-1 text-xs text-slate-500">
                          {formatDistanceToNow(message?.createdAt, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  }
                  <div className="clear-both"></div>
                  {
                    message?.state?.feedback &&
                    <div className="flex items-end float-right mb-4 max-w-[90%] sm:max-w-[49%]">
                    <div className="px-4 py-3 text-white bg-primary rounded-l-md rounded-t-md">
                      {message?.state?.feedback}
                    </div>
                  </div>
                  }

                  {/* 
                    <div className="mt-5 mb-10 text-xs text-center text-slate-400 dark:text-slate-500">
                    12 June 2020
                  </div>  
                  <div className="flex items-end float-right mb-4 max-w-[90%] sm:max-w-[49%]">
                    <Menu className="hidden my-auto mr-3 sm:block">
                      <Menu.Button
                        as="a"
                        
                        className="w-4 h-4 text-slate-500"
                      >
                        <Lucide icon="MoreVertical" className="w-4 h-4" />
                      </Menu.Button>
                      <Menu.Items className="w-40">
                        <Menu.Item>
                          <Lucide
                            icon="CornerUpLeft"
                            className="w-4 h-4 mr-2"
                          />
                          Reply
                        </Menu.Item>
                        <Menu.Item>
                          <Lucide icon="Trash" className="w-4 h-4 mr-2" />{" "}
                          Delete
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                    <div className="px-4 py-3 text-white bg-primary rounded-l-md rounded-t-md">
                      Lorem ipsum
                      <div className="mt-1 text-xs text-white text-opacity-80">
                        1 secs ago
                      </div>
                    </div>
                    <div className="relative flex-none hidden w-10 h-10 ml-5 sm:block image-fit">
                      <img
                        alt="DuvDu Admin DashBoard"
                        className="rounded-full"
                        src={fakerData[1].photos[0]}
                      />
                    </div>
                  </div>
                  <div className="clear-both"></div>
                  <div className="flex items-end float-left mb-4 max-w-[90%] sm:max-w-[49%]">
                    <div className="relative flex-none hidden w-10 h-10 mr-5 sm:block image-fit">
                      <img
                        alt="DuvDu Admin DashBoard"
                        className="rounded-full"
                        src={fakerData[0].photos[0]}
                      />
                    </div>
                    <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 text-slate-500 rounded-r-md rounded-t-md">
                      {fakerData[0]["users"][0]["name"]} is typing
                      <span className="ml-1 typing-dots">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    </div>
                  </div>
                    */}
                </div>
                <div className="flex items-center pt-4 pb-10 border-t sm:py-4 border-slate-200/60 dark:border-darkmode-400">
                  <FormTextarea
                    className="px-5 py-3 border-transparent shadow-none resize-none h-[46px] dark:bg-darkmode-600 focus:border-transparent focus:ring-0"
                    rows={1}
                    placeholder="Type your message..."
                    onChange={(e) => setfeedback(e.target.value)}
                    value={feedback}
                  ></FormTextarea>
                  <a
                    
                    className="flex items-center justify-center flex-none w-8 h-8 mr-5 text-white rounded-full sm:w-10 sm:h-10 bg-primary"
                  >
                    <Lucide icon="Send" className="w-4 h-4" onClick={sendMessage} />
                  </a>
                </div>
              </div>
            )}
            {/* END: Chat Active */}
            {/* BEGIN: Chat Default */}
            {!chatBox && (
              <div className="flex items-center h-full">
                <div className="mx-auto text-center">
                  <div className="flex-none w-16 h-16 mx-auto overflow-hidden rounded-full image-fit">
                    {/* <img
                      alt="DuvDu Admin DashBoard"
                      src={fakerData[0].photos[0]}
                    /> */}
                  </div>
                  <div className="mt-3">
                    <div className="mt-1 text-slate-500">
                      Please select a Ticket to read message.
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* END: Chat Default */}
          </div>
        </div>
        {/* END: Chat Content */}
      </div>
    </>
  );
}

export default Main;
