import { getPreferenceValues } from "@raycast/api"
import fetch from "node-fetch"

interface Timer {
	"name": string,
	"project": number
}

interface Preferences {
	"apiToken": string
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


async function getProjects(workspaceID: string): Promise<Array<Project>> {
    const prefs: Preferences = getPreferenceValues()
    const baseURL = `https://api.track.toggl.com/api/v8/workspaces/${workspaceID}/projects`
    const auth = "Basic " + Buffer.from(prefs.apiToken + ":api_token").toString("base64")

    const response = await fetch(baseURL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
    })
    const projects: any = await response.json()
    return projects
}

async function getWorkspaceID(): Promise<string> {
    const prefs: Preferences = getPreferenceValues()
    const baseURL = "https://api.track.toggl.com/api/v8/workspaces"
    const auth = "Basic " + Buffer.from(prefs.apiToken + ":api_token").toString("base64")
	
    const response = await fetch(baseURL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
    })
    const resJSON: any = await response.json()
    const workspaceID = resJSON[0].id
    return workspaceID
}

async function startTimer(timerObject: Timer) {
    const prefs: Preferences = getPreferenceValues()
    const auth = "Basic " + Buffer.from(prefs.apiToken + ":api_token").toString("base64")
    const baseURL = "https://api.track.toggl.com/api/v8/time_entries/start"
    const data = {
        "time_entry": {
            "description": timerObject.name,
            "pid": timerObject.project,
            "created_with": "toggl-unofficial"
        }
    }
    await fetch(baseURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        body: JSON.stringify(data),
    })
}

export { getProjects, getWorkspaceID, startTimer }
