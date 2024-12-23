import masterDBService from '../services/masterDB.service'
import userRegistrationService from '../services/userRegistration.service'

class SmartTabeActions {
    constructor() { }

    async getAllShiftTimings() {
        const resp = await masterDBService.getAllShiftTimings()
        const data = resp.results
        return await data
            .filter((item) => item.status === true)
            .map((item) => ({
                label: `${item.startTime} - ${item.endTime}`,
                value: item.id,
            }))
    }

    async getAllDepartments() {
        const resp = await masterDBService.getAllDepartments()
        const data = resp.results
        return await data
            .filter((item) => item.status === true)
            .map((item) => ({
                label: item.department,
                value: item.id,
            }))
    }

    async getAllGeographies() {
        const resp = await masterDBService.getAllGeographies()
        const data = resp.results
        return await data
            .filter((item) => item.status === true)
            .map((item) => ({
                label: item.geography,
                value: item.id,
            }))
    }

    async getAllUserEmails() {
        const resp = await userRegistrationService.getUsers1()
        const data = resp.results
        return await data.map((item) => ({
            label: (item.firstName = ' ' + item.lastName),
            value: item.email,
        }))
    }

    async getAllModuleNames() {
        return [
            { label: 'Recruiter Social', value: 'recruiterSocial' },
            { label: 'Search Query Generator', value: 'searchStringGenerator' },
            { label: 'JD Generator', value: 'jobDescriptionMaker' },
            { label: 'Recruiter Outreach', value: 'contentGenerator' },
            { label: 'Domain Identifier', value: 'Classification' },
            { label: 'Recommended Jobs', value: 'JDCVCompatibilty' },
            { label: 'Relevant Candidate Finder', value: 'CVJDCompatibility' },
            { label: 'Skill Highlighter', value: 'skillHighlighter' },
            { label: 'Interview Q & A', value: 'createQuestionAnswer' },
            { label: 'Memories', value: 'memories' },
            { label: 'Buzz', value: 'buzz' },
            { label: 'Social Template Bank', value: 'linkedin' },
            { label: 'Emailers', value: 'mailer' },
            { label: 'User', value: 'users' },
            { label: 'Clan Score Master', value: 'clanScoreMaster' },
            { label: 'Chat Bot', value: 'chatbot' },
        ]
    }

    async getAllStatus() {
        return [
            { label: 'Approved', value: 'Approved' },
            { label: 'Pending', value: 'Pending' },
            { label: 'Rejected', value: 'Rejected' },
            { label: 'Expired', value: 'Expired' },
        ]
    }
}

export const {
    getAllShiftTimings,
    getAllDepartments,
    getAllGeographies,
    getAllUserEmails,
    getAllModuleNames,
    getAllStatus,
} = new SmartTabeActions()
