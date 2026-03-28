
let isSignup = false;

const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");
const confirmGroup = document.getElementById("confirmGroup");

toggleText.onclick = () => {
  isSignup = !isSignup;

  formTitle.textContent = isSignup ? "Sign Up" : "Login";
  toggleText.textContent = isSignup
    ? "Already have an account? Login"
    : "Don't have an account? Sign up";

  confirmGroup.style.display = isSignup ? "block" : "none";
};

function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

const statusBox = document.getElementById("statusMessage");

function showStatus(message, type) {
  statusBox.textContent = message;
  statusBox.className = `status ${type}`;
  statusBox.style.display = "block";
}

function clearStatus() {
  statusBox.style.display = "none";
  statusBox.textContent = "";
}

function handleSubmit() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  document.getElementById("emailError").textContent = "";
  document.getElementById("passwordError").textContent = "";
  document.getElementById("confirmError").textContent = "";
  clearStatus();

  let valid = true;

  if (!email.includes("@")) {
    document.getElementById("emailError").textContent = "Invalid email";
    valid = false;
  }

  if (!validatePassword(password)) {
    document.getElementById("passwordError").textContent =
      "Password must be 8+ chars, include uppercase, lowercase, and number";
    valid = false;
  }

  if (isSignup && password !== confirmPassword) {
    document.getElementById("confirmError").textContent = "Passwords do not match";
    valid = false;
  }

  if (valid) {
    showStatus(isSignup ? "Signup successful" : "Login successful", "success");

    if (!isSignup) { // login only
      setTimeout(() => {
        window.location.href = "index.html"; // redirect to index
      }, 500); // 0.5 seconds
    }
  } else {
    showStatus("Fix the errors above", "error");
  }
}