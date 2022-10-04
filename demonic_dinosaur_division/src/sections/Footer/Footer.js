import footerHtml from './Footer.html';
import './Footer.scss';
// libraries
import animateScrollTo from 'animated-scroll-to';

const FooterSection = (container) => {
    container.innerHTML += footerHtml;

    window.addEventListener('DOMContentLoaded', () => {
        /* show FAQ list */
        const footerAccordion = document.querySelector('.footerAccordion');
        const footerAccordionWrapper = document.querySelector('.footerAccordion__wrapper');
        const footerAccordionBtn = document.querySelector('.footer__copyright-button');

        // show the accordion menu
        footerAccordionBtn.addEventListener('click', (event) => {
            footerAccordionWrapper.style.height = `${footerAccordion.clientHeight}px`;

            // scroll down a bit so user will see that menu has been shown
            setTimeout(() => {
                animateScrollTo(event.pageY + 100, {
                    speed: 3000,
                });
            }, 300);
        });

        /* accordion functionality */
        // list of all items
        const footerAccordionItems = document.querySelectorAll('.footerAccordion__item');
        // first item
        const footerAccordionActiveItem = document.querySelector('.footerAccordion__item-active');

        const showActiveItem = (item) => {
            item.classList.add('footerAccordion__item-active');

            const titleHeight = item.querySelector('.footerAccordion__item-top').clientHeight;
            const textHeight = item.querySelector('.footerAccordion__item-textWrapper').clientHeight;

            item.style.height = `${titleHeight + textHeight}px`;
        };

        const hideItems = (item) => {
            item.classList.remove('footerAccordion__item-active');

            const titleHeight = item.querySelector('.footerAccordion__item-top').clientHeight;

            item.style.height = `${titleHeight}px`;
        };

        footerAccordionItems.forEach((item) => {
            // set height for the unactive items
            hideItems(item);

            // add onclick function to show the item
            item.addEventListener('click', () => {
                footerAccordionItems.forEach((itemsToHide) => {
                    hideItems(itemsToHide);
                });

                showActiveItem(item);
            });
        });

        // set height for the first item
        showActiveItem(footerAccordionActiveItem);
    });
};

export { FooterSection };
