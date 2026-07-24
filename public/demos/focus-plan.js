(function () {
  "use strict";

  var currentView = "today";
  var lastBusinessView = "today";
  var currentSetting = "profile";
  var currentReviewRange = "week";
  var timerSeconds = 50 * 60;
  var timerTotal = timerSeconds;
  var elapsedSeconds = 0;
  var timerId = null;
  var draggedTask = null;
  var pendingTask = null;
  var toastTimer = null;
  var reviewChart = null;
  var categoryChart = null;
  var planGraph = null;
  var planSplitPercent = 55;
  var planSplitPointer = null;
  var planHighlightTimer = null;
  var planGraphResizeTimer = null;
  var selectedPlanContext = "practice";
  var countPlayed = false;
  var currentMonthKey = "";
  var currentMonthDays = 31;
  var planDayOrder = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  var selectedMobilePlanDay = "mon";
  var selectedPlanTaskIndex = -1;
  var planGraphContexts = {
    career: {
      title: "职业能力提升计划 · 全景",
      progress: "8 / 12 项完成",
      activeId: "career-plan",
      nodes: [
        { id: "career-plan", label: "职业能力提升计划", meta: "PLAN", kind: "plan" },
        { id: "foundation-stage", label: "基础学习", meta: "STAGE", kind: "stage", parent: "career-plan" },
        { id: "practice-stage", label: "实践训练", meta: "STAGE", kind: "stage", parent: "career-plan" },
        { id: "review-stage", label: "回顾提升", meta: "STAGE", kind: "stage", parent: "career-plan" }
      ]
    },
    "career-all": {
      title: "全部阶段 · 推进路径",
      progress: "3 个阶段",
      activeId: "career-plan",
      nodes: [
        { id: "career-plan", label: "职业能力提升计划", meta: "PLAN", kind: "plan" },
        { id: "foundation-stage", label: "基础学习", meta: "4 / 5 项完成", kind: "stage", parent: "career-plan" },
        { id: "practice-stage", label: "实践训练", meta: "3 / 5 项完成", kind: "stage", parent: "career-plan" },
        { id: "review-stage", label: "回顾提升", meta: "1 / 2 项完成", kind: "stage", parent: "career-plan" }
      ]
    },
    foundation: {
      title: "基础学习 · 推进路径",
      progress: "2 项待推进",
      activeId: "foundation-stage",
      nodes: [
        { id: "career-plan", label: "职业能力提升计划", meta: "PLAN", kind: "plan" },
        { id: "foundation-stage", label: "基础学习", meta: "STAGE", kind: "stage", parent: "career-plan" },
        { id: "foundation-task-1", label: "复习核心概念", meta: "周一 09:00", kind: "task", parent: "foundation-stage" },
        { id: "foundation-task-2", label: "整理学习路径", meta: "周二 15:00", kind: "task", parent: "foundation-stage" }
      ]
    },
    practice: {
      title: "实践训练 · 推进路径",
      progress: "3 项待推进",
      activeId: "practice-stage",
      nodes: [
        { id: "career-plan", label: "职业能力提升计划", meta: "PLAN", kind: "plan" },
        { id: "practice-stage", label: "实践训练", meta: "STAGE", kind: "stage", parent: "career-plan" },
        { id: "practice-task-1", label: "完成实践练习", meta: "今天 10:30", kind: "task", parent: "practice-stage" },
        { id: "practice-task-2", label: "综合实践训练", meta: "周四 09:30", kind: "task", parent: "practice-stage" },
        { id: "practice-task-3", label: "阶段回顾检查", meta: "周五 15:00", kind: "task", parent: "practice-stage" }
      ]
    },
    reading: {
      title: "阅读与表达计划 · 推进路径",
      progress: "5 项任务",
      activeId: "reading-plan",
      nodes: [
        { id: "reading-plan", label: "阅读与表达计划", meta: "PLAN", kind: "plan" },
        { id: "reading-stage", label: "阅读训练", meta: "STAGE", kind: "stage", parent: "reading-plan" },
        { id: "reading-task-1", label: "阅读专题材料", meta: "周三 14:00", kind: "task", parent: "reading-stage" },
        { id: "reading-task-2", label: "整理阅读笔记", meta: "周一 14:00", kind: "task", parent: "reading-stage" }
      ]
    },
    independent: {
      title: "独立任务 · 本周安排",
      progress: "2 项待推进",
      activeId: "independent-task-1",
      nodes: [
        { id: "independent-task-1", label: "整理本周学习记录", meta: "周六 10:00", kind: "task" },
        { id: "independent-task-2", label: "归档阶段资料", meta: "周日 16:00", kind: "task" }
      ]
    }
  };
  var mobilePlanData = {
    mon: { tasks: [{ time: "09:00", name: "复习核心概念", meta: "理论学习", minutes: 50, tone: "indigo" }, { time: "14:00", name: "整理阅读笔记", meta: "阅读整理", minutes: 40, tone: "amber" }] },
    tue: { tasks: [{ time: "10:00", name: "数据结构练习", meta: "实践训练", minutes: 90, tone: "green" }, { time: "15:00", name: "整理学习路径", meta: "阅读整理", minutes: 50, tone: "indigo" }] },
    wed: { tasks: [{ time: "10:30", name: "完成实践练习", meta: "实践训练", minutes: 50, tone: "indigo" }, { time: "14:00", name: "阅读专题材料", meta: "阅读整理", minutes: 40, tone: "amber" }] },
    thu: { tasks: [{ time: "09:30", name: "综合实践训练", meta: "实践训练", minutes: 90, tone: "green" }] },
    fri: { tasks: [{ time: "15:00", name: "阶段回顾检查", meta: "测试评估", minutes: 50, tone: "indigo" }] },
    sat: { tasks: [] },
    sun: { tasks: [] }
  };
  var reviewData = {
    day: {
      title: "今日完成轨迹",
      subtitle: "任务完成时段与每段实际投入",
      insight: "今天已完成 3 个学习块，14:00 后的两次专注都超过 40 分钟。",
      statLabels: ["今日完成率", "实际投入", "最长专注"],
      stats: ["75.0%", "2.8 小时", "52.0 分钟"],
      categories: [{ name: "实践训练", value: 1.2 }, { name: "理论学习", value: 0.8 }, { name: "阅读整理", value: 0.5 }, { name: "复习巩固", value: 0.3 }]
    },
    week: {
      title: "本周投入节奏",
      subtitle: "稳定性、计划偏差与每日节奏",
      insight: "本周有 5 天保持稳定投入，实际专注比上周增加 2.4 小时。",
      statLabels: ["完成率", "平均专注", "高效时段"],
      stats: ["76.4%", "43.5 分钟", "14:00-16:00"],
      categories: [{ name: "理论学习", value: 4.8 }, { name: "实践训练", value: 4.1 }, { name: "阅读整理", value: 2.7 }, { name: "复习巩固", value: 2.0 }]
    },
    month: {
      title: "本月学习积累",
      subtitle: "每天的一点投入，正在连成长期进步",
      insight: "7 月已经积累 48.6 小时，比 6 月同期多 9.2 小时，完成任务增加 18 项。",
      statLabels: ["本月完成率", "累计投入", "推进 Stage"],
      stats: ["81.7%", "48.6 小时", "3.0 个"],
      categories: [{ name: "实践训练", value: 16.8 }, { name: "理论学习", value: 13.2 }, { name: "阅读整理", value: 10.1 }, { name: "复习巩固", value: 8.5 }]
    }
  };
  var legalDocuments = {
    terms: {
      title: "用户协议",
      content: "<h3>一、服务说明</h3><p>时序 Focus Plan 为个人学习计划、专注记录与复盘工具。用户应按照页面规则创建和管理自己的账号与数据。</p><h3>二、账号责任</h3><p>用户应妥善保管密码和恢复码，不得冒用他人账号、干扰服务运行或利用服务从事违法活动。</p><h3>三、数据与内容</h3><p>用户保留其学习计划和记录的权利，并授权服务为实现同步、统计和备份所必需地处理这些数据。</p><h3>四、服务变更与终止</h3><p>重要规则变化会提前说明。用户可以随时退出或申请注销账号；注销完成后相关数据不可恢复。</p><h3>五、未成年人</h3><p>首期服务仅面向年满 14 周岁的用户。未满 14 周岁的用户请勿注册或使用。</p><h3>六、联系与生效</h3><p>协议版本和生效日期会在正式发布前补充，问题可通过应用商店公布的联系渠道反馈。</p>"
    },
    privacy: {
      title: "隐私政策",
      content: "<h3>一、我们处理的信息</h3><p>包括登录用户名、显示名称、头像、设备会话、Plan、Stage、Task、专注片段、设置和必要的同步状态。</p><h3>二、处理目的</h3><p>用于账号登录、多端同步、专注计时、计划管理、统计复盘、安全控制和故障恢复，不用于广告画像。</p><h3>三、保存与安全</h3><p>业务数据按 userId 隔离。密码和恢复码仅保存不可逆摘要，长期令牌使用平台安全存储。</p><h3>四、共享与第三方</h3><p>正式版本会逐项披露第三方 SDK、处理目的和隐私政策。未披露的 SDK 不得接入正式版本。</p><h3>五、用户权利</h3><p>用户可以访问、更正、导出或删除个人数据，撤销非必要授权，并在应用内注销账号。</p><h3>六、政策更新</h3><p>发生实质变化时会重新提示并征得同意。正式上架版本将提供可公开访问的政策地址、版本号和联系方式。</p>"
    },
    collection: {
      title: "个人信息收集清单",
      content: "<h3>账号信息</h3><p>登录用户名：登录和账号识别；显示名称、头像：用户设置展示。</p><h3>设备与安全</h3><p>设备名称、平台、最近活跃时间和会话标识：设备识别、登录安全和远程退出。</p><h3>学习业务数据</h3><p>计划、阶段、任务、学习方向、专注片段和设置：提供核心功能、多端同步与复盘统计。</p><h3>保存方式</h3><p>服务端按账号隔离保存；客户端仅缓存离线使用所需数据。账号注销后按正式政策约定执行删除。</p>"
    },
    permissions: {
      title: "权限与第三方 SDK",
      content: "<h3>权限使用</h3><p>相册或文件权限仅在用户主动选择头像时申请；通知权限仅在通知模块上线且用户主动启用时申请。拒绝不会影响计划与专注核心功能。</p><h3>第三方 SDK</h3><p>当前概念版本未接入第三方业务 SDK。正式版本如新增统计、崩溃分析或推送 SDK，必须在此列出名称、提供方、目的、数据类型和隐私政策链接。</p>"
    },
    minor: {
      title: "未成年人保护说明",
      content: "<h3>年龄范围</h3><p>首期仅面向年满 14 周岁的用户，注册时需要主动确认年龄，但不额外收集出生日期。</p><h3>处理方式</h3><p>发现不符合年龄要求的账号时，将停止提供服务并按适用规则处理相关信息。后续如面向未满 14 周岁用户开放，将先建立监护人同意和儿童个人信息保护机制。</p>"
    },
    cancellation: {
      title: "账号注销说明",
      content: "<h3>入口与验证</h3><p>用户设置 → 账号与安全 → 注销账号。需要当前密码、图形验证码、输入登录用户名并二次确认。</p><h3>删除范围</h3><p>注销将永久删除账号资料、Plan、Stage、Task、专注记录、学习方向和设备会话，操作不可撤销。</p><h3>处理结果</h3><p>注销完成后所有设备退出登录。正式发布前会补充处理时限、例外保留依据和联系渠道。</p>"
    }
  };

  function byId(id) { return document.getElementById(id); }
  function on(id, eventName, handler) {
    var node = byId(id);
    if (node) node.addEventListener(eventName, handler);
  }
  function renderIcons() {
    if (window.lucide) window.lucide.createIcons({ attrs: { width: 18, height: 18, "stroke-width": 1.8 } });
  }
  function showToast(message) {
    var toast = byId("toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toast.classList.remove("show"); }, 2200);
  }
  function pad(value) { return String(value).padStart(2, "0"); }
  function formatDuration(minutes) {
    var hours = Math.floor(minutes / 60);
    var rest = minutes % 60;
    return hours ? hours + "h" + (rest ? " " + rest + "m" : "") : rest + "m";
  }
  function addMinutes(time, minutes) {
    var parts = time.split(":").map(Number);
    var total = (parts[0] * 60 + parts[1] + minutes + 1440) % 1440;
    return pad(Math.floor(total / 60)) + ":" + pad(total % 60);
  }
  function getBeijingParts() {
    var formatter = new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai", year: "numeric", month: "numeric", day: "numeric", weekday: "long"
    });
    var map = {};
    formatter.formatToParts(new Date()).forEach(function (part) { map[part.type] = part.value; });
    return { year: Number(map.year), month: Number(map.month), day: Number(map.day), weekday: map.weekday };
  }
  function isoWeek(date) {
    var copy = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    copy.setUTCDate(copy.getUTCDate() + 4 - (copy.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1));
    return Math.ceil((((copy - yearStart) / 86400000) + 1) / 7);
  }
  function formatMonthDay(date) { return (date.getUTCMonth() + 1) + "月" + date.getUTCDate() + "日"; }
  function initializeDates() {
    var now = getBeijingParts();
    var today = new Date(Date.UTC(now.year, now.month - 1, now.day));
    var monday = new Date(today);
    monday.setUTCDate(today.getUTCDate() - ((today.getUTCDay() + 6) % 7));
    var sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);
    var todayIndex = (today.getUTCDay() + 6) % 7;
    currentMonthKey = now.year + "-" + pad(now.month);
    currentMonthDays = new Date(Date.UTC(now.year, now.month, 0)).getUTCDate();
    var previousMonth = now.month === 1 ? 12 : now.month - 1;
    reviewData.month.insight = now.month + " 月已经积累 48.6 小时，比 " + previousMonth + " 月同期多 9.2 小时，完成任务增加 18 项。";
    selectedMobilePlanDay = planDayOrder[todayIndex];
    window.focusPlanViewCopy = {
      today: [formatMonthDay(today) + " · " + now.weekday + " · 第" + isoWeek(today) + "周", "把今天过得有节奏"],
      plan: ["本周 · " + formatMonthDay(monday) + " - " + formatMonthDay(sunday), "让目标落到具体时间"],
      focus: ["专注空间 · 当前任务", "只处理眼前这一件事"],
      review: ["学习复盘 · 数据实时计算", "看见积累，也看见下一步"],
      settings: ["用户中心", "我的"]
    };
    document.querySelectorAll("[data-plan-day]").forEach(function (button, index) {
      var date = new Date(monday);
      date.setUTCDate(monday.getUTCDate() + index);
      button.querySelector("strong").textContent = date.getUTCDate();
      var active = index === todayIndex;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", String(active));
      mobilePlanData[planDayOrder[index]].label = (active ? "今天" : "周" + "一二三四五六日"[index]) + " · " + formatMonthDay(date);
      var weekNode = document.querySelector('[data-week-day="' + index + '"]');
      if (weekNode) weekNode.textContent = (active ? "今天" : "周" + "一二三四五六日"[index]) + " · " + date.getUTCDate();
    });
    byId("mobileWeekRange").textContent = window.focusPlanViewCopy.plan[0];
    byId("authDate").textContent = formatMonthDay(today) + " · " + now.weekday + " · 北京时间";
    byId("taskDate").value = now.year + "-" + pad(now.month) + "-" + pad(now.day);
    byId("planStart").value = byId("taskDate").value;
    var endDate = new Date(today);
    endDate.setUTCDate(today.getUTCDate() + 90);
    byId("planEnd").value = endDate.getUTCFullYear() + "-" + pad(endDate.getUTCMonth() + 1) + "-" + pad(endDate.getUTCDate());
  }
  function setView(name) {
    if (name === "settings" && currentView !== "settings") lastBusinessView = currentView;
    if (name !== "settings") lastBusinessView = name;
    currentView = name;
    document.body.classList.toggle("plan-view-active", name === "plan");
    document.querySelectorAll(".view").forEach(function (view) { view.classList.toggle("active", view.id === "view-" + name); });
    document.querySelectorAll("[data-view]").forEach(function (button) { button.classList.toggle("active", button.dataset.view === name); });
    var copy = window.focusPlanViewCopy[name];
    byId("pageEyebrow").textContent = copy[0];
    byId("pageTitle").textContent = copy[1];
    byId("addTaskButton").hidden = name === "settings";
    byId("topbarAccountButton").hidden = name === "settings";
    byId("settingsBackButton").classList.toggle("show", name === "settings");
    if (name === "settings") showSettingPanel("profile");
    if (name === "review") window.setTimeout(function () { renderReview(currentReviewRange); animateCounts(); }, 80);
    if (name === "plan") window.setTimeout(renderPlanGraph, 80);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderTimer() {
    var safeSeconds = Math.max(0, timerSeconds);
    var timerText = String(Math.floor(safeSeconds / 60)).padStart(2, "0") + ":" + String(safeSeconds % 60).padStart(2, "0");
    document.querySelectorAll(".timer-value").forEach(function (node) { node.textContent = timerText; });
    var progress = timerTotal ? Math.max(0, Math.min(100, elapsedSeconds / timerTotal * 100)) : 0;
    document.querySelectorAll(".timer-progress span").forEach(function (node) { node.style.width = progress + "%"; });
    var actual = Math.floor(elapsedSeconds / 60);
    byId("todayActual").textContent = actual + " 分钟";
    byId("focusActual").textContent = actual + " 分钟";
    byId("todayRemaining").textContent = Math.ceil(safeSeconds / 60) + " 分钟";
    byId("completeActual").textContent = actual + " 分钟";
    byId("focusExpectedEnd").textContent = new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", hour12: false
    }).format(new Date(Date.now() + safeSeconds * 1000));
    byId("breakNote").classList.toggle("show", actual >= 40);
  }
  function renderTimerButtons(running) {
    document.querySelectorAll(".timer-toggle").forEach(function (button) {
      button.innerHTML = running ? '<i data-lucide="pause"></i><span>暂停</span>' : '<i data-lucide="play"></i><span>' + (elapsedSeconds ? "继续专注" : "开始专注") + "</span>";
    });
    byId("focusState").textContent = running ? "正在专注" : elapsedSeconds ? "已暂停" : "准备开始";
    renderIcons();
  }
  function stopTimer() {
    window.clearInterval(timerId);
    timerId = null;
    renderTimerButtons(false);
  }
  function toggleTimer() {
    if (timerId) { stopTimer(); showToast("专注已暂停，本轮记录会保留"); return; }
    timerId = window.setInterval(function () {
      timerSeconds -= 1;
      elapsedSeconds += 1;
      renderTimer();
      if (timerSeconds <= 0) { stopTimer(); byId("focusCompleteDialog").showModal(); }
    }, 1000);
    renderTimerButtons(true);
    showToast("专注已开始");
  }
  function applyDuration(minutes, extend) {
    if (!Number.isInteger(minutes) || minutes < 1) { showToast("请输入正整数分钟"); return false; }
    stopTimer();
    if (extend) { timerTotal += minutes * 60; timerSeconds += minutes * 60; }
    else { timerTotal = minutes * 60; timerSeconds = timerTotal; elapsedSeconds = 0; }
    renderTimer();
    return true;
  }
  function resetFocus() {
    stopTimer();
    timerTotal = 50 * 60;
    timerSeconds = timerTotal;
    elapsedSeconds = 0;
    renderTimer();
  }

  function updateDoneCount() {
    var count = document.querySelectorAll("#taskList .task-row.done").length;
    byId("doneCount").textContent = count;
    byId("mobileDoneCount").textContent = count;
  }
  function markTaskDone(task, actualMinutes) {
    if (!task) return;
    task.classList.add("done");
    task.querySelector(".check").innerHTML = '<i data-lucide="check" width="13"></i>';
    var meta = task.querySelector(".task-copy span");
    meta.textContent = meta.textContent.replace(/待开始|当前任务/, "已完成") + (actualMinutes !== null ? " · 实际 " + actualMinutes + " 分钟" : "");
    updateDoneCount();
    renderIcons();
  }
  function bindTask(task) {
    task.querySelector(".check").addEventListener("click", function () {
      if (task.classList.contains("done")) {
        task.classList.remove("done");
        task.querySelector(".check").innerHTML = "";
        updateDoneCount();
        renderIcons();
        showToast("任务已恢复，可继续完成");
        return;
      }
      pendingTask = task;
      if (task.classList.contains("current") || elapsedSeconds > 0) byId("focusCompleteDialog").showModal();
      else byId("manualCompleteDialog").showModal();
    });
    task.addEventListener("dragstart", function () { draggedTask = task; task.classList.add("dragging"); });
    task.addEventListener("dragend", function () { task.classList.remove("dragging"); draggedTask = null; showToast("任务顺序已更新"); });
    task.addEventListener("dragover", function (event) {
      event.preventDefault();
      if (!draggedTask || draggedTask === task) return;
      var box = task.getBoundingClientRect();
      byId("taskList").insertBefore(draggedTask, event.clientY < box.top + box.height / 2 ? task : task.nextSibling);
    });
  }
  function renderMobilePlan() {
    var day = mobilePlanData[selectedMobilePlanDay];
    var list = byId("mobilePlanList");
    var totalMinutes = day.tasks.reduce(function (sum, task) { return sum + task.minutes; }, 0);
    byId("mobilePlanDate").textContent = day.label;
    byId("mobilePlanSummary").textContent = day.tasks.length + " 项" + (totalMinutes ? " · " + formatDuration(totalMinutes) : "");
    list.replaceChildren();
    if (!day.tasks.length) {
      var empty = document.createElement("div");
      empty.className = "mobile-empty";
      empty.textContent = "当天暂无安排";
      list.appendChild(empty);
      return;
    }
    day.tasks.forEach(function (task, index) {
      var card = document.createElement("article");
      card.className = "mobile-plan-card";
      card.dataset.tone = task.tone;
      card.innerHTML = '<time class="mobile-plan-time"></time><div class="mobile-plan-copy"><strong></strong><span></span></div><button class="button ghost icon" type="button" aria-label="调整任务"><i data-lucide="more-horizontal"></i></button>';
      card.querySelector("time").textContent = task.time;
      card.querySelector("strong").textContent = task.name;
      card.querySelector("span").textContent = task.meta + " · " + task.minutes + " 分钟";
      card.querySelector("button").addEventListener("click", function () {
        selectedPlanTaskIndex = index;
        byId("planActionTitle").textContent = task.name;
        byId("planActionDialog").showModal();
      });
      list.appendChild(card);
    });
    renderIcons();
  }

  function reviewOption(range) {
    var common = {
      animationDuration: 420,
      textStyle: { fontFamily: 'Inter, "PingFang SC", sans-serif', color: "#5f6c66" },
      tooltip: { trigger: "axis", borderWidth: 0, backgroundColor: "#26332e", textStyle: { color: "#fff", fontSize: 11 } }
    };
    if (range === "day") return Object.assign(common, {
      grid: { left: 76, right: 36, top: 18, bottom: 30 },
      xAxis: { type: "value", max: 60, name: "分钟", splitLine: { lineStyle: { color: "#edf0ec" } } },
      yAxis: { type: "category", data: ["复习概念", "实践练习", "专题阅读", "错题复盘"], axisLine: { show: false }, axisTick: { show: false } },
      series: [{ type: "bar", data: [48, 52, 34, 21], barWidth: 16, itemStyle: { color: "#6474b9", borderRadius: [0, 3, 3, 0] }, label: { show: true, position: "right", formatter: "{c} 分" } }]
    });
    if (range === "week") return Object.assign(common, {
      grid: { left: 38, right: 34, top: 24, bottom: 32 },
      xAxis: { type: "category", data: ["一", "二", "三", "四", "五", "六", "日"], axisTick: { show: false }, axisLine: { lineStyle: { color: "#dfe4df" } } },
      yAxis: { type: "value", name: "小时", splitLine: { lineStyle: { color: "#edf0ec" } } },
      series: [
        { name: "实际投入", type: "bar", data: [2.5, 3.1, 2.8, 2.9, 1.8, 0.6, 0], barWidth: 16, itemStyle: { color: "#6474b9", borderRadius: [3, 3, 0, 0] } },
        { name: "调整后计划", type: "line", data: [2.2, 2.7, 2.5, 2.6, 2.0, 1.0, 0.5], symbolSize: 7, lineStyle: { color: "#d8ad57", width: 2 }, itemStyle: { color: "#d8ad57" } },
        { name: "原始计划", type: "line", data: [2, 2.5, 2.5, 2.5, 2, 1, 1], symbol: "none", lineStyle: { color: "#b7bcae", width: 1, type: "dashed" } }
      ]
    });
    var calendarData = [];
    for (var day = 1; day <= currentMonthDays; day += 1) calendarData.push([currentMonthKey + "-" + pad(day), [0, 1.2, 0.8, 2.1, 1.7, 2.6, 0.4][day % 7]]);
    return Object.assign(common, {
      tooltip: { position: "top", formatter: function (params) { return params.data[0].slice(5).replace("-", "月") + "日 · " + Number(params.data[1]).toFixed(1) + " 小时"; } },
      visualMap: { min: 0, max: 3, show: false, inRange: { color: ["#edf1ed", "#b9d6ce", "#527a70"] } },
      calendar: { top: 36, left: 38, right: 20, cellSize: ["auto", 28], range: currentMonthKey, splitLine: { show: false }, itemStyle: { borderWidth: 4, borderColor: "#fff" }, yearLabel: { show: false }, monthLabel: { show: false }, dayLabel: { firstDay: 1, nameMap: ["日", "一", "二", "三", "四", "五", "六"], color: "#75817b" } },
      series: [{ type: "heatmap", coordinateSystem: "calendar", data: calendarData }]
    });
  }
  function renderCategory(data, range) {
    if (!window.echarts) return;
    if (!categoryChart) categoryChart = window.echarts.init(byId("categoryChart"));
    categoryChart.setOption({
      animationDuration: 380,
      tooltip: { trigger: "item", formatter: "{b}<br>{c} 小时 · {d}%" },
      color: ["#6474b9", "#6793a6", "#d8ad57", "#4f8b72"],
      series: [{ type: "pie", radius: ["52%", "72%"], center: ["50%", "48%"], avoidLabelOverlap: true, itemStyle: { borderColor: "#fff", borderWidth: 3 }, label: { show: false }, data: data }]
    }, true);
    var total = data.reduce(function (sum, item) { return sum + item.value; }, 0);
    var graphics = [
      { type: "text", left: "center", top: "39%", style: { text: total.toFixed(1) + "h", fill: "#23312b", font: "700 20px Inter" } },
      { type: "text", left: "center", top: "53%", style: { text: range === "day" ? "今日投入" : range === "week" ? "本周投入" : "本月投入", fill: "#6e7a75", font: "10px Inter" } }
    ];
    categoryChart.setOption({ graphic: graphics });
    var colors = ["var(--indigo)", "var(--blue)", "var(--amber)", "var(--green)"];
    byId("categoryList").innerHTML = data.map(function (item, index) {
      return '<div><div class="category-head"><strong>' + item.name + '</strong><span>' + item.value.toFixed(1) + "h · " + (item.value / total * 100).toFixed(1) + '%</span></div><div class="category-track"><i style="width:' + (item.value / total * 100) + "% ;background:" + colors[index] + '"></i></div></div>';
    }).join("");
  }
  function renderReview(range) {
    currentReviewRange = range;
    var data = reviewData[range];
    byId("reviewChartTitle").textContent = data.title;
    byId("reviewChartSubtitle").textContent = data.subtitle;
    byId("reviewInsight").querySelector("span").textContent = data.insight;
    ["One", "Two", "Three"].forEach(function (key, index) {
      byId("reviewStat" + key + "Label").textContent = data.statLabels[index];
      byId("reviewStat" + key).textContent = data.stats[index];
    });
    byId("trendLegend").style.display = range === "week" ? "flex" : "none";
    byId("categorySubtitle").textContent = (range === "day" ? "今日" : range === "week" ? "本周" : "本月") + "实际投入占比";
    if (window.echarts) {
      if (!reviewChart) reviewChart = window.echarts.init(byId("reviewChart"));
      reviewChart.setOption(reviewOption(range), true);
      renderCategory(data.categories, range);
      reviewChart.resize();
      categoryChart.resize();
    } else {
      byId("reviewChart").textContent = "图表组件加载中";
    }
    renderIcons();
  }
  function animateCounts() {
    if (countPlayed) return;
    countPlayed = true;
    document.querySelectorAll("[data-count]").forEach(function (node) {
      var target = Number(node.dataset.count);
      var decimals = String(target).includes(".") ? 1 : 0;
      var start = performance.now();
      function step(now) {
        var progress = Math.min(1, (now - start) / 700);
        var eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = (target * eased).toFixed(decimals);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  function destroyPlanGraph() {
    if (!planGraph) return;
    try { planGraph.destroy(); } catch (error) { /* The accessible fallback remains available. */ }
    planGraph = null;
  }
  function focusScheduledTask(nodeId) {
    var context = planGraphContexts[selectedPlanContext];
    var graphNode = context.nodes.find(function (node) { return node.id === nodeId; });
    if (!graphNode || graphNode.kind !== "task") return;
    var card = document.querySelector('[data-graph-task-id="' + nodeId + '"]');
    if (!card) { showToast("该任务尚未排入当前工作日"); return; }
    document.querySelectorAll(".plan-card.graph-highlight").forEach(function (item) { item.classList.remove("graph-highlight"); });
    window.clearTimeout(planHighlightTimer);
    card.classList.add("graph-highlight");
    var scroller = byId("planDaysScroll");
    var cardRect = card.getBoundingClientRect();
    var scrollerRect = scroller.getBoundingClientRect();
    var targetLeft = scroller.scrollLeft + cardRect.left - scrollerRect.left - (scrollerRect.width - cardRect.width) / 2;
    scroller.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
    var day = card.closest(".plan-day").querySelector(".plan-day-head strong").textContent;
    showToast("已定位到" + day + " · " + card.querySelector("strong").textContent);
    planHighlightTimer = window.setTimeout(function () { card.classList.remove("graph-highlight"); }, 2400);
  }
  function updatePlanFallback(context, reveal) {
    var fallback = byId("planGraph").querySelector(".graph-fallback");
    fallback.replaceChildren();
    context.nodes.forEach(function (node, index) {
      if (index > 0) {
        var connector = document.createElement("i");
        connector.className = "graph-link";
        connector.setAttribute("aria-hidden", "true");
        fallback.appendChild(connector);
      }
      var element = document.createElement(node.kind === "task" ? "button" : "div");
      element.className = "graph-node " + node.kind + (node.id === context.activeId ? " is-selected" : "");
      if (node.kind === "task") {
        element.type = "button";
        element.dataset.graphNodeId = node.id;
        element.setAttribute("aria-label", "定位任务：" + node.label);
        element.addEventListener("click", function () { focusScheduledTask(node.id); });
      }
      var meta = document.createElement("small");
      var label = document.createElement("strong");
      meta.textContent = node.meta;
      label.textContent = node.label;
      element.appendChild(meta);
      element.appendChild(label);
      fallback.appendChild(element);
    });
    fallback.style.visibility = reveal === false ? "hidden" : "visible";
  }
  function buildPlanGraphData(context) {
    var tones = {
      plan: { fill: "#edf3f0", stroke: "#527a70" },
      stage: { fill: "#fff8e9", stroke: "#d8ad57" },
      task: { fill: "#f2f4fc", stroke: "#6474b9" }
    };
    return {
      nodes: context.nodes.map(function (node) {
        var tone = tones[node.kind];
        var selected = node.id === context.activeId;
        return {
          id: node.id,
          style: {
            size: [node.kind === "task" ? 190 : 220, 56],
            radius: 6,
            fill: tone.fill,
            stroke: tone.stroke,
            lineWidth: selected ? 2 : 1,
            shadowColor: selected ? "rgba(82,122,112,.18)" : "transparent",
            shadowBlur: selected ? 10 : 0,
            labelText: node.label,
            labelFill: "#23312b",
            labelFontSize: 11,
            labelFontWeight: 650,
            labelPlacement: "center",
            labelWordWrap: true,
            labelMaxWidth: node.kind === "task" ? 162 : 190,
            labelLineHeight: 16
          }
        };
      }),
      edges: context.nodes.slice(1).map(function (node, index) {
        return { source: context.nodes[index].id, target: node.id };
      })
    };
  }
  function centerPlanGraph() {
    if (planGraph && typeof planGraph.fitCenter === "function") return planGraph.fitCenter();
    return null;
  }
  function renderPlanGraph() {
    if (window.innerWidth <= 720) return;
    var context = planGraphContexts[selectedPlanContext];
    var container = byId("planGraph");
    var fallback = container.querySelector(".graph-fallback");
    var graphData = buildPlanGraphData(context);
    updatePlanFallback(context, !planGraph);
    if (!window.G6) return;
    if (planGraph && typeof planGraph.setData === "function") {
      try {
        planGraph.setData(graphData);
        var redraw = planGraph.render();
        Promise.resolve(redraw).then(centerPlanGraph).then(function () {
          fallback.style.visibility = "hidden";
        }).catch(function () {
          fallback.style.visibility = "hidden";
        });
        return;
      } catch (error) {
        destroyPlanGraph();
        updatePlanFallback(context, true);
      }
    }
    var staleHost = container.querySelector(".g6-graph-host");
    if (staleHost) staleHost.remove();
    var host = document.createElement("div");
    host.className = "g6-graph-host";
    host.style.cssText = "position:absolute;inset:0;background:#fbfcfa";
    container.appendChild(host);
    try {
      planGraph = new window.G6.Graph({
        container: host,
        width: container.clientWidth,
        height: container.clientHeight,
        autoFit: "center",
        data: graphData,
        node: { type: "rect" },
        edge: { type: "polyline", style: { stroke: "#aeb8b2", lineWidth: 1, endArrow: true, radius: 8 } },
        layout: { type: "dagre", rankdir: "TB", nodesep: 12, ranksep: 38 },
        behaviors: []
      });
      if (typeof planGraph.on === "function") {
        planGraph.on("node:click", function (event) {
          var target = event && event.target;
          var nodeId = target && target.id;
          if (!nodeId && event && event.item) nodeId = event.item.id;
          if (nodeId) focusScheduledTask(nodeId);
        });
      }
      Promise.resolve(planGraph.render()).then(centerPlanGraph).then(function () {
        fallback.style.visibility = "hidden";
      }).catch(function () {
        host.remove();
        planGraph = null;
        fallback.style.visibility = "visible";
      });
    } catch (error) {
      host.remove();
      planGraph = null;
      fallback.style.visibility = "visible";
    }
  }
  function selectPlanContext(contextKey, button) {
    var context = planGraphContexts[contextKey];
    if (!context) return;
    selectedPlanContext = contextKey;
    document.querySelectorAll("[data-plan-context]").forEach(function (item) { item.classList.remove("active"); });
    button.classList.add("active");
    if (button.dataset.parentContext) {
      var parent = document.querySelector('[data-plan-context="' + button.dataset.parentContext + '"]');
      if (parent) parent.classList.add("active");
    }
    byId("planStructureTitle").textContent = context.title;
    byId("planStructureProgress").textContent = context.progress;
    renderPlanGraph();
    showToast("已切换到“" + button.textContent.trim() + "”");
  }
  function setPlanSplit(percent) {
    planSplitPercent = Math.max(35, Math.min(65, percent));
    byId("planSplit").style.setProperty("--plan-left", planSplitPercent.toFixed(1) + "%");
    byId("planResizer").setAttribute("aria-valuenow", String(Math.round(planSplitPercent)));
    byId("planResizer").setAttribute("aria-valuetext", "周计划 " + Math.round(planSplitPercent) + "%；流程图 " + Math.round(100 - planSplitPercent) + "%");
  }
  function rerenderPlanGraph() {
    if (planGraph && typeof planGraph.resize === "function") {
      var container = byId("planGraph");
      try {
        var resized = planGraph.resize(container.clientWidth, container.clientHeight);
        Promise.resolve(resized).then(centerPlanGraph);
        return;
      } catch (error) { /* Fall through to the compatibility path. */ }
    }
    renderPlanGraph();
  }
  function finishPlanSplit(pointerId) {
    if (planSplitPointer === null || (pointerId !== undefined && pointerId !== planSplitPointer)) return;
    var resizer = byId("planResizer");
    if (resizer.hasPointerCapture && resizer.hasPointerCapture(planSplitPointer)) resizer.releasePointerCapture(planSplitPointer);
    planSplitPointer = null;
    resizer.classList.remove("is-dragging");
    rerenderPlanGraph();
    showToast("布局已调整为 " + Math.round(planSplitPercent) + "% / " + Math.round(100 - planSplitPercent) + "%");
  }

  function updateTaskPreview() {
    var selected = byId("taskDuration").value;
    var minutes = selected === "custom" ? Number(byId("taskCustomDuration").value) : Number(selected);
    var time = byId("taskTime").value || "00:00";
    byId("taskCustomDuration").hidden = selected !== "custom";
    byId("taskEndPreview").textContent = time + "-" + addMinutes(time, Math.max(1, minutes || 1)) + " · " + (minutes || 0) + " 分钟";
  }
  function openTaskDialog() {
    byId("taskDialog").showModal();
    updateTaskPreview();
    window.setTimeout(function () { byId("taskName").focus(); }, 40);
  }
  function updatePlanTotal() {
    var total = Number(byId("planHours").value || 0) + Number(byId("planMinutes").value || 0) / 60;
    byId("planTotalPreview").textContent = "合计 " + total.toFixed(1) + " 小时";
  }
  function showSettingPanel(key) {
    currentSetting = key;
    document.querySelectorAll("[data-setting]").forEach(function (item) { item.classList.toggle("active", item.dataset.setting === key); });
    document.querySelectorAll(".settings-panel").forEach(function (panel) { panel.hidden = true; });
    var target = byId("settings" + key.charAt(0).toUpperCase() + key.slice(1));
    if (target) target.hidden = false;
    var mobileSubpage = window.matchMedia("(max-width: 720px)").matches && key !== "profile";
    byId("settingsBackButton").classList.toggle("show", currentView === "settings" && (!window.matchMedia("(max-width: 720px)").matches || mobileSubpage));
    renderIcons();
  }
  function showAuthScreen(name) {
    document.querySelectorAll("[data-auth-screen]").forEach(function (screen) { screen.hidden = screen.dataset.authScreen !== name; });
    renderIcons();
  }
  function showAuth(name) {
    stopTimer();
    document.body.classList.remove("plan-view-active");
    byId("appShell").hidden = true;
    document.querySelector(".mobile-nav").hidden = true;
    byId("authShell").hidden = false;
    showAuthScreen(name || "login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function showApp() {
    byId("authShell").hidden = true;
    byId("appShell").hidden = false;
    document.querySelector(".mobile-nav").hidden = false;
    setView("today");
  }
  function refreshCaptcha() {
    var chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    var code = "";
    for (var i = 0; i < 4; i += 1) code += chars[Math.floor(Math.random() * chars.length)];
    document.querySelectorAll("[data-captcha]").forEach(function (node) { node.textContent = code; });
    return code;
  }
  function validPassword(value) { return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value); }
  function openLegal(key, customContent) {
    var doc = legalDocuments[key];
    byId("legalTitle").textContent = customContent ? customContent.title : doc.title;
    byId("legalContent").innerHTML = customContent ? customContent.content : doc.content;
    byId("legalDialog").showModal();
  }
  function recoveryCodesMarkup() {
    return "<p>请立即复制并安全保存。新恢复码生效后，全部旧恢复码已作废。</p><div class=\"recovery-grid\"><code class=\"recovery-code\">KD7P-4R2M</code><code class=\"recovery-code\">VC3X-8N5Q</code><code class=\"recovery-code\">HT6B-2W9A</code><code class=\"recovery-code\">YM4L-7F3C</code><code class=\"recovery-code\">PQ8E-5T2K</code><code class=\"recovery-code\">RN9J-3D6V</code></div>";
  }

  document.querySelectorAll("[data-view]").forEach(function (button) {
    button.addEventListener("click", function () { setView(button.dataset.view); });
  });
  document.querySelectorAll(".timer-toggle").forEach(function (button) { button.addEventListener("click", toggleTimer); });
  document.querySelectorAll(".complete-focus").forEach(function (button) {
    button.addEventListener("click", function () {
      pendingTask = document.querySelector("#taskList .task-row.current");
      stopTimer();
      byId("focusCompleteDialog").showModal();
    });
  });
  document.querySelectorAll("[data-minutes]").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll("[data-minutes]").forEach(function (item) { item.classList.remove("active"); });
      button.classList.add("active");
      applyDuration(Number(button.dataset.minutes), false);
    });
  });
  document.querySelectorAll("[data-extend]").forEach(function (button) {
    button.addEventListener("click", function () {
      byId("extendMinutes").value = button.dataset.extend;
      document.querySelectorAll("[data-extend]").forEach(function (item) { item.classList.toggle("active", item === button); });
    });
  });
  document.querySelectorAll("#taskList .task-row").forEach(bindTask);
  document.querySelectorAll("[data-segment]").forEach(function (segment) {
    segment.querySelectorAll("button").forEach(function (button) {
      button.addEventListener("click", function () {
        segment.querySelectorAll("button").forEach(function (item) { item.classList.remove("active"); });
        button.classList.add("active");
        showToast("已切换为" + button.textContent + "视图");
      });
    });
  });
  document.querySelectorAll("[data-plan-day]").forEach(function (button) {
    button.addEventListener("click", function () {
      selectedMobilePlanDay = button.dataset.planDay;
      document.querySelectorAll("[data-plan-day]").forEach(function (item) {
        var active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      renderMobilePlan();
    });
  });
  document.querySelectorAll("[data-plan-context]").forEach(function (button) {
    button.addEventListener("click", function () { selectPlanContext(button.dataset.planContext, button); });
  });
  byId("planResizer").addEventListener("pointerdown", function (event) {
    if (event.button !== 0) return;
    planSplitPointer = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add("is-dragging");
    event.preventDefault();
  });
  byId("planResizer").addEventListener("pointermove", function (event) {
    if (event.pointerId !== planSplitPointer) return;
    var rect = byId("planSplit").getBoundingClientRect();
    setPlanSplit((event.clientX - rect.left) / rect.width * 100);
  });
  byId("planResizer").addEventListener("pointerup", function (event) { finishPlanSplit(event.pointerId); });
  byId("planResizer").addEventListener("pointercancel", function (event) { finishPlanSplit(event.pointerId); });
  byId("planResizer").addEventListener("dblclick", function () {
    setPlanSplit(55);
    rerenderPlanGraph();
    showToast("已恢复默认布局 55% / 45%");
  });
  byId("planResizer").addEventListener("keydown", function (event) {
    var next = planSplitPercent;
    if (event.key === "ArrowLeft") next -= 2;
    else if (event.key === "ArrowRight") next += 2;
    else if (event.key === "Home") next = 35;
    else if (event.key === "End") next = 65;
    else return;
    event.preventDefault();
    setPlanSplit(next);
    rerenderPlanGraph();
  });
  document.querySelectorAll("#reviewRange button").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll("#reviewRange button").forEach(function (item) { item.classList.toggle("active", item === button); });
      renderReview(button.dataset.range);
    });
  });
  document.querySelectorAll("[data-setting]").forEach(function (button) {
    button.addEventListener("click", function () {
      showSettingPanel(button.dataset.setting);
    });
  });
  document.querySelectorAll("[data-open-setting]").forEach(function (button) {
    button.addEventListener("click", function () { showSettingPanel(button.dataset.openSetting); });
  });
  document.querySelectorAll("[data-auth-target]").forEach(function (button) {
    button.addEventListener("click", function () { showAuthScreen(button.dataset.authTarget); });
  });
  document.querySelectorAll("[data-refresh-captcha]").forEach(function (button) {
    button.addEventListener("click", function () { refreshCaptcha(); showToast("验证码已刷新"); });
  });
  document.querySelectorAll("[data-password]").forEach(function (button) {
    button.addEventListener("click", function () {
      var input = byId(button.dataset.password);
      var visible = input.type === "text";
      input.type = visible ? "password" : "text";
      button.setAttribute("aria-label", visible ? "显示密码" : "隐藏密码");
      button.innerHTML = visible ? '<i data-lucide="eye"></i>' : '<i data-lucide="eye-off"></i>';
      renderIcons();
    });
  });
  document.querySelectorAll("[data-legal]").forEach(function (button) {
    button.addEventListener("click", function () { openLegal(button.dataset.legal); });
  });
  document.querySelectorAll(".magnetic-button").forEach(function (button) {
    button.addEventListener("pointermove", function (event) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      var rect = button.getBoundingClientRect();
      var x = (event.clientX - rect.left - rect.width / 2) * 0.08;
      var y = (event.clientY - rect.top - rect.height / 2) * 0.08;
      button.style.transform = "translate(" + x + "px," + y + "px)";
    });
    button.addEventListener("pointerleave", function () { button.style.transform = ""; });
  });
  document.querySelectorAll(".metric-info").forEach(function (button) {
    button.addEventListener("click", function () { showToast("统计基于真实任务与专注记录计算，结果保留 1 位小数"); });
  });

  on("addTaskButton", "click", openTaskDialog);
  on("compactAdd", "click", openTaskDialog);
  on("taskDuration", "change", updateTaskPreview);
  on("taskCustomDuration", "input", updateTaskPreview);
  on("taskTime", "input", updateTaskPreview);
  on("customDurationButton", "click", function () {
    byId("customDurationField").classList.toggle("show");
    byId("customDurationInput").focus();
  });
  on("applyCustomDuration", "click", function () {
    if (applyDuration(Number(byId("customDurationInput").value), false)) {
      document.querySelectorAll("[data-minutes]").forEach(function (item) { item.classList.remove("active"); });
      byId("customDurationField").classList.remove("show");
      showToast("已改为 " + byId("customDurationInput").value + " 分钟");
    }
  });
  on("railAccountButton", "click", function () { setView("settings"); });
  on("topbarAccountButton", "click", function () { setView("settings"); });
  on("settingsBackButton", "click", function () {
    if (window.matchMedia("(max-width: 720px)").matches && currentSetting !== "profile") showSettingPanel("profile");
    else setView(lastBusinessView || "today");
  });
  on("loginForm", "submit", function (event) {
    event.preventDefault();
    byId("loginError").textContent = "";
    if (!byId("loginUsername").value.trim() || !byId("loginPassword").value) { byId("loginError").textContent = "请输入登录用户名和密码。"; return; }
    showApp();
    showToast("登录成功，已恢复今日进度");
  });
  on("registerForm", "submit", function (event) {
    event.preventDefault();
    var password = byId("registerPassword").value;
    var error = "";
    if (byId("registerUsername").value.trim().length < 4) error = "登录用户名需要 4-32 个字符。";
    else if (!validPassword(password)) error = "密码至少 8 位，并同时包含字母和数字。";
    else if (password !== byId("registerConfirm").value) error = "两次输入的密码不一致。";
    else if (byId("registerCaptcha").value.trim().toUpperCase() !== document.querySelector("[data-captcha]").textContent) error = "图形验证码不正确。";
    else if (!byId("ageConsent").checked) error = "需要确认已年满 14 周岁。";
    else if (!byId("agreementConsent").checked) error = "请先阅读并同意用户协议和隐私政策。";
    byId("registerError").textContent = error;
    if (!error) showAuthScreen("codes");
  });
  on("recoveryForm", "submit", function (event) {
    event.preventDefault();
    var password = byId("recoveryPassword").value;
    var error = "";
    if (!/^([A-Z0-9]{4})-([A-Z0-9]{4})$/i.test(byId("recoveryCode").value.trim())) error = "请输入有效的恢复码。";
    else if (!validPassword(password)) error = "新密码至少 8 位，并同时包含字母和数字。";
    else if (password !== byId("recoveryConfirm").value) error = "两次输入的新密码不一致。";
    else if (byId("recoveryCaptcha").value.trim().toUpperCase() !== document.querySelector("[data-captcha]").textContent) error = "图形验证码不正确。";
    byId("recoveryError").textContent = error;
    if (!error) { showAuthScreen("login"); byId("loginUsername").value = byId("recoveryUsername").value; showToast("密码已更新，请重新登录"); }
  });
  on("copyRecoveryCodes", "click", function () {
    var codes = Array.from(byId("recoveryCodeGrid").querySelectorAll("code")).map(function (node) { return node.textContent; }).join("\n");
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(codes);
    showToast("恢复码已复制");
  });
  on("finishRegistration", "click", function () { showApp(); showToast("账号已创建"); });
  on("closeLegalDialog", "click", function () { byId("legalDialog").close(); });
  on("confirmLegalDialog", "click", function () { byId("legalDialog").close(); });
  on("changeAvatarButton", "click", function () { byId("avatarInput").click(); });
  on("avatarInput", "change", function () {
    var file = byId("avatarInput").files && byId("avatarInput").files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast("头像文件不能超过 5 MB"); return; }
    var reader = new FileReader();
    reader.onload = function () { byId("profileAvatar").style.backgroundImage = 'url("' + reader.result + '")'; byId("profileAvatar").textContent = ""; showToast("头像已更新并等待同步"); };
    reader.readAsDataURL(file);
  });
  on("displayNameInput", "change", function () { var name = byId("displayNameInput").value.trim() || "未设置名称"; byId("profileDisplayName").textContent = name; showToast("显示名称已同步"); });
  on("changeUsernameButton", "click", function () { showToast("修改登录用户名需要当前密码和图形验证码"); });
  on("changePasswordButton", "click", function () { showToast("修改密码验证入口已打开"); });
  on("regenerateCodesButton", "click", function () { if (window.confirm("生成新恢复码后，全部旧恢复码将立即失效。是否继续？")) openLegal("terms", { title: "新的恢复码", content: recoveryCodesMarkup() }); });
  on("logoutButton", "click", function () { if (window.confirm("确认退出当前账号吗？")) showAuth("login"); });
  on("deleteAccountButton", "click", function () { openLegal("cancellation"); });
  on("exportDataButton", "click", function () { showToast("个人数据导出申请已创建"); });
  on("clearCacheButton", "click", function () { showToast("本机缓存已清理，云端数据未受影响"); });
  on("renameDeviceButton", "click", function () { showToast("设备名称编辑入口已打开"); });
  document.querySelectorAll(".remote-logout").forEach(function (button) { button.addEventListener("click", function () { if (window.confirm("确认退出这台设备吗？")) { button.disabled = true; button.textContent = "已退出"; } }); });
  on("addPlanButton", "click", function () { byId("planDialog").showModal(); });
  on("treeAddPlan", "click", function () { byId("planDialog").showModal(); });
  on("inlineAddPlan", "click", function () { byId("taskDialog").close(); byId("planDialog").showModal(); });
  on("addStageButton", "click", function () { showToast("在当前 Plan 下新建 Stage，并设置名称与顺序"); });
  on("mobilePlanSelector", "click", function () { byId("planSelectorDialog").showModal(); });
  on("inlineAddDirection", "click", function () { showToast("新建后自动选中；历史使用过的学习方向只能归档"); });
  on("addDirectionButton", "click", function () { showToast("学习方向创建入口已打开"); });
  on("planHours", "input", updatePlanTotal);
  on("planMinutes", "input", updatePlanTotal);
  on("savePlan", "click", function (event) {
    event.preventDefault();
    if (!byId("planName").value.trim()) { byId("planName").focus(); return; }
    if (byId("planEnd").value < byId("planStart").value) { showToast("目标完成日期不能早于开始日期"); return; }
    byId("planDialog").close();
    showToast("Plan 已创建，可继续添加 Stage");
  });
  on("saveTask", "click", function (event) {
    event.preventDefault();
    var name = byId("taskName").value.trim();
    if (!name) { byId("taskName").focus(); return; }
    var selected = byId("taskDuration").value;
    var duration = selected === "custom" ? Number(byId("taskCustomDuration").value) : Number(selected);
    if (!Number.isInteger(duration) || duration < 1) { showToast("专注时长必须是正整数"); return; }
    var time = byId("taskTime").value;
    var end = addMinutes(time, duration);
    if (time >= "10:30" && time < "11:20" && !window.confirm("该时间与“完成实践练习”重叠。仍要强制保存吗？")) return;
    var task = document.createElement("article");
    task.className = "task-row";
    task.draggable = true;
    task.innerHTML = '<time class="task-time"></time><button class="check" aria-label="切换完成状态"></button><div class="task-copy"><strong></strong><span></span></div><span class="tag"></span><button class="drag-handle" aria-label="拖动任务"><i data-lucide="grip-vertical"></i></button>';
    task.querySelector(".task-time").textContent = time;
    task.querySelector(".task-copy strong").textContent = name;
    task.querySelector(".task-copy span").textContent = time + "-" + end + " · 待开始";
    task.querySelector(".tag").textContent = byId("taskCategory").value;
    byId("taskList").appendChild(task);
    bindTask(task);
    byId("taskDialog").close();
    byId("taskForm").reset();
    initializeDates();
    updateTaskPreview();
    updateDoneCount();
    renderIcons();
    showToast("任务已加入今天的学习流");
  });
  on("confirmCompleteTask", "click", function (event) {
    event.preventDefault();
    var target = pendingTask || document.querySelector("#taskList .task-row.current");
    markTaskDone(target, Math.floor(elapsedSeconds / 60));
    byId("focusCompleteDialog").close();
    resetFocus();
    showToast("任务与本轮专注已完成");
  });
  on("continueTaskButton", "click", function () {
    byId("extendPanel").classList.add("show");
    byId("extendMinutes").focus();
  });
  on("showImpactButton", "click", function () {
    var minutes = Number(byId("extendMinutes").value);
    if (!Number.isInteger(minutes) || minutes < 1) { showToast("请输入正整数分钟"); return; }
    byId("impactMinutes").textContent = minutes + " 分钟";
    var rows = byId("impactDialog").querySelectorAll(".impact-row");
    [["14:00", "14:40"], ["20:00", "20:30"]].forEach(function (times, index) {
      rows[index].querySelector("time").textContent = addMinutes(times[0], minutes) + "-" + addMinutes(times[1], minutes);
    });
    byId("focusCompleteDialog").close();
    byId("impactDialog").showModal();
  });
  on("confirmImpact", "click", function (event) {
    event.preventDefault();
    var minutes = Number(byId("extendMinutes").value);
    applyDuration(minutes, true);
    document.querySelectorAll("#taskList .task-row:not(.done):not(.current)").forEach(function (task) {
      var timeNode = task.querySelector("time");
      timeNode.textContent = addMinutes(timeNode.textContent, minutes);
      task.classList.add("adjusted");
    });
    byId("impactDialog").close();
    byId("extendPanel").classList.remove("show");
    showToast("已延长本轮专注，2 个后续任务已顺延");
  });
  on("manualInputButton", "click", function () {
    byId("manualDurationField").classList.add("show");
    byId("manualMinutes").focus();
  });
  document.querySelectorAll("[data-manual]").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      var minutes = button.dataset.manual === "minutes" ? Number(byId("manualMinutes").value) : 0;
      if (minutes < 0 || !Number.isInteger(minutes)) { showToast("请输入正整数分钟"); return; }
      markTaskDone(pendingTask, minutes);
      byId("manualCompleteDialog").close();
      byId("manualDurationField").classList.remove("show");
      showToast(minutes ? "已补录专注并完成任务" : "任务已完成，实际投入记为 0 分钟");
    });
  });
  on("todayFocusMore", "click", function () { byId("focusMenuDialog").showModal(); });
  on("focusMoreButton", "click", function () { byId("focusMenuDialog").showModal(); });
  on("extendNow", "click", function () {
    byId("focusMenuDialog").close();
    byId("focusCompleteDialog").showModal();
    byId("extendPanel").classList.add("show");
  });
  on("abandonTask", "click", function () {
    if (window.confirm("放弃会结束当前专注并取消任务，是否继续？")) {
      byId("focusMenuDialog").close();
      resetFocus();
      showToast("当前任务已取消");
    }
  });
  on("reviewPlanDetail", "click", function () { setView("plan"); showToast("已定位到当前 Plan / Stage"); });
  document.querySelectorAll(".queue-action").forEach(function (button) {
    button.addEventListener("click", function () {
      if (timerId && !window.confirm("当前专注正在运行。完成当前专注并切换任务吗？")) return;
      showToast("任务操作菜单已打开");
    });
  });
  document.querySelectorAll("[data-plan-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      var tasks = mobilePlanData[selectedMobilePlanDay].tasks;
      var action = button.dataset.planAction;
      if (selectedPlanTaskIndex < 0 || !tasks[selectedPlanTaskIndex]) return;
      if (action === "start") {
        if (timerId && !window.confirm("完成当前专注并切换到所选任务吗？")) return;
        stopTimer(); setView("focus"); showToast("已切换到所选任务"); return;
      }
      if (action === "edit") { showToast("已打开任务编辑"); return; }
      if (action === "delete" || action === "cancel-task") {
        if (action === "delete" && !window.confirm("永久删除后无法恢复，确认删除吗？")) return;
        tasks.splice(selectedPlanTaskIndex, 1); renderMobilePlan(); showToast(action === "delete" ? "任务已永久删除" : "任务已取消"); return;
      }
      if (action === "tomorrow") {
        var next = planDayOrder[planDayOrder.indexOf(selectedMobilePlanDay) + 1];
        if (!next) { showToast("已是本周最后一天"); return; }
        mobilePlanData[next].tasks.push(tasks.splice(selectedPlanTaskIndex, 1)[0]); renderMobilePlan(); showToast("任务已移到明日队列末尾"); return;
      }
      var target = action === "earlier" ? selectedPlanTaskIndex - 1 : selectedPlanTaskIndex + 1;
      if (target < 0 || target >= tasks.length) { showToast(action === "earlier" ? "已经排在最前" : "已经排在最后"); return; }
      var moved = tasks.splice(selectedPlanTaskIndex, 1)[0];
      tasks.splice(target, 0, moved); renderMobilePlan(); showToast("任务顺序已更新");
    });
  });
  window.addEventListener("resize", function () {
    if (reviewChart) reviewChart.resize();
    if (categoryChart) categoryChart.resize();
    window.clearTimeout(planGraphResizeTimer);
    if (currentView === "plan" && window.innerWidth > 720) planGraphResizeTimer = window.setTimeout(rerenderPlanGraph, 120);
  });

  initializeDates();
  setView("today");
  refreshCaptcha();
  renderTimer();
  updateDoneCount();
  renderMobilePlan();
  updateTaskPreview();
  updatePlanTotal();
  setPlanSplit(55);
  renderIcons();
  showAuth("login");
}());
