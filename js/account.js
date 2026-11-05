(() => {
  const auth = window.WanderlyAuth;
  const user = auth.activeUser();
  if (!user) {
    window.location.replace("login.html?next=account");
    return;
  }

  document.querySelector("#account-main").hidden = false;
  document.querySelector("#account-name").textContent = user.fullName;
  document.querySelector("#account-full-name").textContent = user.fullName;
  document.querySelector("#account-email").textContent = user.email;
  const created = new Date(user.createdAt);
  document.querySelector("#account-created").textContent = Number.isNaN(created.getTime()) ? "Demo account" : created.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  document.querySelector("#account-role").textContent = user.role === "admin" ? "Administrator · Demo" : "Traveler · Demo";
  document.querySelector("#account-admin-link").hidden = user.role !== "admin";
  document.querySelector("#account-initials").textContent = user.fullName.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  document.querySelector("#logout-button").addEventListener("click", () => {
    auth.clearSession();
    window.location.replace("index.html");
  });

  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();
})();
