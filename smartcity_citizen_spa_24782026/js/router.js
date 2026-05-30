const routes = {

    login: `
      <section class="row justify-content-center mt-5">
  
        <div class="col-12 col-md-6 col-lg-4 card shadow-sm border-0 p-4">
  
          <h3 class="text-center fw-bold mb-4 welcome-title">
            <i class="bi bi-person-circle me-2"></i>
            Login Warga
          </h3>
  
          <form id="login-form">
  
            <div class="mb-3">
              <label class="form-label">Username</label>
              <input type="text" id="loginUsername" class="form-control" required>
            </div>
  
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" id="loginPassword" class="form-control" required>
            </div>
  
            <button type="submit" class="btn btn-pink w-100 fw-bold">
              Login
            </button>
  
          </form>
  
        </div>
  
      </section>
    `,
  
    dashboard: `
      <section class="row g-4">
  
        <!-- MENU -->
        <aside class="col-12 col-lg-3">
  
          <div class="card p-3">
  
            <h5>
              <i class="bi bi-clipboard-data me-2"></i>
              Menu Laporan
            </h5>
  
            <button class="btn btn-pink w-100 mt-3">
              <i class="bi bi-plus-circle-fill me-2"></i>
              Buat Laporan Baru
            </button>
  
          </div>
  
        </aside>
  
        <!-- CONTENT -->
        <section class="col-12 col-lg-6">
  
          <div class="card p-4 text-center">
  
            <h3 class="fw-bold welcome-title">
              Selamat Datang, ${localStorage.getItem("username")}
            </h3>
  
            <p class="text-muted">
              Portal Citizen Tokyora City untuk mengakses layanan laporan warga.
            </p>
  
            <div class="alert alert-success">
              <i class="bi bi-check-circle-fill me-2"></i>
              Login berhasil dan token tersimpan.
            </div>
  
          </div>
  
        </section>
  
        <!-- INFO -->
        <aside class="col-12 col-lg-3">
  
          <div class="card p-3">
  
            <h5>
              <i class="bi bi-info-circle-fill me-2"></i>
              Informasi
            </h5>
  
            <p class="text-muted mb-0">
              Gunakan portal ini untuk membuat dan memantau laporan warga.
            </p>
  
          </div>
  
        </aside>
  
      </section>
    `
  };
  
  
  function handleRouting() {
  
    const app = document.getElementById("app-content");
  
    const hash = window.location.hash.replace("#", "") || "login";
  
    app.innerHTML = routes[hash] || routes.login;
  
    updateNavbar();
  
    if (hash === "login") {
      setupLoginForm();
    }
  
    if (hash === "dashboard") {
  
      const token = localStorage.getItem("access_token");
  
      if (!token) {
        window.location.hash = "#login";
      }
    }
  }
  
  window.addEventListener("hashchange", handleRouting);
  
  window.addEventListener("DOMContentLoaded", handleRouting);