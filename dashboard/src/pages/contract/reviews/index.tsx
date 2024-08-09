import React, { useEffect } from 'react'
import _ from "lodash";
import clsx from "clsx";
import { useState, useRef } from "react";
import fakerData from "../../../utils/faker";
import Button from "../../../base-components/Button";
import Pagination from "../../../base-components/Pagination";
import { FormCheck, FormInput, FormSelect } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";
import { Dialog, Menu } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import { useAppDispatch, useAppSelector } from '../../../redux/stores/hooks'
import { StateReviews } from '../../../redux/stores/api/reviews/reviews'
import { ActionGetReviews } from '../../../redux/action/api/reviews/getAll'

const StarRating = ({ rate }:{rate:number}) => {
  const fullStars = Math.floor(rate);
  const halfStar = Math.ceil(rate) > fullStars ? 1 : 0;
  const emptyStars = 5 - (fullStars + halfStar);

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, index) => (
          <Lucide
            key={`full-star-${index}`}
            icon="Star"
            className="w-4 h-4 mr-1 text-pending fill-pending/30"
          />
        ))}
        {halfStar === 1 && (
          <Lucide
            icon="StarHalf"
            className="w-4 h-4 mr-1 text-pending fill-pending/30"
          />
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <Lucide
            key={`empty-star-${index}`}
            icon="Star"
            className="w-4 h-4 mr-1 text-slate-400 fill-slate/30"
          />
        ))}
      </div>
      <div className="ml-1 text-xs text-slate-500">({rate})</div>
    </div>
  );
};

export default function Reviews() {
  const dispatch = useAppDispatch()
  const stateReviews = useAppSelector(StateReviews)
  const data = stateReviews?.data?.data
  const pagdnationState = stateReviews?.data?.pagination
  const [limit, setLimit] = useState("10");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(ActionGetReviews({limit , page}))
  }, [dispatch, limit, page])

  console.log(data)
  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Reviews</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                {/* <Table.Th className="border-b-0 whitespace-nowrap">
                  <FormCheck.Input type="checkbox" />
                </Table.Th> */}
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Service Provider
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Customer
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Cycle
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  RATING
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  Comment
                </Table.Th>
                {/* <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  ACTIONS
                </Table.Th> */}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data?.map((faker:any, fakerKey:any) => (
                <Table.Tr key={fakerKey} className="intro-x">
                  <Table.Td className="first:rounded-l-md last:rounded-r-md !py-4 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 image-fit zoom-in">
                        <Tippy
                          as="img"
                          alt="Midone - HTML Admin Template"
                          className="border-white rounded-lg border-1 shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                          src={faker.sp.profileImage}
                          content={`Uploaded at ${faker.sp.name}`}
                        />
                      </div>
                      <a href="" className="ml-4 font-medium whitespace-nowrap">
                        {faker.sp.name}
                      </a>
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md !py-4 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <div className="flex items-center">
                      <div className="w-10 h-10 image-fit zoom-in">
                        <Tippy
                          as="img"
                          alt="Midone - HTML Admin Template"
                          className="border-white rounded-lg border-1 shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                          src={faker.customer.profileImage}
                          content={`Uploaded at ${faker.customer.name}`}
                        />
                      </div>
                      <a href="" className="ml-4 font-medium whitespace-nowrap">
                        {faker.customer.name}
                      </a>
                    </div>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md whitespace-nowrap bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <a
                      className="flex items-center underline decoration-dotted"
                      
                    >
                      {faker.cycle}
                    </a>
                  </Table.Td>
                  <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <StarRating rate={faker.rate}/>
                  </Table.Td>                  
                  <Table.Td className="first:rounded-l-md last:rounded-r-md whitespace-nowrap bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                    <a
                      className="flex items-center underline decoration-dotted"
                      
                    >
                      {faker.comment}
                    </a>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
        {/* END: Data List */}
        {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          {pagdnationState ?
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
            <option>20</option>
            <option>30</option>
            <option>50</option>
            <option>100</option>
          </FormSelect>
        </div>
        {/* END: Pagination */}
      </div>
    </>  )
}
