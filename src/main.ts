import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!
const params = new URLSearchParams(location.search)
const target = params.get('target') || params.get('url') || 'mhapp://open/home'

if (location.pathname === '/wake' || location.pathname === '/redirect') {
  renderWakePage()
} else if (location.pathname === '/scheme' || location.pathname === '/builder') {
  renderGenerator()
} else if (location.pathname === '/relay') {
  renderGenerator()
} else {
  renderHome()
}

function renderHome() {
  app.innerHTML = `
  <main class="shell"><section class="card home-card">
    <div class="eyebrow">SCHEME TOOLBOX</div>
    <h1>盟洪工具箱</h1>
    <p class="desc">选择一个功能开始使用。</p>
    <nav class="feature-list" aria-label="功能列表">
      <a class="feature" href="/scheme"><span><strong>URL Scheme 跳转</strong><small>输入 Scheme，点击按钮直接唤醒 App</small></span><b>›</b></a>
      <a class="feature" href="/relay"><span><strong>重定向中转链接</strong><small>输入 Scheme，生成可分享的 HTTPS 中转链接</small></span><b>›</b></a>
    </nav>
  </section></main>`
}

function renderGenerator() {
  app.innerHTML = `
  <main class="shell"><section class="card">
    <a class="back" href="/">← 返回功能列表</a>
    <div class="eyebrow">URL SCHEME BUILDER</div>
    <h1>生成唤醒链接</h1>
    <p class="desc">粘贴客户端的 URL Scheme，生成一个可以分享的网页唤醒链接。</p>
    <label>URL Scheme<input id="scheme" value="xhsuserprofile://user_id=68ebc3ac00000000370313a2" placeholder="例如：xhsuserprofile://user_id=..." /></label>
    <div class="result"><span>生成的链接</span><code id="result"></code></div>
    <div class="actions"><button id="copy" type="button">复制链接</button><a id="launch" class="button secondary" href="#">打开应用</a></div>
    <p id="copy-status" class="status" aria-live="polite"></p>
  </section></main>`

  const schemeInput = document.querySelector<HTMLInputElement>('#scheme')!
  const result = document.querySelector<HTMLElement>('#result')!
  const launch = document.querySelector<HTMLAnchorElement>('#launch')!
  const copyStatus = document.querySelector<HTMLParagraphElement>('#copy-status')!
  const makeLink = () => {
    const url = new URL('/redirect', location.origin)
    url.searchParams.set('url', schemeInput.value.trim())
    result.textContent = url.toString()
    launch.href = schemeInput.value.trim() || '#'
    return url.toString()
  }
  schemeInput.addEventListener('input', makeLink)
  makeLink()
  document.querySelector<HTMLButtonElement>('#copy')!.addEventListener('click', async () => {
    await navigator.clipboard.writeText(makeLink())
    copyStatus.textContent = '已复制，可直接分享。'
  })
}

function renderWakePage() {
  // 使用标准超链接触发自定义 Scheme。
  const link = document.createElement('a')
  link.href = target
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()

}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
}

function escapeAttr(value: string) {
  return escapeHtml(value)
}
