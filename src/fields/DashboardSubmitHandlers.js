import { domainIdentifier, generateJd, interviewQAndA, recommendedJobs, recruiterOutreach, recruiterSocial, relevantCandidateFinder, searchStringGenerator, setAccuracy, setIsRecruiterSocial, skillHighlighter } from '../../../reduxSlices/essSlice'
import store from '../../../redux/store'


class EssSubmitHandlers {
  constructor(dispatch) {
    this.dispatch = dispatch
  }

  handleJDGenerateSubmission = async (data, e) => {
    try {
      e.preventDefault()
      store.dispatch(generateJd(data))
    } catch (error) {
      throw new Error(error)
    }
  }
  handleRecruiterSocialSubmission = async (data, e) => {
    try {
      e.preventDefault()
      store.dispatch(recruiterSocial(data))
      store.dispatch(setIsRecruiterSocial(true))

    } catch (error) {
      throw new Error(error)
    }
  }
  handleSearchQueryGeneratorSubmission = async (data, e) => {
    try {
      e.preventDefault()
      store.dispatch(searchStringGenerator(data))
    } catch (error) {
      throw new Error(error)
    }
  }
  handleRecruiterOutreachSubmission = async (data, e) => {
    try {
      e.preventDefault()
      store.dispatch(recruiterOutreach(data))
    } catch (error) {
      throw new Error(error)
    }
  }

  handleDomainIdentifiersSubmission = async (data, e) => {
    try {
      e.preventDefault()
      store.dispatch(domainIdentifier(data))
    } catch (error) {
      throw new Error(error)
    }
  }
  handleSkillHighlighterSubmission = async (data, e) => {
    try {
      e.preventDefault()
      store.dispatch(setKeywords(data.formData.skills.split()))
      store.dispatch(skillHighlighter(data))
    } catch (error) {
      throw new Error(error)
    }
  }
  handleInterviewQAndASubmission = async (data, e) => {
    try {
      e.preventDefault()

      store.dispatch(interviewQAndA(data))
    } catch (error) {
      throw new Error(error)
    }
  }
  handleRecommendedJobsSubmission = async (data, e) => {
    try {
      e.preventDefault()
      store.dispatch(setAccuracy(data.formData.accuracyMatch ?? 0))

      
      store.dispatch(recommendedJobs(data))
    } catch (error) {
      throw new Error(error)
    }
  }
  handleRelavantCandidateFinderSubmission = async (data, e) => {
    try {
      e.preventDefault()
      store.dispatch(setAccuracy(data.formData.accuracyMatch ?? 0))

      
      store.dispatch(relevantCandidateFinder(data))

    } catch (error) {
      throw new Error(error)
    }
  }
}

export default new EssSubmitHandlers()
