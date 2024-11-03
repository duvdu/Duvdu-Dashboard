import _ from "lodash";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInline, FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import { useAppSelector, useAppDispatch } from "../../redux/stores/hooks";
import { StateUsers } from "../../redux/stores/api/users";
import { useEffect, useRef, useState } from "react";
import { ActionGetUsers } from "../../redux/action/api/users/get";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import { ActionBlockAdmin } from "../../redux/action/api/users/block";
import { StateGetAllRole } from "../../redux/stores/api/roles/getAll";
import { ActionUpdateUser } from "../../redux/action/api/users/update";
import Tippy from "../../base-components/Tippy";
import { StateEditAdmin } from "../../redux/stores/api/Admin/edit";
import { ActionGetRoles } from "../../redux/action/api/role/getAll";

function Main() {
  const [searchKey, setSearchKey] = useState('');
  const [deleteModalPreview, setDeleteModalPreview] = useState(false);
  const [actionUserId, setActionUserId] = useState<string | null>(null);
  const [openEditModel, setOpenEditModel] = useState(false);
  const sendButtonRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [previewSrc, setPreviewSrc] = useState<any>(null);
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result);
        setUploadedFile(file)
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveImage = () => {
    setPreviewSrc(null);
  };
  const [errors, setErrors] = useState<string|null>(null);
  const deleteButtonRef = useRef(null);
  const [formValues, setFormValues] = useState({ reason:'' });
  const [ formEditValues, setFormEditValues] = useState({
    coverImage:'',
    profileImage:'',
    name: "",
    username: "",
    password: "",
    phoneNumber: { 
      number: "" 
    },
    role: "",
  });
  const [ originalData, setOriginalData] = useState({
    coverImage:'',
    profileImage:'',
    name: "",
    username: "",
    password: "",
    phoneNumber: { 
      number: "" 
    },
    role: "",
  });

  useEffect(() => {
    if(deleteModalPreview == false){
      setFormValues({ reason:'' });
      // setErrors({});
    }
  }, [deleteModalPreview]);
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handleInputChangeEdit = (e:any) => {
    const { name, value } = e.target;
    setFormEditValues({ ...formEditValues, [name]: value });
  };
  const validateForm = () => {
    let newErrors = null;
    if (!formValues.reason) setErrors('Reason is required');

    return newErrors === null;
  };
  
  
  // Local states
  
  
  const navigate = useNavigate();

  const limit = 10;
  const selector = useAppSelector(StateUsers);
  const stateGetAllRole = useAppSelector(StateGetAllRole);
  const stateEditAdmin = useAppSelector(StateEditAdmin);
  const roles = stateGetAllRole?.data?.data || [];
  const state = selector?.data
  const pagdnationState = state?.pagination
  const listusers = state?.data;
  const dispatch = useAppDispatch();
  useEffect(()=>{
    dispatch(ActionGetRoles());
  },[])
  useEffect(() => {
    if (!selector.loading)
      dispatch(ActionGetUsers({ search: searchKey , isAdmin:true }))
  }, [searchKey])

  const pagdnation = (page: number) => {
    dispatch(ActionGetUsers({ search: searchKey, limit: limit, page: page , isAdmin:true }))
  };
  const blockAdmin = () => {
    if (actionUserId)
      dispatch(ActionBlockAdmin({id:actionUserId , reason:formValues.reason}));
  };


  const onBlock = () => {
    setDeleteModalPreview(false);
    blockAdmin();
    // clear();
  };
  const onUpdate = () => {
    const formDate = new FormData();
    if (uploadedFile)
      formDate.append('coverImage', uploadedFile)
    if(originalData.name !== formEditValues.name)
      formDate.append('name',formEditValues.name)
    if(originalData.username !== formEditValues.username)
    formDate.append('username',formEditValues.username)
    if(originalData.phoneNumber.number !== formEditValues.phoneNumber.number)
    formDate.append('phoneNumber[number]',formEditValues.phoneNumber.number)
    if(originalData.role !== formEditValues.role)
    formDate.append('role',formEditValues.role)
    formDate.append('password',formEditValues.password)
    dispatch(ActionUpdateUser({ formData:formDate ,userId: actionUserId }));
  };

  return (
    <>
    <Dialog open={deleteModalPreview} onClose={() => setDeleteModalPreview(false)} initialFocus={deleteButtonRef}>
        <Dialog.Panel>
        <div className="col-span-12 sm:col-span-6 p-5">
              <FormLabel htmlFor="modal-form-1">Reason</FormLabel>
              <FormInput id="modal-form-1" type="text" name="reason" value={formValues.reason} onChange={handleInputChange} />
            </div>
            {errors && <p className="text-danger text-center">{errors}</p>}
          <div className="px-5 pb-8 text-center">
            <Button type="button" variant="outline-secondary" onClick={() => setDeleteModalPreview(false)} className="w-24 mr-1">
              Cancel
            </Button>
            <Button type="button" variant="danger" className="w-24" ref={deleteButtonRef} onClick={onBlock}>
              Block
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* Edit user */}
      <Dialog className='w-[500px]' open={openEditModel} onClose={() => setOpenEditModel(false)} initialFocus={sendButtonRef}>
        <Dialog.Panel className='min-w-[80%]' >
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Edit Rank</h2>
          </Dialog.Title>
          <Dialog.Description className=" gap-y-3">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 grid grid-cols-12 gap-5">
            <FormInline className=" col-span-12 mt-10 xl:flex-row">
                  <div className="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                    <div className="gap-5 pl-4 pr-5">
                      {(previewSrc || formEditValues.coverImage) && (
                        <div className="relative cursor-pointer h-36 image-fit zoom-in aspect-square m-auto">
                          <img className="rounded-md" alt="Uploaded" src={previewSrc ? previewSrc : formEditValues.coverImage} />
                          <Tippy
                            content="Remove this image?"
                            className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                          >
                            <div onClick={handleRemoveImage}>
                              <Lucide icon="X" className="w-4 h-4" />
                            </div>
                          </Tippy>
                        </div>
                      )}
                    </div>
                    <div className="relative flex items-center justify-center px-4 pb-4 mt-5 cursor-pointer">
                      <Lucide icon="Image" className="w-4 h-4 mr-2" />
                      <span className="mr-1 text-primary">Upload a file</span> or drag and drop
                      <FormInput
                        id="horizontal-form-1"
                        type="file"
                        className="absolute top-0 left-0 w-full h-full opacity-0"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </FormInline>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-1" className="font-bold">Name</FormLabel>
                <FormInput
                  id="modal-form-1"
                  type="text"
                  name="name"
                  value={formEditValues.name}
                  onChange={handleInputChangeEdit}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-2" className="font-bold">Username</FormLabel>
                <FormInput
                  id="modal-form-2"
                  type="text"
                  name="username"
                  value={formEditValues.username}
                  onChange={handleInputChangeEdit}
                />
              </div>
            </div>
            <div className="col-span-2 grid grid-cols-12 gap-5">
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-2" className="font-bold">Phone Number</FormLabel>
                <FormInput
                  id="modal-form-2"
                  type="text"
                  name="phoneNumber[number]"
                  value={formEditValues.phoneNumber.number}
                  onChange={(e)=>{
                    setFormEditValues({
                      ...formEditValues,
                      phoneNumber: {
                      ...formEditValues.phoneNumber,
                        number: e.target.value,
                      }
                    })
                  }}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-2" className="font-bold">Password</FormLabel>
                <FormInput
                  id="modal-form-2"
                  type="password"
                  name="password"
                  value={formEditValues.password}
                  onChange={handleInputChangeEdit}
                />
              </div>
              
            </div>
            <div className="col-span-2 grid grid-cols-12 gap-5">
            <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-6">Roles</FormLabel>
                <FormSelect id="modal-form-6" name="role" value={formEditValues.role} onChange={handleInputChangeEdit}>
                  <option value="" disabled>(select role)</option>
                  {roles.map((role:any) => (
                    <option key={role._id} value={role._id}>{role.key}</option>
                  ))}
                </FormSelect>
              </div>
            </div>
          </div>
                  </Dialog.Description>
            {errors && <p className="text-danger text-center">{errors}</p>}
          <Dialog.Footer>
            <Button type="button" variant="outline-secondary" onClick={() => setOpenEditModel(false)} className="w-20 mr-1">
              Cancel
            </Button>
            <Button onClick={onUpdate} variant="primary" type="button" className="w-20" ref={sendButtonRef}>
            {stateEditAdmin?.loading ? (
                  <LoadingIcon icon="puff" className="w-4 h-4 mr-1" />
                ) : (
                  <>
              Edit
              </>
            )}
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
      <h2 className="mt-10 text-lg font-medium intro-y">Users</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          {/* <div className="hidden mx-auto md:block text-slate-500">
            Showing 1 to 10 of 150 entries
          </div> */}
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
        {/* BEGIN: Users Layout */}
        {listusers?.map((user:any, key:number) => (
          <div key={key} className="col-span-12 intro-y md:col-span-6">
            <div className="box">
              <div className="flex flex-col items-center p-5 lg:flex-row">
                <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
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
                  <Button onClick={(event:any) => {
                  event.preventDefault();
                  setDeleteModalPreview(true);
                  setActionUserId(user._id)
                }} className="px-2 py-1 mr-2">
                    Block
                  </Button>
                  <Button 
                  onClick={(event:any) => {
                    event.preventDefault();
                    setOpenEditModel(true);
                    setActionUserId(user._id)
                    setFormEditValues({coverImage:user?.coverImage , profileImage:user?.profileImage , name:user?.name , phoneNumber:{
                      number: user?.phoneNumber
                    } , role:user?.role ?? '' , username:user?.username , password: ''})
                    setOriginalData({coverImage:user?.coverImage , profileImage:user?.profileImage , name:user?.name , phoneNumber:{
                      number: user?.phoneNumber
                    } , role:user?.role ?? '' , username:user?.username , password: ''})

                  }}
                  className="px-2 py-1">
                    Edit
                  </Button>
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
