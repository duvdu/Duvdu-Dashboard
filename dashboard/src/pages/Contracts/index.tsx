import _ from "lodash";
import { useEffect, useState } from "react";
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
import { ActionGetContractAnalysis } from "../../redux/action/api/cycles/contract/analysis";
import { StateAllContractAnalysis } from "../../redux/stores/api/analysis/contracts";
import { useAppDispatch, useAppSelector } from "../../redux/stores/hooks";
import TeamsAnalysis from "./TeamsAnalysis";

function Main() {
  const dispatch = useAppDispatch()
  const stateAllContract = useAppSelector(StateAllContractAnalysis)
  const data = stateAllContract?.data
  const CopyrightContract = data?.copyrightContract
  const RentalContract = data?.rentalContracts
  const ProjectContract = data?.projectContracts
  const TeamContracts = data?.teamContracts
  const ProducerContracts = data?.producerContracts
  useEffect(() => {
    dispatch(ActionGetContractAnalysis())
  }, [])

    return (
    <>
      <div className="flex items-center mt-8 intro-y">
        <h2 className="mr-auto text-lg font-medium">Analysis</h2>
      </div>
      <Tab.Group>
        {/* BEGIN: Profile Info */}
        <div className="px-5 mt-5 intro-y box">
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
            <Tab fullWidth={false}>
              <Tab.Button className="py-4 cursor-pointer">
                Teams
              </Tab.Button>
            </Tab>
          </Tab.List>
        </div>
        {/* END: Profile Info */}
        <Tab.Panels className="mt-5 intro-y">
          <ProjectsAnalysis ProjectContract={ProjectContract}/> 
          <RentalsAnalysis RentalContract={RentalContract}/>
          <CopyrightsAnalysis CopyrightContract={CopyrightContract}/>
          <ProducersAnalysis  ProducerContracts={ProducerContracts}/>
          <TeamsAnalysis TeamContracts={TeamContracts} />
          </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export default Main;
