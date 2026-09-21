const defaultAccounts = [
    { name: "Admin", email: "admin@ems.local", password: "admin123", role: "Admin" },
    { name: "HR Manager", email: "hr@ems.local", password: "hr123", role: "HR" }
];

const employeeManagers = ["Admin", "HR"];
const accountsKey = "emsAccounts";
const sessionKey = "emsSession";

let accounts = JSON.parse(localStorage.getItem(accountsKey) || "null") || defaultAccounts;
let currentUser = JSON.parse(localStorage.getItem(sessionKey) || "null");

function showPage(pageId) {
    if (!currentUser) return;
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active-page"));
    document.getElementById(pageId).classList.add("active-page");
    const titles = { dashboard: "Dashboard", employees: "Employees", attendance: "Attendance", leave: "Leave Management", payroll: "Payroll", performance: "Performance" };
    document.getElementById("pageTitle").innerText = titles[pageId];
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    const icon = document.querySelector(".icon-btn i");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
}

function openModal() {
    if (!employeeManagers.includes(currentUser?.role)) {
        alert("Only Admin and HR can add employees.");
        return;
    }
    document.getElementById("employeeModal").classList.add("show");
}

function closeModal() {
    document.getElementById("employeeModal").classList.remove("show");
    document.getElementById("employeeForm").reset();
}

function setAuthMessage(message, isError = true) {
    const authMessage = document.getElementById("authMessage");
    authMessage.textContent = message;
    authMessage.classList.toggle("error", isError);
}

function switchAuthMode() {
    const signInForm = document.getElementById("signInForm");
    const signUpForm = document.getElementById("signUpForm");
    const isSignIn = !signInForm.classList.contains("hidden");
    signInForm.classList.toggle("hidden", isSignIn);
    signUpForm.classList.toggle("hidden", !isSignIn);
    document.getElementById("authTitle").textContent = isSignIn ? "Create your account" : "Welcome back";
    document.getElementById("authSubtitle").textContent = isSignIn ? "Create an employee account for your organization." : "Sign in to manage your employee workspace.";
    document.getElementById("authSwitch").textContent = isSignIn ? "Already have an account? Sign in" : "Need an account? Sign up";
    setAuthMessage("");
}

function initials(name) {
    return name.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
}

function updateUserInterface() {
    const roleLabel = currentUser.role === "Admin" ? "Administrator" : currentUser.role;
    const userInitials = initials(currentUser.name);
    document.getElementById("sidebarAvatar").textContent = userInitials;
    document.getElementById("sidebarName").textContent = currentUser.name;
    document.getElementById("sidebarRole").textContent = roleLabel;
    document.getElementById("profileAvatar").textContent = userInitials;
    document.getElementById("profileName").textContent = currentUser.name;
    document.getElementById("profileRole").textContent = roleLabel;
    document.getElementById("topbarWelcome").textContent = `Welcome back, ${currentUser.name}`;
    document.getElementById("welcomeHeading").textContent = `Good Morning, ${currentUser.name}!`;
    const canManageEmployees = employeeManagers.includes(currentUser.role);
    document.querySelectorAll(".manage-employees, .employee-actions").forEach(element => element.classList.toggle("hidden", !canManageEmployees));
}

function signIn(event) {
    event.preventDefault();
    const email = document.getElementById("signInEmail").value.trim().toLowerCase();
    const password = document.getElementById("signInPassword").value;
    const account = accounts.find(item => item.email.toLowerCase() === email && item.password === password);
    if (!account) {
        setAuthMessage("The email or password is incorrect.");
        return;
    }
    currentUser = { name: account.name, email: account.email, role: account.role };
    localStorage.setItem(sessionKey, JSON.stringify(currentUser));
    enterApplication();
}

function signUp(event) {
    event.preventDefault();
    const name = document.getElementById("signUpName").value.trim();
    const email = document.getElementById("signUpEmail").value.trim().toLowerCase();
    const password = document.getElementById("signUpPassword").value;
    if (accounts.some(account => account.email.toLowerCase() === email)) {
        setAuthMessage("An account already exists for this email.");
        return;
    }
    const account = { name, email, password, role: "Employee" };
    accounts.push(account);
    localStorage.setItem(accountsKey, JSON.stringify(accounts));
    currentUser = { name, email, role: "Employee" };
    localStorage.setItem(sessionKey, JSON.stringify(currentUser));
    enterApplication();
}

function enterApplication() {
    document.getElementById("authScreen").classList.add("hidden");
    document.querySelector(".container").classList.remove("hidden");
    updateUserInterface();
}

function logOut() {
    currentUser = null;
    localStorage.removeItem(sessionKey);
    document.querySelector(".container").classList.add("hidden");
    document.getElementById("authScreen").classList.remove("hidden");
    document.getElementById("signInForm").reset();
    setAuthMessage("");
}

function addEmployee(event) {
    event.preventDefault();
    if (!employeeManagers.includes(currentUser?.role)) {
        alert("Only Admin and HR can add employees.");
        return;
    }
    const name = document.getElementById("employeeName").value.trim();
    const employeeId = document.getElementById("employeeId").value.trim();
    const department = document.getElementById("employeeDepartment").value;
    const position = document.getElementById("employeePosition").value.trim();
    const salary = document.getElementById("employeeSalary").value;
    const row = document.createElement("tr");
    row.innerHTML = `<td><div class="employee"><div class="employee-avatar">${initials(name)}</div><div><b>${name}</b><small>${employeeId}</small></div></div></td><td>${department}</td><td>${position}</td><td>₹${Number(salary).toLocaleString("en-IN")}</td><td><span class="status active">Active</span></td><td class="employee-actions"><button class="action-btn remove-employee" type="button">Remove</button></td>`;
    document.getElementById("employeeTableBody").appendChild(row);
    closeModal();
}

document.getElementById("signInForm").addEventListener("submit", signIn);
document.getElementById("signUpForm").addEventListener("submit", signUp);
document.getElementById("authSwitch").addEventListener("click", switchAuthMode);
document.getElementById("employeeForm").addEventListener("submit", addEmployee);
document.getElementById("logoutButton").addEventListener("click", logOut);
document.getElementById("employeeSearch").addEventListener("keyup", function() {
    const searchValue = this.value.toLowerCase();
    document.querySelectorAll("#employeeTable tbody tr").forEach(row => row.style.display = row.innerText.toLowerCase().includes(searchValue) ? "" : "none");
});
document.getElementById("employeeTableBody").addEventListener("click", function(event) {
    if (!event.target.classList.contains("remove-employee")) return;
    if (!employeeManagers.includes(currentUser?.role)) {
        alert("Only Admin and HR can remove employees.");
        return;
    }
    if (confirm("Remove this employee from the table?")) event.target.closest("tr").remove();
});
document.querySelector(".notification-btn").addEventListener("click", function() {
    alert("Notifications:\n\n• 3 leave requests pending\n• 2 employee birthdays this week\n• Payroll processing is pending");
});
window.addEventListener("click", function(event) {
    if (event.target === document.getElementById("employeeModal")) closeModal();
});

if (currentUser) enterApplication();
else document.querySelector(".container").classList.add("hidden");