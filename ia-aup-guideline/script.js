const converter = window.showdown ? new showdown.Converter() : null;

function openTab(evt, tabName) {
    try {
        let i, tabcontent, tablinks;

        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        const contentDiv = document.getElementById(tabName);
        contentDiv.style.display = "block";
        evt.currentTarget.className += " active";

        if (contentDiv.innerHTML.trim() === '') {
            if (!converter) {
                contentDiv.innerHTML = 'Error: showdown library not loaded.';
                return;
            }

            const markdownFile = evt.currentTarget.dataset.markdown;
            if (!markdownFile) {
                contentDiv.innerHTML = 'Error: No markdown file specified for this tab.';
                return;
            }

            fetch(markdownFile)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then(text => {
                    contentDiv.innerHTML = converter.makeHtml(text);
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                    contentDiv.innerHTML = `Error loading content: ${error.message}.`;
                });
        }
    } catch (error) {
        console.error('An unexpected error occurred in openTab:', error);
        // Optionally, display a generic error message to the user
    }
}

// Open the first tab by default
if (document.getElementsByClassName("tablinks").length > 0) {
    document.getElementsByClassName("tablinks")[0].click();
}
