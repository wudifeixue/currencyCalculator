const API_URL = 'https://api.exchangerate-api.com/v4/latest/CNY';
let inputCount = 1;

async function getExchangeRates() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const cadToRmb = 1 / data.rates.CAD;
        const usdToRmb = 1 / data.rates.USD;

        document.getElementById('cadToRmbRate').textContent = `1 CAD = ${cadToRmb.toFixed(4)} RMB`;
        document.getElementById('usdToRmbRate').textContent = `1 USD = ${usdToRmb.toFixed(4)} RMB`;

        return { cadToRmb, usdToRmb };
    } catch (error) {
        throw new Error('获取汇率数据失败');
    }
}

function addInput() {
    inputCount++;
    const div = document.createElement('div');
    div.classList.add('cad-input');
    div.innerHTML = `
        <label for="cadTotal${inputCount}">Bill ${inputCount}:</label>
        <input type="number" id="cadTotal${inputCount}" step="0.01" class="cadTotal" oninput="updateTotal()" onblur="updateTotal()">
    `;
    document.getElementById('cadInputs').appendChild(div);
}

function updateTotal() {
    const cadTotals = document.querySelectorAll('.cadTotal');
    let totalCad = 0;

    cadTotals.forEach(input => {
        const value = parseFloat(input.value);
        if (!isNaN(value) && value > 0) {
            totalCad += value;
        }
    });

    document.getElementById('totalCad').textContent = totalCad.toFixed(2);
}

async function calculate() {
    document.getElementById('error').textContent = ''; // 清除之前的错误信息
    const totalCad = parseFloat(document.getElementById('totalCad').textContent);
    if (isNaN(totalCad) || totalCad <= 0) {
        alert('请输入有效的CAD总额');
        return;
    }

    try {
        const { cadToRmb, usdToRmb } = await getExchangeRates();
        const result110 = totalCad * cadToRmb * 1.1;
        const result40 = (totalCad * usdToRmb - totalCad * cadToRmb) * 0.4 + totalCad * cadToRmb;

        document.getElementById('result110').textContent = `110%: ${result110.toFixed(2)} RMB`;
        document.getElementById('result40').textContent = `USD 40% difference: ${result40.toFixed(2)} RMB`;
    } catch (error) {
        document.getElementById('error').textContent = error.message;
        document.getElementById('result110').textContent = '';
        document.getElementById('result40').textContent = '';
    }
}
