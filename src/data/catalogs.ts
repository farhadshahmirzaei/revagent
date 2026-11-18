import { CatalogGuide, CatalogKey, Language } from '../types';

export const localizedCatalogs: Record<Language, Record<CatalogKey, CatalogGuide>> = {
  fa: {
    'ai-agent': {
      key: 'ai-agent',
      title: 'کاتالوگ راهنمای کارشناس فروش هوشمند (واتساپ و اینستاگرام)',
      subtitle: 'آشنایی کامل با نحوه کار، راه‌اندازی گام‌به‌گام و قوانین فروش کارشناس دیجیتال پس از خرید اشتراک',
      whyItMatters:
        'شما به عنوان صاحب کسب‌وکار این اشتراک را تهیه کرده‌اید تا به جای یک ربات پرسش‌وپاسخ ساده، یک کارشناس فروش واقعی در واتساپ و اینستاگرام داشته باشید که نیاز مشتری را کشف کند، قیمت معتبر بدهد، به تردیدها پاسخ دهد و سفارش را قطعی کند.',
      steps: [
        {
          stepNumber: '۰۱',
          title: 'اتصال کانال‌های واتساپ و اینستاگرام',
          detail: 'پیام‌های ورودی مشتریان از دایرکت اینستاگرام و چت واتساپ به صورت یکپارچه وارد موتور مکالمه دستیار می‌شوند.',
        },
        {
          stepNumber: '۰۲',
          title: 'تعریف کاتالوگ محصولات و محدوده اختیارات',
          detail: 'قیمت‌های تأییدشده، موجودی و سقف تخفیف مجاز را مشخص می‌کنید تا کارشناس هوشمند هیچ تعهد غیرمجازی ندهد.',
        },
        {
          stepNumber: '۰۳',
          title: 'تست زنده در شبیه‌ساز مشتری',
          detail: 'پیش از فعال‌سازی روی مشتریان واقعی، در حالت شبیه‌ساز با نقش خریدار سوال بپرسید و نحوه پاسخگویی و ارجاع به انسان را بررسی کنید.',
        },
      ],
      definitions: [
        { term: 'حالت مشاور کسب‌وکار', meaning: 'دستیار در این حالت به شما کمک می‌کند متن فروش، پاسخ به اعتراضات و ساختار پیگیری را طراحی کنید.' },
        { term: 'حالت آزمایش چت مشتری', meaning: 'شبیه‌سازی واقعی گفتگوی یک خریدار در واتساپ یا اینستاگرام با ایجنت فروش شما برای اطمینان از کیفیت پاسخ.' },
        { term: 'ارجاع به نیروی انسانی', meaning: 'انتقال خودکار گفتگو به مدیر فروش انسانی در شرایط حساس، تخفیف‌های خارج از سقف یا درخواست‌های خاص.' },
      ],
      realExampleTitle: 'نمونه واقعی در پایلوت بازار اندونزی',
      realExampleText:
        'مشتری در اینستاگرام درباره قیمت بسته آموزشی یا کالا می‌پرسد؛ کارشناس هوشمند ابتدا نیاز و بودجه او را می‌سنجد، مناسب‌ترین گزینه را پیشنهاد می‌دهد، به نگرانی درباره زمان ارسال پاسخ می‌دهد و در نهایت سفارش را با تایید خریدار ثبت می‌کند.',
    },
    pipeline: {
      key: 'pipeline',
      title: 'کاتالوگ راهنمای قیف فروش و چرخه سفارش',
      subtitle: 'مدیریت گام‌به‌گام معاملات از اولین پیام مشتری تا ثبت نهایی سفارش یا ارجاع به تیم انسانی',
      whyItMatters:
        'قیف فروش نشان می‌دهد هر مشتری در کدام مرحله از تصمیم‌گیری قرار دارد تا هیچ پیام یا سفارش نیمه‌کاره‌ای در واتساپ و اینستاگرام فراموش نشود.',
      steps: [
        {
          stepNumber: '۰۱',
          title: 'دریافت پیام و استعلام اولیه',
          detail: 'هر گفتگوی جدیدی که قصد خرید در آن تشخیص داده شود، به صورت خودکار به عنوان یک موقعیت فروش در ستون اول ثبت می‌شود.',
        },
        {
          stepNumber: '۰۲',
          title: 'کشف نیاز، معرفی محصول و پاسخ به اعتراض',
          detail: 'با پیشرفت گفتگو، پرونده معامله به مراحل معرفی محصول و مدیریت تردیدهای قیمتی یا زمانی منتقل می‌گردد.',
        },
        {
          stepNumber: '۰۳',
          title: 'ثبت نهایی سفارش یا ارجاع به انسان',
          detail: 'پس از تأیید نهایی خریدار، معامله به ستون ثبت نهایی منتقل می‌شود و یا در موارد استثنایی به کارشناس انسانی سپرده خواهد شد.',
        },
      ],
      definitions: [
        { term: 'احتمال قطعی شدن', meaning: 'برآورد درصد احتمال خرید نهایی بر اساس پیشرفت مشتری در مراحل گفتگو.' },
        { term: 'وضعیت سلامت معامله', meaning: 'شاخصی که نشان می‌دهد سرعت پاسخگویی و شفافیت اطلاعات در این معامله چقدر مناسب بوده است.' },
        { term: 'تغییر مرحله دستی یا خودکار', meaning: 'می‌توانید وضعیت هر سفارش را مستقیماً از منوی پایین کارت به مرحله بعدی جابه‌جا کنید.' },
      ],
      realExampleTitle: 'مثال کاربردی برای صاحب کسب‌وکار',
      realExampleText:
        'زمانی که ۱۰ مشتری هم‌زمان در واتساپ پیام می‌دهند، با نگاه کردن به ستون «پاسخ به اعتراضات» دقیقاً می‌فهمید کدام سفارش‌ها نزدیک به نهایی‌شدن هستند و چقدر ارزش ریالی در صف خرید دارید.',
    },
    leads: {
      key: 'leads',
      title: 'کاتالوگ راهنمای سرنخ‌ها و ارزیابی هوشمند',
      subtitle: 'شناسایی مشتریان جدی از میان پیام‌های روزمره و نگارش خودکار پیام پیگیری متناسب با هر خریدار',
      whyItMatters:
        'همه پیام‌های ورودی ارزش تجاری یکسان ندارند. این بخش با امتیازدهی هوشمند مشخص می‌کند کدام خریداران بیشترین آمادگی برای خرید فوری را دارند.',
      steps: [
        {
          stepNumber: '۰۱',
          title: 'بررسی صف سرنخ‌های ورودی',
          detail: 'فهرست مشتریان علاقه‌مند به همراه کانال ورودی (واتساپ یا اینستاگرام) و ارزش تخمینی خرید در این صفحه نمایش داده می‌شود.',
        },
        {
          stepNumber: '۰۲',
          title: 'سنجش امتیاز انطباق و قصد خرید',
          detail: 'مشتریانی که امتیاز انطباق بالاتر و قصد خرید جدی دارند در اولویت پاسخگویی و پیگیری سریع قرار می‌گیرند.',
        },
        {
          stepNumber: '۰۳',
          title: 'تولید پیام پیگیری آماده ارسال',
          detail: 'با کلیک روی هر سرنخ، هوش مصنوعی پیام شخصی‌سازی‌شده و محترمانه متناسب با نیاز همان مشتری را آماده می‌کند.',
        },
      ],
      definitions: [
        { term: 'امتیاز انطباق', meaning: 'عددی بین ۰ تا ۱۰۰ که میزان هم‌خوانی نیاز مشتری با محصولات و خدمات شما را نشان می‌دهد.' },
        { term: 'سطح قصد خرید', meaning: 'نشان‌دهنده میزان فوریت مشتری برای خرید (بالا، متوسط یا کم) بر اساس لحن و سوالات او.' },
        { term: 'ثبت سرنخ جدید', meaning: 'امکان افزودن دستی مشتریان تلفنی یا حضوری به صف ارزیابی هوشمند.' },
      ],
      realExampleTitle: 'چطور بیشترین نتیجه را بگیرید؟',
      realExampleText:
        'هر روز صبح روی سرنخ‌هایی با امتیاز بالای ۸۵ کلیک کنید، پیام پیشنهادی تولیدشده توسط دستیار را بررسی کنید و بلافاصله برای پیگیری در واتساپ بفرستید.',
    },
    campaigns: {
      key: 'campaigns',
      title: 'کاتالوگ راهنمای کمپین‌های جدید و ارتباطات',
      subtitle: 'راه‌اندازی کمپین‌های هدفمند در واتساپ و اینستاگرام برای جذب سرنخ‌های تازه و بازگرداندن مشتریان مردد',
      whyItMatters:
        'برای رشد پایدار فروش نباید فقط منتظر پیام مشتری ماند. بخش کمپین‌ها به شما اجازه می‌دهد پیام‌های هدفمند ارسال کنید و اثرگذاری هر کانال را دقیق اندازه‌گیری نمایید.',
      steps: [
        {
          stepNumber: '۰۱',
          title: 'تعریف هدف و نام کمپین جدید',
          detail: 'با دکمه ساخت کمپین جدید، عنوان کمپین را متناسب با محصول یا جشنواره فروش خود ثبت کنید.',
        },
        {
          stepNumber: '۰۲',
          title: 'انتخاب کانال ارتباطی مناسب',
          detail: 'کانال اصلی ارتباط با مشتریان هدف خود را از میان واتساپ، اینستاگرام، ایمیل یا ترکیب چندکاناله انتخاب نمایید.',
        },
        {
          stepNumber: '۰۳',
          title: 'پایش نرخ بازشدن، پاسخ و تبدیل به خرید',
          detail: 'عملکرد هر کمپین را با سه شاخص عددی دقیق بررسی کنید و با دکمه بهینه‌سازی، متن پیام‌ها را ارتقا دهید.',
        },
      ],
      definitions: [
        { term: 'نرخ مشاهده', meaning: 'درصدی از مخاطبان که پیام کمپین شما را باز کرده و خوانده‌اند.' },
        { term: 'نرخ پاسخ', meaning: 'درصدی از دریافت‌کنندگان که به پیام واکنش نشان داده و وارد گفتگو با ایجنت فروش شده‌اند.' },
        { term: 'نرخ تبدیل به خرید', meaning: 'مهم‌ترین شاخص تجاری که نشان می‌دهد چند درصد از مخاطبان کمپین واقعاً سفارش ثبت کرده‌اند.' },
      ],
      realExampleTitle: 'ایده کمپین آماده برای شروع',
      realExampleText:
        'یک کمپین در واتساپ برای مشتریانی بسازید که هفته گذشته قیمت را پرسیده‌اند ولی خرید را نهایی نکرده‌اند؛ دستیار هوشمند می‌تواند با پیگیری محترمانه بخشی از این فروش‌های نیمه‌کاره را بازیابی کند.',
    },
  },
  en: {
    'ai-agent': {
      key: 'ai-agent',
      title: 'AI Digital Sales Agent Guide Catalog',
      subtitle: 'Step-by-step guide to activating, configuring, and testing your WhatsApp & Instagram sales representative',
      whyItMatters:
        'As a subscribed business owner, you joined RevAgent to deploy a true digital sales rep—not a generic FAQ bot—capable of qualifying needs, presenting verified pricing, handling buyer objections, and confirming orders.',
      steps: [
        {
          stepNumber: '01',
          title: 'Connect WhatsApp Business & Instagram DM',
          detail: 'Route incoming buyer messages from your social and messaging channels directly into one unified sales agent.',
        },
        {
          stepNumber: '02',
          title: 'Set Verified Catalog & Handoff Limits',
          detail: 'Provide approved pricing, stock rules, and maximum discount thresholds so the agent escalates edge cases to humans.',
        },
        {
          stepNumber: '03',
          title: 'Verify Quality in Live Customer Simulator',
          detail: 'Switch to Simulator Mode and message the agent like a real buyer before routing live customer traffic.',
        },
      ],
      definitions: [
        { term: 'Owner Strategy Advisor', meaning: 'Guides you in refining sales scripts, qualification criteria, and objection playbooks.' },
        { term: 'Live Buyer Simulator', meaning: 'Lets you role-play as a prospective WhatsApp or Instagram buyer to verify accuracy and tone.' },
        { term: 'Human Escalation Rule', meaning: 'Automatic boundary that transfers sensitive disputes or custom quotes to a human manager.' },
      ],
      realExampleTitle: 'Version 1 Pilot Workflow',
      realExampleText:
        'A customer messages on Instagram asking about pricing. Your agent clarifies their timeline and budget, recommends the right tier, resolves a delivery question, and logs the confirmed booking.',
    },
    pipeline: {
      key: 'pipeline',
      title: 'Sales Pipeline & Order Cycle Catalog',
      subtitle: 'Understand every stage from initial buyer inquiry to confirmed order or human handoff',
      whyItMatters:
        'Visualizing every active conversation prevents lost deals across busy WhatsApp and Instagram inboxes and shows exact revenue waiting to close.',
      steps: [
        {
          stepNumber: '01',
          title: 'Capture Qualified Buyer Inquiries',
          detail: 'Conversations with confirmed purchase intent enter the first stage automatically.',
        },
        {
          stepNumber: '02',
          title: 'Progress Through Discovery & Objection Handling',
          detail: 'Deals advance as the agent shares verified quotes and addresses buyer concerns.',
        },
        {
          stepNumber: '03',
          title: 'Confirm Order or Escalate Exception',
          detail: 'Confirmed orders move to Closed Won while special commercial requests route cleanly to human owners.',
        },
      ],
      definitions: [
        { term: 'Win Probability', meaning: 'Estimated likelihood of closing based on current stage progression.' },
        { term: 'Deal Health', meaning: 'Measures responsiveness and commercial clarity across the sales thread.' },
        { term: 'Stage Selector', meaning: 'Allows manual stage overrides directly on any order card.' },
      ],
      realExampleTitle: 'Daily Owner Routine',
      realExampleText:
        'Check the Objection Handling column each afternoon to spot high-value orders awaiting final confirmation or human approval.',
    },
    leads: {
      key: 'leads',
      title: 'Leads & Smart Evaluation Catalog',
      subtitle: 'Prioritize high-intent prospects and generate tailored WhatsApp or Instagram follow-ups',
      whyItMatters:
        'Not every inbound message carries the same buying urgency. Fit scoring highlights ready-to-buy prospects so your team focuses where revenue closes fastest.',
      steps: [
        {
          stepNumber: '01',
          title: 'Review the Inbound Queue',
          detail: 'Inspect buyer details, channel source, and estimated order value in one unified list.',
        },
        {
          stepNumber: '02',
          title: 'Sort by Fit Score & Intent Level',
          detail: 'Prioritize leads scoring above 85 with strong budget and timeline alignment.',
        },
        {
          stepNumber: '03',
          title: 'Generate Instant Personalized Outreach',
          detail: 'Click any lead to draft a tailored message ready to copy into WhatsApp or Instagram.',
        },
      ],
      definitions: [
        { term: 'Fit Score', meaning: 'A 0 to 100 alignment rating comparing buyer needs against your product offering.' },
        { term: 'Purchase Intent', meaning: 'Indicates urgency (High, Medium, Low) extracted from buyer questions.' },
        { term: 'Qualify New Lead', meaning: 'Add offline or referral inquiries directly into the scoring queue.' },
      ],
      realExampleTitle: 'Turning Inquiries Into Orders',
      realExampleText:
        'Select any lead with High intent and use the AI Message Composer to send a warm, context-aware follow-up within seconds.',
    },
    campaigns: {
      key: 'campaigns',
      title: 'Campaigns & Outreach Guide Catalog',
      subtitle: 'Launch structured WhatsApp and Instagram campaigns and measure real conversion lift',
      whyItMatters:
        'Consistent revenue growth combines inbound responsiveness with proactive outreach to re-engage hesitant buyers and promote new offers.',
      steps: [
        {
          stepNumber: '01',
          title: 'Define Campaign Name & Goal',
          detail: 'Use Create Campaign to launch a targeted offer or follow-up sequence.',
        },
        {
          stepNumber: '02',
          title: 'Choose Your Primary Channel',
          detail: 'Target WhatsApp, Instagram, Email, or Multi-Channel outreach based on where your buyers reply fastest.',
        },
        {
          stepNumber: '03',
          title: 'Track Open, Reply & Order Conversion',
          detail: 'Compare real conversion rates across channels rather than relying on vanity reach numbers.',
        },
      ],
      definitions: [
        { term: 'Open Rate', meaning: 'Percentage of reached prospects who viewed your campaign message.' },
        { term: 'Reply Rate', meaning: 'Share of recipients who engaged in a two-way conversation with your agent.' },
        { term: 'Conversion', meaning: 'Percentage of campaign contacts who completed an order or booking.' },
      ],
      realExampleTitle: 'High-ROI First Campaign',
      realExampleText:
        'Start with a WhatsApp recovery campaign targeting buyers who asked for pricing last week but never completed checkout.',
    },
  },
  id: {
    'ai-agent': {
      key: 'ai-agent',
      title: 'Katalog Panduan Agen Penjualan Digital AI',
      subtitle: 'Panduan lengkap mengaktifkan, mengatur, dan menguji agen penjualan WhatsApp & Instagram Anda',
      whyItMatters:
        'Sebagai pemilik bisnis berlangganan, Anda menggunakan RevAgent untuk memiliki perwakilan penjualan digital nyata—bukan sekadar bot tanya-jawab—yang mampu menggali kebutuhan, memberi harga resmi, menjawab keberatan, dan mencatat pesanan.',
      steps: [
        {
          stepNumber: '01',
          title: 'Hubungkan WhatsApp Business & Instagram DM',
          detail: 'Sambungkan saluran pesan bisnis Anda agar setiap pertanyaan calon pembeli masuk langsung ke agen penjualan.',
        },
        {
          stepNumber: '02',
          title: 'Tetapkan Katalog Resmi & Batas Wewenang',
          detail: 'Masukkan harga terverifikasi, stok, serta batas diskon agar agen mengalihkan kasus khusus ke tim manusia.',
        },
        {
          stepNumber: '03',
          title: 'Uji Akurasi di Simulasi Chat Pembeli',
          detail: 'Gunakan mode simulasi untuk menguji jawaban agen layaknya pembeli asli sebelum trafik pelanggan dibuka.',
        },
      ],
      definitions: [
        { term: 'Konsultan Pemilik Bisnis', meaning: 'Membantu Anda merancang skrip penjualan, pertanyaan kualifikasi, dan strategi penanganan keberatan.' },
        { term: 'Simulasi Chat Pembeli', meaning: 'Uji coba percakapan langsung sebagai pelanggan WhatsApp atau Instagram untuk memastikan kualitas respons.' },
        { term: 'Aturan Alih ke Staf Manusia', meaning: 'Batas otomatis yang meneruskan negosiasi khusus atau keluhan sensitif kepada manajer manusia.' },
      ],
      realExampleTitle: 'Alur Pilot Pasar Indonesia (Versi 1)',
      realExampleText:
        'Pembeli bertanya harga lewat Instagram DM; agen AI menggali kebutuhan dan anggaran mereka, merekomendasikan paket terbaik, menjawab pertanyaan pengiriman, lalu mengonfirmasi pesanan.',
    },
    pipeline: {
      key: 'pipeline',
      title: 'Katalog Panduan Pipeline & Alur Pesanan',
      subtitle: 'Pantau perjalanan setiap transaksi dari pesan pertama hingga konfirmasi pesanan atau eskalasi',
      whyItMatters:
        'Papan pipeline memastikan tidak ada pesan calon pembeli di WhatsApp atau Instagram yang terlewat dan memperlihatkan nilai transaksi yang siap ditutup.',
      steps: [
        {
          stepNumber: '01',
          title: 'Tangkap Pertanyaan dengan Niat Beli',
          detail: 'Percakapan yang menunjukkan minat beli otomatis masuk ke tahap awal.',
        },
        {
          stepNumber: '02',
          title: 'Lanjut ke Penawaran & Penanganan Keberatan',
          detail: 'Transaksi berpindah tahap saat agen memberi penawaran harga dan menjawab keraguan pembeli.',
        },
        {
          stepNumber: '03',
          title: 'Konfirmasi Pesanan atau Alihkan ke Manusia',
          detail: 'Pesanan yang disetujui pembeli masuk ke kolom dikonfirmasi, sementara permintaan khusus diserahkan ke staf.',
        },
      ],
      definitions: [
        { term: 'Peluang Deal', meaning: 'Perkiraan persentase keberhasilan transaksi berdasarkan tahap saat ini.' },
        { term: 'Kesehatan Transaksi', meaning: 'Indikator kecepatan respons dan kejelasan informasi dalam proses negosiasi.' },
        { term: 'Pemilih Tahap', meaning: 'Memungkinkan Anda memindahkan status pesanan secara langsung dari kartu transaksi.' },
      ],
      realExampleTitle: 'Rutinitas Harian Pemilik Bisnis',
      realExampleText:
        'Periksa kolom Penanganan Keberatan setiap sore untuk melihat pesanan bernilai besar yang hampir selesai atau memerlukan persetujuan diskon Anda.',
    },
    leads: {
      key: 'leads',
      title: 'Katalog Panduan Prospek & Penilaian AI',
      subtitle: 'Prioritaskan calon pembeli serius dan buat pesan tindak lanjut WhatsApp atau Instagram secara instan',
      whyItMatters:
        'Tidak semua pesan masuk memiliki urgensi yang sama. Skor kecocokan AI menyoroti calon pembeli yang paling siap bertransaksi.',
      steps: [
        {
          stepNumber: '01',
          title: 'Tinjau Antrean Prospek Masuk',
          detail: 'Lihat profil pembeli, saluran asal pesan, dan estimasi nilai belanja dalam satu daftar.',
        },
        {
          stepNumber: '02',
          title: 'Prioritaskan Berdasarkan Skor & Niat Beli',
          detail: 'Fokuskan perhatian pada prospek dengan skor di atas 85 yang anggaran dan kebutuhannya jelas.',
        },
        {
          stepNumber: '03',
          title: 'Buat Pesan Penawaran Otomatis',
          detail: 'Klik prospek mana saja untuk menyusun pesan tindak lanjut yang siap dikirim ke WhatsApp atau Instagram.',
        },
      ],
      definitions: [
        { term: 'Skor Kecocokan', meaning: 'Nilai 0 hingga 100 yang mengukur kesesuaian kebutuhan pembeli dengan produk Anda.' },
        { term: 'Tingkat Niat Beli', meaning: 'Mengukur seberapa mendesak kebutuhan pembeli (Tinggi, Sedang, Rendah).' },
        { term: 'Nilai Prospek Baru', meaning: 'Tambahkan prospek dari telepon atau toko fisik ke antrean penilaian AI.' },
      ],
      realExampleTitle: 'Mengubah Pertanyaan Menjadi Transaksi',
      realExampleText:
        'Pilih prospek dengan niat beli Tinggi lalu gunakan Pembuat Pesan AI untuk mengirim sapaan lanjutan yang relevan dalam hitungan detik.',
    },
    campaigns: {
      key: 'campaigns',
      title: 'Katalog Panduan Kampanye & Penjangkauan',
      subtitle: 'Buat kampanye WhatsApp dan Instagram terstruktur serta ukur konversi penjualan nyata',
      whyItMatters:
        'Pertumbuhan penjualan yang konsisten memadukan respons cepat pada pesan masuk dengan kampanye proaktif untuk menjangkau kembali pembeli yang masih ragu.',
      steps: [
        {
          stepNumber: '01',
          title: 'Tentukan Nama & Tujuan Kampanye',
          detail: 'Gunakan tombol Buat Kampanye Baru untuk meluncurkan promo atau urutan tindak lanjut.',
        },
        {
          stepNumber: '02',
          title: 'Pilih Saluran Penjangkauan Utama',
          detail: 'Pilih WhatsApp, Instagram, Email, atau Multi-Saluran sesuai kebiasaan pelanggan Anda.',
        },
        {
          stepNumber: '03',
          title: 'Pantau Tingkat Baca, Balas & Konversi',
          detail: 'Evaluasi efektivitas kampanye dari jumlah pesanan nyata yang dihasilkan.',
        },
      ],
      definitions: [
        { term: 'Tingkat Baca', meaning: 'Persentase penerima yang membuka dan membaca pesan kampanye Anda.' },
        { term: 'Tingkat Balas', meaning: 'Persentase penerima yang merespons dan mulai berdiskusi dengan agen.' },
        { term: 'Konversi Beli', meaning: 'Persentase kontak kampanye yang benar-benar menyelesaikan pesanan.' },
      ],
      realExampleTitle: 'Ide Kampanye Pertama dengan Hasil Cepat',
      realExampleText:
        'Mulailah dengan kampanye WhatsApp untuk menghubungi kembali pelanggan yang pekan lalu menanyakan harga namun belum menyelesaikan pembayaran.',
    },
  },
};
