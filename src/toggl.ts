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

interface Workspace {
    id: number,
    name: string,
    profile: number,
    premium: boolean,
    admin: boolean,
    default_hourly_rate: number,
    default_currency: string,
    only_admins_may_create_projects: boolean,
    only_admins_see_billable_rates: boolean,
    only_admins_see_team_dashboard: boolean,
    projects_billable_by_default: boolean,
    rounding: number,
    rounding_minutes: number,
    api_token: string,
    at: string,
    ical_enabled: boolean
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
    const resJSON = await response.json()
    return resJSON
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

function isProject(arg: unknown): arg is Array<Project> {
    return true
}

function isWorkspace(arg: unknown): arg is Array<Workspace> {
    return true
}

async function getProjects(workspaceID: string): Promise<Array<Project>> {
    const baseURL = `https://api.track.toggl.com/api/v8/workspaces/${workspaceID}/projects`
    const projects = await togglGet(baseURL)
    if (isProject(projects)) {
        return projects
    }
    else {
        throw "Projects array not valid!"
    }
}

async function getWorkspaceID(): Promise<string> {
    const baseURL = "https://api.track.toggl.com/api/v8/workspaces"
    const response = await togglGet(baseURL)
    if (isWorkspace(response)) {
        return response[0].id.toString()
    }
    else {
        throw "Workspace array not valid!"
    }
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
