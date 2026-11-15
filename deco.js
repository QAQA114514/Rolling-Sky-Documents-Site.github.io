// ========== 按钮配置列表，在这里新增/修改按钮 ==========
const buttonConfig = [
    {
        file: "How To Use Flower Dance Moving Blocks",
        text: "How To Use Flower Dance Moving Blocks",
        bgImg: "img/花舞.png",
        border: "2px solid #ff76af"
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

    // 按 [图片名.png] 分割文本，交替生成文本节点 / 图片元素
    const parts = rawText.split(/(\[.*?\])/);
    const frag = document.createDocumentFragment();

    for(const part of parts){
        if(/^\[.*\]$/.test(part)){
            // 是图片标记
            const picName = part.slice(1,-1);
            const wrap = document.createElement("div");
            wrap.className = "doc-image-wrap";
            const img = document.createElement("img");
            img.className = "doc-img";
            img.src = `pic/${picName}`;
            img.alt = picName;
            img.onerror = function(){
                wrap.innerHTML = `<p style="color:#ff8888;margin:4px 0;">图片丢失：${picName}</p>`;
            }
            wrap.appendChild(img);
            frag.appendChild(wrap);
        }else{
            // 普通文字，保留原始换行，用 pre 风格文本节点
            if(part.length>0){
                const textSpan = document.createElement("div");
                textSpan.style.whiteSpace = "pre‑wrap";
                textSpan.textContent = part;
                frag.appendChild(textSpan);
            }
        }
    }

    docContent.appendChild(frag);

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
