document.addEventListener("DOMContentLoaded", function () {
    const toggler = document.querySelector(".chatbot-toggler");
    const windowEl = document.querySelector(".chatbot-window");
    const closeBtn = document.querySelector(".chat-close");
    const chatBody = document.querySelector(".chat-body");
    const chatInput = document.querySelector(".chat-input");
    const sendBtn = document.querySelector(".chat-send");
    const navbar = document.querySelector(".navbar");

    // Прокрутка вниз — всегда работает
    const scrollToBottom = () => {
        setTimeout(() => chatBody.scrollTop = chatBody.scrollHeight + 500, 50);
    };

    // Открытие/закрытие
    toggler.addEventListener("click", () => {
        windowEl.classList.toggle("show");
        if (windowEl.classList.contains("show")) {
            chatInput.focus();
            scrollToBottom();
        }
    });
    closeBtn.addEventListener("click", () => windowEl.classList.remove("show"));

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && windowEl.classList.contains("show")) windowEl.classList.remove("show");
    });

    document.addEventListener("click", e => {
        if (!windowEl.classList.contains("show")) return;
        const inside = windowEl.contains(e.target) || toggler.contains(e.target) || document.querySelector(".chatbot-hover-area").contains(e.target);
        if (!inside) windowEl.classList.remove("show");
    });

    // Добавление сообщения
    const addMessage = (text, sender) => {
        const div = document.createElement("div");
        div.className = `chat-message ${sender}`;
        div.innerHTML = text;
        chatBody.appendChild(div);
        scrollToBottom();
    };

    // Индикатор печати — теперь красиво и с именем
    let typingIndicator = null;
    const showTyping = () => {
        if (typingIndicator) typingIndicator.remove();
        typingIndicator = document.createElement("div");
        typingIndicator.className = "chat-message bot typing-indicator";
        typingIndicator.innerHTML = `
            <i class="fas fa-ellipsis-h typing-dots"></i>
            <i class="fas fa-ellipsis-h typing-dots"></i>
            <i class="fas fa-ellipsis-h typing-dots"></i>
            <span style="font-style:italic; margin-left:8px; color:#94a3b8;">Laira печатает…</span>
        `;
        chatBody.appendChild(typingIndicator);
        scrollToBottom();
    };
    const hideTyping = () => {
        if (typingIndicator) {
            typingIndicator.style.opacity = "0";
            setTimeout(() => typingIndicator?.remove(), 300);
            typingIndicator = null;
        }
    };

    // ──────── ОТВЕТЫ LAIRA — ЧИСТЫЕ, КРАСИВЫЕ, БЕЗ МАРКДАУНА ────────
    const botReply = (text) => {
        const msg = text.toLowerCase().trim();
        let reply = "";

        if (/привет|здравствуй|хай|hi|hello|добрый|прив/i.test(msg)) {
            reply = "Приветствую! Я Laira, ваш интеллектуальный ассистент из Design Lab. Я здесь, чтобы быстро ответить на ваши базовые вопросы. Могу рассказать об услугах, ценах или предоставить наши контакты. Чем я могу быть полезна?";
        }
        else if (/как дела|как ты/i.test(msg)) {
            reply = "Спасибо, всё отлично! Готова помочь с любым вопросом по дизайну.";
        }
        else if (/кто ты|представься/i.test(msg)) {
            reply = "Я — Laira, виртуальный ассистент Design Lab. Помогаю быстро узнать об услугах, ценах и контактах.";
        }
        else if (/услуг|дизайн|ui|ux|финтех|легалтех/i.test(msg)) {
            reply = `Мы специализируемся на UX/UI-дизайне для LegalTech и FinTech проектов.<br><br>
            • Лендинг / корпоративный сайт — от 250 000 ₽<br>
            • Веб-приложение (SaaS, личный кабинет) — от 800 000 ₽<br>
            • Мобильное приложение — от 1 200 000 ₽<br>
            • Полный редизайн продукта — от 1 500 000 ₽<br>
            • Аудит интерфейса — 150 000 ₽<br><br>
            Подробности — на странице <a href="services.html" target="_blank">Услуги</a>`;
        }
        else if (/цена|стоимост|сколько|бюджет/i.test(msg)) {
            reply = `Ориентировочные цены (2025):<br><br>
            • Лендинг — 250 000 – 600 000 ₽<br>
            • Веб-приложение — 800 000 – 2 500 000 ₽<br>
            • Мобильное приложение — 1 200 000 – 3 500 000 ₽<br>
            • Редизайн — от 1 500 000 ₽<br>
            • Аудит UX/UI — 150 000 ₽<br><br>
            Точная стоимость — после обсуждения. Напишите: <a href="mailto:1448884@gmail.com">1448884@gmail.com</a> или <a href="https://t.me/datalaw_rights" target="_blank">@datalaw_rights</a>`;
        }
        else if (/контакт|email|телеграм|связь/i.test(msg)) {
            reply = `Связаться с нами:<br><br>
            Email: <a href="mailto:1448884@gmail.com">1448884@gmail.com</a><br>
            Telegram: <a href="https://t.me/datalaw_rights" target="_blank">@datalaw_rights</a><br><br>
            Отвечаем в течение 1–2 часов в рабочее время.`;
        }
        else if (/стиль|neumorphism|dark/i.test(msg)) {
            reply = "Да, наш фирменный стиль — Dark Neumorphism. Он идеален для профессиональных инструментов: комфортно для глаз и современно.";
        }
        else if (/классно|круто|нравится|красиво/i.test(msg)) {
            reply = "Спасибо! Очень приятно, что вам понравился наш стиль и подход.";
        }
        else {
            reply = "Извините, я пока не совсем поняла ваш вопрос. Могу рассказать об услугах, ценах или контактах — уточните, пожалуйста!";
        }

        showTyping();
        setTimeout(() => {
            hideTyping();
            addMessage(reply, "bot");
        }, 1600 + Math.random() * 800);
    };

    // Отправка
    const handleSend = () => {
        const text = chatInput.value.trim();
        if (!text) return;
        addMessage(text, "user");
        chatInput.value = "";
        botReply(text);
    };
    sendBtn.addEventListener("click", handleSend);
    chatInput.addEventListener("keypress", e => e.key === "Enter" && handleSend());

    // Остальное (форма, уведомления, анимации) — без изменений
    const orderForm = document.getElementById("orderForm");
    const notificationContainer = document.createElement("div");
    notificationContainer.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:1050;";
    document.body.appendChild(notificationContainer);

    const showNotification = (msg, type = 'info') => {
        const n = document.createElement("div");
        n.className = `alert alert-${type} alert-dismissible fade show`;
        n.style.cssText = "background:var(--bg-element);color:var(--text-main);border-radius:12px;border:1px solid rgba(255,255,255,.1);box-shadow:0 10px 20px rgba(0,0,0,.4);margin-top:10px;max-width:300px;text-align:center;";
        n.innerHTML = `${msg}<button type="button" class="btn-close" data-bs-dismiss="alert" style="filter:invert(1);"></button>`;
        notificationContainer.appendChild(n);
        setTimeout(() => { n.classList.remove('show'); n.classList.add('fade'); setTimeout(() => n.remove(), 400); }, 5000);
    };

    if (orderForm) {
        orderForm.addEventListener("submit", e => {
            e.preventDefault();
            showNotification("Заявка успешно отправлена!", 'success');
            orderForm.reset();
        });
    }

    const els = document.querySelectorAll('[data-animate="fade-in-up"]');
    els.forEach(el => el.style.opacity = "0");
    const check = () => {
        els.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 50) {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }
        });
    };
    window.addEventListener('scroll', check);
    check();

    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
        document.body.classList.add('loaded');
        if (typeof AOS !== 'undefined') AOS.init({ duration: 800, once: true });
    });
});