import AlertHtml from "./AlertPopUp.html";
import "./AlertPopUp.scss";

const iconArray = {
  successIcon: '☑︎',
  errorIcon: 'x',
  infoIcon: 'ℹ︎',
  warningIcon: '⚠︎'
};

const DEFAULT = 'default';

// type = 'success' | 'error' | 'info" | 'warning'
const Alert = (type = DEFAULT, message) => {
  const alertDiv = document.createElement("div");
  alertDiv.classList.add("alert", "alert--default");
  alertDiv.innerHTML = AlertHtml;
  document.body.append(alertDiv);

  // Add icon
  if (type !== DEFAULT) document.querySelector(`.alert .alert__icon`).innerText = iconArray[`${type}Icon`];

  document
    .querySelector(`.alert`)
    .classList.replace("alert--default", `alert--${type}`);
  document.querySelector(`.alert .alert__text`).innerHTML = message;

  // Show Alert
  document.querySelector(`.alert`).style.opacity = 1;

  // Remove the alert after 5secs
  const timeOut = setTimeout(() => {
    const topAlert = document.querySelector(".alert");
    document.querySelector(`.alert`).style.opacity = 0;
    topAlert.parentElement.removeChild(topAlert);
    clearTimeout(timeOut);
  }, 5000);

  // Listenere for closing the alert
  document
    .querySelector(`.alert .alert__close`)
    .addEventListener("click", () => {
      clearTimeout(timeOut);
      const topAlert = document.querySelector(".alert");
      topAlert.parentElement.removeChild(topAlert);
    });
};

export { Alert };
