import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import fakerData from "../../../utils/faker";
import Button from "../../../base-components/Button";
import Pagination from "../../../base-components/Pagination";
import { FormInput, FormSelect } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import { Dialog, Menu } from "../../../base-components/Headless";
import { useAppDispatch, useAppSelector } from "../../../redux/stores/hooks";
import { ActionGetStudio } from "../../../redux/action/api/cycles/studio/get";
import { StateAllStudios } from "../../../redux/stores/api/cycles/studioBooking";

function Main() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);


  const stateAllStudios = useAppSelector(StateAllStudios)
  const state = stateAllStudios?.data
  const pagdnationState = state?.pagination

  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState("1");
  const [search, setSearch] = useState("");


  const dispatch = useAppDispatch()

  const data = stateAllStudios?.data?.data

  useEffect(() => {
    dispatch(ActionGetStudio({ limit, page, search }))
  }, [dispatch, limit, page, search])

  const pagdnation = (page: number) => {
    dispatch(ActionGetStudio({ limit, page, search }))
  };
  const PaginationInfo = ({ pagination }) => {
    if (!pagination) return <></>
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
      <h2 className="mt-10 text-lg font-medium intro-y">Studios</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <PaginationInfo pagination={pagdnationState} />
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
          data &&
          data.map((item, key) => (
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
                      src={item.cover}
                    />
                    <div className="absolute bottom-0 z-10 px-5 pb-6 text-white">
                      <a href="" className="block text-base font-medium">
                        {item.studioName}
                      </a>
                      <span className="mt-3 text-xs text-white/90">
                        {item.user.name}
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 text-slate-600 dark:text-slate-500">
                    <div className="flex items-center">
                      <Lucide icon="Link" className="w-4 h-4 mr-2" /> Price: $
                      {item.pricePerHour} / hour
                    </div>
                    <div className="flex items-center mt-2">
                      <Lucide icon="Layers" className="w-4 h-4 mr-2" />
                      insurance : {item.insurance}
                    </div>
                    <div className="flex items-center mt-2">
                      <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />{" "}
                      subCategory : {item.subCategory}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">

                  <a
                    className="flex items-center text-danger"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setDeleteConfirmationModal(true);
                    }}
                  >

                  </a>
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
            </Pagination> : <div className="w-full sm:w-auto sm:mr-auto" />
          }
          <FormSelect className="w-20 mt-3 !box sm:mt-0" onChange={(e) => setLimit(e.target.value)} >
            <option>10</option>
            <option>25</option>
            <option>35</option>
            <option>50</option>
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
