function updateNavbar() {
    const navMenu = document.getElementById("nav-menu");
    const token = localStorage.getItem("access_token");
  
    if (token) {
      navMenu.innerHTML = `
        <button class="btn btn-light btn-sm" onclick="logout()">
          <i class="bi bi-box-arrow-right me-1"></i>Logout
        </button>
      `;
    } else {
      navMenu.innerHTML = `
        <a href="#login" class="btn btn-light btn-sm">
          <i class="bi bi-box-arrow-in-right me-1"></i>Login
        </a>
      `;
    }
  }