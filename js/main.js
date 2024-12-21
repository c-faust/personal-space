// 打字效果
function typeEffect(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    // 实现打字效果
    const titleElement = document.querySelector('.typing-effect');
    typeEffect(titleElement, '欢迎来到我的个人空间');

    // 留言板功能增强
    initGuestbook();

    // 深色模式切换
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // 检查本地存储中的主题设置
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // 照片预览功能
    const modal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const closeBtn = document.getElementsByClassName('modal-close')[0];

    // 为所有图片添加点击事件
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.src;
            modalCaption.textContent = this.alt;
        });
    });

    // 关闭模态框
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 点击模态框外部也可以关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });

    // 修改流星生成函数以支持不同部分
    function createMeteor(container, className = '') {
        const meteorShower = container.querySelector('.meteor-shower');
        if (!meteorShower) return;
        
        const meteor = document.createElement('div');
        meteor.className = 'meteor ' + className;
        
        // 随机起始位置
        const startX = Math.random() * window.innerWidth;
        const startY = -50;
        
        // 随机大小和持续时间
        const size = Math.random() * 2 + 1;
        const duration = Math.random() * 1.5 + 0.5;
        
        meteor.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
        `;
        
        meteorShower.appendChild(meteor);
        
        meteor.addEventListener('animationend', () => {
            meteor.remove();
        });
    }

    // 为特定部分启动流星效果
    function startSectionMeteors(sectionId, interval = 2000, probability = 0.5) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // 初始化几个流星
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createMeteor(section, `${sectionId}-meteor`);
            }, Math.random() * 1500);
        }
        
        // 持续创建新的流星
        setInterval(() => {
            if (Math.random() > probability) {
                createMeteor(section, `${sectionId}-meteor`);
            }
        }, interval);
    }

    // 在 DOMContentLoaded 事件中启动所有流星效果
    startSectionMeteors('about', 2500, 0.6);  // 关于我部分，较少的流星
    startSectionMeteors('blog', 2000, 0.5);   // 博客部分，中等数量的流星
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 添加导航栏滚动效果
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > lastScrollY) {
        // 向下滚动
        navbar.classList.add('hidden');
    } else {
        // 向上滚动
        navbar.classList.remove('hidden');
    }
    lastScrollY = window.scrollY;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateNavbar();
        });
        ticking = true;
    }
});

// 优化滚动动画的触发时机
const observerOptions = {
    threshold: 0.15,  // 当元素15%进入视口时触发
    rootMargin: '0px 0px -10% 0px'  // 提前触发一点动画
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // 不要取消观察，这样可以重复触发动画
            // observer.unobserve(entry.target);
        } else {
            // 当元素离开视口时，移除visible类，这样再次滚动到时会重新触发动画
            entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// 留言板功能增强
function initGuestbook() {
    const JSONBIN_BIN_ID = '6766d0dce41b4d34e4691d94';
    const JSONBIN_API_KEY = '$2a$10$5L0KBFztkRjOUwQ.A2Z6s.VwLEUFdUFwR7w5GjXyJA4PbCYWZY5Xi';
    const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

    const messageForm = document.getElementById('message-form');
    const messagesContainer = document.getElementById('messages-container');
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.textContent = '加载中...';
    
    // 从服务器获取留言
    async function fetchMessages() {
        try {
            messagesContainer.appendChild(loadingIndicator);
            const response = await fetch(JSONBIN_URL, {
                headers: {
                    'X-Master-Key': JSONBIN_API_KEY
                }
            });
            if (!response.ok) throw new Error('获取留言失败');
            const data = await response.json();
            return data.record.messages || [];
        } catch (error) {
            console.error('获取留言失败:', error);
            showError('获取留言失败，请稍后重试');
            return [];
        } finally {
            loadingIndicator.remove();
        }
    }

    // 保存留言到服务器
    async function saveMessages(messages) {
        try {
            const response = await fetch(JSONBIN_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY
                },
                body: JSON.stringify({ messages })
            });
            if (!response.ok) throw new Error('保存留言失败');
            return true;
        } catch (error) {
            console.error('保存留言失败:', error);
            showError('保存留言失败，请稍后重试');
            return false;
        }
    }

    // 显示留言
    function displayMessages(messages) {
        if (messages.length === 0) {
            messagesContainer.innerHTML = '<div class="no-messages">还没有留言，来说点什么吧~</div>';
            return;
        }

        messagesContainer.innerHTML = messages.map((msg, index) => `
            <div class="message" style="animation: fadeIn 0.5s ease-out ${index * 0.1}s both;">
                <h4>${escapeHtml(msg.name)}</h4>
                <p>${escapeHtml(msg.message)}</p>
                <small>${msg.date}</small>
            </div>
        `).join('');
    }

    // HTML转义函数，防止XSS攻击
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 显示成功提示
    function showSuccess(message) {
        const successMessage = document.createElement('div');
        successMessage.className = 'message-toast success';
        successMessage.textContent = message;
        document.body.appendChild(successMessage);
        setTimeout(() => successMessage.remove(), 2000);
    }

    // 显示错误提示
    function showError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'message-toast error';
        errorMessage.textContent = message;
        document.body.appendChild(errorMessage);
        setTimeout(() => errorMessage.remove(), 3000);
    }

    // 提交新留言
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const messageInput = document.getElementById('message');
        const submitButton = messageForm.querySelector('button[type="submit"]');

        if (!nameInput.value.trim() || !messageInput.value.trim()) {
            showError('请填写名字和留言内容');
            return;
        }

        // 禁用提交按钮防止重复提交
        submitButton.disabled = true;
        submitButton.textContent = '提交中...';

        const newMessage = {
            name: nameInput.value.trim(),
            message: messageInput.value.trim(),
            date: new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        try {
            // 获取现有留言
            const messages = await fetchMessages();
            messages.unshift(newMessage);

            // 保存到服务器
            const success = await saveMessages(messages);
            if (success) {
                displayMessages(messages);
                messageForm.reset();
                showSuccess('留言成功！');
            }
        } catch (error) {
            showError('提交失败，请稍后重试');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = '发送留言';
        }
    });

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .loading-indicator {
            text-align: center;
            padding: 2rem;
            color: rgba(255, 255, 255, 0.7);
        }

        .no-messages {
            text-align: center;
            padding: 2rem;
            color: rgba(255, 255, 255, 0.7);
            font-style: italic;
        }

        .message-toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            z-index: 1000;
            animation: fadeInOut 2s forwards;
        }

        .message-toast.success {
            background: rgba(46, 204, 113, 0.9);
        }

        .message-toast.error {
            background: rgba(231, 76, 60, 0.9);
        }

        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -20px); }
            20% { opacity: 1; transform: translate(-50%, 0); }
            80% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -20px); }
        }
    `;
    document.head.appendChild(style);

    // 初始加载留言
    fetchMessages().then(displayMessages);
} 