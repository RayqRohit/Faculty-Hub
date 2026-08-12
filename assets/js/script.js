document.addEventListener('DOMContentLoaded', () => {
    const facultyCards = document.querySelectorAll('.faculties-directory-card');
    facultyCards.forEach(card => {
        card.addEventListener('click', () => {
            facultyCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // Faculty Item Active State
    const facultyItems = document.querySelectorAll('.faculties-directory-faculty-item');
    facultyItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent jump to top from href="#"
            facultyItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // FAQ Logic
    const detailsElements = document.querySelectorAll('.faculties-directory-details');
    detailsElements.forEach((detail) => {
        const summary = detail.querySelector('.faculties-directory-summary');
        summary.addEventListener('click', (e) => {
            e.preventDefault();
            if (detail.hasAttribute('open')) {
                detail.classList.add('closing');
                setTimeout(() => {
                    detail.removeAttribute('open');
                    detail.classList.remove('closing');
                }, 300);
            } else {
                detailsElements.forEach((otherDetail) => {
                    if (otherDetail !== detail && otherDetail.hasAttribute('open')) {
                        otherDetail.classList.add('closing');
                        setTimeout(() => {
                            otherDetail.removeAttribute('open');
                            otherDetail.classList.remove('closing');
                        }, 300);
                    }
                });
                detail.setAttribute('open', '');
            }
        });
    });

    const viewMoreBtn = document.getElementById('faq-view-more-btn');
    const hiddenFaqs = document.querySelectorAll('.faq-hidden-item');
    if (viewMoreBtn) {
        viewMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let isHidden = false;
            hiddenFaqs.forEach((faq) => {
                if (faq.classList.contains('d-none')) {
                    faq.classList.remove('d-none');
                    isHidden = true;
                } else {
                    faq.classList.add('d-none');
                    faq.removeAttribute('open');
                }
            });
            if (isHidden) {
                viewMoreBtn.innerHTML = 'View less &uarr;';
            } else {
                viewMoreBtn.innerHTML = 'View more &darr;';
            }
        });
    }


    // Faculties Grid Mobile Slick Slider
    let slickInitialized = false;

    function initSlick() {
        if (window.innerWidth <= 767 && !slickInitialized) {
            $('.faculties-directory-pagination').empty(); // Clear any hardcoded dummy dots first
            $('.faculties-directory-all-faculties-grid').slick({
                dots: true,
                arrows: false,
                infinite: false,
                speed: 300,
                slidesToShow: 1,
                slidesToScroll: 1,
                rows: 5,
                appendDots: $('.faculties-directory-pagination'),
                customPaging: function (slider, i) {
                    // Custom dots to match the design (d-block and height are needed to make them visible)
                    return '<span class="faculties-directory-dot d-block" style="height: 8px;"></span>';
                }
            });

            // Style the custom dots initially and on change
            function styleDots() {
                $('.faculties-directory-pagination li').each(function () {
                    const dot = $(this).find('.faculties-directory-dot');
                    if ($(this).hasClass('slick-active')) {
                        dot.addClass('active rounded-pill').removeClass('rounded-circle bg-secondary opacity-25');
                        dot.css({ 'width': '24px', 'background-color': '#ffcc00' });
                    } else {
                        dot.removeClass('active rounded-pill').addClass('rounded-circle bg-secondary opacity-25');
                        dot.css({ 'width': '8px', 'background-color': '' });
                    }
                });
            }

            $('.faculties-directory-all-faculties-grid').on('setPosition afterChange', function () {
                styleDots();
            });

            styleDots(); // Initial style
            slickInitialized = true;
        } else if (window.innerWidth > 767 && slickInitialized) {
            $('.faculties-directory-all-faculties-grid').slick('unslick');
            $('.faculties-directory-pagination').empty();
            slickInitialized = false;
        }
    }

    initSlick();
    $(window).on('resize', initSlick);

    // Custom Pagination for Profiles Grid
    function initCustomPagination() {
        const cardsPerPage = 8;
        const cards = $('.faculties-directory-profile-card');
        const totalPages = Math.ceil(cards.length / cardsPerPage);
        const paginationContainer = $('.faculties-directory-profile-pagination');

        // Helper to create buttons and apply common styles
        function createBtn(htmlContent, isPill, isDisabled, onClick) {
            const btn = $('<button></button>').html(htmlContent);
            btn.css({
                'width': isPill ? '54px' : '44px',
                'height': isPill ? '35px' : '44px',
                'border-radius': isPill ? '25px' : '50%',
                'margin': '0 8px',
                'transition': 'all 0.2s ease',
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'border': 'none',
                'cursor': isDisabled ? 'default' : 'pointer',
                'opacity': isDisabled ? '0.3' : '1',
                'font-family': 'var(--font-figtree-medium)',
                'font-size': isPill ? '32px' : '15px'
            });

            if (!isDisabled) {
                btn.on('click', function (e) {
                    e.preventDefault();
                    onClick();
                    // Smooth scroll back to the top of the grid
                    const gridElement = document.querySelector('.faculties-directory-profile-grid');
                    if (gridElement) {
                        const gridTop = gridElement.getBoundingClientRect().top + window.scrollY - 200; // -100px for padding/header
                        window.scrollTo({ top: gridTop, behavior: 'smooth' });
                    }
                });
            }
            return btn;
        }

        function showPage(page) {
            // Toggle visibility using Bootstrap classes to override d-flex !important
            cards.removeClass('d-flex').addClass('d-none');
            cards.slice((page - 1) * cardsPerPage, page * cardsPerPage).removeClass('d-none').addClass('d-flex');

            paginationContainer.empty();
            if (totalPages > 1) {
                
                // Prev Button
                const prevBtn = createBtn('<img src="assets/images/academic-faculties/faculties-pagination-arrow-left.svg" alt="Previous" style="width: 24px; height: 24px;">', true, page === 1, () => showPage(page - 1));
                prevBtn.css({ 'background-color': '#110543', 'color': 'white' });
                if (page > 1) {
                    prevBtn.hover(
                        function () { $(this).css('opacity', '0.8'); },
                        function () { $(this).css('opacity', '1'); }
                    );
                }
                paginationContainer.append(prevBtn);

                // Number Buttons
                const maxVisiblePages = 4;
                let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
                let endPage = startPage + maxVisiblePages - 1;

                // Adjust if we are near the end
                if (endPage > totalPages) {
                    endPage = totalPages;
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                for (let i = startPage; i <= endPage; i++) {
                    const btn = createBtn(i, false, false, () => showPage(i));
                    if (i === page) {
                        btn.css({ 'background-color': '#110543', 'color': 'white' });
                    } else {
                        btn.css({ 'background-color': 'transparent', 'color': '#8c98a4', 'border': '1px solid #e9ecef' });
                        btn.hover(
                            function () { $(this).css({ 'background-color': '#f0f2f5', 'color': '#110543' }); },
                            function () { $(this).css({ 'background-color': 'transparent', 'color': '#8c98a4' }); }
                        );
                    }
                    paginationContainer.append(btn);
                }

                // Next Button
                const nextBtn = createBtn('<img src="assets/images/academic-faculties/faculties-pagination-arrow-right.svg" alt="Next" style="width: 24px; height: 24px;">', true, page === totalPages, () => showPage(page + 1));
                nextBtn.css({ 'background-color': '#110543', 'color': 'white' });
                if (page < totalPages) {
                    nextBtn.hover(
                        function () { $(this).css('opacity', '0.8'); },
                        function () { $(this).css('opacity', '1'); }
                    );
                }
                paginationContainer.append(nextBtn);
            }
        }

        showPage(1);
    }
    initCustomPagination();

});
