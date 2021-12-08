import { getPreferenceValues } from "@raycast/api"
import fetch from "node-fetch"

interface Timer {
	"name": string,
	"project": number
}

interface TimerBody {
    "time_entry": {
        "description": string,
        "pid": number,
        "created_with": string
    }
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

async function togglGet(baseURL: string) {
    const prefs: Preferences = getPreferenceValues()
    const auth = "Basic " + Buffer.from(prefs.apiToken + ":api_token").toString("base64")
    const response = await fetch(baseURL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
    })
    return await response.json()
}

async function togglPost(baseURL: string, data: TimerBody) {
    const prefs: Preferences = getPreferenceValues()
    const auth = "Basic " + Buffer.from(prefs.apiToken + ":api_token").toString("base64")
    await fetch(baseURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth
        },
        body: JSON.stringify(data),
    })
}

async function getProjects(workspaceID: string): Promise<Array<Project>> {
    const baseURL = `https://api.track.toggl.com/api/v8/workspaces/${workspaceID}/projects`
    const projects: unknown = await togglGet(baseURL)
    return projects
}

async function getWorkspaceID(): Promise<string> {
    const baseURL = "https://api.track.toggl.com/api/v8/workspaces"
    const response = await togglGet(baseURL)
    const workspaceID: string = response[0].id.toString()
    return workspaceID
}

async function startTimer(timerObject: Timer) {
    const baseURL = "https://api.track.toggl.com/api/v8/time_entries/start"
    const data: TimerBody = {
        "time_entry": {
            "description": timerObject.name,
            "pid": timerObject.project,
            "created_with": "toggl-unofficial"
        }
    }
    await togglPost(baseURL, data)
}

export { getProjects, getWorkspaceID, startTimer }
