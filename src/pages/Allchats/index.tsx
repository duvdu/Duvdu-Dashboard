import _ from "lodash";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import { FormInput, FormTextarea } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import { StateChat } from "../../redux/stores/api/chat/one";
import { ActionGetChats } from "../../redux/action/api/chat/getall";
import { ActionGetChat } from "../../redux/action/api/chat/getone";
import { StateAllChat } from "../../redux/stores/api/chat/all";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ActionSendMessage } from "../../redux/action/api/chat/send";
import { StateMyProfile } from "../../redux/stores/api/profile/myprofile";
import { ActionMyProfile } from "../../redux/action/api/profile/myprofile";
import { FileInfo, handleMultipleFileUpload } from "../../utils/helper";
import FileIcon from "../../base-components/FileIcon";
import Tippy from "../../base-components/Tippy";
import AudioRecorder from "../../components/recording/recording";

function Main() {
  const dispatch = useAppDispatch()
  const statechat = useAppSelector(StateChat)
  const stateAllchat = useAppSelector(StateAllChat)
  const stateMyProfile = useAppSelector(StateMyProfile)
  const [messageContent, setMessageField] = useState('');
  const [files, setFiles] = useState<FileInfo[]>([]);
  ///////////// audio //////////////
  const [isRecording, setisRecord] = useState(false)
  ///////////// audio //////////////
  const [audioSrc, setaudioSrc] = useState<String>()
  const [recordobject, setRecordobject] = useState<Blob | undefined>()

  const chatref = useRef(null)
  const { id } = useParams();
  const navigate = useNavigate();
  const getOther = (user1: any, user2: any) => {
    if (user1?._id == stateMyProfile?.data?.data?._id) return user2
    else return user1
  };


  const attachmentsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = handleMultipleFileUpload(e);
    setFiles(uploadedFiles);
  };
  const handleRemoveImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles([]);
  };

  useEffect(() => {
    dispatch(ActionGetChats())
    dispatch(ActionMyProfile())
  }, [])
  useEffect(() => {
    if (id)
      dispatch(ActionGetChat({ id: id }))
  }, [id])

  const sendmessage = () => {
    dispatch(ActionSendMessage({ id: id, message: messageContent, files: files, vocieNote: recordobject }));
    clearInput()
  };

  const clearInput = () => {
    setMessageField('');
    setFiles([]);
    removeRecord()
  }
  const removeRecord = () => {
    setaudioSrc("");
    setRecordobject(undefined);
  }

  const handleInputChange = (e) => {
    setMessageField(e.target.value);
  };
  const showChatBox = (id: string) => {
    navigate(`/allchats/${id}`)
  }
  const other = getOther(statechat?.data?.data[0]?.sender, statechat?.data?.data[0]?.receiver)
  const getLastMessageId = (statechat) => {
    const messages = statechat?.data?.data;
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      return lastMessage._id;
    }
    return null; // Return null or handle the case where there are no messages
  };
  const lastMessageId = getLastMessageId(statechat);
  // Example usage:
  useEffect(() => {
    if (lastMessageId) {
      const element = document.getElementById(lastMessageId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [lastMessageId]);


  // Function to handle file upload

  // Function to convert selected files into FileInfo array
  const handleMultipleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): FileInfo[] => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return [];
    }

    return Array.from(files).map((file: File) => {
      const fileName = file.name;
      const fileType = file.type;
      const fileSize = file.size;
      const formattedFileSize = formatFileSize(fileSize);

      return {
        fileName: fileName,
        fileType: fileType,
        formattedFileSize: formattedFileSize,
        file: file
      };
    });
  };

  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (bytes > 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
  };

  const swapRecording = () => {
    setisRecord(!isRecording)
  };

  const handleRecodOutPut = (audioUrl: string, audioBlob: Blob) => {
    setaudioSrc(audioUrl)
    setRecordobject(audioBlob)
  };

  const isRecord = () => audioSrc && audioSrc.length > 0
  console.log(statechat?.data?.data)
  return (
    <>
      <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
        <h2 className="mr-auto text-lg font-medium">Chat</h2>
      </div>
      <div className="grid grid-cols-12 gap-5 mt-5 intro-y">
        {/* BEGIN: Chat Side Menu */}
        <Tab.Group className="col-span-12 lg:col-span-4 2xl:col-span-3">
          <Tab.Panels>
            <Tab.Panel>
              <div className="pt-1 pr-1 mt-4 overflow-y-auto h-[525px] scrollbar-hidden">
                {stateAllchat?.data?.data?.map((item, key) => {
                  const other = getOther(item.newestMessage.sender, item.newestMessage.receiver);
                  return (
                    <div
                      key={key}
                      className={clsx({
                        "intro-x cursor-pointer box relative flex items-center p-5":
                          true,
                        "mt-5": key,
                      })}
                      onClick={() => showChatBox(other._id)}
                    >
                      <div className="flex-none w-12 h-12 mr-1 image-fit">
                        <img
                          alt="DuvDu Admin DashBoard"
                          className="rounded-full"
                          src={other.profileImage}
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
                      </div>
                      <div className="ml-2 overflow-hidden">
                        <div className="flex items-center">
                          <a href="#" className="font-medium">
                            {other.name}
                          </a>
                          <div className="ml-auto text-xs text-slate-400">
                            {other.updatedAt}
                          </div>
                        </div>
                        <div className="w-full truncate text-slate-500 mt-0.5">
                          {item.newestMessage.content}
                        </div>
                      </div>
                      {item.unreadMessageCount > 0 && (
                        <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-1 -mr-1 text-xs font-medium text-white rounded-full bg-primary">
                          {item.unreadMessageCount}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Tab.Panel>

          </Tab.Panels>
        </Tab.Group>
        {/* END: Chat Side Menu */}
        {/* BEGIN: Chat Content */}
        <div className="col-span-12 intro-y lg:col-span-8 2xl:col-span-9">
          <div className="h-[782px] box">
            {/* BEGIN: Chat Active */}
            {statechat?.data?.data && (
              <div className="flex flex-col h-full">
                <div className="flex flex-col px-5 py-4 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
                  <div className="flex items-center">
                    <div className="relative flex-none w-10 h-10 sm:w-12 sm:h-12 image-fit">
                      <img
                        alt="DuvDu Admin DashBoard"
                        className="rounded-full"
                        src={other?.profileImage}
                      />
                    </div>
                    <div className="ml-3 mr-auto">
                      <div className="text-base font-medium">
                        {other?.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center px-5 pt-3 mt-5 -mx-5 border-t sm:ml-auto sm:mt-0 sm:border-0 border-slate-200/60 sm:pt-0 sm:mx-0 sm:px-0">
                    <a href="#" className="w-5 h-5 text-slate-500">
                      <Lucide icon="Search" className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-5 h-5 ml-5 text-slate-500">
                      <Lucide icon="UserPlus" className="w-5 h-5" />
                    </a>
                    <Menu className="ml-auto sm:ml-3">
                      <Menu.Button
                        as="a"
                        href="#"
                        className="w-5 h-5 text-slate-500"
                      >
                        <Lucide icon="MoreVertical" className="w-5 h-5" />
                      </Menu.Button>
                      <Menu.Items className="w-40">
                        <Menu.Item>
                          <Lucide icon="Share2" className="w-4 h-4 mr-2" />
                          Share Contact
                        </Menu.Item>
                        <Menu.Item>
                          <Lucide icon="Settings" className="w-4 h-4 mr-2" />
                          Settings
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                </div>
                <div className="p-4 h-full overflow-y-scroll scrollbar-hidden" ref={chatref}>
                  {statechat?.data?.data?.map((message, index) => (
                    <div id={message._id} key={index}>
                      {message.sender._id === getOther(message.sender, message.receiver)._id ? (
                        <div className="flex items-end float-left mb-4 max-w-[90%] sm:max-w-[49%]">
                          <div className="relative flex-none hidden w-10 h-10 mr-5 sm:block image-fit">
                            <img
                              alt={message.sender.username}
                              className="rounded-full"
                              src={message.sender.profileImage}
                            />
                          </div>
                          <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 text-slate-500 rounded-r-md rounded-t-md">
                            <div> 
                              {message.media && message.media.length > 0 && message.media.map((mediaItem, index) => (
                              <>
                                {(() => {
                                  if (mediaItem.type.includes('pdf')) {
                                    return <FileIcon key={index} className="w-10 h-10 mx-auto" variant="file" />;
                                  } else if (mediaItem.type.includes('audio')) {
                                    return <div key={index} className="w-60 flex items-center relative">
                                      <audio controls controlsList="nodownload" src={`https://duvdu-s3.s3.eu-central-1.amazonaws.com/${mediaItem.url}`} className="w-full outline-none"></audio>
                                    </div>
                                  } else if (mediaItem.type.includes('image')) {
                                    return <FileIcon key={index} className="w-60 h-60 my-1 mx-auto" variant="image" src={`https://duvdu-s3.s3.eu-central-1.amazonaws.com/${mediaItem.url}`} />;
                                  } else {
                                    return <FileIcon key={index} className="w-40 h-40 mx-auto" variant="directory" />;
                                  }
                                })()}
                              </>
                            ))}
                            </div>

                            {
                              !(message.media && message.media.length > 0) &&
                              message.content
                            }

                            <div className="mt-1 text-xs text-slate-500">
                              {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-end float-right mb-4 max-w-[90%] sm:max-w-[49%]">
                          <div className="px-4 py-3 text-white bg-primary rounded-l-md rounded-t-md">
                          <div>
                              {message.media && message.media.length > 0 && message.media.map((mediaItem, index) => (
                                <>
                                  {(() => {
                                    if (mediaItem.type.includes('pdf')) {
                                      return <FileIcon key={index} className="w-10 h-10 mx-auto" variant="file" />;
                                    } else if (mediaItem.type.includes('audio')) {
                                      return <div key={index} className="w-60 flex items-center relative">
                                        <audio controls controlsList="nodownload" src={`https://duvdu-s3.s3.eu-central-1.amazonaws.com/${mediaItem.url}`} className="w-full outline-none"></audio>
                                      </div>
                                    } else if (mediaItem.type.includes('image')) {
                                      return <FileIcon key={index} className="w-60 h-60 my-1 mx-auto" variant="image" src={`https://duvdu-s3.s3.eu-central-1.amazonaws.com/${mediaItem.url}`} />;
                                    } else {
                                      return <FileIcon key={index} className="w-40 h-40 mx-auto" variant="directory" />;
                                    }
                                  })()}
                                </>
                              ))}
                            </div>

                            {
                              !(message.media && message.media.length > 0) &&
                              message.content
                            }
                            <div className="mt-1 text-xs text-white text-opacity-80">
                              {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                            </div>
                          </div>
                          <div className="relative flex-none hidden w-10 h-10 ml-5 sm:block image-fit">
                            <img
                              alt={message.sender.username}
                              className="rounded-full"
                              src={message.sender.profileImage}
                            />
                          </div>
                        </div>
                      )}
                      <div className="clear-both"></div>
                    </div>
                  ))}
                </div>
                {files.length > 0 &&
                  <div className="relative flex flex-wrap h-96 gap-2 items-center pt-4 pb-10 border-t sm:py-4 border-slate-200/60 dark:border-darkmode-400 overflow-y-scroll scrollbar-hidden">
                    <Tippy
                      content="Remove all files"
                      className="absolute top-3 right-3 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                    >
                      <div onClick={handleRemoveImage}>
                        <Lucide icon="X" className="w-4 h-4" />
                      </div>
                    </Tippy>
                    {files.map((file, index) => (
                      <div key={index} className="col-span-6 intro-y sm:col-span-4 md:col-span-3 2xl:col-span-2">
                        <div className="relative px-2 pt-1 pb-1 rounded-md file box sm:px-3 zoom-in">
                          {/* Render the appropriate file icon based on file type */}
                          {(() => {
                            if (file.fileType.includes('pdf')) {
                              return <FileIcon className="w-3/5 mx-auto" variant="file" />;
                            }
                            // else if (file.fileType.includes('video')) {
                            //   return <FileIcon className="w-3/5 mx-auto" variant="" />;
                            // }
                            else if (file.fileType.includes('audio')) {
                              return <FileIcon className="w-3/5 mx-auto" variant="file" />;
                            } else if (file.fileType.includes('image')) {
                              return <FileIcon className="w-3/5 mx-auto" variant="image" src={URL.createObjectURL(file.file)} />
                            } else {
                              return <FileIcon className="w-3/5 mx-auto" variant="directory" />;
                            }
                          })()}
                          {/* Render the file name */}
                          <a href="#" className="block mt-2 font-medium text-center truncate w-48">{file.fileName}</a>
                          {/* Render the file size */}
                          <div className="text-slate-500 text-xs text-center mt-0.5 ">{file.formattedFileSize}</div>
                          {/* Render the file menu */}
                          <Menu className="absolute top-0 right-0 mt-3 ml-auto mr-2 hidden">
                            <Menu.Button as="a" className="block w-5 h-5" href="#">
                              <Lucide icon="MoreVertical" className="w-5 h-5 text-slate-500" />
                            </Menu.Button>
                            <Menu.Items className="w-40">
                              <Menu.Item>
                                <Lucide icon="Trash" className="w-4 h-4 mr-2" /> Delete
                              </Menu.Item>
                            </Menu.Items>
                          </Menu>
                        </div>
                      </div>
                    ))}
                  </div>
                }
                <div className="flex items-center pt-4 pb-10 border-t sm:py-4 border-slate-200/60 dark:border-darkmode-400">
                  <FormTextarea
                    className="px-5 py-3 border-transparent shadow-none resize-none h-[46px] dark:bg-darkmode-600 focus:border-transparent focus:ring-0"
                    rows={1}
                    placeholder="Type your message..."
                    value={messageContent}
                    onChange={handleInputChange}
                  ></FormTextarea>
                  <AudioRecorder
                    isstartRecording={isRecording}
                    recordingoutput={handleRecodOutPut}
                  />
                  {
                    recordobject &&
                    <div className="w-full flex items-center max-w-xs relative" >
                      <audio controls controlsList="nodownload" src={audioSrc} className="w-full outline-none"></audio>

                    </div>
                  }
                  <div className="relative w-4 h-4 mx-3 sm:w-5 sm:h-5 text-slate-500 sm:mr-5">
                    {
                      <div>
                        {!isRecord() &&
                          <>
                            {isRecording ? (
                              <Lucide icon="StopCircle" className="w-5 h-5" onClick={swapRecording} />
                            ) : (
                              <Lucide icon="Mic" className="w-5 h-5" onClick={swapRecording} />
                            )}
                          </>
                        }

                        {!isRecording && isRecord() && (
                          <Tippy
                            onClick={removeRecord}
                            content="Remove record message"
                            className="absolute top-3 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                          >
                            <div>
                              <Lucide icon="X" className="w-4 h-4" />
                            </div>
                          </Tippy>
                        )}
                      </div>
                    }
                  </div>

                  {!isRecord() && !isRecording &&
                    <div className="relative w-4 h-4 mr-3 sm:w-5 sm:h-5 text-slate-500 sm:mr-5">

                      <Lucide icon="Paperclip" className="w-full h-full" />
                      <FormInput
                        type="file"
                        multiple
                        className="absolute top-0 left-0 w-full h-full opacity-0"
                        onChange={attachmentsUpload}
                      />
                    </div>
                  }
                  <div className="flex items-center justify-center flex-none w-8 h-8 mr-5 text-white rounded-full sm:w-10 sm:h-10 bg-primary" onClick={sendmessage}>
                    <Lucide icon="Send" className="w-4 h-4" />
                  </div>
                </div>
              </div>
            )}
            {/* END: Chat Active */}
            {/* BEGIN: Chat Default */}
            {!statechat?.data?.data && (
              <div className="flex items-center h-full">
                <div className="mx-auto text-center">
                  <div className="flex-none w-16 h-16 mx-auto overflow-hidden rounded-full image-fit">

                  </div>
                  <div className="mt-3">
                    <div className="font-medium">
                      Hey,
                    </div>
                    <div className="mt-1 text-slate-500">
                      Please select a chat to start messaging.
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* END: Chat Default */}
          </div>
        </div>
        {/* END: Chat Content */}
      </div >
    </>
  );
}

export default Main;
