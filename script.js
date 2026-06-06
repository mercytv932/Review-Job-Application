const applicationForm = document.querySelector("#application-form");

const companyInput = document.querySelector("#company-input");
const positionInput = document.querySelector("#position-input");
const statusInput = document.querySelector("#status-input");
const addBtn = document.querySelector(".addBtn");
const searchInput = document.querySelector("#search-input");
const statusFilter = document.querySelector("#status-filter");

const applicationListContainer = document.querySelector("#application-list-container");

const statTotal = document.querySelector("#stat-total .stat-value");
const statReview = document.querySelector("#stat-review .stat-value");
const statInterview = document.querySelector("#stat-interview .stat-value");
const statOffer = document.querySelector("#stat-offer .stat-value");
const statRejected = document.querySelector("#stat-rejected .stat-value");

const applications = [];
let isEditing = false;
let editingIndex = null;

applicationForm.addEventListener("submit",(event)=>{
  event.preventDefault();
const company = companyInput.value;
const position = positionInput.value;
const status = statusInput.value;
const dateApplied = new Date().toLocaleDateString();

if(isEditing){
  applications[editingIndex].company = company;
  applications[editingIndex].position = position;
  applications[editingIndex].status = status;

  isEditing = false;
  editingIndex = null;
  addBtn.textContent = "Add";
}
else{

const job = {
  company,
  position,
  status,
  dateApplied
};
applications.push(job);
}


applyFilters();
updateDashBoard();
saveToLocalStorage();

  companyInput.value = "";
  positionInput.value = "";
  statusInput.value = "";
});


function renderApplications(applicationsToShow = applications){
  applicationListContainer.innerHTML = "";

  if(applicationsToShow.length===0){
    applicationListContainer.textContent = "No Applications Yet! please add one";
    return;
  }

  applicationsToShow.forEach((application)=>{
    const actualIndex = applications.indexOf(application);

    const cardDiv = document.createElement("div");

    const companyP = document.createElement("p");
    companyP.textContent = application.company;

    const positionP = document.createElement("p");
    positionP.textContent = application.position;

    const statusP = document.createElement("p");
    statusP.textContent = application.status;
    statusP.classList.add(application.status);

    const dateP = document.createElement("p");
    dateP.textContent = `Applied: ${application.dateApplied}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", ()=>{

      const isConfirmed = window.confirm("Are you sure?");

      if (isConfirmed){
       applications.splice(actualIndex, 1);

      applyFilters();
      updateDashBoard();
      saveToLocalStorage();
      }

    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click",()=>{
      
     companyInput.value = application.company;
     positionInput.value = application.position;
     statusInput.value = application.status;

     isEditing = true;
     editingIndex = actualIndex;

     addBtn.textContent = "Save";
    });

    cardDiv.appendChild(companyP);
    cardDiv.appendChild(positionP);
    cardDiv.appendChild(statusP);
    cardDiv.appendChild(dateP);
    cardDiv.appendChild(editBtn);
    cardDiv.appendChild(deleteBtn);

    applicationListContainer.appendChild(cardDiv);
  });
}

  searchInput.addEventListener("input", applyFilters);
  statusFilter.addEventListener("change", applyFilters);


function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedStatus = statusFilter.value;

  let filtered = applications.filter(application => {
    const matchesSearch =
      application.company.toLowerCase().includes(searchTerm) ||
      application.position.toLowerCase().includes(searchTerm);

    const matchesStatus =
      selectedStatus === "all" || application.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  renderApplications(filtered);
}


function updateDashBoard(){
  statTotal.textContent = applications.length;
  
  const reviewApplications = applications.filter(application =>{
    return application.status === "review";
  });
  statReview.textContent = reviewApplications.length;

  const interviewApplications = applications.filter(application=>{
    return application.status ==="interview";
  });
  statInterview.textContent = interviewApplications.length;

  const offerApplications = applications.filter(application =>{
    return application.status ==="offer";
  });
   statOffer.textContent = offerApplications.length;

  const rejectedApplications = applications.filter(application=>{
    return application.status ==="rejected";
  });
   statRejected.textContent = rejectedApplications.length;
}

function saveToLocalStorage(){
  localStorage.setItem('applications', JSON.stringify(applications));
}

function loadFromLocalStorage(){
  const storedApplicationsString = localStorage.getItem('applications');

  if(storedApplicationsString){
    try{
      const  parsedApplications = JSON.parse(storedApplicationsString);

      parsedApplications.forEach(application =>{
        applications.push(application);
      });

    }catch(error){
      console.error("Error parsing applications from localStorage", error);
    }
  }
  applyFilters();
  updateDashBoard();
}

loadFromLocalStorage();
