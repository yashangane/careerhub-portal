// Sample Data: Jobs and Internships
const opportunities = [
  {
    id: 1,
    type: "internship",
    title: "Web Development Intern",
    company: "TechNova Solutions",
    location: "Pune (Hybrid)",
    stipend: "₹10,000 / month",
    duration: "3 Months",
    skills: "HTML, CSS, JavaScript, Git"
  },
  {
    id: 2,
    type: "job",
    title: "Junior Frontend Developer",
    company: "Apex Digital Systems",
    location: "Mumbai",
    stipend: "₹3.6 - ₹4.2 LPA",
    duration: "Full-Time",
    skills: "JavaScript, React Basics, Responsive UI"
  },
  {
    id: 3,
    type: "internship",
    title: "Database Management Intern",
    company: "DataCore Systems",
    location: "Remote",
    stipend: "₹8,000 / month",
    duration: "2 Months",
    skills: "SQL, MySQL, Normalization, Schema Design"
  },
  {
    id: 4,
    type: "job",
    title: "Technical Support Associate",
    company: "CloudNet Services",
    location: "Pune",
    stipend: "₹2.8 LPA",
    duration: "Full-Time",
    skills: "Networking, Linux Basics, Hardware troubleshooting"
  }
];

// --- AUTHENTICATION LOGIC ---
const regForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const showLoginBtn = document.getElementById("showLogin");
const showRegBtn = document.getElementById("showRegister");

// Toggle form views on index.html
if (showLoginBtn && showRegBtn) {
  showLoginBtn.addEventListener("click", () => {
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
  });

  showRegBtn.addEventListener("click", () => {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("registerBox").style.display = "block";
  });
}

// User Registration
if (regForm) {
  regForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const student = {
      name: document.getElementById("regName").value.trim(),
      email: document.getElementById("regEmail").value.trim().toLowerCase(),
      course: document.getElementById("regCourse").value,
      password: document.getElementById("regPassword").value
    };

    localStorage.setItem("user_" + student.email, JSON.stringify(student));
    alert("Registration successful! Please login with your credentials.");
    
    // Switch to login box
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
  });
}

// User Login
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;

    const storedUser = localStorage.getItem("user_" + email);

    if (!storedUser) {
      alert("No account found with this email. Please register first.");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.password === password) {
      localStorage.setItem("currentUser", JSON.stringify(userData));
      window.location.href = "dashboard.html";
    } else {
      alert("Incorrect password. Please try again.");
    }
  });
}

// --- DASHBOARD LOGIC ---
const dashboardContainer = document.getElementById("listingsContainer");
const logoutBtn = document.getElementById("logoutBtn");

if (dashboardContainer) {
  // Session Check
  const sessionUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!sessionUser) {
    alert("Access denied! Please login first.");
    window.location.href = "index.html";
  } else {
    document.getElementById("studentWelcome").textContent = `Welcome, ${sessionUser.name} (${sessionUser.course})`;
    document.getElementById("studentEmailInfo").textContent = `Logged in as: ${sessionUser.email}`;
    renderListings("all");
  }
}

// Render dynamic job/internship cards
function renderListings(filterType) {
  const container = document.getElementById("listingsContainer");
  if (!container) return;

  container.innerHTML = "";

  // Update active state on filter buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent.toLowerCase().includes(filterType) || (filterType === "all" && btn.textContent.includes("All"))) {
      btn.classList.add("active");
    }
  });

  const filtered = filterType === "all" 
    ? opportunities 
    : opportunities.filter(item => item.type === filterType);

  const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];

  filtered.forEach(item => {
    const isApplied = appliedJobs.includes(item.id);
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <span class="badge ${item.type}">${item.type.toUpperCase()}</span>
        <h3>${item.title}</h3>
        <p class="company">${item.company}</p>
        <div class="details">
          <p><strong>Location:</strong> ${item.location}</p>
          <p><strong>Package / Stipend:</strong> ${item.stipend}</p>
          <p><strong>Duration / Term:</strong> ${item.duration}</p>
          <p><strong>Required Skills:</strong> ${item.skills}</p>
        </div>
      </div>
      <button class="apply-btn ${isApplied ? 'applied' : ''}" 
              onclick="applyToJob(${item.id})" 
              ${isApplied ? 'disabled' : ''}>
        ${isApplied ? 'Applied ✓' : 'Apply Now'}
      </button>
    `;
    container.appendChild(card);
  });
}

// Handle Job Application Action
function applyToJob(jobId) {
  let appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];
  if (!appliedJobs.includes(jobId)) {
    appliedJobs.push(jobId);
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
    alert("Application submitted successfully to the employer!");
    renderListings("all");
  }
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
}