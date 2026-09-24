let selectedRole = "Admin";


/* ================= DEMO ACCOUNTS ================= */

const demoAccounts = [
    {
        name: "Admin User",
        email: "admin@ems.com",
        password: "admin123",
        role: "Admin"
    },
    {
        name: "HR Manager",
        email: "hr@ems.com",
        password: "hr123",
        role: "HR Manager"
    },
    {
        name: "Employee User",
        email: "employee@ems.com",
        password: "emp123",
        role: "Employee"
    }
];


/* ================= ROLE ================= */

function selectRole(role, button) {

    selectedRole = role;

    document.getElementById("loginRole").value = role;

    document.querySelectorAll(".role").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");
}


/* ================= AUTH SWITCH ================= */

function showSignup() {

    document.getElementById("loginCard").style.display = "none";
    document.getElementById("signupCard").style.display = "block";
}


function showLogin() {

    document.getElementById("signupCard").style.display = "none";
    document.getElementById("loginCard").style.display = "block";
}


/* ================= LOGIN ================= */

function login() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;

    const role =
        document.getElementById("loginRole").value;


    if (!email || !password) {
        alert("Please enter email and password.");
        return;
    }


    let account = demoAccounts.find(user =>
        user.email === email &&
        user.password === password &&
        user.role === role
    );


    const savedAccounts =
        JSON.parse(localStorage.getItem("emsAccounts")) || [];


    const savedAccount = savedAccounts.find(user =>
        user.email === email &&
        user.password === password &&
        user.role === role
    );


    if (!account) {
        account = savedAccount;
    }


    if (!account) {
        alert("Invalid email, password or role.");
        return;
    }


    localStorage.setItem(
        "emsCurrentUser",
        JSON.stringify(account)
    );


    openApplication(account);
}


/* ================= CREATE ACCOUNT ================= */

function createAccount() {

    const name =
        document.getElementById("signupName").value.trim();

    const email =
        document.getElementById("signupEmail").value.trim();

    const phone =
        document.getElementById("signupPhone").value.trim();

    const role =
        document.getElementById("signupRole").value;

    const password =
        document.getElementById("signupPassword").value;

    const confirm =
        document.getElementById("signupConfirm").value;


    if (!name || !email || !phone || !password || !confirm) {
        alert("Please fill all fields.");
        return;
    }


    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }


    const accounts =
        JSON.parse(localStorage.getItem("emsAccounts")) || [];


    const exists =
        demoAccounts.some(user => user.email === email) ||
        accounts.some(user => user.email === email);


    if (exists) {
        alert("An account with this email already exists.");
        return;
    }


    const newAccount = {
        name,
        email,
        phone,
        role,
        password
    };


    accounts.push(newAccount);


    localStorage.setItem(
        "emsAccounts",
        JSON.stringify(accounts)
    );


    alert("Account created successfully!");


    document.getElementById("loginEmail").value = email;


    selectedRole = role;
    document.getElementById("loginRole").value = role;


    document.querySelectorAll(".role").forEach(btn => {

        btn.classList.remove("active");

        if (btn.textContent.trim() === role) {
            btn.classList.add("active");
        }

    });


    showLogin();
}


/* ================= OPEN APPLICATION ================= */

function openApplication(user) {

    document.getElementById("authPage").style.display = "none";

    document.getElementById("application").style.display = "block";


    document.getElementById("topName").textContent =
        user.name;

    document.getElementById("sideName").textContent =
        user.name;

    document.getElementById("welcomeName").textContent =
        user.name.split(" ")[0];


    document.getElementById("topRole").textContent =
        user.role;

    document.getElementById("sideRole").textContent =
        user.role;


    const initial =
        user.name.charAt(0).toUpperCase();


    document.getElementById("topAvatar").textContent =
        initial;

    document.getElementById("sideAvatar").textContent =
        initial;


    applyRolePermissions(user.role);


    showPage(
        "dashboard",
        document.querySelector(".nav-link")
    );
}


/* ================= ROLE PERMISSIONS ================= */

function applyRolePermissions(role) {

    const links =
        document.querySelectorAll(".nav-link");


    links.forEach(link => {
        link.style.display = "flex";
    });


    if (role === "HR Manager") {

        // Payroll
        links[4].style.display = "none";

    }


    if (role === "Employee") {

        // Employees
        links[1].style.display = "none";

        // Payroll remains visible
        // Employee can view salary

    }
}


/* ================= PAGE NAVIGATION ================= */

function showPage(pageId, button) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });


    const page =
        document.getElementById(pageId);


    if (page) {
        page.classList.add("active");
    }


    document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.remove("active");
    });


    if (button) {
        button.classList.add("active");
    }


    const pageInfo = {

        dashboard: [
            "Dashboard",
            "Here's what's happening with your workforce today."
        ],

        employees: [
            "Employee Management",
            "Manage your organization's employees."
        ],

        attendance: [
            "Attendance",
            "Monitor daily employee attendance."
        ],

        leave: [
            "Leave Management",
            "Review and manage employee leave requests."
        ],

        payroll: [
            "Payroll",
            "Manage salary and payroll information."
        ],

        performance: [
            "Performance",
            "Track employee performance and productivity."
        ]

    };


    if (pageInfo[pageId]) {

        document.getElementById("pageTitle").textContent =
            pageInfo[pageId][0];

        document.getElementById("pageSub").textContent =
            pageInfo[pageId][1];
    }
}


/* ================= DATE ================= */

function setDate() {

    const date = new Date();

    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric"
    };

    document.getElementById("currentDate").textContent =
        date.toLocaleDateString("en-IN", options);
}


/* ================= EMPLOYEE MODAL ================= */

function openEmployeeModal() {

    document.getElementById("employeeModal").style.display =
        "flex";
}


function closeEmployeeModal() {

    document.getElementById("employeeModal").style.display =
        "none";
}


/* ================= ADD EMPLOYEE ================= */

function addEmployee() {

    const name =
        document.getElementById("newName").value.trim();

    const department =
        document.getElementById("newDepartment").value;

    const position =
        document.getElementById("newPosition").value.trim();


    if (!name || !position) {
        alert("Please enter employee details.");
        return;
    }


    const initials =
        name
        .split(" ")
        .map(word => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();


    const row =
        document.createElement("tr");


    row.innerHTML = `

        <td>
            <div class="employee-cell">

                <div class="person-avatar">
                    ${initials}
                </div>

                <div>
                    <strong>${name}</strong>
                    <small>
                        ${name.toLowerCase().replaceAll(" ", ".")}@company.com
                    </small>
                </div>

            </div>
        </td>

        <td>${department}</td>

        <td>${position}</td>

        <td>
            <span class="status active">
                Active
            </span>
        </td>

        <td>
            <button class="edit-btn">
                Edit
            </button>
        </td>
    `;


    document
        .querySelector("#employeeTable tbody")
        .appendChild(row);


    document.getElementById("newName").value = "";
    document.getElementById("newPosition").value = "";


    closeEmployeeModal();

    alert("Employee added successfully!");
}


/* ================= SEARCH ================= */

function searchEmployees() {

    const search =
        document.getElementById("employeeSearch")
        .value
        .toLowerCase();


    document
        .querySelectorAll("#employeeTable tbody tr")
        .forEach(row => {

            const text =
                row.innerText.toLowerCase();

            row.style.display =
                text.includes(search) ? "" : "none";

        });
}


/* ================= LOGOUT ================= */

function logout() {

    localStorage.removeItem("emsCurrentUser");

    document.getElementById("application").style.display =
        "none";

    document.getElementById("authPage").style.display =
        "grid";

    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";

    showLogin();
}


/* ================= LOAD ================= */

window.addEventListener("load", () => {

    setDate();


    const currentUser =
        JSON.parse(
            localStorage.getItem("emsCurrentUser")
        );


    if (currentUser) {
        openApplication(currentUser);
    }

});