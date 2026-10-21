document.addEventListener("DOMContentLoaded", () => {
  const safeRead = (key) => { try { const value = JSON.parse(localStorage.getItem(key) || "[]"); return Array.isArray(value) ? value : []; } catch { return []; } };
  const saved = safeRead("techspaceSavedEvents");
  const notifications = safeRead("techSpaceNotifications");
  const savedCount = document.getElementById("dashboardSavedCount");
  const unreadCount = document.getElementById("dashboardUnreadCount");
  if (savedCount) savedCount.textContent = saved.length;
  if (unreadCount) unreadCount.textContent = notifications.length ? notifications.filter(item => !item.read).length : 3;
  const nameTarget = document.querySelector(".profile-info strong");
  try {
    const user = JSON.parse(localStorage.getItem("techSpaceUser") || "null");
    if (user && nameTarget) nameTarget.textContent = user.name || user.fullName || "Student";
  } catch (_) {}
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  if (menuToggle && sidebar && overlay) {
    const close = () => { sidebar.classList.remove("open"); overlay.classList.remove("visible"); };
    menuToggle.addEventListener("click", () => { sidebar.classList.toggle("open"); overlay.classList.toggle("visible"); });
    overlay.addEventListener("click", close);
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }
});
