const markdownFiles = {
    'ban_hang': 'quy_trinh_ban_hang.md',
    'mua_hang': 'quy_trinh_mua_hang.md',
    'quan_ly_tai_san': 'quy_trinh_quan_ly_tai_san.md',
    'quan_ly_tien': 'quy_trinh_quan_ly_tien.md',
    'thue': 'quy_trinh_thue.md',
    'lao_dong': 'quy_trinh_lao_dong_va_tien_luong.md'
};

const converter = new showdown.Converter();

function openTab(evt, tabName) {
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
        fetch(markdownFiles[tabName])
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                contentDiv.innerHTML = converter.makeHtml(text);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                contentDiv.innerHTML = 'Error loading content.';
            });
    }
}

// Open the first tab by default
document.getElementsByClassName("tablinks")[0].click();
