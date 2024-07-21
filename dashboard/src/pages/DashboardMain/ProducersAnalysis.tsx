import _ from "lodash";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import clsx from "clsx";
import Tippy from "../../base-components/Tippy";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import { StateAllProducerAnalysis } from "../../redux/stores/api/analysis/producer";
import { ActionGetProducerAnalysis } from "../../redux/action/api/cycles/producer/analysis";
import { MapPin } from "lucide-react";

export default function ProducersAnalysis() {
  const dispatch = useAppDispatch()
  const stateAllProducer = useAppSelector(StateAllProducerAnalysis)
  const data = stateAllProducer?.data?.data

  useEffect(() => {
    dispatch(ActionGetProducerAnalysis())
  }, [])


  return (
    <Tab.Panel>
    <div className="grid grid-cols-12 gap-6 mt-5 mb-8">

      <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
        <div
          className={clsx([
            "relative zoom-in",
            "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
          ])}
        >
          <div className="p-5 box">
            <div className="mt-6 text-3xl font-medium leading-8">
            {data?.totalCount}
            </div>
            <div className="mt-1 text-base text-slate-500">
              Total Count
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-12 gap-6">
      {/* BEGIN: Top Budget Users */}
      <div className="col-span-12 intro-y box lg:col-span-6">
        <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
          <h2 className="mr-auto text-base font-medium">Top Budget</h2>
          <h2 className="ml-auto text-base font-medium">Total Budget</h2>
        </div>
        <div className="p-5">
          {data?.topMaxBudgetUsers?.map((user:any,index:number)=>
            <div key={index} className="relative flex items-center pb-3">
              <div className="flex-none w-12 h-12 image-fit">
                <img
                  alt="DuvDu Admin DashBoard"
                  className="rounded-full"
                  src={user.userDetails.profileImage}
                />
              </div>
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  {user.userDetails.username}
                </a>
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-500">
                {user.totalMaxBudget}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* END: Top Budget Users */}
      {/* BEGIN: Bottom Budget Users */}
      <div className="col-span-12 intro-y box lg:col-span-6">
        <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
          <h2 className="mr-auto text-base font-medium">Bottom Budget</h2>
          <h2 className="ml-auto text-base font-medium">Total Budget</h2>
        </div>
        <div className="p-5">
          {data?.bottomMaxBudgetUsers?.map((user:any,index:number)=>
            <div key={index} className="relative flex items-center pb-3">
              <div className="flex-none w-12 h-12 image-fit">
                <img
                  alt="DuvDu Admin DashBoard"
                  className="rounded-full"
                  src={user.userDetails.profileImage}
                />
              </div>
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  {user.userDetails.username}
                </a>
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-500">
                {user.totalMaxBudget}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* END: Bottom Budget Users */}
    </div>
  </Tab.Panel>
  )
}
