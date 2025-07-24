
const phrases = [
    "smart software.",
    "AI solutions.",
    "scalable platforms.",
    "beautiful apps.",
];
const el = document.getElementById("type-text");
let i = 0,
    j = 0,
    currentPhrase = [],
    isDeleting = false;

function loop() {
    el.innerHTML = currentPhrase.join("");
    if (!isDeleting && j <= phrases[i].length) {
        currentPhrase.push(phrases[i][j]);
        j++;
    }
    if (isDeleting && j <= phrases[i].length) {
        currentPhrase.pop();
        j--;
    }
    if (j === phrases[i].length) {
        isDeleting = true;
        setTimeout(loop, 1000);
        return;
    }
    if (j === 0 && isDeleting) {
        isDeleting = false;
        i = (i + 1) % phrases.length;
    }
    setTimeout(loop, isDeleting ? 50 : 150);
}
loop();

function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    menu.style.display =
        menu.style.display === "flex" ? "none" : "flex";
}

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    },
    { threshold: 0.1 },
);
document
    .querySelectorAll("[data-animate]")
    .forEach((el) => observer.observe(el));

function showTab(id) {
    document
        .querySelectorAll(".tab-content")
        .forEach((el) => el.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

document.querySelectorAll(".job-card").forEach((card) => {
    card.addEventListener("click", () => {
        const jobId = card.getAttribute("data-job");

        document
            .querySelectorAll(".job-card")
            .forEach((c) => c.classList.remove("active"));
        card.classList.add("active");

        document
            .querySelectorAll(".jd")
            .forEach((j) => j.classList.remove("active"));
        document.getElementById(jobId).classList.add("active");
    });
});

function openApplyPopup() {
    document.getElementById("applyPopup").style.display = "flex";
}

function closeApplyPopup() {
    document.getElementById("applyPopup").style.display = "none";
}

function closeMapPopup() {
    document.getElementById("mapPopup").style.display = "none";
}

function showOnMap(locationName) {
    if (!navigator.geolocation) {
        alert("Geolocation not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const geocoderUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`;

        fetch(geocoderUrl)
            .then((res) => res.json())
            .then((data) => {
                if (data.length === 0) {
                    alert("Location not found");
                    return;
                }

                const jobLat = parseFloat(data[0].lat);
                const jobLng = parseFloat(data[0].lon);

                const distance = getDistanceFromLatLonInKm(
                    userLat,
                    userLng,
                    jobLat,
                    jobLng,
                );

                const map = L.map("map").setView([jobLat, jobLng], 10);
                L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                        attribution: "&copy; OpenStreetMap contributors",
                    },
                ).addTo(map);

                L.marker([userLat, userLng])
                    .addTo(map)
                    .bindPopup("You")
                    .openPopup();
                L.marker([jobLat, jobLng])
                    .addTo(map)
                    .bindPopup(locationName);

                document.getElementById("distanceInfo").innerText =
                    `Distance from your location: ${distance.toFixed(2)} km`;
                document.getElementById("mapPopup").style.display = "flex";
            });
    });
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

let currentIndex = 0;

function moveCarousel(direction) {
    const track = document.querySelector(".carousel-track");
    const slides = document.querySelectorAll(".carousel-slide");
    const totalSlides = slides.length;

    currentIndex += direction;
    if (currentIndex < 0) currentIndex = totalSlides - 1;
    if (currentIndex >= totalSlides) currentIndex = 0;

    const offset = currentIndex * -100;
    track.style.transform = `translateX(${offset}%)`;
}

document.addEventListener("DOMContentLoaded", () => {
    const firstCard = document.querySelector(".job-card");
    const firstJobId = firstCard.getAttribute("data-job");

    firstCard.classList.add("active");

    document
        .querySelectorAll(".jd")
        .forEach((j) => j.classList.remove("active"));
    document.getElementById(firstJobId).classList.add("active");
});

// document.addEventListener("DOMContentLoaded", function () {
//     const hamburger = document.getElementById("hamburgerBtn");
//     const mobileMenu = document.getElementById("mobileMenu");

//     hamburger.addEventListener("click", function () {
//         mobileMenu.classList.toggle("show");
//     });

//     document.addEventListener("click", function (e) {
//         if (
//             mobileMenu.classList.contains("show") &&
//             !mobileMenu.contains(e.target) &&
//             !hamburger.contains(e.target)
//         ) {
//             mobileMenu.classList.remove("show");
//         }
//     });

//     document.querySelectorAll(".menu-item").forEach((item) => {
//         item.addEventListener("click", () => {
//             mobileMenu.classList.remove("show");
//         });
//     });
// });



document.addEventListener('DOMContentLoaded', () => {
    const sliderContainer = document.getElementById('slider-container');
    const slides = Array.from(sliderContainer.querySelectorAll('.slide'));
    const numSlides = slides.length;
    let currentActiveIndex = 0;
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    function updateSlideStates() {
        if (numSlides === 0) return;
        for (let i = 0; i < numSlides; i++) {
            const slide = slides[i];
            let status = 'hidden';
            let diff = i - currentActiveIndex;
            if (diff > numSlides / 2) {
                diff -= numSlides;
            } else if (diff < -numSlides / 2) {
                diff += numSlides;
            }
            if (diff === 0) {
                status = 'active';
            } else if (numSlides > 1 && diff === 1) {
                status = 'next';
            } else if (numSlides > 2 && diff === -1) {
                status = 'prev';
            } else if (numSlides > 3 && diff === 2) {
                status = 'background-next';
            } else if (numSlides > 4 && diff === -2) {
                status = 'background-prev';
            }
            if (numSlides === 2 && diff === -1) {
                status = 'next';
            }
            if (numSlides === 3 && diff === -2) { // For N=3, diff=-2 is same as diff=1 ('next')
                // This case is diff=2, which normalizes to diff=-1 for N=3, so 'prev'
                // The diff calc already handles this.
            }
            if (numSlides === 4 && diff === -2) { // For N=4, diff=-2 is same as diff=2 ('background-next')
                status = 'background-next';
            }
            slide.dataset.status = status;
            slide.classList.remove('shadow-xl', 'shadow-lg', 'shadow-md');
            if (status === 'active') slide.classList.add('shadow-xl');
            else if (status === 'next' || status === 'prev') slide.classList.add('shadow-lg');
            else if (status === 'background-next' || status === 'background-prev') slide.classList.add('shadow-md');
        }
    }
    if (numSlides > 0) {
        updateSlideStates();
    } else {
        if (sliderContainer) sliderContainer.innerHTML = '<p class="text-stone-500 text-center p-10 absolute inset-0 flex items-center justify-center">No testimonials available.</p>';
    }
    if (numSlides <= 1) {
        if (prevButton) prevButton.style.display = 'none';
        if (nextButton) nextButton.style.display = 'none';
    } else {
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                currentActiveIndex = (currentActiveIndex - 1 + numSlides) % numSlides;
                updateSlideStates();
            });
        }
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                currentActiveIndex = (currentActiveIndex + 1) % numSlides;
                updateSlideStates();
            });
        }
    }
});







$(document).ready(function() {
  
  $('.navbar-toggle').mouseenter(function() {
    if ($(this).hasClass('active')) {
    } else {
      $('.navbar-toggle').animate ({
          width: '60px',
          height: '60px'
        }, 200, function(){
          // anim complete
        });
    }
    });
  
  
    $('.navbar-toggle').mouseleave(function() {
      if ($(this).hasClass('active')) {} else {
    $('.navbar-toggle').animate ({
        width: '50px',
        height: '50px'
      }, 200, function(){
        // anim complete
      });
      }
  });
  
  
  
  
  
  $('.navbar-toggle').click(function() {
    var $this = $(this);
    
    if ($('.collapse').hasClass('open')) {
      $('.navbar > li').slideUp("fast");  
      $this.removeClass('active');
      $('.collapse').removeClass('open');  
      $this.animate ({
        width: '50px',
        height: '50px',
        borderBottomRightRadius: '12px'
      }, 200, function(){
        // anim complete
      });
      $('.close').hide('fast');
      setTimeout(function() {
        $this.children('.icon-bar').show("fast");
      }, 200);
    } 


    else {
      $this.delay("100").addClass('active');
      //$('.collapse').stop(true).slideDown("fast");
      $this.children('.icon-bar').hide();
      $this.delay("220").animate ({
        width: '300px',
        height: '275px',
        borderBottomRightRadius: '275px'
      }, 200, function(){
        // anim complete
      });
      setTimeout(function() {
        $('.navbar > li').slideDown("fast");
        $('.collapse').addClass('open');
        $('.close').show('fast');
      }, 500);
    }
  });
});

