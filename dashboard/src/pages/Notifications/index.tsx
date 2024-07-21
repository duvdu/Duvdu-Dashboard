import _ from "lodash";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu } from "../../base-components/Headless";
import { useAppSelector, useAppDispatch } from "../../redux/stores/hooks";
import { StateUsers } from "../../redux/stores/api/users";
import { useEffect, useRef, useState } from "react";
import { ActionGetUsers } from "../../redux/action/api/users/get";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Dialog } from '../../base-components/Headless';
import { StateSendNotificationsToAllUsers } from "../../redux/stores/api/notifications/sendToAllUsers";
import { ActionSendNotificationToAllUsers } from "../../redux/action/api/notifications/sendToAllUsers";
import { StateSendNotificationsToSelectedUsers } from "../../redux/stores/api/notifications/sendToSelectedUsers";
import { ActionSendNotificationToSelectedUsers } from "../../redux/action/api/notifications/sendToSelectedUsers";

function Main() {
  const [formValues, setFormValues] = useState<{title:string , message:string , topic?:string}>({ title: '' , message:''  });
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<string|null>(null);
  const [openAddModel, setOpenAddModel] = useState(false);
  const [openAddSelectedModel, setOpenAddSelectedModel] = useState(false);
  const navigate = useNavigate();
  const limit = 20;
  const selector = useAppSelector(StateUsers);
  const state = selector?.data
  const pagdnationState = state?.pagination
  const listusers = state?.data;
  const dispatch = useAppDispatch();
  const sendButtonRef = useRef(null);

  const stateSendNotificationsToAllUsers = useAppSelector(StateSendNotificationsToAllUsers);
  const stateSendNotificationsToSelectedUsers = useAppSelector(StateSendNotificationsToSelectedUsers);
  const pagdnation = (page: number) => {
    dispatch(ActionGetUsers({ limit: limit, page: page }))
  };
  useEffect(() => {
      dispatch(ActionGetUsers({  limit: limit}))
  }, [])
  useEffect(() => {
    if(stateSendNotificationsToAllUsers?.data)
      setOpenAddModel(false)
  }, [stateSendNotificationsToAllUsers?.data]);
  useEffect(() => {
    if(stateSendNotificationsToSelectedUsers?.data)
      setOpenAddSelectedModel(false)
  }, [stateSendNotificationsToSelectedUsers?.data]);


  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const clear = () => {
    setFormValues({ title: '' , message:''});
  };
  const validateForm = () => {
    let newErrors = null;
    if (!formValues.topic && !setOpenAddSelectedModel) setErrors('Topic Count is required');
    if (!formValues.title) setErrors('Title Count is required');
    if (!formValues.message) setErrors('Message is required');

    return newErrors === null;
  };


  const SendToAllUsers = () => {
    if (validateForm()) {      
      dispatch(ActionSendNotificationToAllUsers(formValues));
    }
  };
  const onSubmit = () => {
    SendToAllUsers();
  };
  const SendToSelectedUsers = () => {
    if (validateForm()) {      
      dispatch(ActionSendNotificationToSelectedUsers({...formValues , users:selectedUserIds}));
    }
  };
  const onSubmitSelected = () => {
    SendToSelectedUsers();
  };

  const handleCheckboxChange = (userId:string) => {
    setSelectedUserIds((prevSelectedUserIds) => {
      if (prevSelectedUserIds.includes(userId)) {
        // If already selected, remove it
        return prevSelectedUserIds.filter((id) => id !== userId);
      } else {
        // If not selected, add it
        return [...prevSelectedUserIds, userId];
      }
    });
  };
  return (
    <>
           {/* Add Rank */}
      <Dialog open={openAddModel} onClose={() => setOpenAddModel(false)} initialFocus={sendButtonRef}>
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Send Notifications to All Users</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-6 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">Topic</FormLabel>
              <FormInput id="modal-form-1" type="text" name="topic" value={formValues.topic} onChange={handleInputChange} />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Title</FormLabel>
              <FormInput id="modal-form-2" type="text" name="title" value={formValues.title} onChange={handleInputChange} />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">message</FormLabel>
              <FormInput id="modal-form-2" type="text" name="message" value={formValues.message} onChange={handleInputChange} />
            </div>
          </Dialog.Description>
            {errors && <p className="text-danger text-center">{errors}</p>}
          <Dialog.Footer>
            <Button type="button" variant="outline-secondary" onClick={() => setOpenAddModel(false)} className="w-20 mr-1">
              Cancel
            </Button>
            <Button onClick={onSubmit} variant="primary" type="button" className="w-20" ref={sendButtonRef}>
            {stateSendNotificationsToAllUsers?.loading ? (
                  <LoadingIcon icon="puff" className="w-4 h-4 mr-1" />
                ) : (
                  <>
              Send
              </>
              )}
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
       {/* Add Selected Users */}
      <Dialog open={openAddSelectedModel} onClose={() => setOpenAddSelectedModel(false)} initialFocus={sendButtonRef}>
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Send Notifications</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-6 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">Title</FormLabel>
              <FormInput id="modal-form-2" type="text" name="title" value={formValues.title} onChange={handleInputChange} />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">message</FormLabel>
              <FormInput id="modal-form-2" type="text" name="message" value={formValues.message} onChange={handleInputChange} />
            </div>
          </Dialog.Description>
            {errors && <p className="text-danger text-center">{errors}</p>}
          <Dialog.Footer>
            <Button type="button" variant="outline-secondary" onClick={() => setOpenAddSelectedModel(false)} className="w-20 mr-1">
              Cancel
            </Button>
            <Button onClick={onSubmitSelected} variant="primary" type="button" className="w-20" ref={sendButtonRef}>
            {stateSendNotificationsToSelectedUsers?.loading ? (
                  <LoadingIcon icon="puff" className="w-4 h-4 mr-1" />
                ) : (
                  <>
              Send
              </>
              )}
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
      <Button onClick={() => {
        setOpenAddModel(true)
        clear();
        }} variant="primary" className="mr-2 mb-2 shadow-md">
        Send Notification To All Users
      </Button>
      {selectedUserIds.length > 0 &&
      <Button onClick={() => {
        setOpenAddSelectedModel(true)
        clear();
        }} variant="primary" className="mr-2 mb-2 shadow-md">
        Send Notification To Selected Users
      </Button>
      }

      <h2 className="mt-10 text-lg font-medium intro-y">Users</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* BEGIN: Users Layout */}
        {listusers?.map((user:any, key:number) => (
          <div key={key} className="col-span-12 intro-y md:col-span-6">
            <div className="box">
              <div className="flex items-center gap-2 p-5 flex-row">
                <div className="w-8 h-8 image-fit lg:mr-1">
                  <img
                    alt="DuvDu Admin DashBoard"
                    className="rounded-full"
                    src={user.profileImage}
                  />
                </div>
                <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                  <a href="" className="font-medium">
                    {user.name}
                  </a>
                  <div className="text-slate-500 text-xs mt-0.5">
                    {user.username}
                  </div>
                </div>
                <div className="flex mt-4 lg:mt-0">
                  <input type="checkbox"
                    onChange={() => handleCheckboxChange(user._id)}
                    checked={selectedUserIds.includes(user._id)}                  
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        {selector.loading &&
          <LoadingIcon icon="puff" className="w-5 h-5" />
        }
        {/* BEGIN: Users Layout */}
        {/* END: Pagination */}
        {state &&
          <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap" >
            <Pagination className="w-full sm:w-auto sm:mr-auto">
              <Pagination.Link>
                <Lucide onClick={() => pagdnation(1)} icon="ChevronsLeft" className="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link>
                <Lucide onClick={() => pagdnation(pagdnationState?.currentPage > 1 ? pagdnationState?.currentPage - 1 : 1)} icon="ChevronLeft" className="w-4 h-4" />
              </Pagination.Link>
              {Array.from({ length: pagdnationState?.totalPages }, (_, index) => (
                <div onClick={() => pagdnation(index + 1)}>
                <Pagination.Link
                  key={index}
                  active={pagdnationState?.currentPage === index + 1}
                  >
                    {index + 1}
                </Pagination.Link>
                  </div>
              ))}
              <Pagination.Link>
                <Lucide icon="ChevronRight" className="w-4 h-4"
                  onClick={() =>
                    pagdnation(pagdnationState?.currentPage < pagdnationState?.totalPages ? pagdnationState?.currentPage + 1 : pagdnationState?.totalPages)
                  }
                />
              </Pagination.Link>
              <Pagination.Link>
                <Lucide icon="ChevronsRight" className="w-4 h-4" onClick={() => pagdnation(pagdnationState?.totalPages)} />
              </Pagination.Link>
            </Pagination>
          </div>}
        {/* END: Pagination */}
      </div>
    </>
  );
}

export default Main;
