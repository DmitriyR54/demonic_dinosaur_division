import headerHtml from "./Header.html";
import "./Header.scss";
// libraries
import "hamburgers/_sass/hamburgers/hamburgers.scss";
import animateScrollTo from "animated-scroll-to";
import {
  connectWallet,
  disconnectWallet,
  InitiateConnection,
  provider,
  selectedAccount,
} from "./WalletConnector";
import { Alert } from "../../components/AlertPopUp/AlertPopUp";

const HeaderSection = (container) => {
  container.innerHTML += headerHtml;

  window.addEventListener("DOMContentLoaded", () => {
    const headerMenu = document.querySelector(".header__menu");
    const headerMenuBtn = headerMenu.querySelector(".header__menu-btn");
    const headerNav = headerMenu.querySelector(".header__nav");

    let menuActive = false;

    const toggleNav = () => {
      if (menuActive) {
        menuActive = false;
        document.body.classList.remove("no-scroll");
        headerMenuBtn.classList.remove("is-active");
        headerNav.classList.remove("nav-active");
      } else {
        menuActive = true;
        document.body.classList.add("no-scroll");
        headerMenuBtn.classList.add("is-active");
        headerNav.classList.add("nav-active");
      }
    };

    headerMenuBtn.addEventListener("click", toggleNav);

    /* animate moving to a section */
    const anchorsLinks = document.querySelectorAll(".header__nav-link-anchor");

    anchorsLinks.forEach((link) => {
      link.onclick = (event) => {
        event.preventDefault();

        let elOffset =
          document.querySelector(`.${link.getAttribute("href")}`).offsetTop -
          document.querySelector(".header").clientHeight;

        animateScrollTo(elOffset);

        // hide menu if opened
        if (menuActive) {
          menuActive = false;
          document.body.classList.remove("no-scroll");
          headerMenuBtn.classList.remove("is-active");
          headerNav.classList.remove("nav-active");
        }
      };
    });

    /* show user the information, which section is currently in their viewport */
    const sectionsList = document.querySelectorAll(".main > section");

    /* this is a wrapper for the text, that shows a user which section is currently in their viewport. only for small screens (<= 768px) */
    const activeSectionName = document.querySelector(
      ".header__menu-activeSessionInfo"
    );

    const highlightViewportSectionLink = () => {
      sectionsList.forEach((section, index) => {
        /* does not include the first section */
        if (index > 0) {
          /* coordinates of the section */
          const coord = section.getBoundingClientRect();

          const relevantLink = document.querySelector(
            `.header__nav-link-anchor[href=${section.className}]`
          );

          const addActiveSessionInfo = () => {
            relevantLink.classList.add("link-active");
            if (activeSectionName.innerText !== relevantLink.innerText) {
              activeSectionName.style.opacity = "0";
              setTimeout(() => {
                activeSectionName.innerText = relevantLink.innerText;
                activeSectionName.style.opacity = "1";
              }, 300);
            }
          };

          const removeActiveSessionInfo = () => {
            relevantLink.classList.remove("link-active");
          };

          if (coord.top < window.innerHeight / 2 && coord.top > 0) {
            addActiveSessionInfo();
          } else if (coord.top > window.innerHeight / 2) {
            removeActiveSessionInfo();
          } else if (coord.bottom > window.innerHeight / 2) {
            addActiveSessionInfo();
          } else if (
            coord.bottom < window.innerHeight / 2 &&
            coord.bottom > 0
          ) {
            removeActiveSessionInfo();
          }
        }
      });
    };

    highlightViewportSectionLink();
    window.addEventListener("scroll", highlightViewportSectionLink);

    /* remove current section info for the 'intro' section */
    window.addEventListener("scroll", () => {
      if (window.scrollY < window.innerHeight / 2) {
        activeSectionName.style.opacity = "0";
        setTimeout(() => {
          activeSectionName.innerText = "";
          activeSectionName.style.opacity = "1";
        }, 300);
      }
    });

    // Web3 Wallet Connection
    InitiateConnection();

    document.querySelector("#wallet-info").addEventListener("click", () => {
      disconnectWallet();
      if (menuActive) toggleNav();
    });
    document.querySelector("#connect-wallet").addEventListener("click", () => {
      connectWallet();
      if (menuActive) toggleNav();
    });
    
  });
  
};

export { HeaderSection };
