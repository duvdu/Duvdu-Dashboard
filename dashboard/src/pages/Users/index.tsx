import _ from "lodash";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu } from "../../base-components/Headless";
import { useAppSelector, useAppDispatch } from "../../redux/stores/hooks";
import { StateUsers } from "../../redux/stores/api/users";
import { useEffect, useState } from "react";
import { ActionGetUsers } from "../../redux/action/api/users/get";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";

function Main() {
  const [searchKey, setSearchKey] = useState('');
  const navigate = useNavigate();
  const limit = 10;
  const selector = useAppSelector(StateUsers);
  const state = selector?.data
  const pagdnationState = state?.pagination
  const listusers = state?.data;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!selector.loading)
      dispatch(ActionGetUsers({ search: searchKey }))
  }, [searchKey])

  const pagdnation = (page: number) => {
    dispatch(ActionGetUsers({ search: searchKey, limit: limit, page: page }))
  };

  return (
    <>
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
                  <Button  className="px-2 py-1 mr-2" onClick={() => { navigate(`/allchats/${user._id}`) }}>
                    Message
                  </Button>
                  <Button  className="px-2 py-1">
                    Profile
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
