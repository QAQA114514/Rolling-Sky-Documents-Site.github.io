// ========== 按钮配置列表，在这里新增/修改按钮 ==========
const buttonConfig = [
    {
        file: "How To Use Flower Dance Moving Blocks",
        text: "How To Use Flower Dance Moving Blocks",
        bgImg: "img/花舞.png",
        border: "3px solid #ff76af"
    }
];
// =======================================================
const homeEl = document.getElementById('home');
const docView = document.getElementById('doc-view');
const docContent = document.getElementById('doc-content');
const btnContainer = document.getElementById('btnContainer');
const bgMask = document.getElementById('bg-mask');

buttonConfig.forEach(item=>{
    const btn = document.createElement('button');
    btn.className = "doc-btn";
    btn.innerText = item.text;
    btn.style.backgroundImage = `url(${item.bgImg})`;
    btn.style.border = item.border;
    btn.onclick = ()=> loadDoc(item.file, item.bgImg);
    btnContainer.appendChild(btn);
})

async function loadDoc(filename, bgUrl){
    bgMask.style.backgroundImage = `url(${bgUrl})`;
    bgMask.style.opacity = "1";

    homeEl.classList.add('hide');
    docView.classList.remove('show');
    docContent.innerHTML = "";

    const res = await fetch(`docs/${filename}.txt`);
    const rawText = await res.text();

    const escapeHtml = (str) => {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    const parts = rawText.split(/(\[.*?\])/);
    let html = "";

    for(const part of parts){
        if(/^\[.*\]$/.test(part)){
            const picName = part.slice(1, -1);
            html += `
                <span class="doc-image-wrap">
                    <img src="pic/${picName}" alt="${picName}" class="doc-img"
                         onerror="this.outerHTML='<span style=color:#ff8888>图片丢失：${escapeHtml(picName)}</span>'">
                </span>
            `;
        }else{
            html += escapeHtml(part).replace(/\n/g, "<br>");
        }
    }

    docContent.innerHTML = html;

    setTimeout(()=>{
        docView.classList.add('show');
    },450);
}

function goBack(){
    docView.classList.remove('show');
    bgMask.style.opacity = "0";
    setTimeout(()=>{
        homeEl.classList.remove('hide');
    },450);
}
