import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import essService from '../services/ess.service'
import { aloisSolutions, aloisHealthcare } from '../assets/static/staticTextData'
import { setFeed } from './dashboardSlice'
import userService from '../services/user.service'
import userRegistrationService from '../services/userRegistration.service'
import { useDispatch } from 'react-redux'
import mailerService from '../services/mailer.service'
import minio from '../libs/minio'
import base64ArrayToFiles from '../utils/Base64ArrayToFiles'
import minioService from '../services/minio.service'
export const generateJd = createAsyncThunk('/ess/generateJd', async (data, { rejectWithValue }) => {
  try {
    const item = data.formData

    const processedData = {
      prompt: item.designation ?? '',
      geography: item.geography ?? '',
      mode: item.modeOfWork ?? '',
      location: item.location ?? '',
      limit: item.wordLimit ?? '',
      remark: item.remark ?? '',
      company: item.companyName ?? '',
    }

    const response = await essService.generateJd(processedData)
    return { response, processedData }
  } catch (error) {
    return rejectWithValue(`Error while getting latest buzz ${error.toString()}`)
  }
})
export const recruiterSocial = createAsyncThunk(
  '/ess/recruiterSocial',
  async (data, { rejectWithValue }) => {
    try {
      const item = data.formData
      let prompt =
        'Write a' +
        item.Intent +
        " detailed social media caption from a recruiter's perspective for the position of " +
        item.Designation +
        ' with ' +
        item.Experience +
        ' experience.'
      if (item.Remark) {
        prompt = prompt + item.Remark
      }
      prompt = prompt + ' for location ' + item.Location
      if (item['Company name']) {
        prompt = prompt + ' for a position at' + item['Company name']
      } else {
        prompt = prompt + ' for a position at ALOIS Solutions'
      }

      if (item.Email) {
        prompt = prompt + '  Also add cta email id to ' + item.Email
      } else {
        let user = JSON.parse(localStorage.getItem('user'))
        prompt = prompt + '  Also add cta email id to ' + user.email
      }
      prompt = prompt + 'also add 15 related hashtags'
      const processedData = {
        prompt: prompt ?? '',
        limit: item.Limit ?? '',
      }

      const response = await essService.recruiterSocial(processedData)
      return response
    } catch (error) {
      return rejectWithValue(`Error while getting recruiter social ${error.toString()}`)
    }
  },
)
export const searchStringGenerator = createAsyncThunk(
  '/ess/searchStringGenerator',
  async (data, { rejectWithValue }) => {
    try {
      const item = data.formData

      const processedData = {
        prompt: item.job_description ?? '',
      }

      const response = await essService.searchStringGenerator(processedData)
      return response
    } catch (error) {
      return rejectWithValue(`Error while getting recruiter social ${error.toString()}`)
    }
  },
)

export const recruiterOutreach = createAsyncThunk(
  '/ess/recruiterOutreach',
  async (data, { rejectWithValue }) => {
    try {
      const item = data.formData

      console.log(item)
      const processedData = {
        prompt: `${item.writeAn} ${item.contentType} ${item.purpose} ` ?? '',
        limit: item.wordLimit ?? '',
      }

      const response = await essService.recruiterOutreach(processedData)
      return response
    } catch (error) {
      return rejectWithValue(`Error while getting recruiter social ${error.toString()}`)
    }
  },
)
export const domainIdentifier = createAsyncThunk(
  '/ess/domainIdentifier',
  async (data, { rejectWithValue }) => {
    try {
      const item = data.formData

      const processedData = {
        jobDescription: `${item.job_description}` ?? '',
      }
      const response = await essService.domainIdentifier(processedData)
      return response
    } catch (error) {
      return rejectWithValue(`Error while getting recruiter social ${error.toString()}`)
    }
  },
)
function base64ToFile(base64Data, contentType, fileName) {
  const byteCharacters = atob(base64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  let file = new File([blob], fileName, { type: contentType })

  return file
}

export const skillHighlighter = createAsyncThunk(
  '/ess/skillHighlighter',
  async (data, { rejectWithValue }) => {
    try {
      const item = data.formData
      
      const etag = await minio.uploadBase64Files(item?.cv, "/skillHighlighter");

      const res = await minio.SearchFile(etag[0]?.etag?.etag);

      const response = await essService.skillHighlighter({data: res?.url})
      return response
    } catch (error) {
      return rejectWithValue(`Error while getting recruiter social ${error.toString()}`)
    }
  },
)
export const interviewQAndA = createAsyncThunk(
  '/ess/interviewQAndA',
  async (data, { rejectWithValue }) => {
    try {
      const item = data.formData
      let formData = new FormData()

      if (item.jd_file) {
        const fileObject = base64ArrayToFiles([item.jd_file])

        // Convert base64 to Blob
        data.formData.files = fileObject
      } else if (item.designation) {
        formData.append('designation', item.designation)
      }
      formData.append('difficulty', item.difficulty)
      formData.append('noOfQuestions', item.number_of_questions)
      if (item.remarks) {
        formData.append('remarks', item.remarks)
      }
      delete data.formData.jd_file
      const response = await essService.interviewQandA({ ...data.formData })
      return response
    } catch (error) {
      return rejectWithValue(`Error while getting recruiter social ${error.toString()}`)
    }
  },
)

export const recommendedJobs = createAsyncThunk(
  '/ess/recommendedJobs',
  async (data, { rejectWithValue }) => {
    try {
      const item = data.formData
      let formData = {};
      let jdUrl = [];

      if (item.jobDescriptions && item.jobDescriptions.length > 0) {
        const uploadedCVs = await minio.uploadBase64Files(item.jobDescriptions, '/jdcv-cvjd-compatibility/');
        const jdPromises = uploadedCVs.map(async (jdItem) => {
          const etag = jdItem.etag.etag;
          const response = await minio.SearchFile(etag);
          return response.url;
        });

        jdUrl = await Promise.all(jdPromises);
        formData['jd'] = jdUrl;
      }

      if (item.cv && item.cv.length > 0) {
        const uploadedCvs = await minio.uploadBase64Files(item.cv, '/jdcv-cvjd-compatibility/');
        if (uploadedCvs.length > 0) {
          const cvResponse = await minio.SearchFile(uploadedCvs[0].etag.etag);
          formData['resumes'] = cvResponse.url;
        } else {
          return rejectWithValue('No valid resumes found.');
        }
      } else {
        return rejectWithValue('No job resumes provided.');
      }

      formData['accuracy'] = item.accuracyMatch ?? 0.3;
      const response = await essService.recommendedJobs(formData)
      return response
    } catch (error) {
      return rejectWithValue(`Error while getting recommended jobs: ${error.toString()}`)
    }
  },
)
export const relevantCandidateFinder = createAsyncThunk(
  '/ess/relevantCandidateFinder',
  async (data, { rejectWithValue }) => {
    try {
      const { formData: item } = data;
      let formData = {};
      let cvUrl = [];

      if (item.cv && item.cv.length > 0) {
        const uploadedCVs = await minio.uploadBase64Files(item.cv, '/jdcv-cvjd-compatibility/');

        const cvPromises = uploadedCVs.map(async (cvItem) => {
          const etag = cvItem.etag.etag;
          const response = await minio.SearchFile(etag);
          return response.url;
        });

        cvUrl = await Promise.all(cvPromises);
        formData['resumes'] = cvUrl;
      }

      if (item.jobDescriptions && item.jobDescriptions.length > 0) {
        const uploadedJobDescriptions = await minio.uploadBase64Files(item.jobDescriptions, '/jdcv-cvjd-compatibility/');
        if (uploadedJobDescriptions.length > 0) {
          const jdResponse = await minio.SearchFile(uploadedJobDescriptions[0].etag.etag);
          formData['jd'] = jdResponse.url;
        } else {
          return rejectWithValue('No valid job descriptions found.');
        }
      } else {
        return rejectWithValue('No job descriptions provided.');
      }

      formData['accuracy'] = item.accuracyMatch ?? 0.3;

      const response = await essService.relavantCandidateFinder(formData);

      return response;
    } catch (error) {
      // Improved error handling
      console.error('Error in relevantCandidateFinder:', error);
      return rejectWithValue(`Error while getting recruiter social: ${error.message || error.toString()}`);
    }
  }
);

export const message = createAsyncThunk('/ess/message', async (data, { rejectWithValue }) => {
  try {
    const item = data.formData

    let formData = new FormData()

    if (item.cv.length) {
      for (let i = 0; i < item.cv.length; i++) {
        const base64Data = item.cv[i].split(',')[1]
        const contentType = item.cv[i].match(/data:(.*?);/)[1]

        // Convert base64 to Blob
        const blob = base64ToFile(base64Data, contentType, 'resume-' + (i + 1))

        formData.append('resumes', blob)
      }
    }

    const base64Data = item.jobDescriptions.split(',')[1]
    const contentType = item.jobDescriptions.match(/data:(.*?);/)[1]

    // Convert base64 to Blob
    const blob = base64ToFile(base64Data, contentType, 'jobdescription')
    formData.append('jds', blob)

    formData.append('accuracy', item.accuracyMatch ?? 0)

    const response = await essService.relavantCandidateFinder(formData)
    return response
  } catch (error) {
    return rejectWithValue(`Error while getting recruiter social ${error.toString()}`)
  }
})

export const singleUser = createAsyncThunk('/ess/singleUser', async (data, { rejectWithValue }) => {
  try {
    const { formData } = data
    const payload = { ...formData.info, ...formData.personalInfo, ...formData.employeeinfo }
    const res = userRegistrationService.createSingleUser(payload)
    return res
  } catch (error) {
    rejectWithValue(`Error while creating user ${error.toString()}`)
    throw new Error(error)
  }
})

export const updateUser = createAsyncThunk('/ess/updateUser', async (data, { rejectWithValue }) => {
  try {
    const { id, formData } = data
    const payload = { ...formData.info, ...formData.personalInfo, ...formData.employeeinfo }
    const res = await userRegistrationService.updateUser(id, payload);
    return res
  } catch (error) {
    rejectWithValue(`Error while creating user ${error.toString()}`)
    throw error
  }
})

export const bulkEmail = createAsyncThunk('/ess/bulkEmail', async (data, { rejectWithValue }) => {
  try {
    const res = await mailerService.createMailer({
      ...data,
      date: data?.date ? data?.date : new Date().toISOString(),
      mailType: 'Scheduled',
      time: data?.time ? data?.time : new Date().toTimeString(),
    })
    setFormdata({})
    return res
  } catch (error) {
    rejectWithValue(`Error while sending emails ${error.toString()}`)
  }
})

export const essSlice = createSlice({
  name: 'ess',
  initialState: {
    isLoading: false,
    submitted: false,
    generatedContent: '',
    skillsList: [],
    prediction: '',
    convertedHtml: '',
    occurences: {},
    keywords: [],
    similarity: [],
    isRecruiterSocial: false,
    designation: '',
    message: '',
    feed: {},
    departments: [],
    formData: {},
    socialImage: '',
  },
  reducers: {
    clearJD: (state, action) => {
      state.generatedContent = ''
      state.skillsList = []
      state.prediction = ''
      state.convertedHtml = ''
      state.occurences = {}
      state.keywords = []
      state.similarity = []
      state.accuracy = 0
      state.isRecruiterSocial = false
      state.designation = ''
      state.message = ''
      state.feed = {}
      state.isLoading = false
      state.submitted = false
      // state.formData = {}
    },
    setSubmitted: (state, action) => {
      state.submitted = action.payload
    },
    setKeywords: (state, action) => {
      state.keywords = action.payload
    },
    setSocialImage: (state, action) => {
      state.socialImage = action.payload
    },
    setFormdata: (state, action) => {
      state.formData = action.payload
    },
    setIsRecruiterSocial: (state, action) => {
      state.isRecruiterSocial = action.payload
    },
    setDesignation: (state, action) => {
      state.designation = action.payload
    },
    setAccuracy: (state, action) => {
      state.accuracy = action.payload
    },
    setDepartments: (state, action) => {
      state.departments = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateJd.pending, (state) => {
        state.generatedContent = ''
        state.isLoading = true
      })
      .addCase(generateJd.fulfilled, (state, action) => {
        state.isLoading = false

        state.generatedContent = ''
        let answer = action.payload.response.answer
        const userEmail = JSON.parse(localStorage.getItem('user')).email

        if (userEmail.includes('@aloissolutions.com') && !action.payload.processedData.company)
          answer += `\n \n${aloisSolutions}`
        if (userEmail.includes('@aloishealthcare.com') && !action.payload.processedData.company)
          answer += `\n \n${aloisHealthcare}`

        state.generatedContent = answer
      })
      .addCase(generateJd.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(recruiterSocial.pending, (state) => {
        state.generatedContent = ''
        state.isLoading = true
      })
      .addCase(recruiterSocial.fulfilled, (state, action) => {
        state.isLoading = false
        let answer = action.payload.answer
        const userEmail = JSON.parse(localStorage.getItem('user')).email
        if (userEmail.includes('@aloissolutions.com')) answer += `\n \n ${aloisSolutions}`
        if (userEmail.includes('@aloishealthcare.com')) answer += `\n \n ${aloisHealthcare}`

        state.generatedContent = answer
      })
      .addCase(recruiterSocial.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(searchStringGenerator.pending, (state) => {
        state.isLoading = true
      })
      .addCase(searchStringGenerator.fulfilled, (state, action) => {
        state.isLoading = false
        let answer = action.payload.value
        state.skillsList = answer
      })
      .addCase(searchStringGenerator.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(recruiterOutreach.pending, (state) => {
        state.generatedContent = ''
        state.isLoading = true
      })
      .addCase(recruiterOutreach.fulfilled, (state, action) => {
        state.isLoading = false
        state.generatedContent = ''
        let answer = action.payload.answer
        const userEmail = JSON.parse(localStorage.getItem('user')).email

        state.generatedContent = answer
      })
      .addCase(recruiterOutreach.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(domainIdentifier.pending, (state) => {
        state.isLoading = true
      })
      .addCase(domainIdentifier.fulfilled, (state, action) => {
        state.isLoading = false
        let answer = action.payload.value.prediction

        state.prediction = answer
      })
      .addCase(domainIdentifier.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(skillHighlighter.pending, (state) => {
        state.isLoading = true
      })
      .addCase(skillHighlighter.fulfilled, (state, action) => {
        state.isLoading = false
        let cleanedHtml = action.payload
        let occurences = {}
        let maxResults = 0

        const lightColorShades = [
          '#FBC531',
          '#9B59B6',
          '#FF6B6B',
          '#2ECC71',
          '#FFA801',
          '#00B894',
          '#FFC312',
          '#FF4D4D',
          '#8E44AD',
          '#FF9F43',
          '#54a0ff',
          '#CDDC39',
          '#FF85A1',
          '#FF3838',
          '#FFB8B8',
        ]

        // Split the keywords by comma and trim spaces
        const keywordList = state.keywords.map((keyword) => keyword.trim()) // Trim spaces from each keyword

        if (keywordList.length > 0) {
          keywordList.forEach((keyword, index) => {
            if (keyword.length > 0) {
              let color = lightColorShades[index % lightColorShades.length] // Get color based on index
              const regex = new RegExp(`\\b${keyword}\\b`, 'gi') // Use case-insensitive matching
              let matches = cleanedHtml.match(regex)

              if (matches) {
                maxResults += matches.length
                occurences[keyword] = matches.length
              } else {
                occurences[keyword] = 0
              }
              // Replace keyword occurrences with highlighted span
              cleanedHtml = cleanedHtml.replace(
                regex,
                `<span class="highlighted" style="background: ${color};">${keyword}</span>`,
              )
            }
          })
        }

        state.occurences = occurences
        state.convertedHtml = cleanedHtml
      })
      .addCase(skillHighlighter.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })

      .addCase(interviewQAndA.pending, (state) => {
        state.isLoading = true
      })
      .addCase(interviewQAndA.fulfilled, (state, action) => {
        state.isLoading = false
        let answer = action.payload.answer

        state.generatedContent = answer
      })
      .addCase(interviewQAndA.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(recommendedJobs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(recommendedJobs.fulfilled, (state, action) => {
        state.isLoading = false
        let answer = action.payload;

        if (!answer || Array.isArray(answer) && answer.length === 0) {
          state.similarity = [];
        } else {
          state.similarity = answer;
        }
      })
      .addCase(recommendedJobs.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(relevantCandidateFinder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(relevantCandidateFinder.fulfilled, (state, action) => {
        state.isLoading = false
        let answer = action.payload
        if (!answer || Array.isArray(answer) && answer.length === 0) {
          state.similarity = [];
        } else {
          state.similarity = answer;
        }
      })
      .addCase(relevantCandidateFinder.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(setFeed.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(setFeed.pending, (state) => {
        state.isLoading = true
      })
      .addCase(setFeed.fulfilled, (state, action) => {
        state.isLoading = false
        let answer = action.payload.data
        state.feed = answer
      })
      .addCase(singleUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(singleUser.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(singleUser.fulfilled, (state, action) => {
        state.isLoading = false
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = { message: action.payload }
      })
      .addCase(updateUser.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.formData = {
          info: {
            profilePic: action.payload?.profilePic ?? '',
            firstName: action.payload?.firstName ?? '',
            lastName: action.payload?.lastName ?? '',
            empId: action.payload?.empId ?? '',
            designation: action.payload?.designation ?? '',
          },
          personalInfo: {
            gender: action.payload?.gender ?? '',
            dateOfBirth: action.payload?.dateOfBirth
              ? new Date(action.payload?.dateOfBirth).toISOString().split('T')[0]
              : '',
            bloodGroup: action.payload?.bloodGroup ?? '',
            nationality: action.payload?.nationality ?? '',
            countryCode: action.payload?.countryCode ?? '',
            phoneNumber: action.payload?.phoneNumber ?? '',
            address: action.payload?.address ?? '',
            residence: action.payload?.residence ?? '',
          },
          employeeinfo: {
            email: action.payload?.email ?? '',
            dateOfJoining: action.payload?.dateOfJoining
              ? new Date(action.payload?.dateOfJoining).toISOString().split('T')[0]
              : '',
            department: action.payload?.department?.id ?? '',
            shift: action.payload?.shift?.id ?? '',
            shiftTiming: action.payload?.shiftTiming?.id ?? '',
            reportTo: action.payload?.reportTo ?? '',
          },
        };
      })
  },
})
export const {
  clearJD,
  setKeywords,
  setAccuracy,
  setDesignation,
  setIsRecruiterSocial,
  setDepartments,
  setFormdata,
  setSocialImage,
  setSubmitted,
} = essSlice.actions
export default essSlice.reducer
