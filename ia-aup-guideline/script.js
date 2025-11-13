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
                        let html = "<table><tr><th>Phân hành</th><th>Số hiệu</th><th>Tên thủ tục</th><th>Nội dung</th></tr>";
                        for (let i = 0; i < procedures.length; i++) {
                            const phanHanh = procedures[i].getElementsByTagName("Phan_hanh")[0].childNodes[0].nodeValue;
                            const soHieu = procedures[i].getElementsByTagName("So_hieu_thu_tuc")[0].childNodes[0].nodeValue;
                            const tenThuTuc = procedures[i].getElementsByTagName("Ten_thu_tuc")[0].childNodes[0].nodeValue;
                            const noiDung = procedures[i].getElementsByTagName("Noi_dung_thu_tuc")[0].childNodes[0].nodeValue;
                            html += `<tr><td>${phanHanh}</td><td>${soHieu}</td><td>${tenThuTuc}</td><td>${noiDung}</td></tr>`;
                        }
                        html += "</table>";
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
