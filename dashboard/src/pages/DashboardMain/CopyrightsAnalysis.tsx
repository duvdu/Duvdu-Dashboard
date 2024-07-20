import _ from "lodash";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import clsx from "clsx";
import Tippy from "../../base-components/Tippy";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import { ActionGetCopyRightAnalysis } from "../../redux/action/api/cycles/copyright/analysis";
import { StateAllCopyRighterAnalysis } from "../../redux/stores/api/analysis/copyright";

export default function CopyrightsAnalysis() {
  const dispatch = useAppDispatch()
  const stateAllCopyRighter = useAppSelector(StateAllCopyRighterAnalysis)
  const data = stateAllCopyRighter?.data?.data
  console.log({copy : data})
  useEffect(() => {
    dispatch(ActionGetCopyRightAnalysis())
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
              4.710
            </div>
            <div className="mt-1 text-base text-slate-500">
              Item Sales
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
              3.721
            </div>
            <div className="mt-1 text-base text-slate-500">
              New Orders
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
              2.149
            </div>
            <div className="mt-1 text-base text-slate-500">
              Total Products
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
              152.040
            </div>
            <div className="mt-1 text-base text-slate-500">
              Unique Visitor
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-12 gap-6">
      {/* BEGIN: Daily Sales */}
      <div className="col-span-12 intro-y box lg:col-span-6">
        <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
          <h2 className="mr-auto text-base font-medium">Daily Sales</h2>
          <Menu className="ml-auto sm:hidden">
            <Menu.Button  className="block w-5 h-5" >
              <Lucide
                icon="MoreHorizontal"
                className="w-5 h-5 text-slate-500"
              />
            </Menu.Button>
            <Menu.Items className="w-40">
              <Menu.Item>
                <Lucide icon="File" className="w-4 h-4 mr-2" /> Download
                Excel
              </Menu.Item>
            </Menu.Items>
          </Menu>
          <Button
            
            className="hidden sm:flex"
          >
            <Lucide icon="File" className="w-4 h-4 mr-2" /> Download
            Excel
          </Button>
        </div>
        <div className="p-5">
          <div className="relative flex items-center">
            <div className="flex-none w-12 h-12 image-fit">
              <img
                alt="DuvDu Admin DashBoard"
                className="rounded-full"
                src={fakerData[0].photos[0]}
              />
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {fakerData[0].users[0].name}
              </a>
              <div className="mr-5 text-slate-500 sm:mr-5">
                Bootstrap 4 HTML Admin Template
              </div>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              +$19
            </div>
          </div>
          <div className="relative flex items-center mt-5">
            <div className="flex-none w-12 h-12 image-fit">
              <img
                alt="DuvDu Admin DashBoard"
                className="rounded-full"
                src={fakerData[1].photos[0]}
              />
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {fakerData[1].users[0].name}
              </a>
              <div className="mr-5 text-slate-500 sm:mr-5">
                Tailwind HTML Admin Template
              </div>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              +$25
            </div>
          </div>
          <div className="relative flex items-center mt-5">
            <div className="flex-none w-12 h-12 image-fit">
              <img
                alt="DuvDu Admin DashBoard"
                className="rounded-full"
                src={fakerData[2].photos[0]}
              />
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {fakerData[2].users[0].name}
              </a>
              <div className="mr-5 text-slate-500 sm:mr-5">
                Vuejs HTML Admin Template
              </div>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              +$21
            </div>
          </div>
        </div>
      </div>
      {/* END: Daily Sales */}
      {/* BEGIN: Daily Sales */}
      <div className="col-span-12 intro-y box lg:col-span-6">
        <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
          <h2 className="mr-auto text-base font-medium">Daily Sales</h2>
          <Menu className="ml-auto sm:hidden">
            <Menu.Button  className="block w-5 h-5" >
              <Lucide
                icon="MoreHorizontal"
                className="w-5 h-5 text-slate-500"
              />
            </Menu.Button>
            <Menu.Items className="w-40">
              <Menu.Item>
                <Lucide icon="File" className="w-4 h-4 mr-2" /> Download
                Excel
              </Menu.Item>
            </Menu.Items>
          </Menu>
          <Button
            
            className="hidden sm:flex"
          >
            <Lucide icon="File" className="w-4 h-4 mr-2" /> Download
            Excel
          </Button>
        </div>
        <div className="p-5">
          <div className="relative flex items-center">
            <div className="flex-none w-12 h-12 image-fit">
              <img
                alt="DuvDu Admin DashBoard"
                className="rounded-full"
                src={fakerData[0].photos[0]}
              />
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {fakerData[0].users[0].name}
              </a>
              <div className="mr-5 text-slate-500 sm:mr-5">
                Bootstrap 4 HTML Admin Template
              </div>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              +$19
            </div>
          </div>
          <div className="relative flex items-center mt-5">
            <div className="flex-none w-12 h-12 image-fit">
              <img
                alt="DuvDu Admin DashBoard"
                className="rounded-full"
                src={fakerData[1].photos[0]}
              />
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {fakerData[1].users[0].name}
              </a>
              <div className="mr-5 text-slate-500 sm:mr-5">
                Tailwind HTML Admin Template
              </div>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              +$25
            </div>
          </div>
          <div className="relative flex items-center mt-5">
            <div className="flex-none w-12 h-12 image-fit">
              <img
                alt="DuvDu Admin DashBoard"
                className="rounded-full"
                src={fakerData[2].photos[0]}
              />
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {fakerData[2].users[0].name}
              </a>
              <div className="mr-5 text-slate-500 sm:mr-5">
                Vuejs HTML Admin Template
              </div>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              +$21
            </div>
          </div>
        </div>
      </div>
      {/* END: Daily Sales */}
      {/* BEGIN: Daily Sales */}
      <div className="col-span-12 intro-y box lg:col-span-6">
        <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
          <h2 className="mr-auto text-base font-medium">Daily Sales</h2>
          <Menu className="ml-auto sm:hidden">
            <Menu.Button  className="block w-5 h-5" >
              <Lucide
                icon="MoreHorizontal"
                className="w-5 h-5 text-slate-500"
              />
            </Menu.Button>
            <Menu.Items className="w-40">
              <Menu.Item>
                <Lucide icon="File" className="w-4 h-4 mr-2" /> Download
                Excel
              </Menu.Item>
            </Menu.Items>
          </Menu>
          <Button
            
            className="hidden sm:flex"
          >
            <Lucide icon="File" className="w-4 h-4 mr-2" /> Download
            Excel
          </Button>
        </div>
        <div className="p-5">
          <div className="relative flex items-center">
            <div className="flex-none w-12 h-12 image-fit">
              <img
                alt="DuvDu Admin DashBoard"
                className="rounded-full"
                src={fakerData[0].photos[0]}
              />
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {fakerData[0].users[0].name}
              </a>
              <div className="mr-5 text-slate-500 sm:mr-5">
                Bootstrap 4 HTML Admin Template
              </div>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              +$19
            </div>
          </div>
          <div className="relative flex items-center mt-5">
            <div className="flex-none w-12 h-12 image-fit">
              <img
                alt="DuvDu Admin DashBoard"
                className="rounded-full"
                src={fakerData[1].photos[0]}
              />
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {fakerData[1].users[0].name}
              </a>
              <div className="mr-5 text-slate-500 sm:mr-5">
                Tailwind HTML Admin Template
              </div>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              +$25
            </div>
          </div>
          <div className="relative flex items-center mt-5">
            <div className="flex-none w-12 h-12 image-fit">
              <img
                alt="DuvDu Admin DashBoard"
                className="rounded-full"
                src={fakerData[2].photos[0]}
              />
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {fakerData[2].users[0].name}
              </a>
              <div className="mr-5 text-slate-500 sm:mr-5">
                Vuejs HTML Admin Template
              </div>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              +$21
            </div>
          </div>
        </div>
      </div>
      {/* END: Daily Sales */}
      {/* BEGIN: Daily Sales */}
      <div className="col-span-12 intro-y box lg:col-span-6">
        <div className="flex items-center px-5 py-5 border-b sm:py-3 border-slate-200/60 dark:border-darkmode-400">
          <h2 className="mr-auto text-base font-medium">Daily Sales</h2>
          <Menu className="ml-auto sm:hidden">
            <Menu.Button  className="block w-5 h-5" >
              <Lucide
                icon="MoreHorizontal"
                className="w-5 h-5 text-slate-500"
              />
            </Menu.Button>
            <Menu.Items className="w-40">
              <Menu.Item>
                <Lucide icon="File" className="w-4 h-4 mr-2" /> Download
                Excel
              </Menu.Item>
            </Menu.Items>
          </Menu>
          <Button
            
            className="hidden sm:flex"
          >
            <Lucide icon="File" className="w-4 h-4 mr-2" /> Download
            Excel
          </Button>
        </div>
        <div className="p-5">
          <div className="relative flex items-center">
            <div className="flex-none w-12 h-12 image-fit">
              <img
                alt="DuvDu Admin DashBoard"
                className="rounded-full"
                src={fakerData[0].photos[0]}
              />
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {fakerData[0].users[0].name}
              </a>
              <div className="mr-5 text-slate-500 sm:mr-5">
                Bootstrap 4 HTML Admin Template
              </div>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              +$19
            </div>
          </div>
          <div className="relative flex items-center mt-5">
            <div className="flex-none w-12 h-12 image-fit">
              <img
                alt="DuvDu Admin DashBoard"
                className="rounded-full"
                src={fakerData[1].photos[0]}
              />
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {fakerData[1].users[0].name}
              </a>
              <div className="mr-5 text-slate-500 sm:mr-5">
                Tailwind HTML Admin Template
              </div>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              +$25
            </div>
          </div>
          <div className="relative flex items-center mt-5">
            <div className="flex-none w-12 h-12 image-fit">
              <img
                alt="DuvDu Admin DashBoard"
                className="rounded-full"
                src={fakerData[2].photos[0]}
              />
            </div>
            <div className="ml-4 mr-auto">
              <a href="" className="font-medium">
                {fakerData[2].users[0].name}
              </a>
              <div className="mr-5 text-slate-500 sm:mr-5">
                Vuejs HTML Admin Template
              </div>
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-500">
              +$21
            </div>
          </div>
        </div>
      </div>
      {/* END: Daily Sales */}
    </div>
  </Tab.Panel>
  )
}
