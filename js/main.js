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

    // 留言板功能
    const messageForm = document.getElementById('message-form');
    const messagesContainer = document.getElementById('messages-container');

    // 从localStorage获取已存在的留言
    const messages = JSON.parse(localStorage.getItem('messages')) || [];

    // 显示已有留言
    function displayMessages() {
        messagesContainer.innerHTML = messages.map(msg => `
            <div class="message">
                <h4>${msg.name}</h4>
                <p>${msg.message}</p>
                <small>${msg.date}</small>
            </div>
        `).join('');
    }

    // 提交新留言
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;

        const newMessage = {
            name,
            message,
            date: new Date().toLocaleString()
        };

        messages.unshift(newMessage);
        localStorage.setItem('messages', JSON.stringify(messages));
        
        displayMessages();
        messageForm.reset();
    });

    // 初始显示留言
    displayMessages();

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

    // 流星效果
    function createMeteor() {
        const meteorShower = document.querySelector('.meteor-shower');
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // 随机起始位置
        const startX = Math.random() * window.innerWidth;
        const startY = -50; // 从屏幕顶部开始
        
        // 随机大小
        const size = Math.random() * 2 + 1;
        
        // 随机动画持续时间
        const duration = Math.random() * 1 + 0.5;
        
        meteor.style.cssText = `
            left: ${startX}px;
            top: ${startY}px;
            width: ${size}px;
            height: ${size}px;
            animation-duration: ${duration}s;
        `;
        
        meteorShower.appendChild(meteor);
        
        // 动画结束后移除流星
        meteor.addEventListener('animationend', () => {
            meteor.remove();
        });
    }

    // 定期创建新的流星
    function startMeteorShower() {
        // 初始创建几个流星
        for (let i = 0; i < 5; i++) {
            setTimeout(createMeteor, Math.random() * 1500);
        }
        
        // 持续创建新的流星
        setInterval(() => {
            if (Math.random() > 0.5) { // 50%的概率创建新流星
                createMeteor();
            }
        }, 800);
    }

    startMeteorShower();
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