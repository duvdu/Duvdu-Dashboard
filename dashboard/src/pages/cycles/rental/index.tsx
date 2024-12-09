import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import fakerData from "../../../utils/faker";
import Button from "../../../base-components/Button";
import Pagination from "../../../base-components/Pagination";
import { FormInput, FormSelect } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import { Dialog, Menu } from "../../../base-components/Headless";
import { useAppDispatch, useAppSelector } from "../../../redux/stores/hooks";
import { ActionGetStudio } from "../../../redux/action/api/cycles/rental/get";
import { StateAllStudios } from "../../../redux/stores/api/cycles/rental";
import { formatDate } from "../../../utils/helper";

function Main() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const deleteButtonRef = useRef(null);


  const stateAllStudios = useAppSelector(StateAllStudios)
  console.log({stateAllStudios})
  const state = stateAllStudios?.data
  const pagdnationState = state?.pagination
  const [rental, setRental] = useState<any>(null);

  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(null);
  
  
  const dispatch = useAppDispatch()
  
  const data = stateAllStudios?.data?.data
  const filterCategory = (id: string) => {
    setRental(data?.find((rental:any) => rental?._id === id)??[]);
  }

  useEffect(() => {
    if (search)
      action()
  }, [dispatch, search])

  useEffect(() => {
    action()
  }, [dispatch, limit, page])

  const handleSearch = () => action();

  const action = () => {
    dispatch(ActionGetStudio({ limit, page, search }))
  }
  const handleKeyDown = (e:any) => {
    if (e.key === 'Enter' && search) {
      handleSearch();
    }
  };
  
  const PaginationInfo = ({ pagination }:{pagination:any}) => {
    if (!pagination) return <div className="hidden mx-auto md:block text-slate-500" />

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
  console.log({data})
  return (
    <>
      <Dialog open={rental == null ? false : true} onClose={() => {
        setRental(null);
        }}
        >

        {rental &&
          <Dialog.Panel className="py-5 text-center bg-slate-500">
            <div className=" px-2 rounded-md">
              <div className="box mb-4 mx-4">
                <h2 className="category-title text-2xl font-bold mb-4">{rental?.title}</h2>
                <div className="h-40 overflow-y-hidden">
                  <img src={rental?.cover} alt={rental?.title} className="category-image h-full  mb-4 max-w-full w-full" />
                </div>
              </div>
                <h3 className="text-2xl font-bold">{rental.title}</h3>
              <div className="flex flex-col gap-2 category-subcategories box mb-4 pt-4 px-4 mx-4">

                <h3 className="text-start"><span className="font-semibold text-xl text-cyan-600">Price :</span>  {rental.projectScale.pricerPerUnit} $ / {rental.projectScale.unit}</h3>
                <h3 className="text-start"><span className="font-semibold text-xl text-cyan-600">Insurance :</span>  {rental.insurance}</h3>
                <h3 className="text-start"><span className="font-semibold text-xl text-cyan-600">Address :</span> {rental.address}</h3>
                <h3 className="text-start"><span className="font-semibold text-xl text-cyan-600">Email :</span> {rental.email}</h3>
                <h3 className="text-start"><span className="font-semibold text-xl text-cyan-600">Description :</span> {rental.description}</h3>
                <h3 className="text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img src={rental.user.profileImage} className="w-full h-full" alt="" />
                    </div>
                    <div className="text-white text-xl">{rental.user.name}</div>
                  </div>
                </h3>
                
              </div>
            </div>
          </Dialog.Panel>
        }
      </Dialog >


      <h2 className="mt-10 text-lg font-medium intro-y">Rentals</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="search?..."
                value={search??''}
                onChange={(e:any) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
          <Menu>
            <Menu.Button as={Button} className="px-2 !box mx-2" onClick={handleSearch}>
              <span className="flex items-center justify-center w-5 h-5">
                <Lucide icon="Search" className="w-4 h-4" />
              </span>
            </Menu.Button>
          </Menu>
          <PaginationInfo pagination={pagdnationState} />
        </div>
        {/* BEGIN: Users Layout */}
        {
          data && data.length>0 &&
          data?.map((item:any) => (
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
                      <span className="block text-base font-medium">
                        {item.title}
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 text-slate-600 dark:text-slate-500">
                    <div className="flex items-center">
                      <Lucide icon="Link" className="w-4 h-4 mr-2" /> Price: $
                      {item.projectScale?.pricerPerUnit} / {item.projectScale?.unit} 
                    </div>
                    <div className="flex items-center mt-2">
                      <Lucide icon="Layers" className="w-4 h-4 mr-2" />
                      insurance : {item.insurance}
                    </div>
                    <div className="flex items-center mt-2">
                      <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />{" "}
                      Sub Category : {item.subCategory?.title}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
                <div className="flex items-center mr-auto text-primary cursor-pointer" onClick={() => { filterCategory(item._id); }}>
                    <Lucide icon="Eye" className="w-4 h-4 mr-1" /> Preview
                  </div>

                  <a
                    className="flex items-center text-danger"
                    
                    onClick={(event) => {
                      event.preventDefault();
                        (true);
                    }}
                  >
                    delete
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
                <Lucide onClick={() => setPage(1)} icon="ChevronsLeft" className="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link>
                <Lucide onClick={() => setPage(pagdnationState?.currentPage > 1 ? pagdnationState?.currentPage - 1 : 1)} icon="ChevronLeft" className="w-4 h-4" />
              </Pagination.Link>
              {Array.from({ length: pagdnationState?.totalPages }, (_, index) => (
                <div onClick={() => setPage(index + 1)}>
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
                    setPage(pagdnationState?.currentPage < pagdnationState?.totalPages ? pagdnationState?.currentPage + 1 : pagdnationState?.totalPages)
                  }
                />
              </Pagination.Link>
              <Pagination.Link>
                <Lucide icon="ChevronsRight" className="w-4 h-4" onClick={() => setPage(pagdnationState?.totalPages)} />
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
            (false);
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
