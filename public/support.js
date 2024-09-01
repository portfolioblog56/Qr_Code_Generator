// Theme toggle functionality
const themeToggleBtn = document.getElementById("themeToggle");
const html = document.documentElement;

themeToggleBtn.addEventListener("click", function () {
  html.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    html.classList.contains("dark") ? "dark" : "light"
  );
});

// Check for saved theme preference or prefer-color-scheme
if (
  localStorage.getItem("theme") === "dark" ||
  (!localStorage.getItem("theme") &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  html.classList.add("dark");
} else {
  html.classList.remove("dark");
}

function showInputFields() {
  const dataType = document.getElementById("dataType").value;
  document.getElementById("inptGroup1").style.display =
    dataType === "custom" ? "block" : "none";
  document.getElementById("inptGroup2").style.display =
    dataType === "url" ? "block" : "none"; 
  document.getElementById("inptGroup3").style.display =
    dataType === "Vcard" ? "block" : "none";
}

document.getElementById("qrForm").addEventListener("submit", function (e) {
  e.preventDefault();
  generateQRCode();
});

function generateQRCode() {
  const dataType = document.getElementById("dataType").value;
  let apiUrl;
  let name;
  let data;

  if (dataType === "custom") {
    data = document.getElementById("data").value;
    if (!data) {
      alert("Please enter your data");
      return;
    }
    apiUrl = `/api/qrgen?data=${encodeURIComponent(data)}`;
  } else if (dataType === "url") {
    const urldata = document.getElementById("url").value;
    if (!urldata) {
      alert("Please enter a URL");
      return;
    }
    data = urldata;
    apiUrl = `/api/qrgen?url=${encodeURIComponent(urldata)}`;
  } else if (dataType === "Vcard") {
    const cardName = document.getElementById("name").value;
    const cardphoneNum = document.getElementById("phoneNum").value;
    const cardAddress = document.getElementById("address").value;
    const cardOrg = document.getElementById("org").value;
    
    if (!cardName || !cardphoneNum || !cardAddress || !cardOrg) {
      alert("Please fill in all Vcard fields");
      return;
    }
    
    name = cardName;
    data = `Name: ${cardName}, Phone: ${cardphoneNum}, Address: ${cardAddress}, Org: ${cardOrg}`;
    apiUrl = `/api/qrgen?name=${encodeURIComponent(cardName)}&phoneNum=${encodeURIComponent(cardphoneNum)}&address=${encodeURIComponent(cardAddress)}&org=${encodeURIComponent(cardOrg)}`;
  } else {
    alert("Please select a data type");
    return;
  }

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then((blob) => {
      const qrCodeImg = document.getElementById("qrCode");
      qrCodeImg.src = URL.createObjectURL(blob);
      document.getElementById("printArea").style.display = "block";

      const showNameDiv = document.querySelector(".show-name");
      showNameDiv.textContent = `Data: ${data}`;

      const downloadBtn = document.getElementById("downloadQRBtn");
      downloadBtn.href = URL.createObjectURL(blob);
      downloadBtn.download = "qrcode.png";
      downloadBtn.style.display = "block";

      const shareBtn = document.getElementById("shareQRBtn");
      shareBtn.style.display = "block";
      shareBtn.onclick = function () {
        const shareData = {
          title: "QR Code",
          text: `Scan this QR code for ${name || data}`,
          url: window.location.origin + apiUrl,
        };

        if (navigator.share) {
          navigator.share(shareData)
            .catch((error) => console.error("Error sharing:", error));
        } else {
          alert("Sharing is not supported in this browser.");
        }
      };

      document.getElementById("printQRBtn").style.display = "block";
    })
    .catch((error) => {
      console.error("Error generating QR code:", error);
      alert("Error generating QR code. Please try again.");
    });
}

function printQRCode() {
  window.print();
}

document
  .querySelector('[data-collapse-toggle="navbar-cta"]')
  .addEventListener("click", function () {
    const navbar = document.getElementById("navbar-cta");
    navbar.classList.toggle("hidden");
  });