# ဖွင့်ဟ (Pwin Ha) - AI Journaling App

ဤသည်မှာ မြန်မာဘာသာစကားအသုံးပြုသူများအတွက် စိတ်ခံစားမှုများကို ရင်ဖွင့်ရေးသားနိုင်ပြီး AI ထံမှ နွေးထွေးသော အကြံပြုချက်များ ရယူနိုင်ရန် ဖန်တီးထားသော web application တစ်ခုဖြစ်သည်။

ဤ project သည် VPN မလိုအပ်ဘဲ အသုံးပြုနိုင်ရန် Vercel Serverless Function ကိုအသုံးပြု၍ Backend Proxy တည်ဆောက်ထားပါသည်။

---

## အသုံးပြုထားသော နည်းပညာများ (Technology Stack)

-   **Frontend:** HTML, CSS, Plain JavaScript (No frameworks)
-   **UI Framework:** Bootstrap 5
-   **Icons:** Feather Icons
-   **AI Service:** Google Gemini API
-   **Backend/Proxy:** Vercel Serverless Function (Node.js environment)
-   **Hosting & Deployment:** Vercel (GitHub နှင့် ချိတ်ဆက်ထားသည်)

---

## Project တည်ဆောက်ပုံ (Project Structure)

ဤ project သည် အဓိက file နှစ်ခုဖြင့် ဖွဲ့စည်းထားပါသည်-

1.  **`index.html`**
    -   ဤသည်မှာ application တစ်ခုလုံး၏ ပင်မ file ဖြစ်သည်။
    -   Frontend နှင့်ပတ်သက်သော HTML, CSS, နှင့် JavaScript code များအားလုံး ဤ file တစ်ခုတည်းတွင်သာ ပါဝင်သည်။
    -   User Interface (UI) အားလုံးကို JavaScript ဖြင့် 동적 생성 (dynamically generated) လုပ်ထားသည်။
    -   User ၏ ထည့်သွင်းမှုများကို လက်ခံပြီး AI အကြံပြုချက်ရယူရန်အတွက် Backend (`/api/analyze.js`) ကို `fetch` request ပို့ပေးသည်။

2.  **`api/analyze.js`**
    -   ဤသည်မှာ Vercel တွင် အလုပ်လုပ်သော Serverless Function (Backend) ဖြစ်သည်။
    -   သူ၏ အဓိကတာဝန်မှာ Frontend (`index.html`) နှင့် Google Gemini API အကြားတွင် ကြားခံ (Proxy) အဖြစ်ဆောင်ရွက်ရန်ဖြစ်သည်။
    -   Frontend မှပို့လိုက်သော `prompt` ကို လက်ခံရယူသည်။
    -   Vercel Environment Variable တွင် လုံခြုံစွာသိမ်းဆည်းထားသော `GEMINI_API_KEY` ကို အသုံးပြု၍ Google Gemini API အစစ်ကို ခေါ်ယူသည်။
    -   Google မှ ပြန်လည်ပေးပို့သော အဖြေကို Frontend သို့ ပြန်လည်ပို့ဆောင်ပေးသည်။
    -   ဤတည်ဆောက်ပုံကြောင့် API Key သည် user ဘက်သို့ ဘယ်တော့မှ မရောက်ရှိဘဲ လုံခြုံမှုရှိစေသည်။

---

## အနာဂတ် AI အတွက် လမ်းညွှန်ချက် (Instructions for Future AI)

> ဤစာကို ကျွန်ုပ်၏ project နှင့်ပတ်သက်၍ အကူအညီတောင်းဆိုသည့်အခါတိုင်း အသုံးချပါ။
>
> ---
>
> မင်္ဂလာပါ AI။ ကျွန်ုပ်သည် ဤ `README.md` file တွင် ဖော်ပြထားသော project ကို လုပ်ဆောင်နေပါသည်။
>
> သင်၏အကူအညီမပေးမီ၊ ဤ `README.md` ဖိုင်ကို သေချာစွာဖတ်ရှုပြီး ကျွန်ုပ်၏ project တည်ဆောက်ပုံ (Technology Stack နှင့် File Structure) ကို နားလည်ပေးပါ။
>
> ကျွန်ုပ်ကို အကူအညီပေးသည့်အခါ အောက်ပါအချက်များကို လိုက်နာပေးပါ-
>
> 1.  **အဆင့်မကျော်ပါနှင့်။** လုပ်ဆောင်ရမည့်အဆင့်များကို တစ်ဆင့်ချင်းစီ၊ အသေးစိတ်ကျကျ၊ ဘာတစ်ခုမှမကျော်ဘဲ ရှင်းပြပေးပါ။
> 2.  **Copy and Replace ပုံစံဖြင့် ရေးပေးပါ။** Code ရေးသားပေးသည့်အခါ ပြင်ဆင်ရန်လိုအပ်သော အပိုင်းအစเล็กများ (snippets) ကိုသာမပေးဘဲ၊ ကျွန်ုပ်တိုက်ရိုက်ကူးယူပြီး အစားထိုးနိုင်ရန်အတွက် Code block တစ်ခုလုံး (full code block) ကို အပြည့်အစုံ ရေးသားပေးပါ။

---

## ပြင်ဆင်မှုများ ပြုလုပ်ခြင်း (How to Make Changes)

1.  Code အားလုံးကို GitHub repository တွင် တိုက်ရိုက်ပြင်ဆင်နိုင်ပါသည်။
2.  GitHub တွင် `Commit` ပြုလုပ်လိုက်သည်နှင့် Vercel မှ အလိုအလျောက်သိရှိပြီး deployment အသစ်တစ်ခုကို စတင်ပါလိမ့်မည်။
3.  Deployment ပြီးဆုံးသွားလျှင် အပြောင်းအလဲများကို live website တွင် တွေ့မြင်နိုင်ပါပြီ။
