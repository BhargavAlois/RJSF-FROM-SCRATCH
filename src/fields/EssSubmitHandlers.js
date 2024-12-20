import {
  bulkEmail,
  clearJD,
  domainIdentifier,
  generateJd,
  interviewQAndA,
  recommendedJobs,
  recruiterOutreach,
  recruiterSocial,
  relevantCandidateFinder,
  searchStringGenerator,
  setAccuracy,
  setIsRecruiterSocial,
  setSubmitted,
  singleUser,
  skillHighlighter,
  updateUser,
} from '../../../reduxSlices/essSlice'
import store from '../../../redux/store'
import { setKeywords } from '../../../reduxSlices/essSlice'
import commonService from '../../../services/common.service'
import { useDispatch, useSelector } from 'react-redux'
import { setToast } from '../../../reduxSlices/toastSlice'
import aloisFeedService from '../../../services/aloisFeed.service'
import base64ArrayToFiles from '../../../utils/Base64ArrayToFiles'
import userRegistrationService from '../../../services/userRegistration.service'
import { getFeed, setFeed, uploadBuzz } from '../../../reduxSlices/dashboardSlice'
import scheduledUsersService from '../../../services/scheduledUsers.service'
import minio from '../../../libs/minio'

class EssSubmitHandlers {
  constructor(dispatch) {
    this.dispatch = dispatch;
  }

  scrollToBottom = () => {
    setTimeout(() => {
      try {
        const generateBox = document.querySelector('.generate-box');
        if (generateBox) {
          generateBox.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });

          // Add visual feedback
          generateBox.style.transition = 'background-color 0.3s ease';
          generateBox.style.backgroundColor = '#f8f9fa';
          setTimeout(() => {
            generateBox.style.backgroundColor = '';
          }, 1000); // Increased time
        } else {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth',
          });
        }
      } catch (error) {
        console.warn('Scroll to bottom failed:', error);
        window.scrollTo(0, document.body.scrollHeight);
      }
    }, 100);
  };

  handleJDGenerateSubmission = async (data, e) => {
    try {
      e.preventDefault();
      store.dispatch(setSubmitted(true));
      await store.dispatch(generateJd(data));
      this.scrollToBottom();
    } catch (error) {
      console.error('JD Generation failed:', error);
      throw new Error(error);
    }
  };

  handleRecruiterSocialSubmission = async (data, e) => {
    try {
      e.preventDefault();
      store.dispatch(setIsRecruiterSocial(true));
      store.dispatch(setSubmitted(true));
      await store.dispatch(recruiterSocial(data));
      this.scrollToBottom();
    } catch (error) {
      console.error('Recruiter Social submission failed:', error);
      throw new Error(error);
    }
  };

  handleSearchQueryGeneratorSubmission = async (data, e) => {
    try {
      e.preventDefault();
      store.dispatch(setSubmitted(true));
      await store.dispatch(searchStringGenerator(data));
      this.scrollToBottom();
    } catch (error) {
      console.error('Search query generation failed:', error);
      throw new Error(error);
    }
  };

  handleRecruiterOutreachSubmission = async (data, e) => {
    try {
      e.preventDefault();
      store.dispatch(setSubmitted(true));
      await store.dispatch(recruiterOutreach(data));
      this.scrollToBottom();
    } catch (error) {
      console.error('Recruiter outreach failed:', error);
      throw new Error(error);
    }
  };

  handleDomainIdentifiersSubmission = async (data, e) => {
    try {
      e.preventDefault();
      store.dispatch(setSubmitted(true));
      await store.dispatch(domainIdentifier(data));
      this.scrollToBottom();
    } catch (error) {
      console.error('Domain identifier submission failed:', error);
      throw new Error(error);
    }
  };

  handleSkillHighlighterSubmission = async (data, e) => {
    try {
      e.preventDefault();
      store.dispatch(setSubmitted(true));
      const skills = data.formData.skills.split(',').map((skill) => skill.trim());
      store.dispatch(setKeywords(skills));
      await store.dispatch(skillHighlighter(data));
      this.scrollToBottom();
    } catch (error) {
      console.error('Skill highlighter submission failed:', error);
      throw new Error(error);
    }
  };

  handleInterviewQAndASubmission = async (data, e) => {
    try {
      e.preventDefault();
      store.dispatch(clearJD());
      store.dispatch(setSubmitted(true));
      await store.dispatch(interviewQAndA(data));
      this.scrollToBottom();
    } catch (error) {
      console.error('Interview Q&A submission failed:', error);
      throw new Error(error);
    }
  };

  handleRecommendedJobsSubmission = async (data, e) => {
    try {
      e.preventDefault();
      const accuracy = data.formData.accuracyMatch ?? 0;
      store.dispatch(setAccuracy(accuracy));
      store.dispatch(setSubmitted(true));
      await store.dispatch(recommendedJobs(data));
      this.scrollToBottom();
    } catch (error) {
      console.error('Recommended jobs submission failed:', error);
      throw new Error(error);
    }
  };

  handleRelavantCandidateFinderSubmission = async (data, e) => {
    try {
      e.preventDefault();
      const accuracy = data.formData.accuracyMatch ?? 0;
      store.dispatch(setSubmitted(true));
      store.dispatch(setAccuracy(accuracy));
      await store.dispatch(relevantCandidateFinder(data));
      this.scrollToBottom();
    } catch (error) {
      console.error('Relevant candidate finder submission failed:', error);
      throw new Error(error);
    }
  };

  handleSingleUserCreation = async (data, e) => {
    try {
      e.preventDefault();
      const { formData } = data;
      const payload = {
        ...formData.info,
        ...formData.personalInfo,
        ...formData.employeeinfo,
      };
      const res = await userRegistrationService.createSingleUser(payload);
      this.scrollToBottom();
      return res;
    } catch (error) {
      console.error('Single user creation failed:', error);
      throw error;
    }
  };

  handleUserUpdate = async (data, e) => {
    try {
      e.preventDefault();
      await store.dispatch(updateUser(data));
      this.scrollToBottom();
    } catch (error) {
      console.error('User update failed:', error);
      throw error;
    }
  };

  handleBulkEmail = async (data, e) => {
    try {
      e.preventDefault();
      await store.dispatch(bulkEmail(data));
      this.scrollToBottom();
    } catch (error) {
      console.error('Bulk email submission failed:', error);
      throw new Error(error);
    }
  };

  handleFeedback = async ({ formData }) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const email = user?.email;
      let updatedFormData = {
        ...formData,
        email,
        firstName: user?.firstName,
        lastName: user?.lastName,
      };
      if (formData.feedbackImage) {
        const minioResponse = await minio.uploadBase64Files(formData.feedbackImage, '/feedback_images/');
        const etag = minioResponse[0]?.etag;
        const UrlResponse = await minio.SearchFile(etag, import.meta.env.VITE_DEFAULT_BUCKET);
        updatedFormData.feedbackImage = UrlResponse.url;
      }

      await commonService.sendFeedback(updatedFormData);
      store.dispatch(
        setToast({
          visible: true,
          title: 'Thank You!',
          text: 'Feedback submitted successfully!',
          type: 'success',
        }),
      );
    } catch (error) {
      console.error('Error submitting feedback', error);
      store.dispatch(
        setToast({
          visible: true,
          title: 'Submission Failed',
          text: 'Failed to send Feedback. Please try again',
          type: 'danger',
        }),
      );
    }
  };

  handleBuzzUpload = async ({ formData }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const buzzDate = formData.buzzDate;
      const date = new Date(buzzDate);
      const options = { month: 'long', year: 'numeric' };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
      const finalDate = `${formattedDate.split(' ')[0]}'${date.getFullYear()}`;

      const thumbnail = formData.featureImage;
      const content = formData.buzzFile;
      const folderName = 'buzz';
      const buzzName = finalDate;

      let db_upload = {
        featureImage: null,
        path: content ? [] : null,
        month: formattedDate.split(' ')[0],
        year: date.getFullYear(),
        buzzName,
        buzzNo: formData.edition,
        user: user.id,
      }
      await minio
        .uploadBase64Files([thumbnail], folderName, true)
        .then(async (res) => {
          const etag = res[0]?.etag?.etag;
          const UrlResponse = await minio.SearchFile(etag);
          const feedbackImageUrl = UrlResponse.url;
          db_upload.featureImage = feedbackImageUrl
        })
      // const splitedPdfPages = await splitPdfToBase64Array(content, name[0]);

      for (let index = 0; index < content.length; index++) {
        await minio
          .uploadBase64Files([content[index]], folderName, true)
          .then(async (res) => {
            for (let index = 0; index < res.length; index++) {
              const etag = res[index].etag?.etag
              const UrlResponse = await minio.SearchFile(etag);
              const feedbackImageUrl = UrlResponse.url;
              db_upload.path.push(feedbackImageUrl)
            }
          })

      }




      const res = await store.dispatch(uploadBuzz(db_upload))
      // .then(()=>{dispatch(getLatestBuzz({page}))});
      return db_upload
    } catch (error) {
      // console.log('error in pdf', error);
      return error
    }
  }

  handleScheduleUserDelete = async (data) => {
    try {
      const res = await scheduledUsersService.createSchedule(data)
      return res
    } catch (error) {
      console.error('Error in buzz upload', error);
      throw error;
    }
  };
}

export default new EssSubmitHandlers();
