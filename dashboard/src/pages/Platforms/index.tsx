import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import Button from '../../base-components/Button';
import { useAppDispatch, useAppSelector } from '../../redux/stores/hooks';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FormInline, FormInput, FormLabel, FormSelect, FormSwitch, InputGroup } from '../../base-components/Form';
import { StateCreatePlatform } from '../../redux/stores/api/platform/create';
import { StateUpdatePlatform } from '../../redux/stores/api/platform/update';
import { StateGetPlatformById } from '../../redux/stores/api/platform/getById';
import { StateDeletePlatform } from '../../redux/stores/api/platform/delete';
import { ActionCreatePlatform } from '../../redux/action/api/platforms/create';
import { ActionUpdatePlatform } from '../../redux/action/api/platforms/update';
import { ActionGetPlatforms } from '../../redux/action/api/platforms/getAll';
import { ActionDeletePlatform } from '../../redux/action/api/platforms/delete';
import { StateGetAllPlatforms } from '../../redux/stores/api/platform/getAll';
import LoadingIcon from '../../base-components/LoadingIcon';
import Tippy from '../../base-components/Tippy';

const Main: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Global states
  const stateUpdatePlatform = useAppSelector(StateUpdatePlatform);
  const stateCreatePlatform = useAppSelector(StateCreatePlatform);
  const stateGetPlatformById = useAppSelector(StateGetPlatformById);
  const stateDeletePlatform = useAppSelector(StateDeletePlatform);
  const stateGetAllPlatforms = useAppSelector(StateGetAllPlatforms);
  // Local states
  const details = stateGetPlatformById?.data?.data || [];
  const [formValues, setFormValues] = useState({
    titleEnglish:'',
    titleArabic:'',
  });
  const [errors, setErrors] = useState<string|null>(null);
  const [actionRankId, setActionRankId] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [status, setStatus] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [deleteModalPreview, setDeleteModalPreview] = useState(false);
  const [openAddModel, setOpenAddModel] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);
  const sendButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);
  // Load platforms details
  useEffect(() => {
    if(stateDeletePlatform?.data|| stateCreatePlatform?.data|| stateUpdatePlatform?.data)
    dispatch(ActionGetPlatforms())
      .then(response => {
        if (response.payload) {
          setPlatforms(response.payload.data);
        }
      });
      setOpenAddModel(false)
      setOpenEditModel(false)
  }, [stateDeletePlatform?.data, stateCreatePlatform?.data, stateUpdatePlatform?.data]);

  useEffect(() => {
    dispatch(ActionGetPlatforms())
    .then(response => {
      if (response.payload) {
        setPlatforms(response.payload.data);
      }
    });

  }, []);


  useEffect(() => {
    if(openAddModel == false){
      setFormValues({titleArabic: '', titleEnglish: '' });
      // setErrors({});
    }
  }, [openAddModel]);
  // Form handlers
  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    let newErrors = null;
    if (!formValues.titleEnglish) setErrors('Title English is required');
    if (!formValues.titleArabic) setErrors('Title Arabic is required');
    
    return newErrors === null;
  };

  const createRank = () => {
    if (validateForm()) {      
      const formDate = new FormData();
      formDate.append('name.en' , formValues.titleEnglish)
      formDate.append('name.ar' , formValues.titleArabic)
      if (uploadedFile)
        formDate.append('image', uploadedFile)
      dispatch(ActionCreatePlatform({formdata:formDate}));
    }
  };
  const onUpdate = () => {

    const formDate = new FormData();
    if (uploadedFile)
      formDate.append('image', uploadedFile)
      formDate.append('name.en' , formValues.titleEnglish)
      formDate.append('name.ar' , formValues.titleArabic)

    dispatch(ActionUpdatePlatform({ formdata: formDate, id: actionRankId }))

  };

  const deleteRank = () => {
    if (actionRankId)
      dispatch(ActionDeletePlatform(actionRankId));
  };

  const onSubmit = () => {
    createRank();
  };

  const onDelete = () => {
    setDeleteModalPreview(false);
    deleteRank();
    clear();
  };

  const clear = () => {
    setFormValues({ titleEnglish: '', titleArabic: ''});
  };
  
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader:any = new FileReader();
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
  const editorConfig = {
    toolbar: {
      items: ["bold", "italic", "link"],
    },
  };

  return (
    <>
     {/* Add Rank */}
      <Dialog open={openAddModel} onClose={() => setOpenAddModel(false)} initialFocus={sendButtonRef}>
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Add New platforms</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-6 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">

              <FormInline className="flex-col items-start mt-10 xl:flex-row">
                <div className="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                  <div className="gap-5 pl-4 pr-5">
                    {previewSrc && (
                      <div className="relative cursor-pointer h-36 image-fit zoom-in aspect-square m-auto">

                        <img className="rounded-md" alt="Uploaded" src={previewSrc} />
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
                      // onClick={(e) => {
                      //   e.target.value = '';
                      // }}
                    />
                  </div>
                </div>
              </FormInline>
            </div>

            <div className="col-span-12 sm:col-span-6">
                <InputGroup className="sm:w-full col-span-3 h-min">
                  <InputGroup.Text id={`input-group-en`}>EN</InputGroup.Text>
                  <FormInput
                    type="text"
                    placeholder="title"
                    aria-describedby={`input-group-en=`}
                    // value={formState?.title[index]?.en}
                    name='titleEnglish'
                    value={formValues.titleEnglish}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <InputGroup className="sm:w-full col-span-3 h-min">
                  <InputGroup.Text id={`input-group-ar=`}>AR</InputGroup.Text>
                  <FormInput
                    type="text"
                    name='titleArabic'
                    placeholder="الاسم"
                    aria-describedby={`input-group-ar=`}
                    // value={formState?.title[index]?.ar}
                    value={formValues.titleArabic}
                    onChange={handleInputChange}
                    />
                </InputGroup>
              </div>
          </Dialog.Description>
            {errors && <p className="text-danger text-center">{errors}</p>}
          <Dialog.Footer>
            <Button type="button" variant="outline-secondary" onClick={() => setOpenAddModel(false)} className="w-20 mr-1">
              Cancel
            </Button>
            <Button onClick={onSubmit} variant="primary" type="button" className="w-20" ref={sendButtonRef}>
            {stateCreatePlatform?.loading ? (
                  <LoadingIcon icon="puff" className="w-4 h-4 mr-1" />
                ) : (
                  <>
              Add
              </>
              )}
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    
      {/* Edit Rank  */}
      <Dialog open={openEditModel} onClose={() => setOpenEditModel(false)} initialFocus={sendButtonRef}>
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Edit platforms</h2>
          </Dialog.Title>
          <Dialog.Description className="grid grid-cols-6 gap-4 gap-y-3">
            <div className="col-span-12 sm:col-span-6">

              <FormInline className="flex-col items-start mt-10 xl:flex-row">
                <div className="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                  <div className="gap-5 pl-4 pr-5">
                    {previewSrc && (
                      <div className="relative cursor-pointer h-36 image-fit zoom-in aspect-square m-auto">

                        <img className="rounded-md" alt="Uploaded" src={previewSrc} />
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
                      // onClick={(e) => {
                      //   e.target.value = '';
                      // }}
                    />
                  </div>
                </div>
              </FormInline>
            </div>

            <div className="col-span-12 sm:col-span-6">
                <InputGroup className="sm:w-full col-span-3 h-min">
                  <InputGroup.Text id={`input-group-en`}>EN</InputGroup.Text>
                  <FormInput
                    type="text"
                    placeholder="title"
                    aria-describedby={`input-group-en=`}
                    // value={formState?.title[index]?.en}
                    name='titleEnglish'
                    defaultValue={formValues.titleEnglish}
                    onChange={handleInputChange}
                  />
                </InputGroup>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <InputGroup className="sm:w-full col-span-3 h-min">
                  <InputGroup.Text id={`input-group-ar=`}>AR</InputGroup.Text>
                  <FormInput
                    type="text"
                    name='titleArabic'
                    placeholder="الاسم"
                    aria-describedby={`input-group-ar=`}
                    // value={formState?.title[index]?.ar}
                    defaultValue={formValues.titleArabic}
                    onChange={handleInputChange}
                    />
                </InputGroup>
              </div>
          </Dialog.Description>

            {errors && <p className="text-danger text-center">{errors}</p>}
          <Dialog.Footer>
            <Button type="button" variant="outline-secondary" onClick={() => setOpenEditModel(false)} className="w-20 mr-1">
              Cancel
            </Button>
            <Button onClick={onUpdate} variant="primary" type="button" className="w-20" ref={sendButtonRef}>
            {stateUpdatePlatform?.loading ? (
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

      <Dialog open={deleteModalPreview} onClose={() => setDeleteModalPreview(false)} initialFocus={deleteButtonRef}>
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide icon="XCircle" className="w-16 h-16 mx-auto mt-3 text-danger" />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button type="button" variant="outline-secondary" onClick={() => setDeleteModalPreview(false)} className="w-24 mr-1">
              Cancel
            </Button>
            <Button type="button" variant="danger" className="w-24" ref={deleteButtonRef} onClick={onDelete}>
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Platforms</h2>
      </div>
      <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
        <Button onClick={() => {
          setOpenAddModel(true)
          clear();
          }} variant="primary" className="mr-2 mb-2 shadow-md">
          Add New Platforms
        </Button>
        <div className="hidden mx-auto md:block text-slate-500 md:hidden">
          Showing 1 to 10 of 150 entries
        </div>
        <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0 hidden">
          <div className="relative w-56 text-slate-500">
            <FormInput type="text" className="w-56 pr-10 !box" placeholder="Search..." />
            <Lucide icon="Search" className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3">
        {platforms.map((rank:any, index:number) => (
          <div key={index} style={{
            borderColor:'white',
            border:`solid 1px white`
          }} className="flex flex-col m-1 gap-5 intro-y box px-3 py-5">
            <img className='h-52 w-full' src={rank.image} alt=''/>
            <div className="flex justify-between items-center">
              <div
              className="mt-2 font-black ">
                {rank.name.en}
              </div>
              <div
              className="mt-2 font-black ">
                {rank.name.ar}
              </div>
            </div>
            <div className='flex justify-between items-center'>
              <div
                className="flex items-center text-cyan-600 cursor-pointer"
                onClick={(event) => {
                  event.preventDefault();
                  setOpenEditModel(true);
                  setActionRankId(rank._id)
                  setFormValues({titleArabic:rank.name.ar , titleEnglish:rank.name.en})
                  setPreviewSrc(rank.image)
                }}
              >
                    <Lucide icon="Edit" className="w-4 h-4 mr-1" />Edit
              </div>
              <div
                className="flex items-center text-danger cursor-pointer"
                onClick={(event) => {
                  event.preventDefault();
                  setDeleteModalPreview(true);
                  setActionRankId(rank._id)
                }}
              >
                {actionRankId === rank._id && stateDeletePlatform?.loading ? (
                  <LoadingIcon icon="puff" className="w-4 h-4 mr-1" />
                ) : (
                  <>
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Main;
