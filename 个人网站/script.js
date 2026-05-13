const cursorGlow = document.querySelector(".cursor-glow");
const magneticItems = document.querySelectorAll(".magnetic");
const revealItems = document.querySelectorAll(".reveal");
const tiltItems = document.querySelectorAll("[data-tilt]");
const projectButtons = document.querySelectorAll("[data-project]");
const moduleLinks = document.querySelectorAll(".module-nav a");
const moduleSections = document.querySelectorAll(".module-section");

window.addEventListener("load", () => {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
});

const projects = [
  {
    tag: "Agent Product",
    metric: "投递转化 +38%",
    title: "AI 简历诊断 Agent",
    desc:
      "为求职者构建岗位匹配度分析、简历改写、面试题生成的一体化 Agent，将岗位 JD、候选人经历和 HR 评价标准结构化匹配。",
    impact: [
      ["我的贡献", "定义核心用户路径、Prompt 评价框架和结果可信度提示。"],
      ["关键权衡", "在“生成好看”和“保持真实”之间加入事实校验步骤。"],
      ["结果", "模拟用户测试中，平均修改时间从 90 分钟降到 24 分钟。"],
    ],
  },
  {
    tag: "RAG Knowledge Base",
    metric: "客服命中率 86%",
    title: "智能知识库问答",
    desc:
      "面向内部运营团队搭建 RAG 问答系统，把散落 SOP、FAQ、案例库统一成可追溯的智能助手。",
    impact: [
      ["我的贡献", "梳理知识切片规则、答案引用策略和低置信度转人工流程。"],
      ["关键权衡", "优先保障答案可解释性，而不是盲目追求生成速度。"],
      ["结果", "高频问题平均处理时长从 12 分钟降到 3.5 分钟。"],
    ],
  },
  {
    tag: "Growth Copilot",
    metric: "活动转化 +41%",
    title: "增长实验 Copilot",
    desc:
      "为增长团队设计 AI 辅助实验台，自动生成活动假设、用户分层、文案方案和复盘摘要。",
    impact: [
      ["我的贡献", "定义实验模板、指标看板、风险检查项和复盘输出结构。"],
      ["关键权衡", "把 AI 放在建议位，最终决策保留给业务负责人。"],
      ["结果", "单次实验准备周期从 2 天压缩到 4 小时。"],
    ],
  },
];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  observer.observe(item);
});

window.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY };
  if (!cursorGlow) return;
  cursorGlow.style.transform = `translate(${event.clientX - 144}px, ${event.clientY - 144}px)`;
});

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

tiltItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `perspective(1100px) rotateX(${y * -6}deg) rotateY(${x * 8}deg)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const project = projects[Number(button.dataset.project)];
    projectButtons.forEach((item) => item.classList.toggle("active", item === button));
    document.querySelector("#projectTag").textContent = project.tag;
    document.querySelector("#projectMetric").textContent = project.metric;
    document.querySelector("#projectTitle").textContent = project.title;
    document.querySelector("#projectDesc").textContent = project.desc;
    document.querySelector("#projectImpact").innerHTML = project.impact
      .map(([label, text]) => `<p><b>${label}</b>：${text}</p>`)
      .join("");
  });
});

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      moduleLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-38% 0px -52% 0px", threshold: 0 }
);

moduleSections.forEach((section) => navObserver.observe(section));

const canvas = document.querySelector("#signalCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let dust = [];
let pointer = { x: -9999, y: -9999 };

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({ length: Math.min(74, Math.floor(window.innerWidth / 18)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: Math.random() * 1.5 + 0.7,
    hue: Math.random() > 0.72 ? "107, 232, 255" : "215, 255, 104",
  }));
  dust = Array.from({ length: Math.min(150, Math.floor(window.innerWidth / 9)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.12,
    a: Math.random() * 0.22 + 0.05,
  }));
}

function drawSignals() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const gradient = ctx.createRadialGradient(
    window.innerWidth * 0.72,
    window.innerHeight * 0.18,
    0,
    window.innerWidth * 0.72,
    window.innerHeight * 0.18,
    window.innerWidth * 0.68
  );
  gradient.addColorStop(0, "rgba(107, 232, 255, 0.055)");
  gradient.addColorStop(0.45, "rgba(215, 255, 104, 0.025)");
  gradient.addColorStop(1, "rgba(9, 10, 15, 0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  dust.forEach((d) => {
    d.x += d.vx;
    d.y += d.vy;
    if (d.x < -20) d.x = window.innerWidth + 20;
    if (d.x > window.innerWidth + 20) d.x = -20;
    if (d.y < -20) d.y = window.innerHeight + 20;
    if (d.y > window.innerHeight + 20) d.y = -20;

    ctx.beginPath();
    ctx.arc(d.x, d.y, 0.65, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${d.a})`;
    ctx.fill();
  });

  particles.forEach((p, index) => {
    const pointerDistance = Math.hypot(p.x - pointer.x, p.y - pointer.y);
    if (pointerDistance < 180) {
      p.vx += (pointer.x - p.x) * 0.000018;
      p.vy += (pointer.y - p.y) * 0.000018;
    }

    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.998;
    p.vy *= 0.998;

    if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.hue}, 0.68)`;
    ctx.shadowColor = `rgba(${p.hue}, 0.45)`;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    for (let j = index + 1; j < particles.length; j += 1) {
      const q = particles[j];
      const distance = Math.hypot(p.x - q.x, p.y - q.y);
      if (distance < 150) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(107, 232, 255, ${0.16 - distance / 980})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  setTimeout(drawSignals, 36);
}

resizeCanvas();
drawSignals();
window.addEventListener("resize", resizeCanvas);
