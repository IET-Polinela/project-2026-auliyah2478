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

let currentTab = "my_reports";
let currentPage = 1;

let allReports = [];
let totalPages = 1;

let editingReportId = null;

async function loadDashboardData(
  tab = currentTab,
  page = currentPage
) {
  currentTab = tab;
  currentPage = page;

  const response = await requestAPI(
    `/report/?tab=${tab}&page=${page}`,
    "GET"
  );

  if (response && response.status === 200) {

    allReports = response.data.results || [];

    const totalCount =
      response.data.count || 0;

    totalPages =
      Math.ceil(totalCount / 10);

    renderList();
    renderPagination();
    loadSummaryStats();

  } else {

    const listContainer =
      document.getElementById("listContainer");

    if (listContainer) {
      listContainer.innerHTML = `
        <div class="col-12 text-center text-muted p-5">
          <i class="bi bi-exclamation-triangle fs-1"></i>
          <p>Gagal memuat data laporan.</p>
        </div>
      `;
    }

    const paginationContainer =
      document.getElementById("paginationContainer");

    if (paginationContainer) {
      paginationContainer.innerHTML = "";
    }
  }
}

async function loadSummaryStats() {

  const response = await requestAPI(
    "/report/?tab=my_reports&page_size=1000",
    "GET"
  );

  if (response && response.status === 200) {

    const reports = response.data.results || [];

    const draftCount =
      reports.filter(
        report => report.status === "DRAFT"
      ).length;

    const progressCount =
      reports.filter(
        report =>
          report.status === "VERIFIED" ||
          report.status === "IN_PROGRESS"
      ).length;

    const resolvedCount =
      reports.filter(
        report => report.status === "RESOLVED"
      ).length;

    document.getElementById("draftCount").textContent =
      draftCount;

    document.getElementById("progressCount").textContent =
      progressCount;

    document.getElementById("resolvedCount").textContent =
      resolvedCount;
  }
}

function renderList() {

  const listContainer =
    document.getElementById("listContainer");

  if (!listContainer) return;

  if (allReports.length === 0) {

    listContainer.innerHTML = `
      <div class="col-12 text-center text-muted p-5">
        <i class="bi bi-folder-x fs-1"></i>
        <p>Belum ada laporan.</p>
      </div>
    `;

    return;
  }

  listContainer.innerHTML = allReports.map(report => `

    <div class="col-12">

      <div class="card p-3">

        <h5>${report.title}</h5>

        <p class="text-muted mb-2">
          ${report.category}
        </p>

        <p>
          ${report.description}
        </p>

        <p class="small text-muted">
          📍 ${report.location}
        </p>

        ${currentTab === "feed"
          ? `
          <p class="small text-secondary">
            👤 ${report.reporter}
          </p>
          `
          : ""
        }

        <div class="mt-3">

          <div class="progress">

            <div
              class="progress-bar bg-primary"
              role="progressbar"
              style="width: ${
                report.status === "DRAFT"
                  ? "20%"
                  : report.status === "REPORTED"
                  ? "40%"
                  : report.status === "VERIFIED"
                  ? "60%"
                  : report.status === "IN_PROGRESS"
                  ? "80%"
                  : report.status === "RESOLVED"
                  ? "100%"
                  : "0%"
              }">

                ${report.status}

              </div>

            </div>

          </div>

          ${
            report.status === "DRAFT"
              ? `
              <div class="mt-2 text-end">

                <button
                  class="btn btn-warning btn-sm"
                  onclick="editDraft(${report.id})">

                  Edit Draft

                </button>

              </div>
              `
              : ""
          }

      </div>

    </div>

  `).join("");
}

function renderPagination() {

  const paginationContainer =
    document.getElementById("paginationContainer");

  if (!paginationContainer) return;

  let html = "";

  for (let i = 1; i <= totalPages; i++) {

    html += `
      <button
        class="btn btn-sm ${
          i === currentPage
            ? "btn-pink"
            : "btn-outline-secondary"
        } me-1"
        onclick="loadDashboardData('${currentTab}', ${i})">
        ${i}
      </button>
    `;
  }

  paginationContainer.innerHTML = html;
}

function getReportFormData() {

  return {
    title:
      document.getElementById("reportTitle").value,

    category:
      document.getElementById("reportCategory").value,

    location:
      document.getElementById("reportLocation").value,

    description:
      document.getElementById("reportDescription").value
  };
}

async function submitReport(status) {

  const reportData = getReportFormData();

  reportData.status = status;

  let response;

  if (editingReportId === null) {

    response = await requestAPI(
      "/report/",
      "POST",
      reportData
    );

  } else {

    response = await requestAPI(
      `/report/${editingReportId}/`,
      "PUT",
      reportData
    );
  }

  if (
    response.status === 201 ||
    response.status === 200
  ) {

    const modal =
      bootstrap.Modal.getInstance(
        document.getElementById("reportModal")
      );

    modal.hide();

    document
      .getElementById("reportForm")
      .reset();
    
    editingReportId = null;

    loadDashboardData();
  }
}

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const submitBtn =
      document.getElementById("submitReportBtn");

    if (submitBtn) {

      submitBtn.addEventListener(
        "click",
        () => submitReport("REPORTED")
      );
    }

    const draftBtn =
      document.getElementById("saveDraftBtn");

    if (draftBtn) {

      draftBtn.addEventListener(
        "click",
        () => submitReport("DRAFT")
      );
    }
  }
);

async function editDraft(id) {

  const report =
    allReports.find(
      report => report.id === id
    );

  if (!report) return;

  document.getElementById("reportTitle").value =
    report.title;

  document.getElementById("reportCategory").value =
    report.category;

  document.getElementById("reportLocation").value =
    report.location;

  document.getElementById("reportDescription").value =
    report.description;

  editingReportId = id;

  const modal = new bootstrap.Modal(
    document.getElementById("reportModal")
  );

  modal.show();
}