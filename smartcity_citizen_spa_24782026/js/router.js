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

        <!-- SIDEBAR -->
        <aside class="col-12 col-lg-3">

          <div class="card p-3">

            <h5>
              <i class="bi bi-clipboard-data me-2"></i>
              Tokyora City
            </h5>

            <button
              class="btn btn-pink w-100 mt-3"
              data-bs-toggle="modal"
              data-bs-target="#reportModal">

              <i class="bi bi-plus-circle-fill me-2"></i>
              Buat Laporan Baru

            </button>

            <hr>

            <h6>Rekap Status</h6>

            <p class="mb-1">
              Draft :
              <span id="draftCount">0</span>
            </p>

            <p class="mb-1">
              Diproses :
              <span id="progressCount">0</span>
            </p>

            <p class="mb-0">
              Selesai :
              <span id="resolvedCount">0</span>
            </p>

          </div>

        </aside>

        <!-- CONTENT -->
        <section class="col-12 col-lg-9">

          <div class="card p-3">

            <div class="d-flex gap-2 mb-3">

              <button
                class="btn btn-pink"
                onclick="loadDashboardData('my_reports', 1)">
                Laporan Saya
              </button>

              <button
                class="btn btn-outline-secondary"
                onclick="loadDashboardData('feed', 1)">
                Feed Kota
              </button>

            </div>

            <div
              id="listContainer"
              class="row g-3">
            </div>

            <div
              id="paginationContainer"
              class="mt-4">
            </div>

          </div>

        </section>

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
        return;
      }
  
      loadDashboardData();
    }
  }
  
  window.addEventListener("hashchange", handleRouting);

  window.addEventListener("DOMContentLoaded", handleRouting);