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
            const markdownFile = evt.currentTarget.dataset.markdown;
            const xmlFile = evt.currentTarget.dataset.xml;

            if (markdownFile) {
                if (!converter) {
                    contentDiv.innerHTML = 'Error: showdown library not loaded.';
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
            } else if (xmlFile) {
                fetch(xmlFile)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Network response was not ok: ${response.statusText}`);
                        }
                        return response.text();
                    })
                    .then(text => {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(text, "application/xml");
                        const procedures = xmlDoc.getElementsByTagName("Procedure");
                        let html = "";

                        if (procedures.length > 0) {
                            const firstProcedure = procedures[0];
                            const headerTags = Array.from(firstProcedure.children).map(child => child.tagName);

                            html += "<table><thead><tr>";
                            headerTags.forEach(tag => {
                                // Convert tag name back to a more readable format for display
                                let displayHeader = tag.replace(/_/g, ' ');
                                displayHeader = displayHeader.charAt(0).toUpperCase() + displayHeader.slice(1);
                                html += `<th>${displayHeader}</th>`;
                            });
                            html += "</tr></thead><tbody>";

                            for (let i = 0; i < procedures.length; i++) {
                                html += "<tr>";
                                headerTags.forEach(tag => {
                                    const element = procedures[i].getElementsByTagName(tag)[0];
                                    let value = element?.childNodes[0]?.nodeValue || '';

                                    // Apply specific formatting for "Nội dung" if applicable
                                    if (tag === "Nội_dung_thủ_tục") { // Assuming this is the tag for "Nội dung"
                                        value = value.replace(/Mục tiêu:/g, '<strong>Mục tiêu:</strong>')
                                                     .replace(/Nội dung:/g, '<br><strong>Nội dung:</strong>');
                                    }
                                    html += `<td>${value}</td>`;
                                });
                                html += "</tr>";
                            }
                            html += "</tbody></table>";
                        } else {
                            html = "<p>No procedures found in the XML file.</p>";
                        }
                        contentDiv.innerHTML = html;
                    })
                    .catch(error => {
                        console.error('There has been a problem with your fetch operation:', error);
                        contentDiv.innerHTML = `Error loading content: ${error.message}.`;
                    });
            } else {
                contentDiv.innerHTML = 'Error: No data file specified for this tab.';
            }
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
