import { SchedulerHelpers } from "@aldabil/react-scheduler/types";
import * as React from "react";

interface props {
  scheduler: SchedulerHelpers;
}
const CalendarEditor: React.FC<props> = (props) => {

  React.useEffect(() => {
    console.log(props.scheduler);
  }, []);

  return (
    <>
      Editor
    </>
  )
};

export default CalendarEditor;