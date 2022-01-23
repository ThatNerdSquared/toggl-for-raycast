import { ActionPanel, closeMainWindow, Form, Icon, showHUD, SubmitFormAction } from "@raycast/api";
import { useEffect, useState } from "react";
import { getProjects, getWorkspaces, startTimer } from "./toggl";
import { NewTimeEntry, Project } from "./types";

async function submitForm(values: NewTimeEntry) {
  const timerObj = {
    description: values.description,
    pid: values.pid,
  };
  await closeMainWindow();
  await startTimer(timerObj);
  await showHUD(`Timer for "${timerObj.description}" created! 🎉`);
}

export default function NewTimerForm() {
  const [projects, setProjects] = useState<Array<Project>>();

  useEffect(() => {
    const getProj = async () => {
      const workspaces = await getWorkspaces();
      const projectsList: Array<Project> = await getProjects(workspaces[0].id.toString());
      setProjects(projectsList);
    };
    getProj();
  }, []);

  return (
    <Form
      actions={
        <ActionPanel>
          <SubmitFormAction title="Create New Timer" onSubmit={async (values: NewTimeEntry) => submitForm(values)} />
        </ActionPanel>
      }
    >
      <Form.TextField id="description" title="Timer Name" placeholder="Llama Taming" />
      <Form.Dropdown id="pid" title="Timer Project">
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
