const ASSETS = "./assets";
const VIDEO_URL = ["127.0.0.1", "localhost"].includes(window.location.hostname)
  ? `${ASSETS}/videos/brand.mp4`
  : "https://github.com/yang1832-gg/yuntianhua-pages/releases/download/v1.0.0/brand.mp4";

const crops = {
  "水果类": [
    ["葡萄", "78f5605111404c3d8c51054a99f640b1.jpg", "2ae576f609a641059613f4f0e4199535.png"],
    ["柑橘", "35504e242b1e46619f101561303fa861.jpg", "11482b8b210248489428493b72f32189.png"],
    ["李子", "392c5be51c15426ab8612dc1ae6ed7cf.jpg", "951f7b7e24b047c2b8a7e5c25216d1ef.png"],
    ["冬枣", "727a52605e58482383be9c1cf7183265.jpg", "196930fe8335429ba7f6595d66fc9fa0.png"],
    ["苹果", "fd97d173370b40b3a65323de598536a5.jpg", "01386a6f693b4391a26ab951cd634ad0.png"],
    ["猕猴桃", "a6f59715a607462782b7edadfdf5843c.jpg", "cddc396f075c47a1a3a6baf9fb3f7837.png"]
  ],
  "棉麻类": [
    ["花椒", "c45792b2b13c474084463a9d5b9a86a0.jpg", "4a2b64f286a7456fb44ad08fae5041b7.png"],
    ["棉花", "0a61088ce1754b8c949b959bf9b3c8a9.jpg", "5c64b200261547b2ace5745b3c518cc9.png"]
  ],
  "香料类": [
    ["葱", "117888af1f85401092d70cef55750916.jpg", "b9ffc763679646379b4bbc6250e73ff6.png"]
  ],
  "其他类": [
    ["坚果", "94314d52563a4a119b2d7a61563fa1a2.jpg", "38c43f296f3f4e548c7e6438d5aca32d.png"]
  ]
};

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const modalRoot = document.querySelector("#modal-root");
let toastTimer;
let captcha = createCaptcha();
let activeCropCategory = "水果类";

function createCaptcha() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function navigate(route) {
  window.location.hash = route;
}

function brandBanner() {
  return `
    <div class="brand-banner" aria-label="云天化股份">
      <img class="brand-banner__logo" src="${ASSETS}/images/logo.png" alt="云天化股份 YUNTIANHUA CO., LTD" />
      <img class="brand-banner__lineart" src="${ASSETS}/images/top-banner.png" alt="云天化厂区线稿" />
    </div>`;
}

function subpageHeader(title) {
  return `
    <header class="subpage-header">
      <button class="back-button" type="button" data-action="back" aria-label="返回">‹</button>
      <h1>${title}</h1>
      <span></span>
    </header>`;
}

function homePage() {
  return `
    <div class="page-shell">
      ${brandBanner()}
      <section class="system-zone">
        <div class="system-zone__inner">
          <h1 class="system-title">云天化产品二维码追溯系统</h1>
          <div class="product-summary">
            <div class="product-summary__copy">
              <p class="product-summary__name">云天化正品产品</p>
              <p class="product-summary__hint">产品详情见包装袋</p>
            </div>
            <button class="text-link" type="button" data-route="product">点击查看更多...</button>
          </div>
          <button class="feature-button" type="button" data-route="zhuli" aria-label="高考助力活动报名入口" style="background-image:url('${ASSETS}/images/enter-bg.png')"></button>
        </div>
      </section>

      <main class="home-content">
        <div class="tool-grid">
          <button class="crop-tool" type="button" data-route="crops">
            <span class="crop-tool__text">云天化种植<br />技术交流群</span>
            <img src="${ASSETS}/images/planting.png" alt="种植" />
          </button>
          <button class="crop-tool" type="button" data-route="crops">
            <span class="crop-tool__text">作物解决方<br />案</span>
            <img src="${ASSETS}/images/planting.png" alt="作物方案" />
          </button>
        </div>

        <button class="inquiry-button" type="button" data-route="inquiry">
          <span class="inquiry-button__text">真伪查询</span>
          <span class="search-mark" aria-hidden="true"></span>
        </button>

        <section class="video-section" aria-labelledby="video-title">
          <h2 class="section-heading" id="video-title"><img src="${ASSETS}/images/video-logo.png" alt="" />热点视频</h2>
          <div class="video-card" data-video-card="enterprise">
            <span class="video-card__label">企业宣传视频</span>
            <video controls preload="metadata" playsinline poster="${ASSETS}/images/enterprise-poster.jpg" data-video="enterprise">
              <source src="${VIDEO_URL}" type="video/mp4" />
            </video>
            <div class="video-error">视频暂时无法加载，请稍后重试。</div>
          </div>
          <div class="video-card">
            <span class="video-card__label">产品宣传视频</span>
            <video controls preload="metadata" playsinline poster="${ASSETS}/images/brand-poster.jpg">
              <source src="${VIDEO_URL}" type="video/mp4" />
            </video>
          </div>
        </section>

        <section class="follow-section" aria-labelledby="follow-title">
          <h2 class="section-heading" id="follow-title"><img src="${ASSETS}/images/qrcode.png" alt="" />扫码关注</h2>
          <div class="qr-grid">
            <figure>
              <figcaption>云天化农分享公众号</figcaption>
              <img src="${ASSETS}/images/gongzhonghao.jpg" alt="云天化农分享公众号二维码" />
            </figure>
            <figure>
              <figcaption>云天化农分享微信视频号</figcaption>
              <img src="${ASSETS}/images/shipinhao.jpg" alt="云天化农分享微信视频号二维码" />
            </figure>
          </div>
        </section>

        <button class="contact-button" type="button" data-route="advice">联系我们</button>
      </main>

      <button class="more-pill" type="button" data-route="crops" aria-label="查看更多作物方案">
        <span class="more-pill__icon" aria-hidden="true">»</span>
        <span>更多</span>
      </button>
      <footer class="site-footer">© 云南云天化股份有限公司</footer>
    </div>`;
}

function cropsPage() {
  const tabs = Object.keys(crops).map(category => `
    <button class="crop-tab ${category === activeCropCategory ? "is-active" : ""}" type="button" data-category="${category}">${category}</button>
  `).join("");

  const items = crops[activeCropCategory].map(([name, photo, qr]) => `
    <article class="crop-item">
      <div>
        <h2 class="crop-item__name">${name}</h2>
        <img class="crop-item__photo" src="${ASSETS}/crops/${photo}" alt="${name}" />
      </div>
      <img class="crop-item__qr" src="${ASSETS}/crops/${qr}" alt="云天化${name}种植技术交流群二维码" />
    </article>
  `).join("");

  return `
    <div class="page-shell crop-page">
      ${subpageHeader("二维码群聊")}
      ${brandBanner()}
      <div class="crop-tip"><img src="${ASSETS}/images/qrcode.png" width="38" height="38" alt="" />长按识别二维码进群</div>
      <main class="crop-layout">
        <nav class="crop-tabs" aria-label="作物分类">${tabs}</nav>
        <section class="crop-list" aria-live="polite">${items}</section>
      </main>
    </div>`;
}

function productPage() {
  return `
    <div class="page-shell">
      ${subpageHeader("产品详情")}
      <main class="subpage-content product-page">
        <img class="product-page__banner" src="${ASSETS}/images/product-banner.jpg" alt="绿色科技 服务现代农业" />
        <section class="product-info">
          <h2>产品详情</h2>
          <dl>
            <dt>品牌</dt><dd>云天化</dd>
            <dt>产品名称</dt><dd>云天化系列肥料</dd>
            <dt>产品信息</dt><dd>主要技术指标、净重和生产批号以产品包装袋标识为准。</dd>
            <dt>生产商</dt><dd>云南云天化股份有限公司</dd>
          </dl>
        </section>
        <button class="feedback-button" type="button" data-route="advice">产品质量反馈</button>
      </main>
    </div>`;
}

function inquiryPage() {
  captcha = createCaptcha();
  return `
    <div class="page-shell form-page">
      ${subpageHeader("真伪查询")}
      ${brandBanner()}
      <main class="form-panel">
        <h2 class="page-title-large">真伪查询</h2>
        <p class="trace-code-label">追溯码：请输入包装袋追溯码</p>
        <form id="inquiry-form" novalidate>
          <div class="field">
            <label for="trace-code">追溯码</label>
            <input id="trace-code" name="traceCode" autocomplete="off" placeholder="请输入追溯码" required />
          </div>
          <div class="field">
            <label for="captcha">验证码</label>
            <div class="captcha-row">
              <input id="captcha" name="captcha" autocomplete="off" placeholder="请输入验证码" required />
              <button class="captcha-canvas" type="button" data-action="refresh-captcha" aria-label="更换验证码">${captcha}</button>
            </div>
          </div>
          <button class="primary-button" type="submit">验证</button>
        </form>
        <div class="company-contact">
          <p>公司地址：云南省昆明市滇池路1417号</p>
          <p>联系方式：400-860-1912</p>
        </div>
      </main>
    </div>`;
}

function advicePage() {
  return `
    <div class="page-shell form-page">
      ${subpageHeader("反馈意见")}
      ${brandBanner()}
      <main class="form-panel">
        <form id="advice-form" novalidate>
          <div class="field"><label for="name">您的姓名</label><input id="name" name="name" placeholder="请输入您的姓名" required /></div>
          <div class="field"><label for="contact">联系方式</label><input id="contact" name="contact" placeholder="请输入您的联系方式" required /></div>
          <div class="field"><label for="message">您想对我们说</label><textarea id="message" name="message" placeholder="请输入您的建议" required></textarea></div>
          <button class="primary-button" type="submit">提交</button>
        </form>
        <div class="company-contact">
          <p>公司地址：云南省昆明市滇池路1417号</p>
          <p>联系方式：400-860-1912</p>
        </div>
      </main>
    </div>`;
}

const activitySections = [
  ["ⓘ 活动简介", `
    <ul><li>为回馈云天化化肥忠实用户，云天化联合核心合作伙伴开展“金榜题名・助力同行”2026年高考助力活动，为家中有2026年高考学子的用户送上升学助力，以积分抽奖形式送出助力奖金及实物好礼，用实际行动助力学子金榜题名，传递品牌温度。</li><li>助力总金额：500万元</li><li>助力名额：1000名，每名5000元</li><li>助力方式：积分抽奖</li></ul>`],
  ["♟ 申请对象", `<p>云天化化肥用户家中参加2026年高考的应届考生，且该考生被本科高校录取。</p>`],
  ["▣ 活动时间", `<ol><li>报名及积分获取：即日起至2026年8月9日</li><li>资格审查阶段：2026年8月9日至18日</li><li>抽奖阶段：2026年8月19日至8月24日每天早10点至晚18点</li><li>助力兑现：2026年8月24日起陆续发放</li></ol>`],
  ["☷ 报名及助力规则", `
    <p><strong>（一）活动报名（即日起至2026年8月9日 24:00）</strong></p>
    <ol><li>用户扫描本人或父母、亲兄弟姐妹等直系亲属购买的云天化化肥产品包装袋上二维码，进入活动报名页面，按照指引填写考生姓名、联系电话、就读中学名称等基础信息，提交后完成报名，系统自动生成个人专属助力链接。</li><li>必须由高考学子本人报名或直系亲属代报名，信息务必真实，其他亲友代报名无效。本次报名总名额不设上限。</li></ol>
    <p><strong>（二）积分获取（即日起至2026年8月9日 24:00）</strong></p>
    <ol><li>报名成功用户，扫描购买的云天化化肥产品包装袋二维码，每1个有效二维码可获1积分，同个二维码仅限首次扫描有效，重复扫描不计分。</li><li>分享专属邀请码/链接邀请好友助力，好友扫描本人云天化化肥产品二维码可为邀请者助力积分；好友在专属链接点赞助力，每10人点赞，邀请者可获1积分。</li><li>每10个积分可兑换1次抽奖机会，积分仅可在抽奖阶段使用，未使用积分在抽奖活动结束后自动失效，抽奖消耗的积分参与后即时清零。</li></ol>
    <p><strong>（三）资格审查（2026年8月9日至18日 24:00）</strong></p>
    <p>考生被国内高校本科及以上院校录取并完成全部核验流程，参与活动即默认承诺学子将参加2026年应届高考并力争本科录取。（注：仅认可国家教育部指定的全日制本科办学资质院校的录取结果，非此类院校录取者不予领奖。）</p>`],
  ["□ 抽奖阶段", `<ol><li>抽奖时间：2026年8月19日—2026年8月24日（每日10:00至18:00）。</li><li>抽奖形式：用户消耗积分（10分/次）抽奖，系统即时显示一次抽奖结果。</li><li>中奖概率：本次活动总共1000个中奖名额，中奖概率基于总的抽奖次数计算。</li><li>为保证公平公正，抽奖过程将由系统采用经过验证的随机算法进行，确保公平、公正、随机，并在活动结束后公示中奖名单。</li><li>无论是否中奖，用户用于兑换抽奖机会的积分（每10分）在参与抽奖后即被消耗（清零）。未使用的积分在活动结束后失效。</li></ol>`],
  ["¥ 助力兑现（2026年8月24日起陆续发放）", `<ol><li>中奖者必须在8月25日24:00之前在系统内提交录取学校（本科）、专业等信息进行初步核验。发放奖金时，现场对录取通知书原件、身份证、户口册原件核验。</li><li>公司将通过报名预留电话与中奖者联系，确定助力兑现具体时间和地点，到现场进行身份核验和助力兑现。</li><li>录取通知书学生信息必须是报名者本人或其直系亲属。</li><li>中奖者亦可通过官方服务热线400-860-1912、微信公众号与主办方联系，确定助力兑现时间和地点，根据约定到现场进行身份核验和助力兑现。</li></ol>`]
];

function zhuliPage() {
  return `
    <div class="page-shell zhuli-page">
      ${subpageHeader("大学新生助学报名活动")}
      <img class="zhuli-hero" src="${ASSETS}/images/zhuli-header.png" alt="云天化股份 CCTV农业农村频道首席行业合作伙伴" />
      <main class="rules-sheet">
        ${activitySections.map(([title, body]) => `<section class="rule-section"><h2>${title}</h2>${body}</section>`).join("")}
      </main>
      <div class="agreement">
        <label><input id="activity-agreement" type="checkbox" /> 我已阅读并同意</label>
        <button type="button" data-action="privacy">《隐私声明和风险提示》</button>
      </div>
      <div class="zhuli-apply"><button type="button" data-action="open-registration">✎ 立即报名</button></div>
    </div>`;
}

function registrationModal() {
  modalRoot.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="registration-title" data-modal-panel>
        <header class="modal__header"><h2 id="registration-title">填写预报名信息</h2><button class="modal__close" type="button" data-action="close-modal" aria-label="关闭">×</button></header>
        <p class="modal-note">此复刻版只在当前浏览器中演示表单校验，不会把姓名、手机号或住址发送到正式报名系统。</p>
        <form id="registration-form" novalidate>
          <div class="field"><label for="reg-name">姓名</label><input id="reg-name" name="name" placeholder="请输入真实姓名" required /></div>
          <div class="field"><label for="reg-phone">手机号</label><input id="reg-phone" name="phone" inputmode="tel" placeholder="请输入手机号码" required pattern="1[3-9][0-9]{9}" /></div>
          <div class="field"><label for="reg-province">省份</label><input id="reg-province" name="province" placeholder="请选择省份" required /></div>
          <div class="field"><label for="reg-city">城市</label><input id="reg-city" name="city" placeholder="请选择城市" required /></div>
          <div class="field"><label for="reg-district">区/县</label><input id="reg-district" name="district" placeholder="请选择区/县" required /></div>
          <div class="field"><label for="reg-school">高中学校</label><input id="reg-school" name="school" placeholder="请输入高中学校名称" required /></div>
          <div class="field"><label for="reg-class">班级信息</label><input id="reg-class" name="className" placeholder="请输入班级名称" required /></div>
          <div class="field"><label for="reg-address">详细家庭住址</label><input id="reg-address" name="address" placeholder="请输入详细家庭住址" required /></div>
          <div class="field"><label for="reg-birthday">出生日期</label><input id="reg-birthday" name="birthday" type="date" required /></div>
          <button class="primary-button" type="submit">提交预报名</button>
        </form>
      </section>
    </div>`;
  document.querySelector("#reg-name").focus();
}

function privacyModal() {
  modalRoot.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="privacy-title" data-modal-panel>
        <header class="modal__header"><h2 id="privacy-title">隐私声明和风险提示</h2><button class="modal__close" type="button" data-action="close-modal" aria-label="关闭">×</button></header>
        <p>报名信息仅应用于活动资格审核、联系及助力兑现。请确保提交的信息真实、准确，并注意保护身份证、录取通知书等个人资料。</p>
        <p class="modal-note">本地复刻版不会上传或保存正式报名资料。</p>
      </section>
    </div>`;
}

function closeModal() {
  modalRoot.innerHTML = "";
}

const routes = {
  home: homePage,
  crops: cropsPage,
  product: productPage,
  inquiry: inquiryPage,
  advice: advicePage,
  zhuli: zhuliPage
};

function render() {
  const route = window.location.hash.replace(/^#\/?/, "") || "home";
  const renderer = routes[route] || routes.home;
  app.innerHTML = renderer();
  closeModal();
  window.scrollTo(0, 0);

  const enterpriseVideo = document.querySelector('[data-video="enterprise"]');
  if (enterpriseVideo) {
    enterpriseVideo.addEventListener("error", () => {
      enterpriseVideo.closest(".video-card").classList.add("is-error");
    }, { once: true });
  }

}

document.addEventListener("click", event => {
  const routeTarget = event.target.closest("[data-route]");
  if (routeTarget) {
    navigate(routeTarget.dataset.route);
    return;
  }

  const categoryTarget = event.target.closest("[data-category]");
  if (categoryTarget) {
    activeCropCategory = categoryTarget.dataset.category;
    app.innerHTML = cropsPage();
    return;
  }

  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;

  if (action === "back") {
    if (window.history.length > 1) window.history.back();
    else navigate("home");
  }

  if (action === "refresh-captcha") {
    captcha = createCaptcha();
    actionTarget.textContent = captcha;
  }

  if (action === "open-registration") {
    const agreement = document.querySelector("#activity-agreement");
    if (!agreement?.checked) {
      showToast("请先阅读并同意隐私声明和风险提示");
      return;
    }
    registrationModal();
  }

  if (action === "privacy") privacyModal();

  if (action === "close-modal" && (!event.target.closest("[data-modal-panel]") || event.target.closest(".modal__close"))) {
    closeModal();
  }
});

document.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.target;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (form.id === "inquiry-form") {
    const data = new FormData(form);
    if (String(data.get("captcha")).toUpperCase() !== captcha) {
      showToast("验证码不正确，请重新输入");
      captcha = createCaptcha();
      document.querySelector("[data-action='refresh-captcha']").textContent = captcha;
      return;
    }
    showToast("本地复刻版未连接正式防伪数据库，请以官方查询结果为准");
  }

  if (form.id === "advice-form") {
    showToast("反馈已在本地完成校验，未发送到官方服务器");
    form.reset();
  }

  if (form.id === "registration-form") {
    showToast("预报名信息已完成本地校验，未发送到正式报名系统");
    closeModal();
  }
});

window.addEventListener("hashchange", render);
render();
