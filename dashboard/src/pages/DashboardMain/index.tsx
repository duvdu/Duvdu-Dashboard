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
import { getToken, onMessage } from "firebase/messaging";
import { useSocket } from "../../socketContext";

function Main() {
  const { visitorCount, loggedUserCount } = useSocket();
  const [initialCounts, setInitialCounts] = useState<{ visitors: number; logged: number }>({ visitors: 0, logged: 0 });
  console.log({visitorCount, loggedUserCount})
  // useEffect(() => {
  //   const fetchInitialCounts = async () => {
  //     try {
  //       const visitorsResponse = await fetch('https://api.duvdu.com/getVisitorsCounter');
  //       console.log(visitorsResponse)
  //       const visitorsData = await visitorsResponse.json();
  //       const loggedResponse = await fetch('https://api.duvdu.com/getLoggedCounter');
  //       const loggedData = await loggedResponse.json();

  //       setInitialCounts({
  //         visitors: visitorsData.count,
  //         logged: loggedData.count,
  //       });
  //     } catch (error) {
  //       console.error('Error fetching initial counts:', error);
  //     }
  //   };

  //   fetchInitialCounts();
  // }, []);

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
                socket
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
          <Tab.Panel>
            <div>
              <h1>Visitor Count: {visitorCount }</h1>
              <h2>Logged User Count: {loggedUserCount }</h2>
            </div>
          </Tab.Panel>
          </Tab.Panels>
      </Tab.Group>
    </>
  );
}

export default Main;
