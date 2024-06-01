const API_URL = 'https://api.exchangerate-api.com/v4/latest/CAD';

async function getExchangeRates() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const cadToRmb = data.rates.CNY;
        const usdToRmb = data.rates.CNY / data.rates.USD;
        return { cadToRmb, usdToRmb };
    } catch (error) {
        throw new Error('获取汇率数据失败');
    }
}

async function calculate() {
    document.getElementById('error').textContent = ''; // 清除之前的错误信息
    const cadTotal = parseFloat(document.getElementById('cadTotal').value);
    if (isNaN(cadTotal) || cadTotal <= 0) {
        alert('请输入有效的CAD总额');
        return;
    }

    try {
        const { cadToRmb, usdToRmb } = await getExchangeRates();
        const result110 = cadTotal * cadToRmb * 1.1;
        const result40 = (cadTotal * usdToRmb - cadTotal * cadToRmb) * 0.4 + cadTotal * cadToRmb;

        document.getElementById('result110').textContent = `110%: ${result110.toFixed(2)} RMB`;
        document.getElementById('result40').textContent = `USD 40% difference: ${result40.toFixed(2)} RMB`;
    } catch (error) {
        document.getElementById('error').textContent = error.message;
        document.getElementById('result110').textContent = '';
        document.getElementById('result40').textContent = '';
    }
}
