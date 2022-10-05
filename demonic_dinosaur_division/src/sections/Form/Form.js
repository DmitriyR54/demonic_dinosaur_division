import formHtml from './Form.html';
import './Form.scss';
// components
import { textTypingEffect } from 'Components/TextTypingEffect/textTypingEffect';
import { Alert } from '../../components/AlertPopUp/AlertPopUp';

const FormSection = (container) => {
    container.innerHTML += formHtml;

    window.addEventListener('DOMContentLoaded', () => {
        /* typewriter effect */
        const typewriterText = 'Sign up to receive updates from Demonic Dinosaur Division NFT.';
        const typewriterDestination = document.querySelector('.formSection__subtitle');

        textTypingEffect(typewriterText, typewriterDestination);

        // Newsletter Form Handling
        const newsletterForm = document.querySelector('.newsletter-form');
        newsletterForm.addEventListener('submit', handleFormSubmit);
    });
};

const handleFormSubmit = async (event) => {
    event.preventDefault();

    const nameInput = document.querySelector('.newsletter-form input[name="name"]');
    const emailInput = document.querySelector('.newsletter-form input[name="email"]');
    const submitButton = document.querySelector('.newsletter-form .form__submit');

    // You can write code for validating the input here
    let fullname = nameInput.value;
    let email = emailInput.value;

    // Disable submit button
    submitButton.disabled = true;

    // Send Post Request to API
    try {
        const res = await fetch(`${process.env.API_BASE_URL}/newsletter/subscribe`, {
            // credentials: 'include',
            body: JSON.stringify({
                email,
                fullname,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        const body = await res.json();
        if (!res.ok) {
            // console.log(body.message);
            Alert('error', body.message);
            return;
        }
        Alert('success', body.message);

        // Clear input
        nameInput.value = '';
        emailInput.value = '';
    } catch (error) {
        console.log(error);
        Alert('error', 'Something went wrong');
    } finally {
        // Enable submit button
        submitButton.disabled = false;
    }
};

export { FormSection };
