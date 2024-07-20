import _ from "lodash";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import clsx from "clsx";
import Tippy from "../../base-components/Tippy";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import { useEffect } from "react";
import { StateAllProjectAnalysis } from "../../redux/stores/api/analysis/project";
import { ActionGetProjectAnalysis } from "../../redux/action/api/cycles/project/analysis";
import { MapPin } from "lucide-react";

export default function ProjectsAnalysis() {
  const dispatch = useAppDispatch()
  const stateAllProject = useAppSelector(StateAllProjectAnalysis)
  const data = stateAllProject?.data?.data
  useEffect(() => {
    dispatch(ActionGetProjectAnalysis())
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
      <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
        <div
          className={clsx([
            "relative zoom-in",
            "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
          ])}
        >
          <div className="p-5 box">
            <div className="mt-6 text-3xl font-medium leading-8">
            {data?.showOnHomeCount}
            </div>
            <div className="mt-1 text-base text-slate-500">
              Show on Home
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
        <div
          className={clsx([
            "relative zoom-in",
            "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
          ])}
        >
          <div className="p-5 box">
            <div className="mt-6 text-3xl font-medium leading-8">
            {data?.deletedProjectsCount}
            </div>
            <div className="mt-1 text-base text-slate-500">
              Delete Project Count
            </div>
          </div>
        </div>
      </div>

    </div>
    <div className="grid grid-cols-12 gap-6">
            {/* BEGIN: Top Users */}
            <div className="col-span-12 intro-y box lg:col-span-6">
        <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
          <h2 className="mr-auto text-base font-medium">Top Users</h2>
          <h2 className="ml-auto text-base font-medium">Total Booking</h2>
        </div>
        <div className="p-5">
          {data?.topUsers?.map((user:any)=>
            <div className="relative flex items-center pb-3">
              <div className="flex-none w-12 h-12 image-fit">
                <img
                  alt="DuvDu Admin DashBoard"
                  className="rounded-full"
                  src={user.profileImage}
                />
              </div>
              <div className="ml-4 mr-auto">
                <a href="" className="font-medium">
                  {user.username}
                </a>
              </div>
              <div className="font-medium text-slate-600 dark:text-slate-500">
                {user.totalProjects}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* END: Top Users */}
      {/* BEGIN: Address Status */}
      <div className="col-span-12 intro-y box lg:col-span-6">
        <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
          <h2 className="mr-auto text-base font-medium">Top Address Around</h2>
          <h2 className="ml-auto text-base font-medium">Total Booking</h2>
        </div>
        <div className="p-5">
          {data?.addressStats?.map((address:any)=>
          <div className="relative flex items-center pb-3">
            <div className="flex-none image-fit">
              <MapPin/>
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {address.address}
              </a>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              {address.totalProjects}
            </div>
          </div>
          )}

        </div>
      </div>
      {/* END: Address Status */}
    </div>
  </Tab.Panel>

  )
}
