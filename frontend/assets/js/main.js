// base API (لو شغّلت backend على نفس السيرفر اختار /api)
const API_BASE = ''; // If serving backend and frontend from same domain, keep empty. 
// إذا backend على دومين آخر: const API_BASE = 'https://your-backend.example.com';

document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('orderForm');
  if (!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const payload = {};
    for (const [k,v] of data.entries()) payload[k]=v;
    try {
      const res = await fetch(API_BASE + '/api/orders', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'خطأ في الإرسال');
      // show success and give option to open WhatsApp
      const result = document.getElementById('result');
      result.classList.remove('hidden');
      result.innerHTML = `<div class="order-card"><h3>تم حفظ الطلب ✅</h3>
        <p>شكراً ${payload.name} — سيتم التواصل قريباً.</p>
        <p><a href="${json.whatsappLink}" target="_blank" class="btn">أرسل طلبك على واتساب</a></p>
      </div>`;
      form.reset();
    } catch (err) {
      alert('حدث خطأ: ' + err.message);
    }
  });
});
