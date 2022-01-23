import { ActionPanel, closeMainWindow, Form, FormValue, Icon, showHUD, SubmitFormAction } from "@raycast/api";
import { useEffect, useState } from "react";
import { getProjects, getWorkspaceID, startTimer, stopTimer } from "./toggl";

interface Project {
  id: number;
  wid: number;
  name: string;
  billable: boolean;
  is_private: boolean;
  active: boolean;
  template: boolean;
  at: string;
  created_at: string;
  color: string;
  auto_estimates: boolean;
  actual_hours: number;
  hex_color: string;
}

interface Timer {
  name: string;
  pid: number;
  project: string;
  colour: string;
}

async function submitForm(values) {
  const timerObj: Timer = {
    name: values.name,
    pid: parseInt(values.project),
    project: "",
    colour: "",
  };
  await closeMainWindow();
  await startTimer(timerObj);
  await showHUD(`Timer for "${timerObj.name}" created! 🎉`);
}

export default function NewTimerForm() {
  const [projects, setProjects] = useState<Array<Project>>();

  useEffect(() => {
    const getProj = async () => {
      const wid = await getWorkspaceID();
      const projectsList: Array<Project> = await getProjects(wid);
      setProjects(projectsList);
    };
    getProj();
  }, []);

  return (
    <Form
      actions={
        <ActionPanel>
          <SubmitFormAction title="Create New Timer" onSubmit={async (values) => submitForm(values)} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Timer Name" placeholder="Llama Taming" />
      <Form.Dropdown id="project" title="Timer Project">
        {projects?.map((project) => (
          <Form.DropdownItem
            value={project.id.toString()}
            title={project.name}
            icon={{ source: Icon.Circle, tintColor: project.hex_color }}
          />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
