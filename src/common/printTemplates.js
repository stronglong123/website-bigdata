export function createTable(cols,datas) {
    return "<table width='300px'>" + createThead(cols) + createTbody(cols, datas) + "</table>"
}

function createThead(cols) {
    let txt = "<thead><tr>"
    cols.forEach(col => {
        txt += `<th>${col.label}</th>`
    })
    txt += "</tr></thead>"
    return txt;
}

function createTbody(cols, datas) {
    if (!datas || !datas.length) return '';
    let bodyHtml = "<tbody>";
    datas.forEach(row => {
        bodyHtml += "<tr>"
        cols.forEach(col => {
            bodyHtml += `<td align="center">${row[col.key]}</td>`
        })
        bodyHtml += "</tr>"
    })
    bodyHtml += "</tbody>"
    return bodyHtml;
}

function calcRate() {
    Array.from({length:12},(v,k) =>{return 360 - k*30}).reduce((prev,it,index) => {
        let base = 20000*(index+1)/12
        return it*base*2.5/10000 + prev
    },0)
}