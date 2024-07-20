import _ from "lodash";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import { FormSwitch } from "../../base-components/Form";
import Progress from "../../base-components/Progress";
import Lucide from "../../base-components/Lucide";
import StackedBarChart1 from "../../components/StackedBarChart1";
import SimpleLineChart from "../../components/SimpleLineChart";
import SimpleLineChart1 from "../../components/SimpleLineChart1";
import SimpleLineChart2 from "../../components/SimpleLineChart2";
import { Menu, Tab } from "../../base-components/Headless";
import { Tab as HeadlessTab } from "@headlessui/react";
import ProjectsAnalysis from "./ProjectsAnalysis";
import RentalsAnalysis from "./RentalsAnalysis";
import CopyrightsAnalysis from "./CopyrightsAnalysis";
import ProducersAnalysis from "./ProducersAnalysis";

function Main() {
  return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Profile Layout</h2>
      </div>
      <Tab.Group>
        {/* BEGIN: Profile Info */}
        <div className="px-5 pt-5 mt-5 intro-y box">
          <div className="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
            <div className="flex items-center justify-center flex-1 px-5 lg:justify-start">
              <div className="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit">
                <img
                  alt="DuvDu Admin DashBoard"
                  className="rounded-full"
                  src={fakerData[0].photos[0]}
                />
                <div className="absolute bottom-0 right-0 flex items-center justify-center p-2 mb-1 mr-1 rounded-full bg-primary">
                  <Lucide icon="Camera" className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-5">
                <div className="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal">
                  {fakerData[0].users[0].name}
                </div>
                <div className="text-slate-500">{fakerData[0].jobs[0]}</div>
              </div>
            </div>
            <div className="flex-1 px-5 pt-5 mt-6 border-t border-l border-r lg:mt-0 border-slate-200/60 dark:border-darkmode-400 lg:border-t-0 lg:pt-0">
              <div className="font-medium text-center lg:text-left lg:mt-3">
                Contact Details
              </div>
              <div className="flex flex-col items-center justify-center mt-4 lg:items-start">
                <div className="flex items-center truncate sm:whitespace-normal">
                  <Lucide icon="Mail" className="w-4 h-4 mr-2" />
                  {fakerData[0].users[0].email}
                </div>
                <div className="flex items-center mt-3 truncate sm:whitespace-normal">
                  <Lucide icon="Instagram" className="w-4 h-4 mr-2" /> Instagram
                  {fakerData[0].users[0].name}
                </div>
                <div className="flex items-center mt-3 truncate sm:whitespace-normal">
                  <Lucide icon="Twitter" className="w-4 h-4 mr-2" /> Twitter
                  {fakerData[0].users[0].name}
                </div>
              </div>
            </div>
            <div className="flex-1 px-5 pt-5 mt-6 border-t lg:mt-0 lg:border-0 border-slate-200/60 dark:border-darkmode-400 lg:pt-0">
              <div className="font-medium text-center lg:text-left lg:mt-5">
                Sales Growth
              </div>
              <div className="flex items-center justify-center mt-2 lg:justify-start">
                <div className="flex w-20 mr-2">
                  USP:{" "}
                  <span className="ml-3 font-medium text-success">+23%</span>
                </div>
                <div className="w-3/4">
                  <SimpleLineChart1 height={55} className="-mr-5" />
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <div className="flex w-20 mr-2">
                  STP: <span className="ml-3 font-medium text-danger">-2%</span>
                </div>
                <div className="w-3/4">
                  <SimpleLineChart2 height={55} className="-mr-5" />
                </div>
              </div>
            </div>
          </div>
          <Tab.List
            variant="link-tabs"
            className="flex-col justify-center text-center sm:flex-row lg:justify-start"
          >
            <Tab fullWidth={false}>
              <Tab.Button className="py-4 cursor-pointer">
                Projects
              </Tab.Button>
            </Tab>
            <Tab fullWidth={false}>
              <Tab.Button className="py-4 cursor-pointer">
                Rental
              </Tab.Button>
            </Tab>
            <Tab fullWidth={false}>
              <Tab.Button className="py-4 cursor-pointer">
                Copyrights
              </Tab.Button>
            </Tab>
            <Tab fullWidth={false}>
              <Tab.Button className="py-4 cursor-pointer">
                Producers
              </Tab.Button>
            </Tab>
          </Tab.List>
        </div>
        {/* END: Profile Info */}
        <Tab.Panels className="mt-5 intro-y">
          <ProjectsAnalysis/>
          <RentalsAnalysis/>
          <CopyrightsAnalysis/>
          <ProducersAnalysis/>
        </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export default Main;
