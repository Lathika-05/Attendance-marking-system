let attendanceData = JSON.parse(localStorage.getItem("attendance")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];

/* ---------- Page Switch ---------- */

function showRegister() {
  document.getElementById("loginSection").classList.add("hidden");
  document.getElementById("registerSection").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("registerSection").classList.add("hidden");
  document.getElementById("loginSection").classList.remove("hidden");
}

/* ---------- Register ---------- */

function registerUser() {
  const name = document.getElementById("regName").value;
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const role = document.getElementById("regRole").value;

  if (!name || !username || !password) {
    alert("Fill all fields!");
    return;
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    alert("Username already exists!");
    return;
  }

  users.push({ name, username, password, role });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful!");
  showLogin();
}

/* ---------- Login ---------- */

function login() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const role = document.getElementById("loginRole").value;

  const user = users.find(
    u => u.username === username &&
         u.password === password &&
         u.role === role
  );

  if (!user) {
    alert("Invalid login!");
    return;
  }

  localStorage.setItem("currentUser", username);
  localStorage.setItem("currentRole", role);

  document.getElementById("loginSection").classList.add("hidden");

  if (role === "employee") {
    document.getElementById("employeeDashboard").classList.remove("hidden");
    renderEmployeeTable();
  } else {
    document.getElementById("managerDashboard").classList.remove("hidden");
    renderManagerTable();
  }
}

/* ---------- Logout ---------- */

function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("currentRole");
  location.reload();
}

/* ---------- Attendance ---------- */

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function getCurrentTime() {
  return new Date().toLocaleTimeString();
}

function checkIn() {
  const user = localStorage.getItem("currentUser");
  const date = getTodayDate();

  const record = attendanceData.find(
    r => r.user === user && r.date === date
  );

  if (record) {
    alert("Already checked in!");
    return;
  }

  attendanceData.push({
    user,
    date,
    checkIn: getCurrentTime(),
    checkOut: "-"
  });

  localStorage.setItem("attendance", JSON.stringify(attendanceData));
  renderEmployeeTable();
}

function checkOut() {
  const user = localStorage.getItem("currentUser");
  const date = getTodayDate();

  const record = attendanceData.find(
    r => r.user === user && r.date === date
  );

  if (!record) {
    alert("Check in first!");
    return;
  }

  record.checkOut = getCurrentTime();

  localStorage.setItem("attendance", JSON.stringify(attendanceData));
  renderEmployeeTable();
}

/* ---------- Tables ---------- */

function renderEmployeeTable() {
  const user = localStorage.getItem("currentUser");
  const tbody = document.querySelector("#employeeTable tbody");
  tbody.innerHTML = "";

  attendanceData
    .filter(r => r.user === user)
    .forEach(r => {
      tbody.innerHTML += `
        <tr>
          <td>${r.date}</td>
          <td>${r.checkIn}</td>
          <td>${r.checkOut}</td>
        </tr>
      `;
    });
}

function renderManagerTable() {
  const tbody = document.querySelector("#managerTable tbody");
  tbody.innerHTML = "";

  attendanceData.forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r.user}</td>
        <td>${r.date}</td>
        <td>${r.checkIn}</td>
        <td>${r.checkOut}</td>
      </tr>
    `;
  });
}
