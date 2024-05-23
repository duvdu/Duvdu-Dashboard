import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import { Dialog, Menu } from "../../base-components/Headless";
import Lucide from "../../base-components/Lucide";
import Pagination from "../../base-components/Pagination";
import { FormSelect, FormInput, FormSwitch } from "../../base-components/Form";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import { ActionGetCategory } from "../../redux/action/api/category/get";
import { StateCategory } from "../../redux/stores/api/category/category";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ActionDeleteCategory } from "../../redux/action/api/category/delete";
import { formatDate } from "../../utils/helper";
import { StateDeleteCategory } from "../../redux/stores/api/category/delete";
import { selectFormState, updateFormData } from "../../redux/stores/form";
import { ActionUpdateCategory } from "../../redux/action/api/category/update";
import { StateCreateCategory } from "../../redux/stores/api/category/create";
import LoadingIcon from "../../base-components/LoadingIcon";


function Main() {
  const [categoryIdToDelete, setcategoryIdToDelete] = useState(null);
  const [category, setCategory] = useState();
  const [categories, setCategories] = useState([]);

  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState("1");
  const [search, setSearch] = useState("");

  const [idToEdit, setidEdit] = useState("");

  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);
  const stateAllCategories = useAppSelector(StateCategory)
  const state = stateAllCategories?.data
  const pagdnationState = state?.pagination
  const stateDeleteCategory = useAppSelector(StateDeleteCategory)
  const createCategory = useAppSelector(StateCreateCategory)

  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const formState = useAppSelector(selectFormState);

  useEffect(() => {
    if (stateAllCategories?.data?.data?.length) {
      setCategories(stateAllCategories.data.data)
    }
  }, [stateAllCategories?.data?.data?.length])

  const filterCategory = (id: string) => {
    setCategory(categories.find(category => category._id === id));
  }
  console.log(limit)
  useEffect(() => {
    dispatch(ActionGetCategory({ limit, page, search }))
  }, [dispatch, stateDeleteCategory, createCategory, limit, page, search])

  const pagdnation = (page: number) => {
    dispatch(ActionGetCategory({ limit, page, search }))
  };

  const onChangeStutus = (newState: boolean, id) => {
    setidEdit(id)
    const formDate = new FormData();
    formDate.append('status', newState)
    dispatch(ActionUpdateCategory({ formdata: formDate, id: id }))
  };

  const PaginationInfo = ({ pagination }) => {
    if(!pagination) return <></>

    const { currentPage, resultCount, totalPages } = pagination;

    // Calculate the start and end entry numbers
    const entriesPerPage = Math.ceil(resultCount / totalPages);
    const startEntry = (currentPage - 1) * entriesPerPage + 1;
    const endEntry = Math.min(currentPage * entriesPerPage, resultCount);

    return (
      <div className="hidden mx-auto md:block text-slate-500">
        Showing {startEntry} to {endEntry} of {resultCount} entries
      </div>
    );
  };
  return (
    <>
      <Dialog open={category == null ? false : true} onClose={() => {
        setCategory(null);
      }}
      >

        {category &&
          <Dialog.Panel className="py-10 text-center bg-slate-500">
            <div className="px-2 rounded-md">
              <div className="box mb-4 mx-4">
                <h2 className="category-title text-2xl font-bold mb-4">{category.title.en}</h2>
                <div className="h-40 overflow-y-hidden">
                  <img src={category.image} alt={category.title.en} className="category-image mb-4 max-w-full w-full" />
                </div>
              </div>
              <div className="category-subcategories box mb-4 p-4 mx-4">
                <h3 className="text-xl font-semibold">Subcategories:</h3>
                <div className="flex flex-wrap w-full gap-3">
                  {category?.subCategories.map(subCategory => (
                    <div key={subCategory._id} className="subcategory-item p-2 text-start w-full">
                      <h4 className="text-lg font-medium">{subCategory.title.en}</h4>
                      <ul className="flex flex-wrap gap-2 py-2">
                        {subCategory?.tags?.map((tag, index) => (
                          <li key={index} className="py-1 px-2 border border-[#00000080] dark:border-[#FFFFFF4D] rounded-full">{tag.en}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="category-job-titles text-start box mb-4 p-4 mx-4">
                <h3 className="text-xl font-semibold">Job Titles:</h3>
                <ul className="job-titles-list">
                  {category?.jobTitles.map((jobTitle, index) => (
                    <li key={index} className="job-title-item">{jobTitle.en}</li>
                  ))}
                </ul>
              </div>
              <div className="box mb-4 p-4 mx-4">
                <div className="text-sm text-gray-600">
                  <p>Created at: {formatDate(category.createdAt, 'DD/MM/YYYY')}</p>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        }
      </Dialog >

      <h2 className="mt-10 text-lg font-medium intro-y">All categories</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Link to={"/category-form"}>
            <Button variant="primary" className="mr-2 shadow-md">
              Add New Category
            </Button>
          </Link>

          <div className="hidden mx-auto md:block text-slate-500">
            <PaginationInfo pagination={pagdnationState} />
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
        {/* BEGIN: Users Layout */}
        {
          categories &&
          categories.map((item, key) => (
            <div
              key={item._id}
              className="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
            >
              <div className="box">
                <div className="p-5">
                  <div className="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                    <img
                      alt="Midone - HTML Admin Template"
                      className="rounded-md"
                      src={item.image}
                    />
                    <div className="absolute bottom-0 z-10 px-5 pb-6 text-white">
                      <Link to="" className="block text-base font-medium">
                        {item.studioName}
                      </Link>
                      <span className="mt-3 text-xs text-white/90">
                        {/* {item.user.name} */}
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 text-slate-600 dark:text-slate-500">
                    <div className="flex items-center">
                      <Lucide icon="Link" className="w-4 h-4 mr-2" />
                      title : {item.title.en}
                    </div>
                    <div className="flex items-center mt-2">
                      <Lucide icon="Layers" className="w-4 h-4 mr-2" />
                      type : {item.cycle}
                    </div>
                    <div className="flex items-center mt-2">
                      <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />{" "}
                      status : {item.status ? 'Active' : 'inactive'}

                      {
                        createCategory.loading && idToEdit == item._id ?
                          <LoadingIcon icon="puff" className="w-10 h-10 ml-auto" /> :
                          <FormSwitch className="mt-2 ml-auto" >
                            <FormSwitch.Input checked={item.status} type="checkbox" onChange={(c) => onChangeStutus(!item.status, item._id)} />
                          </FormSwitch>
                      }
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
                  <div className="flex items-center mr-auto text-primary cursor-pointer" onClick={() => { filterCategory(item._id); }}>
                    <Lucide icon="Eye" className="w-4 h-4 mr-1" /> Preview
                  </div>
                  <div className="flex items-center mr-3 cursor-pointer" onClick={() => { navigate(`edit/${item._id}`) }}>
                    <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" /> Edit
                  </div>
                  <Link
                    className="flex items-center text-danger"
                    to="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setDeleteConfirmationModal(true);
                      setcategoryIdToDelete(item._id)
                    }}
                  >
                    <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                  </Link>
                </div>
              </div>
            </div>
          ))}
        {/* END: Users Layout */}
        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          {state ?
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
            </Pagination> : <div className="w-full sm:w-auto sm:mr-auto"/>
          }
          <FormSelect className="w-20 mt-3 !box sm:mt-0" onChange={(e) => setLimit(e.target.value)} >
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>5</option>
          </FormSelect>
        </div>
        {/* END: Pagination */}
      </div>
      {/* BEGIN: Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmationModal}
        onClose={() => {
          setDeleteConfirmationModal(false);
        }}
        initialFocus={deleteButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              className="w-24"
              ref={deleteButtonRef}
              onClick={() => {
                dispatch(ActionDeleteCategory({ id: categoryIdToDelete }))
                setDeleteConfirmationModal(false);
              }}
            >
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* END: Delete Confirmation Modal */}
    </>
  );
}

export default Main;
