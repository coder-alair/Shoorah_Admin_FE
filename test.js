====> Admin can change the profile status of expert to invite approve and decline,
These are the required status ( profileAction ) and there code:-
EXPERT_PROFILE_STATUS:{
  APPROVED: 1,
  REJECTED: 2,
  INVITED: 3,
},
Note:-  IF Admin rejected a expert profile, So rejetReason will be required. 

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjQwZWVlZmE2MjNjNzg0Nzg3NjNkNyIsImlhdCI6MTcyNzQzMDIyOSwiZXhwIjoxNzMwMDIyMjI5fQ._tI_GPklc-ptMaILzci0HZaVTv5siMzKnv9TxGPSVk6FFh4XgwtAfHOFw-xSnGK3F61vbNGdGfYs35hZKJ9VEw");

const raw = JSON.stringify({
"expertId": "66fb95a39c7dcd3e44009432",
"profileAction": 3,
"rejectReason": "test"
});

const requestOptions = {
method: "POST",
headers: myHeaders,
body: raw,
redirect: "follow"
};

fetch("http://192.168.29.209:3003/admin/v1/expert-profile-action", requestOptions)
.then((response) => response.text())
.then((result) => console.log(result))
.catch((error) => console.error(error));



===> IN this API we will get list of expert that completed the three step form and they are under review.

const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjQwZWVlZmE2MjNjNzg0Nzg3NjNkNyIsImlhdCI6MTcyNzM1NDM4NywiZXhwIjoxNzI5OTQ2Mzg3fQ.kI6HLqFETnkb9xrfHMinsylkXOK9NFYx5hvzpr37HxrY1I4uAjJ6eXQwySUpUBuI6r6ozFh9JeLwYO56ZEdARw");

const requestOptions = {
method: "GET",
headers: myHeaders,
redirect: "follow"
};

fetch("http://192.168.29.209:3003/admin/v1/get-expert-status-list?page=1&perPage=50", requestOptions)
.then((response) => response.text())
.then((result) => console.log(result))
.catch((error) => console.error(error));


==> Response above API:- 
{
  "data": [
      {
          "_id": "66fa2b544ab5746774570ca1",
          "profile_status": 3,
          "userDetails": {
              "name": "demo45",
              "email": "demo45@yopmail.com",
              "createdAt": "2024-09-30T04:36:25.953Z"
          },
          "scheduleDetails": {
              "schedual_date": "2024-10-02T00:00:00.000Z",
              "time_slot": "9:30am"
          }
      }
  ],
  "meta": {
      "code": "fetchExpertStatusList",
      "message": 1,
      "page": "1",
      "perPage": 30,
      "totalCount": 4
  }
}


==> This below API is to get the information of expert :-
Note:- IN this API we have to pass expertId in the query to get particular Expert details.


const myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjQwZWVlZmE2MjNjNzg0Nzg3NjNkNyIsImlhdCI6MTcyNzQzMDIyOSwiZXhwIjoxNzMwMDIyMjI5fQ._tI_GPklc-ptMaILzci0HZaVTv5siMzKnv9TxGPSVk6FFh4XgwtAfHOFw-xSnGK3F61vbNGdGfYs35hZKJ9VEw");

const requestOptions = {
method: "GET",
headers: myHeaders,
redirect: "follow"
};

fetch("http://192.168.29.209:3003/admin/v1/get-expert-account-info?expertId=66fb95a39c7dcd3e44009432", requestOptions)
.then((response) => response.text())
.then((result) => console.log(result))
.catch((error) => console.error(error));

==> Response above API:-

{
  "data": {
      "_id": "66fb95a39c7dcd3e44009432",
      "user_id": {
          "_id": "66fb93bf2fa8557d481b8dc7",
          "company_id": null,
          "name": "paresh",
          "email": "soft.devvv@gmail.com",
          "user_type": 6,
          "user_profile": null,
          "account_type": 1,
          "login_platform": 0,
          "status": 1,
          "social_id": null,
          "dob": "test",
          "country": "india",
          "gender": [
              0
          ],
          "last_login": "2024-10-01T06:24:25.465Z",
          "isVerified": true,
          "deletedAt": null,
          "job_role": "fvz",
          "on_board_step": 1,
          "is_under_trial": false,
          "trial_starts_from": null,
          "trial_ends_at": null,
          "country_code": null,
          "mobile": null,
          "user_added_by": null,
          "ethnicity": "ethinicity",
          "commission": null,
          "klaviyo_id": null,
          "report_sent": null,
          "is_audio_feedback_disabled": false,
          "createdAt": "2024-10-01T06:16:31.255Z",
          "updatedAt": "2024-10-01T07:26:24.326Z",
          "__v": 0,
          "address": "test",
          "first_name": "jhon3",
          "last_name": "doe3",
          "id": "66fb93bf2fa8557d481b8dc7"
      },
      "title": "Mr",
      "status": false,
      "reject_reason": null,
      "linkedln_url": "linkedlnUrl",
      "location": "surat",
      "focus_ids": [],
      "dbs_check": false,
      "identity": false,
      "insurance": [],
      "certification": [],
      "spoken_languages": [],
      "industry_experience": [
          "Healthcare"
      ],
      "professional_Sector": [],
      "__v": 0,
      "applicant_id": "fa6a4482-340d-4644-bdbe-929779a4429b",
      "current_job_titile": "Chief Surgeon",
      "highest_certification": "Board Certified",
      "language": "English",
      "location_of_practice": "New York, USA",
      "medical_no": "MED123456",
      "place_of_education": "Harvard Medical School",
      "price_per_hour": "150",
      "qualification": "MBBS, MD",
      "specialities": "Cardiology",
      "year_of_experience": "15",
      "workflow_run_id": "850ec9a4-bd1d-4620-9e9f-d15b29603a8d",
      "bio": "test",
      "profile_status": 0,
      "reason_to_join": "test1"
  },
  "meta": {
      "code": "fetchExpertAccountInfo",
      "message": 1
  }
}