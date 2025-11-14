const converter = window.showdown ? new showdown.Converter() : null;
let proceduresData = []; // Store all procedure data globally
let filterTimeout; // For debouncing

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

        const hasBeenLoaded = contentDiv.dataset.loaded === 'true';

        if (!hasBeenLoaded) {
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
                        const currentContent = contentDiv.innerHTML;
                        contentDiv.innerHTML = converter.makeHtml(text);
                        // Prepend existing content if any, useful if there are controls inside
                        if (currentContent.trim() !== '') {
                            contentDiv.innerHTML = currentContent + contentDiv.innerHTML;
                        }
                        contentDiv.dataset.loaded = 'true';
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
                        proceduresData = Array.from(xmlDoc.getElementsByTagName("Procedure"));
                        
                        populatePhanHanhFilter();
                        renderTable(proceduresData);
                        contentDiv.dataset.loaded = 'true';
                    })
                    .catch(error => {
                        console.error('There has been a problem with your fetch operation:', error);
                        const aupProceduresDiv = document.getElementById('aup_procedures');
                        // Ensure filter container is not overwritten on error
                        const filterContainerHTML = aupProceduresDiv.querySelector('#filter-container')?.outerHTML || '';
                        aupProceduresDiv.innerHTML = filterContainerHTML + `<p>Error loading content: ${error.message}.</p>`;
                    });
            }
        }
    } catch (error) {
        console.error('An unexpected error occurred in openTab:', error);
    }
}

function populatePhanHanhFilter() {
    const filterSelect = document.getElementById('phanHanh-filter');
    if (!filterSelect || filterSelect.options.length > 1) return; // Don't repopulate

    const phanHanhValues = new Set();
    proceduresData.forEach(procedure => {
        const phanHanh = procedure.getElementsByTagName("Phần_hành")[0]?.childNodes[0]?.nodeValue;
        if (phanHanh) {
            phanHanhValues.add(phanHanh);
        }
    });

    // Sort values alphabetically for better UX
    Array.from(phanHanhValues).sort().forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        filterSelect.appendChild(option);
    });
}

function renderTable(procedures) {
    const contentDiv = document.getElementById('aup_procedures');
    const tableContainer = contentDiv.querySelector('#table-container') || document.createElement('div');
    tableContainer.id = 'table-container';
    let tableHtml = "";

    if (procedures.length > 0) {
        const firstProcedure = proceduresData[0]; // Use global data for headers to keep it consistent
        const headerTags = Array.from(firstProcedure.children).map(child => child.tagName);

        tableHtml += `<div class="table-info"><p>Tìm thấy <strong>${procedures.length}</strong> thủ tục</p></div>`;
        tableHtml += "<table id='procedures-table'><thead><tr>";
        headerTags.forEach(tag => {
            let displayHeader = tag.replace(/_/g, ' ');
            displayHeader = displayHeader.charAt(0).toUpperCase() + displayHeader.slice(1);
            tableHtml += `<th>${displayHeader}</th>`;
        });
        tableHtml += "</tr></thead><tbody>";

        procedures.forEach(procedure => {
            tableHtml += "<tr>";
            headerTags.forEach(tag => {
                const element = procedure.getElementsByTagName(tag)[0];
                let value = element?.childNodes[0]?.nodeValue || '';

                if (tag === "Nội_dung_thủ_tục") {
                    value = value.replace(/Mục tiêu:/g, '<strong>Mục tiêu:</strong>')
                                 .replace(/Nội dung:/g, '<br><strong>Nội dung:</strong>');
                }
                tableHtml += `<td>${value}</td>`;
            });
            tableHtml += "</tr>";
        });
        tableHtml += "</tbody></table>";
    } else {
        tableHtml = "<div class='no-results'><p>Không có thủ tục nào khớp với tiêu chí lọc.</p></div>";
    }

    tableContainer.innerHTML = tableHtml;
    
    if (!contentDiv.querySelector('#table-container')) {
        contentDiv.appendChild(tableContainer);
    }
}

function filterProcedures() {
    const phanHanhFilter = document.getElementById('phanHanh-filter').value;
    const keywordFilter = document.getElementById('keyword-filter').value.toLowerCase();

    const filteredProcedures = proceduresData.filter(procedure => {
        const phanHanh = procedure.getElementsByTagName("Phần_hành")[0]?.textContent || '';
        const tenThuTuc = procedure.getElementsByTagName("Tên_thủ_tục")[0]?.textContent.toLowerCase() || '';
        const noiDung = procedure.getElementsByTagName("Nội_dung_thủ_tục")[0]?.textContent.toLowerCase() || '';

        const phanHanhMatch = !phanHanhFilter || phanHanh === phanHanhFilter;
        const keywordMatch = !keywordFilter || tenThuTuc.includes(keywordFilter) || noiDung.includes(keywordFilter);

        return phanHanhMatch && keywordMatch;
    });

    renderTable(filteredProcedures);
}

function resetFilters() {
    document.getElementById('phanHanh-filter').value = '';
    document.getElementById('keyword-filter').value = '';
    renderTable(proceduresData);
}

// Add event listener for keyword filter with debouncing
document.addEventListener('DOMContentLoaded', function() {
    const keywordInput = document.getElementById('keyword-filter');
    if (keywordInput) {
        keywordInput.addEventListener('keyup', function() {
            clearTimeout(filterTimeout);
            filterTimeout = setTimeout(filterProcedures, 300); // 300ms debounce
        });
    }
});

// Open the first tab by default
if (document.getElementsByClassName("tablinks").length > 0) {
    document.getElementsByClassName("tablinks")[0].click();
}
