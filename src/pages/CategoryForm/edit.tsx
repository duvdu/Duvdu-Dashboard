import { ClassicEditor } from "../../base-components/Ckeditor";
import TomSelect from "../../base-components/TomSelect";
import { useEffect, useRef, useState } from "react";
import Button from "../../base-components/Button";
import {
  FormInline,
  FormInput,
  FormLabel,
  FormSelect,
  FormSwitch,
  InputGroup,
} from "../../base-components/Form";
import Tippy from "../../base-components/Tippy";
import Lucide from "../../base-components/Lucide";
import _ from "lodash";
import { useAppSelector, useAppDispatch } from "../../redux/stores/hooks";
import { selectFormState, updateFormData, insertToArray, removeItemFromField, resetForm, createFormData } from "../../redux/stores/form";
import { Popover } from "../../base-components/Headless";
import { ActionCreateCategory } from "../../redux/action/api/category/create";
import Toastify from "toastify-js";
import Notification from "../../base-components/Notification";
import { StateCreateCategory } from "../../redux/stores/api/category/create";
import { ActionUpdateCategory } from "../../redux/action/api/category/update";
import { useParams } from "react-router-dom";
import { ActionGetCategoryById } from "../../redux/action/api/category/getById";
import { StateCategory } from "../../redux/stores/api/category/category";
import { ActionGetCategory } from "../../redux/action/api/category/get";

function Main() {
  const [editorData, setEditorData] = useState("<p>Content of the editor.</p>");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState();
  const [englishTag, setEnglishTag] = useState('');
  const [arabicTag, setArabicTag] = useState('');
  const [type, setType] = useState('');
  const formState = useAppSelector(selectFormState);
  const stateCreateCategory = useAppSelector(StateCreateCategory);
  const list = useAppSelector(StateCategory)?.data?.data || [];
  const dispatch = useAppDispatch()
  const { id } = useParams();
  // const formGet = list[0] || []

  useEffect(() => {
    const categorey = list.find(item => item._id === id);
    if (categorey){
      dispatch(createFormData({value: categorey}))
    }
  },[list]) // @mos3ad


  const filterById = () => {
    if ((list?.length || 0) == 0)
      dispatch(ActionGetCategory())
  }
  useEffect(() => {
    filterById()
  }, [])


  function objectToFormData(data: any, formData: FormData, parentKey?: string) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        const prefixedKey = parentKey ? `${parentKey}[${key}]` : key;
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((element, index) => {
              objectToFormData(element, formData, `${prefixedKey}[${index}]`);
            });
          } else {
            objectToFormData(value, formData, prefixedKey);
          }
        } else {
          formData.append(prefixedKey, value);
        }
      }
    }
  }


  const onSubmit = () => {
    const formDate = new FormData();
    if (uploadedFile)
      formDate.append('cover', uploadedFile)
    objectToFormData(formState, formDate)
    dispatch(ActionUpdateCategory({ formdata: formDate, id: id }))
  };

  useEffect(() => {
    if (stateCreateCategory.data)
      showSuccess()
  }, [stateCreateCategory.data])
  useEffect(() => {
    if (Object.keys(formState).length > 0) {
      dispatch(resetForm())
    }
  }, [])

  const showSuccess = () => {
    const failedEl = document
      .querySelector("#success-notification-content")!
      .cloneNode(true) as HTMLElement;
    failedEl.classList.remove("hidden");

    Toastify({
      node: failedEl,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
    }).showToast();
    dispatch(resetForm())
    setPreviewSrc(null);
    setUploadedFile(null)
  }
  const handleEnglishChange = (event) => {
    setEnglishTag(event.target.value);
  };

  const handleArabicChange = (event) => {
    setArabicTag(event.target.value);
  };
  const putInBasket = (field: string, value: any) => dispatch(updateFormData({ field: field, value: value }))
  const addToBasket = (field: string, value: any) => dispatch(insertToArray({ field: field, value: value }))
  const removefromBasket = (field: string, index: number) => dispatch(removeItemFromField({ field: field, index: index }))


  // const [categories, setCategories] = useState([]);


  const handleSubCategoryChange = (index: number, field: 'title' | 'tags', lang: 'ar' | 'en', value: string, tagIndex?: number) => {
    let updatedSubCategories = JSON.parse(JSON.stringify(formState.subCategories))
    if (field === 'title') {
      updatedSubCategories[index].title[lang] = value;
    } else if (field === 'tags' && tagIndex !== undefined) {
      updatedSubCategories[index].tags[tagIndex] = { 'en': JSON.parse(value).en, 'ar': JSON.parse(value).ar };
    }
    putInBasket('subCategories', updatedSubCategories);
  };

  const handleRemoveTag = (subCategoriesIndex: number, tagIndex: number) => {
    let updatedSubCategories = JSON.parse(JSON.stringify(formState.subCategories));
    if (updatedSubCategories[subCategoriesIndex].tags) {
      updatedSubCategories[subCategoriesIndex].tags.splice(tagIndex, 1);
      putInBasket('subCategories', updatedSubCategories);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | String, index: number, field: 'title' | 'tags', lang: 'ar' | 'en', tagIndex?: number) => {
    const value = typeof e === 'string' ? e : e.target.value;
    handleSubCategoryChange(index, field, lang, value, tagIndex);
  };



  const handleAddJopDetails = () => {
    if (!formState?.jobTitles)
      putInBasket('jobTitles', [{ en: '', ar: '' }])
    else {
      const jop = [...formState?.jobTitles, { en: '', ar: '' }]
      putInBasket('jobTitles', jop)
    }
  };
  const handleChangeJopDetails = (index: number, value: string, lang: 'en' | 'ar') => {
    let jop = JSON.parse(JSON.stringify(formState?.jobTitles));
    jop[index][lang] = value;
    putInBasket('jobTitles', jop)

  };
  const handleRemoveJopDetails = (index: number) => {
    // Check if there are job titles to remove and the index is within range
    if (formState?.jobTitles && index >= 0 && index < formState.jobTitles.length) {
      // Create a new array excluding the element at the specified index
      const newJopDetails = formState.jobTitles.filter((_, i) => i !== index);
      // Update the state with the new array of job titles
      putInBasket('jobTitles', newJopDetails);
    }
  };

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
  const editorConfig = {
    toolbar: {
      items: ["bold", "italic", "link"],
    },
  };

  useEffect(() => {
    const value = {
      "Choose Type": null,
      "studio booking": "studio-booking",
      "portfolio post": "portfolio-post",
      "copy rights": "copy-rights",
      "producer": "producer"
    }[type];

    putInBasket('cycle', value);
  }, [type]);


  return (
    <>
      <Notification
        id="success-notification-content"
        className="flex hidden"
      >
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Addation success!</div>
          <div className="mt-1 text-slate-500 capitalize">
            you can check categories to ensure
          </div>
        </div>
      </Notification>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Form Layout</h2>
      </div>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12 intro-y lg:col-span-6">
          <div className="p-5 intro-y box mt-4">
            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <FormInline className="flex-col items-start mt-10 xl:flex-row">
                <div className="flex-1 w-full pt-4 mt-3 border-2 border-dashed rounded-md xl:mt-0 dark:border-darkmode-400">
                  <div className="gap-5 pl-4 pr-5">
                    {(previewSrc || formState.image) && (
                      <div className="relative cursor-pointer h-36 image-fit zoom-in aspect-square m-auto">
                        <img className="rounded-md" alt="Uploaded" src={previewSrc ? previewSrc : formState.image} />
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
            </div>
          </div>
          <div className="p-5 intro-y box mt-4">
            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="mt-3">
                <FormLabel >
                  Category Name
                </FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  <InputGroup className="sm:w-full">
                    <InputGroup.Text id="input-group-3">EN</InputGroup.Text>
                    <FormInput
                      type="text"
                      placeholder="category"
                      aria-describedby="input-group-3"
                      value={formState?.title?.en}
                      onChange={(e) => putInBasket('title', { 'en': e.target.value, 'ar': formState?.title?.ar })}
                    />
                  </InputGroup>
                  <InputGroup className="mt-2 sm:mt-0 sm:w-full">
                    <InputGroup.Text id="input-group-4">AR</InputGroup.Text>
                    <FormInput
                      type="text"
                      placeholder="الفئه"
                      aria-describedby="input-group-4"
                      value={formState?.title?.ar}
                      onChange={(e) => putInBasket('title', { 'ar': e.target.value, 'en': formState?.title?.en })}
                    />
                  </InputGroup>

                </div>
              </div>

              <div className="mt-4">
                <FormLabel className="flex items-center">
                  SubCategory
                  <Tippy content="add subcategory field" className="flex flex-col items-center justify-center" onClick={() => addToBasket('subCategories', { title: { en: '', ar: '' }, tags: [] })}>
                    <div className="min-w-[40px] flex justify-center">
                      <Lucide icon="PlusCircle" className="block mx-auto mt-2 sm:mt-0 cursor-pointer" />
                    </div>
                  </Tippy>
                </FormLabel>

                {formState?.subCategories?.map((subCategory, index) => (
                  <div key={index} className="mb-5">
                    <div className="grid grid-cols-12 gap-2 mt-2">
                      <InputGroup className="sm:w-full col-span-3 h-min">
                        <InputGroup.Text id={`input-group-en-${index}`}>EN</InputGroup.Text>
                        <FormInput
                          type="text"
                          placeholder="subcategory"
                          aria-describedby={`input-group-en-${index}`}
                          // value={formState?.subCategory[index]?.en}
                          value={formState.subCategories[index].title.en}
                          onChange={(e) => handleChange(e, index, 'title', 'en')}
                        />
                      </InputGroup>
                      <InputGroup className="sm:w-full col-span-3 h-min">
                        <InputGroup.Text id={`input-group-ar-${index}`}>AR</InputGroup.Text>
                        <FormInput
                          type="text"
                          placeholder="الفئه"
                          aria-describedby={`input-group-ar-${index}`}
                          // value={formState?.subCategory[index]?.ar}
                          value={formState.subCategories[index].title.ar}
                          onChange={(e) => handleChange(e, index, 'title', 'ar')}
                        />
                      </InputGroup>
                      <InputGroup className="sm:w-full col-span-6 mb-4">
                        <div className="text-center">
                          <Popover className="inline-block">
                            {({ close }) => (
                              <>
                                <Popover.Button as={Button} variant="primary" className={"whitespace-nowrap"}>
                                  Add Tag
                                  <Lucide icon="ChevronDown" className="w-4 h-4 ml-2" />
                                </Popover.Button>
                                <Popover.Panel placement="bottom-start">
                                  <div className="p-2">
                                    <div>
                                      <div className="text-xs text-left">English</div>
                                      <FormInput
                                        onChange={handleEnglishChange}
                                        type="text"
                                        className="flex-1 mt-2"
                                        placeholder="tag ..."
                                      />
                                    </div>
                                    <div className="mt-3">
                                      <div className="text-xs text-left">Arabic</div>
                                      <FormInput
                                        onChange={handleArabicChange}
                                        type="text"
                                        className="flex-1 mt-2"
                                        placeholder="tag ..."
                                      />
                                    </div>
                                    <div className="flex items-center mt-3">
                                      <Button variant="secondary" onClick={() => { close(); }}
                                        className="w-32 ml-auto"
                                      >
                                        Close
                                      </Button>
                                      <Button variant="primary" className="w-32 ml-2"
                                        onClick={() => {
                                          if (englishTag.length > 0 && arabicTag.length > 0)
                                            handleChange(JSON.stringify({ en: englishTag, ar: arabicTag }), index, 'tags', 'en', formState?.subCategories[index].tags?.length || 0)
                                        }}
                                      >
                                        Add
                                      </Button>
                                    </div>
                                  </div>
                                </Popover.Panel>
                              </>
                            )}
                          </Popover>
                        </div>
                        <div className="flex flex-wrap gap-2 px-3">
                          {
                            formState?.subCategories[index].tags?.map((tag, tagIndex) => (
                              <div key={tagIndex} className="flex flex-col relative px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                <div className="mr-5">
                                  EN: {tag.en}
                                </div>
                                <div className="mr-5">
                                  AR: {tag.ar}
                                </div>
                                <Tippy
                                  onClick={() => handleRemoveTag(index, tagIndex)}
                                  content="Remove this tag"
                                  className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                                >
                                  <Lucide icon="X" className="w-4 h-4" />
                                </Tippy>

                              </div>
                            ))
                          }
                        </div>
                      </InputGroup>
                    </div>
                    {
                      index > 0 &&
                      <Tippy content="Remove Last subcategory field" className="absolute right-5 flex flex-col items-end justify-center text-danger -translate-y-10" onClick={() => removefromBasket('subCategories', index)}>
                        <div className="min-w-[40px] flex justify-center">
                          <Lucide icon="XCircle" className="block mx-auto mt-2 sm:mt-0 cursor-pointer" />
                        </div>
                      </Tippy>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5 intro-y box mt-4">
            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="mt-3">
                <div className="mt-4">
                  <FormLabel className="flex items-center">
                    Job Titles
                    <Tippy content="add Jop details field" className="flex flex-col justify-center" onClick={handleAddJopDetails}>
                      <div className="min-w-[40px] flex justify-center">
                        <Lucide icon="PlusCircle" className="block mx-auto mt-2 sm:mt-0 cursor-pointer" />
                      </div>
                    </Tippy>
                  </FormLabel>
                  {formState?.jobTitles?.map((jop, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 mt-3">
                      <InputGroup className="sm:w-full ">
                        <InputGroup.Text id={`input-group-en-${index}`}>EN</InputGroup.Text>
                        <FormInput
                          type="text"
                          aria-describedby={`input-group-en-${index}`}
                          value={formState.jobTitles[index].en}
                          onChange={(e) => handleChangeJopDetails(index, e.target.value, 'en')}
                        />
                      </InputGroup>
                      <InputGroup className="sm:w-full">
                        <InputGroup.Text id={`input-group-ar-${index}`}>AR</InputGroup.Text>
                        <FormInput
                          type="text"
                          aria-describedby={`input-group-ar-${index}`}
                          value={formState.jobTitles[index].ar}
                          onChange={(e) => handleChangeJopDetails(index, e.target.value, 'ar')}
                        />
                      </InputGroup>
                      {
                        index > 0 &&
                        <Tippy content="Remove Last subcategory field" className="absolute right-0 flex flex-col items-end justify-center text-danger" onClick={(e) => handleRemoveJopDetails(index)}>
                          <div className="min-w-[40px] flex justify-center">
                            <Lucide icon="XCircle" className="block mx-auto mt-2 sm:mt-0 cursor-pointer" />
                          </div>
                        </Tippy>
                      }
                    </div>

                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 intro-y box mt-4">
            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
              <div className="mt-3">
                <FormLabel htmlFor="crud-form-3">Cycle</FormLabel>
                <FormSelect defaultValue={formState.cycle?.replace('-', ' ')} className="sm:mt-2 sm:mr-2" aria-label=".form-select-lg example" onChange={(e) => setType(e.target.value)}>
                  {[
                    "Choose Type",
                    "studio booking",
                    "portfolio post",
                    "copy rights",
                    "producer"
                  ].map((item, index) =>
                    <option key={index}>{item}</option>
                  )}
                </FormSelect>
              </div>

              <div className="mt-3">
                <label>Active Status</label>
                <FormSwitch className="mt-2" >
                  <FormSwitch.Input checked={formState.status} type="checkbox" onChange={(c) => putInBasket('status', !formState.status)} />
                </FormSwitch>
              </div>


              <div className="mt-3 hidden">
                <label>Description</label>
                <div className="mt-2">
                  <ClassicEditor
                    value={editorData}
                    onChange={setEditorData}
                    config={editorConfig}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 text-right">
            <Button
              type="button"
              variant="outline-secondary"
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button onClick={onSubmit} type="button" variant="primary" className="w-24" >
              Update
            </Button>
          </div>
          {/* END: Form Layout */}
        </div>
      </div>
    </>
  );
}

export default Main;
