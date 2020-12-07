document.querySelector(".qty").addEventListener("change", calcVal)
document.querySelector(".prc").addEventListener("change", calcVal)
document.querySelector("input[list=vendors]").addEventListener("keyup", checkValue)
document.getElementById("saveBill").addEventListener("click", saveBill)

function checkValue(keyup) {
  let valLenght = keyup.target.value.length
  if (valLenght == keyup.target.maxLength ) {
    keyup.target.className = "maxLen"
  }
  else { keyup.target.className = "" }
}

fetch('/getVendors')
    .then(res => res.json())
    .then(vendors => {addVendorsToList(vendors)})


fetch('/getProducts')
    .then(res => res.json())
    .then(products => {addProductsToList(products)})

function calcVal(ev) {
    //console.log(ev.target.className)
    let val = ev.target.parentElement.parentElement.querySelector(".val")
    let qty = ev.target.parentElement.parentElement.querySelector(".qty")
    let prc = ev.target.parentElement.parentElement.querySelector(".prc")
    // ev.target.parentElement.parentElement.querySelector(".qty").value = formatNumber(qty.value)
    // ev.target.parentElement.parentElement.querySelector(".prc").value = formatNumber(prc.value)
    val.textContent = formatNumber(qty.value * prc.value)
    recalcSum()
}

document.querySelector(".addpos").addEventListener("click", addNewRow)

function addNewRow(click){
    let button = click.target
    let tr = button.parentElement.parentElement
    let clonedTr = tr.cloneNode(true)

    //tu czysci input
    clonedTr.querySelectorAll("input").forEach(input => {input.value=""})
    clonedTr.querySelector(".val").textContent =""
    let newQty = clonedTr.querySelector(".qty")
    let newPrc = clonedTr.querySelector(".prc")
    //przypisanie funkcji calcVal do inputow w sklonowanym wierszu
    newQty.addEventListener("change", calcVal)
    newPrc.addEventListener("change", calcVal)
    //kasujemy guzik
    addDelButton(button)
    clonedTr.querySelector(".addpos").addEventListener("click", addNewRow)
    let sum = tr.parentElement.querySelector(".sum")
    sum = tr.parentElement.removeChild(sum)
    tr.parentElement.appendChild(clonedTr)
    tr.parentElement.appendChild(sum)
    recalcLp()
}

function addDelButton(oldButton){
    oldButton.textContent = "Usun"
    oldButton.removeEventListener("click", addNewRow)
    oldButton.addEventListener("click", removeRow)
}

function removeRow(click){
    let tr = click.target.parentElement.parentElement
    tr.parentElement.removeChild(tr)
    recalcLp()
    recalcSum()
}

function recalcLp(){
    let lps = document.querySelectorAll(".lp")
    //console.log(lps), iniciowanie petli, kontrola powtorzen, zwiekszanie)
    for (let i =0;lps.length >i;i=i+1) {
        lps[i].textContent = i+1
        //toggle - przelacza klase. jak jest usuwa jak nie ma to dodaje
        if(i%2) lps[i].parentElement.className = "second" 
        else lps[i].parentElement.className = "" 
    }
}

//document.querySelectorAll(".val")
//document.getElementById("val1")
function recalcSum(){
    let vals = document.querySelectorAll(".val"), sumVal = 0;
    for (let i = 0; i < vals.length;i++)
    {
        sumVal += Number(vals[i].textContent.replace(/,/g,''))
        //sumVal = sumVal+querySelector(".val")[i];
    }
    document.getElementById("sum").textContent = formatNumber(sumVal)
}

function formatNumber(number) {
    return Number(Number(number).toFixed(2)).toLocaleString("en",{minimumFractionDigits: 2});
}

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
 if(dd<10){
        dd='0'+dd
    } 
    if(mm<10){
        mm='0'+mm
    } 

today = yyyy+'-'+mm+'-'+dd;
document.getElementById("datefield").setAttribute("max", today)

//odpowiedzialne za miejsca dziesietne i separatory we wszystkich liczbch i kalkulacjach
function addCommas(nStr)
{
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}


const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    // const modal = document.querySelector(button.dataset.modalTarget)
    // openModal(modal)
    let newVendor = document.querySelector("input[list=vendors]").value
    fetch("/addVendor",{method: 'POST', body: JSON.stringify({newVendor: newVendor})})    
      .then(res => res.text())
      .then(message => {alert(message)})
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal')
    closeModal(modal)
  })
})

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}

function addVendorsToList(vendorsJson) {
    
    vendorsJson.forEach(vendor => {
        let newVendor = document.createElement("OPTION")
        newVendor.setAttribute("data-id", vendor.vendorID)
        newVendor.textContent = vendor.vendorName
        document.getElementById("vendors").appendChild(newVendor)        
    })

    // for (let i = 0; i < vendorsJson.data.length;i++){
    //     let newVendor = document.createElement("OPTION")
    //     newVendor.value = vendorsJson.data[i]
    //     document.getElementById("vendors").appendChild(newVendor)
    // }   
}



function addProductsToList(productsJson){
    
  productsJson.forEach(product => {
      let newProduct = document.createElement("OPTION")
      newProduct.value = product.productName
      document.getElementById("products").appendChild(newProduct)        
  })

  // for (let i = 0; i < vendorsJson.data.length;i++){
  //     let newVendor = document.createElement("OPTION")
  //     newVendor.value = vendorsJson.data[i]
  //     document.getElementById("vendors").appendChild(newVendor)
  // }   
}

function saveBill() {
  let order = {}
  order.orderDate = document.getElementById("datefield").value
  order.vendorID = document.querySelector("input[list=vendors]").value
  order.currency = document.getElementById("currency").value
  order.lines = []
  
  
  document.querySelectorAll("tr").forEach((tr,i) => {

    if(i>0 && i<document.querySelectorAll("tr").length-1) {
      let line = {}      
      line.productID = tr.querySelector("[list=products]").value
      order.lines.push(line)
    }

  })


  fetch("/addBill",{method: 'POST', body: JSON.stringify(order)})    
  .then(res => res.text())
  .then(message => {alert(message)})
}

