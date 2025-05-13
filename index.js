console.log("The deep is calling...");

function isInViewport(element, topMargin, bottomMargin)
{
    const rect = element.getBoundingClientRect();

    return (
        rect.top >= topMargin && rect.top < (window.innerHeight)-bottomMargin
        ||
        rect.bottom >= topMargin && rect.bottom < (window.innerHeight)-bottomMargin
        ||
        rect.top < topMargin && rect.bottom > (window.innerHeight)-bottomMargin
    );
}

function setupSliders ()
{
    const sliderSeparators = document.querySelectorAll(".slider-separator")
    if (sliderSeparators.length == 0) return;

    let mouseX = 0;
    let mousedown = false;

    window.onmouseup = () => {mousedown = false;};
    window.onmousedown = () => {mousedown = true;};
    document.addEventListener('mousemove', (e) =>
        {
            mouseX = e.clientX;
        }
    );
    
    for (let separator of sliderSeparators)
    {
        const img1 = separator.parentElement.querySelector(".slider-1");
        let separatorWidth = separator.getBoundingClientRect().width;
        let separatorInUse = false;
        img1.style.clipPath = "inset(0 0 0 "+separatorWidth/2+"px)";


        separator.parentElement.addEventListener("mousedown", () => {
            separatorInUse = true;
            mousedown = true;
            
            const updatePos = setInterval(() =>
            {
                const container = separator.parentElement.getBoundingClientRect();
                separator.style.transition = "opacity 0.05s";
                separator.style.opacity = "100%";
                if (!mousedown) {
                    clearInterval(updatePos);
                    separatorInUse = false;
                    setTimeout(() => {
                        if (!separatorInUse)
                        {
                            separator.style.transition = "opacity 1s";
                            separator.style.opacity = "0%"
                        }
                    }, 2000);
                    return;
                }

                if (mouseX > container.x+container.width)
                {
                    separator.style.left = container.width-(separatorWidth/2)+"px";
                }
                else if (mouseX < container.x)
                {
                    separator.style.left = -separatorWidth/2+"px";
                }
                else 
                {
                    separator.style.left = (mouseX-container.x-(separatorWidth/2))+"px";
                }
                img1.style.clipPath = "inset(0 0 0 "+(mouseX-container.x)+"px)"
            }, 10);
        })
    }
}

function setupBackButtons ()
{
    const buttons = document.querySelectorAll(".back");
    if (buttons.length == 0) return;

    for (let button of buttons)
    {
        button.onclick = () => {history.back()};
    }
}

function setupFadeIns (className, time)
{
    setupFadeIns (className, 0, 0, time);
}

function setupFadeIns (className, topMargin, bottomMargin, time)
{
    const elements = document.querySelectorAll(className);
            
    for (let element of elements)
    {
        element.style.opacity = "0%";
        setTimeout(() => {element.style.transition = "opacity "+time+"s ease";}, 1000);

        setInterval(() => {
            if (isInViewport(element, topMargin, bottomMargin))
            {
                element.style.opacity = "100%";
            }
            else
            {
                element.style.opacity = "0%";
            }
        }, 200);
    }
}

function setupImageDisplayer ()
{
    const viewer = document.querySelector(".image-displayer");
    if (viewer == null) return;
    const images = document.querySelectorAll("img.clickable");
    const viewerDescription = document.querySelector(".displayer-description");
    const viewerImage = viewer.querySelector("img");
    const viewerCross = viewer.querySelector(".displayer-cross");

    function toggleDisplayer (image)
    {
        viewerImage.src = typeof image === 'undefined'? "" : image.src;
        viewerDescription.innerHTML = typeof image === 'undefined'? "Nessuna descrizione fornita" : image.alt;
        viewer.classList.toggle("show");
    }

    function newImageTab ()
    {
        window.open(viewerImage.src);
    }

    viewerImage.onclick = () => {newImageTab();};
    viewerCross.onclick = () => {toggleDisplayer();};
    viewer.onclick = (e) => {if (e.target == viewer) toggleDisplayer();};

    for (let image of images)
    {
        const src = image.src;

        image.onclick = () => {toggleDisplayer(image);};
    }
}

function setupDropdowns ()
{
    const dropdowns = document.querySelectorAll(".dropdown");

    for (let dropdown of dropdowns)
    {
        const content = dropdown.querySelector(".dropdown-content");
        dropdown.addEventListener("click", () =>
        {
            content.classList.toggle("show");
        });
    }
}

function setupLangToggle ()
{
    const toggle = document.querySelector("#lang-toggle")
    if (toggle == null) return;

    let currentLang = "it";
    for (let enText of document.querySelectorAll(".en"))
    {enText.classList.add("hidden")};

    toggle.onclick = () =>
    {
        currentLang == "it" ? currentLang="en" : currentLang="it";
        console.log("CURRENT LANGUAGE: "+currentLang);

        let langText = document.querySelectorAll(".lang");
        for (let text of langText)
        {
            if (text.classList.contains(currentLang))
                text.classList.remove("hidden");
            else text.classList.add("hidden");
        }

    }

}

setupDropdowns();
setupImageDisplayer();
setupFadeIns(".paragrafo", 60, 100, 1);
setupFadeIns(".break", 20, 20, 0.3)
setupSliders();
setupBackButtons();
setupLangToggle();