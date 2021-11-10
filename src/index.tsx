import { ActionPanel, List, showHUD } from "@raycast/api"
import timers from "./timers"
import { getProjects, getWorkspaceID, startTimer } from "./toggl"

interface Timer {
	"name": string,
	"project": string
}

interface TimeEntry {
	"name": string,
	"project": number
}

interface Project {
	"id": number,
	"wid": number,
	"name": string,
	"billable": boolean,
	"is_private": boolean,
	"active": boolean,
	"template": boolean,
	"at": string,
	"created_at": string,
	"color": string, 
	"auto_estimates": boolean,
	"actual_hours": number,
	"hex_color": string
}

async function itemChosen(item: Timer) {
	const workspaceID: string = await getWorkspaceID()
	const projects: Array<Project> = await getProjects(workspaceID)
	let projectID = 0
	projects.forEach(project => {
			if (project.name == item.project) {
				projectID = project.id
			}
		}
	)
	const timeEntry: TimeEntry = {
		"name": item.name,
		"project": projectID
	}
	await startTimer(timeEntry)
	await showHUD(`Timer for "${item.name}" started! 🎉`)
}

const timerArray = timers.map(timer => {
	return (
		<List.Item
			title={timer.name}
			subtitle={timer.project}
			actions={
				<ActionPanel>
					<ActionPanel.Item title="Start Timer" onAction={() => itemChosen(timer)} />
				</ActionPanel>
			}
		/>
	)
})

export default function Command() {
	return (
		<List>
			{timerArray}
		</List>
	)
}
