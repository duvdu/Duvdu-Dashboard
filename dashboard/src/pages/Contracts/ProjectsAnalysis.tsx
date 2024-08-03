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

export default function ProjectsAnalysis({ProjectContract}:any) {

  return (
    <Tab.Panel>
{ProjectContract && 
      <>
      <div className="grid grid-cols-12 gap-6 mt-5 mb-8">    
        <div className="col-span-12 sm:col-span-3 intro-y">
          <div className="grid grid-rows-12 gap-6">
              <div className="grid grid-rows-12 gap-5 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="mt-6 text-3xl font-medium leading-8">
                    {ProjectContract.totalCount}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Total Count
                    </div>
                  </div>
                </div>
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="mt-6 text-3xl font-medium leading-8">
                    {ProjectContract.totalPriceSum}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Total Price
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div className="col-span-12 sm:col-span-9 intro-y">
        <div className="col-span-12 intro-y box lg:col-span-6">
          <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
            <h2 className="mr-auto text-base font-medium">Status</h2>
            <h2 className="ml-auto text-base font-medium">Count</h2>
          </div>
          <div className="p-5">
            {ProjectContract?.statusCounts && Object?.entries(ProjectContract?.statusCounts).map(([key, value]: [string, any], index:number) => 
              <div key={index} className="relative flex items-center pb-3">
                <div className="ml-4 mr-auto">
                  <div  className="font-medium capitalize">
                    {key?.replaceAll('-',' ')}
                  </div>
                </div>
                <div className="font-medium text-slate-600 dark:text-slate-500">
                  {value?.v}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
      </>
          }
  </Tab.Panel>

  )
}
