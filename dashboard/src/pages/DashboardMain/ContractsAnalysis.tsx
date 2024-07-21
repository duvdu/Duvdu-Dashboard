import _ from "lodash";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import clsx from "clsx";
import Tippy from "../../base-components/Tippy";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import { StateAllContractAnalysis } from "../../redux/stores/api/analysis/contracts";
import { MapPin } from "lucide-react";
import { ActionGetContractAnalysis } from "../../redux/action/api/cycles/contract/analysis";
import LoadingIcon from "../../base-components/LoadingIcon";

export default function ContractsAnalysis() {
  const dispatch = useAppDispatch()
  const stateAllContract = useAppSelector(StateAllContractAnalysis)
  const data = stateAllContract?.data
  
  useEffect(() => {
    dispatch(ActionGetContractAnalysis())
  }, [])


  return (
    <Tab.Panel>
      {/* {    stateAllContract?.loading? 
      <>
        <LoadingIcon icon="puff" className="ml-3" />
      </>
      : */}
      {data?.copyrightContract && 
      <>
      <h1 className="text-2xl">Copyright</h1>
      <div className="grid grid-cols-12 gap-6 mt-5 mb-8">    
        <div className="col-span-12 sm:col-span-3 intro-y">
          <div className="grid grid-rows-12 gap-6">
              <div className="grid grid-rows-2 gap-5 col-span-12 sm:col-span-6 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="mt-6 text-3xl font-medium leading-8">
                    {data?.copyrightContract.totalCount}
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
                    {data?.copyrightContract.totalPriceSum}
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
            {data?.copyrightContract?.statusCounts && Object?.entries(data?.copyrightContract?.statusCounts).map(([key, value]: [string, any], index:number) => 
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
      {data?.producerContracts?.totalCount && 
      <>
      <h1 className="text-2xl">Products</h1>
      <div className="grid grid-cols-12 gap-6 mt-5 mb-8">    
        <div className="col-span-12 sm:col-span-3 intro-y">
          <div className="grid grid-rows-12 gap-6">
              <div className="grid grid-rows-2 gap-5 col-span-12 sm:col-span-6 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="mt-6 text-3xl font-medium leading-8">
                    {data?.producerContracts.totalCount}
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
                    {data?.producerContracts.totalPriceSum}
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
            {data?.producerContracts?.statusCounts && Object?.entries(data?.producerContracts?.statusCounts).map(([key, value]: [string, any],index:number) => 
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
      {data?.projectContracts?.totalCount && 
      <>
      <h1 className="text-2xl">Project</h1>
      <div className="grid grid-cols-12 gap-6 mt-5 mb-8">    
        <div className="col-span-12 sm:col-span-3 intro-y">
          <div className="grid grid-rows-12 gap-6">
              <div className="grid grid-rows-2 gap-5 col-span-12 sm:col-span-6 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="mt-6 text-3xl font-medium leading-8">
                    {data?.projectContracts.totalCount}
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
                    {data?.projectContracts.totalPriceSum}
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
            {data?.projectContracts?.statusCounts && Object?.entries(data?.projectContracts?.statusCounts).map(([key, value]: [string, any],index:number) => 
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
      {data?.rentalContracts?.totalCount && 
      <>
      <h1 className="text-2xl">Rental</h1>
      <div className="grid grid-cols-12 gap-6 mt-5 mb-8">    
        <div className="col-span-12 sm:col-span-3 intro-y">
          <div className="grid grid-rows-12 gap-6">
              <div className="grid grid-rows-2 gap-5 col-span-12 sm:col-span-6 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="mt-6 text-3xl font-medium leading-8">
                    {data?.rentalContracts.totalCount}
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
                    {data?.rentalContracts.totalPriceSum}
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
            {data?.rentalContracts?.statusCounts && Object?.entries(data?.rentalContracts?.statusCounts).map(([key, value]: [string, any],index:number) => 
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
      {data?.teamContracts?.totalCount && 
      <>
        <h1 className="text-2xl">Team</h1>
        <div className="grid grid-cols-12 gap-6 mt-5 mb-8">    
          <div className="col-span-12 sm:col-span-3 intro-y">
            <div className="grid grid-rows-12 gap-6">
                <div className="grid grid-rows-2 gap-5 col-span-12 sm:col-span-6 intro-y">
                  <div
                    className={clsx([
                      "relative zoom-in",
                      "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                    ])}
                  >
                    <div className="p-5 box">
                      <div className="mt-6 text-3xl font-medium leading-8">
                      {data?.teamContracts.totalCount}
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
                      {data?.teamContracts.totalPriceSum}
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
              {data?.teamContracts?.statusCounts && Object?.entries(data?.teamContracts?.statusCounts).map(([key, value]: [string, any],index:number) => 
                <div key={index} className="relative flex items-center pb-3">
                  <div className="ml-4 mr-auto">
                    <div  className="font-medium">
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
