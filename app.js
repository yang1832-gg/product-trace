const ASSETS = "./assets";
const PRODUCT_VIDEO_URL = `${ASSETS}/videos/brand.mp4`;
const ENTERPRISE_VIDEO_URL = `${ASSETS}/videos/enterprise.mp4`;

const PRODUCT = {
  brand: "三环中化",
  name: "磷酸二铵",
  technicalIndex: "总养分（N+P2O5）≥64.0%，配合式：18-46-0",
  weight: "50 kg",
  batch: "SZ 260517 2B",
  factory: "云南三环中化化肥有限公司",
  address: "云南省昆明市西山区海口工业园区",
  description: "磷酸二铵，也称作磷酸氢二铵、磷酸氢铵。本色是种乳白色的晶体，分子式为（NH4）2HPO4，溶于水，加热至155℃分解，但在室温下也有可能逐渐地分解放出氨气，而形成磷酸二氢铵，水溶性呈弱碱性，PH8.0。因添加原料不同，所以实物颜色不同，以实物为准。",
  spill: "简单清扫堆放，放置到袋内。",
  standard: "GB/T10205-2009",
  disposal: "在使用前一定要保持包装袋完好无损，运输过程中要做好防雨淋，贮存在干燥、通风良好的地方。",
  hotline: "800-8895800"
};

const INITIAL_CERTIFICATION = {
  code: "805778674236962"
};

const RECORD_ID = (new URLSearchParams(window.location.search).get("id") || "").trim().toLowerCase();
const RECORD_ID_PATTERN = /^[a-f0-9]{24}$/;
let recordLookup = {
  status: RECORD_ID ? "loading" : "none",
  record: null
};

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
let activeCropCategory = "水果类";

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function navigate(route) {
  window.location.hash = route;
}

function certificationStatus() {
  if (recordLookup.status === "valid") {
    return {
      code: recordLookup.record.code
    };
  }

  return INITIAL_CERTIFICATION;
}

function productBatch() {
  return PRODUCT.batch;
}

async function loadStaticRecord() {
  if (!RECORD_ID) return;
  if (!RECORD_ID_PATTERN.test(RECORD_ID)) {
    recordLookup = { status: "invalid", record: null };
    return;
  }

  try {
    const response = await fetch(`${ASSETS}/data/records/${RECORD_ID.slice(0, 2)}.json?v=1`);
    if (!response.ok) {
      recordLookup = { status: response.status === 404 ? "invalid" : "error", record: null };
      return;
    }

    const records = await response.json();
    const record = records[RECORD_ID];
    recordLookup = record
      ? { status: "valid", record }
      : { status: "invalid", record: null };
  } catch {
    recordLookup = { status: "error", record: null };
  }
}

function authenticationStatusMarkup(certification) {
  if (recordLookup.status === "invalid") {
    return `
      <div class="authentication-status authentication-status--error" role="alert">
        <p class="authentication-status__headline">二维码无效</p>
        <p>未找到对应的防伪编码，请核对包装上的二维码。</p>
      </div>`;
  }

  if (recordLookup.status === "error") {
    return `
      <div class="authentication-status authentication-status--error" role="alert">
        <p class="authentication-status__headline">认证数据加载失败</p>
        <p>请检查网络后重新扫码或刷新页面。</p>
      </div>`;
  }

  return `
    <div class="authentication-status" aria-label="产品防伪认证信息">
      <p class="authentication-status__code"><strong>防伪编码：</strong><span>${certification.code}</span></p>
      <p>该产品已通过防伪中心认证！</p>
    </div>`;
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
  const certification = certificationStatus();
  const batch = productBatch();
  return `
    <div class="page-shell">
      ${brandBanner()}
      <section class="system-zone">
        <div class="system-zone__inner">
          <h1 class="system-title">云天化产品二维码追溯系统</h1>
          ${authenticationStatusMarkup(certification)}
          <article class="product-summary">
            <div class="product-summary__media">
              <img src="${ASSETS}/images/product-bag.jpg?v=11" alt="三环中化磷酸二铵肥料包装" />
            </div>
            <div class="product-summary__details">
              <p><strong>品牌：</strong><span>${PRODUCT.brand}</span></p>
              <p><strong>产品名称：</strong><span>${PRODUCT.name}</span></p>
              <p><strong>主要技术指标：</strong></p>
              <p class="product-summary__technical">${PRODUCT.technicalIndex}</p>
              <p><strong>净重：</strong><span>${PRODUCT.weight}</span></p>
              <p><strong>生产批号/生产日期：</strong></p>
              <p>${batch}</p>
              <p><strong>生产商：</strong></p>
              <p>${PRODUCT.factory}</p>
              <button class="text-link" type="button" data-route="product">点击查看更多...</button>
            </div>
          </article>
        </div>
      </section>

      <div class="feature-wrap">
        <button class="feature-button" type="button" data-route="zhuli" aria-label="高考助力活动报名入口" style="background-image:url('${ASSETS}/images/enter-bg.png')"></button>
      </div>

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

        <section class="video-section" aria-labelledby="video-title">
          <h2 class="section-heading" id="video-title"><img src="${ASSETS}/images/video-logo.png" alt="" />热点视频</h2>
          <div class="video-card" data-video-card="enterprise">
            <span class="video-card__label">企业宣传视频</span>
            <video controls preload="metadata" playsinline poster="${ASSETS}/images/enterprise-poster.jpg" data-video="enterprise">
              <source src="${ENTERPRISE_VIDEO_URL}" type="video/mp4" />
            </video>
            <div class="video-error">视频暂时无法加载，请稍后重试。</div>
          </div>
          <div class="video-card" data-video-card="product">
            <span class="video-card__label">产品宣传视频</span>
            <video controls preload="metadata" playsinline poster="${ASSETS}/images/brand-poster.jpg" data-video="product">
              <source src="${PRODUCT_VIDEO_URL}" type="video/mp4" />
            </video>
            <div class="video-error">视频暂时无法加载，请稍后重试。</div>
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
  const batch = productBatch();
  return `
    <div class="page-shell">
      ${subpageHeader("产品详情")}
      <main class="subpage-content product-page">
        <img class="product-page__banner" src="${ASSETS}/images/product-banner.jpg" alt="绿色科技 服务现代农业" />
        <section class="product-info" aria-label="产品详情">
          <div class="product-info__field">
            <h2>品牌：</h2>
            <p>${PRODUCT.brand}</p>
          </div>
          <div class="product-info__field">
            <h2>产品名称：</h2>
            <p>${PRODUCT.name}</p>
          </div>
          <div class="product-info__field">
            <h2>主要技术指标：</h2>
            <p>${PRODUCT.technicalIndex}</p>
          </div>
          <div class="product-info__field">
            <h2>生产批号/生产日期：</h2>
            <p>${batch}</p>
          </div>
          <div class="product-info__field">
            <h2>生产地址：</h2>
            <p>${PRODUCT.factory}</p>
          </div>
          <div class="product-info__field product-info__description">
            <h2>产品描述：</h2>
            <p>${PRODUCT.description.replace("\n", "</p><p>")}</p>
          </div>
          <div class="product-info__section">
            <h2>
              <svg class="product-info__icon product-info__icon--advice" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              使用建议：
            </h2>
          </div>
          <div class="product-info__section">
            <h2>
              <svg class="product-info__icon product-info__icon--other" aria-hidden="true" viewBox="0 0 24 24"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              其他信息：
            </h2>
            <p>产品散落物：${PRODUCT.spill}</p>
            <p>产品的执行标准：${PRODUCT.standard}</p>
            <p>处置方法：${PRODUCT.disposal}</p>
            <p>免费服务热线：${PRODUCT.hotline}</p>
          </div>
          <button class="feedback-button" type="button" data-route="advice">产品质量反馈</button>
        </section>
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

function adviceSuccessModal() {
  modalRoot.innerHTML = `
    <div class="modal-backdrop success-dialog-backdrop" data-action="close-modal">
      <section class="success-dialog" role="alertdialog" aria-modal="true" aria-labelledby="advice-success-message" data-modal-panel>
        <p id="advice-success-message">发送成功，祝您生活愉快！</p>
        <div class="success-dialog__actions">
          <button class="success-dialog__confirm" type="button" data-action="close-modal">确定</button>
        </div>
      </section>
    </div>`;
  document.querySelector(".success-dialog__confirm").focus();
}

function closeModal() {
  modalRoot.innerHTML = "";
}

const routes = {
  home: homePage,
  crops: cropsPage,
  product: productPage,
  advice: advicePage,
  zhuli: zhuliPage
};

function render() {
  const route = window.location.hash.replace(/^#\/?/, "") || "home";
  const renderer = routes[route] || routes.home;
  app.innerHTML = renderer();
  closeModal();
  window.scrollTo(0, 0);

  document.querySelectorAll("video[data-video]").forEach(video => {
    video.addEventListener("error", () => {
      video.closest(".video-card").classList.add("is-error");
    }, { once: true });
  });

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

  if (action === "open-registration") {
    const agreement = document.querySelector("#activity-agreement");
    if (!agreement?.checked) {
      showToast("请先阅读并同意隐私声明和风险提示");
      return;
    }
    registrationModal();
  }

  if (action === "privacy") privacyModal();

  if (action === "close-modal" && (actionTarget.matches("button") || !event.target.closest("[data-modal-panel]"))) {
    closeModal();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && modalRoot.hasChildNodes()) closeModal();
});

document.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.target;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (form.id === "advice-form") {
    form.reset();
    adviceSuccessModal();
  }

  if (form.id === "registration-form") {
    showToast("预报名信息已完成本地校验，未发送到正式报名系统");
    closeModal();
  }
});

window.addEventListener("hashchange", render);

async function initializeApp() {
  if (RECORD_ID) {
    app.innerHTML = `
      <main class="record-loading" role="status" aria-live="polite">
        <span class="record-loading__spinner" aria-hidden="true"></span>
        <p>正在验证二维码...</p>
      </main>`;
    await loadStaticRecord();
  }
  render();
}

initializeApp();
