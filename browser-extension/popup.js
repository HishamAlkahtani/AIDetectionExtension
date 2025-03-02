function toggleEnabled() {
  let enabled = document.getElementById("enable-checkbox").checked;

  document.getElementById("enabled").hidden = !enabled;
  document.getElementById("disabled").hidden = enabled;

  browser.storage.local.set({ extensionEnabled: enabled });
}

async function init() {
  const checkbox = document.getElementById("enable-checkbox");
    let enabled = (await browser.storage.local.get("extensionEnabled")).extensionEnabled;
    
    checkbox.checked = enabled;
  
    document.getElementById("enabled").hidden = !enabled;
    document.getElementById("disabled").hidden = enabled;

    checkbox.addEventListener("change", toggleEnabled);
}

init();