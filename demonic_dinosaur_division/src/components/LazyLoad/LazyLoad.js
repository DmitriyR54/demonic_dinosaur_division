import './LazyLoad.scss';
// libraries
import { decode } from 'blurhash';

const LazyLoad = () => {
    document.addEventListener('DOMContentLoaded', () => {
        const lazyloadImages = document.querySelectorAll('.lazy-image');

        lazyloadImages.forEach((img) => {
            const blurHash = img.getAttribute('data-blur');

            if (blurHash) {
                // size of an image
                const width = img.parentNode.clientWidth;
                const height = img.parentNode.clientHeight;

                // get blur value
                const pixels = decode(blurHash, width, height);

                const canvas = document.createElement('canvas');
                // styling a blurred item
                canvas.width = width;
                canvas.height = height;
                canvas.style.position = 'absolute';
                canvas.style.bottom = '0';
                canvas.style.left = '0';
                canvas.style.zIndex = '1';
                
                // insert a blurred item to the page
                const ctx = canvas.getContext('2d');
                const imageData = ctx.createImageData(width, height);
                imageData.data.set(pixels);
                ctx.putImageData(imageData, 0, 0);
                img.parentNode.append(canvas);
            }
        });

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        const dataSrc = image.getAttribute('data-src');
                        import(/* webpackMode: "eager" */ `Src/images/lazyload/${dataSrc}`).then((src) => {
                            image.setAttribute('src', src.default);
                            image.addEventListener('load', () => {
                                image.parentNode.classList.add('image-loaded');
                            });
                        });
                        imageObserver.unobserve(image);
                    }
                });
            });

            lazyloadImages.forEach((image) => {
                imageObserver.observe(image);
            });
        } else {
            /* in case IntersectionObserver is not supported */
            let lazyloadThrottleTimeout;

            const lazyload = () => {
                if (lazyloadThrottleTimeout) {
                    clearTimeout(lazyloadThrottleTimeout);
                }

                lazyloadThrottleTimeout = setTimeout(() => {
                    let scrollTop = window.pageYOffset;

                    lazyloadImages.forEach((img) => {
                        if (img.offsetTop < window.innerHeight + scrollTop) {
                            const dataSrc = img.getAttribute('data-src');
                            import(/* webpackMode: "eager" */ `Src/images/lazyload/${dataSrc}`).then((src) => {
                                img.setAttribute('src', src.default);
                                img.parentNode.classList.add('image-loaded');
                            });
                        }
                    });

                    if (lazyloadImages.length == 0) {
                        document.removeEventListener('scroll', lazyload);
                        window.removeEventListener('resize', lazyload);
                        window.removeEventListener('orientationChange', lazyload);
                    }
                }, 20);
            };

            document.addEventListener('scroll', lazyload);
            window.addEventListener('resize', lazyload);
            window.addEventListener('orientationChange', lazyload);
        }
    });
};

export default LazyLoad;
