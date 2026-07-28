import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!
const params = new URLSearchParams(location.search)
const target = params.get('target') || 'mhapp://open/home'
const fallback = params.get('fallback') || ''

if (location.pathname === '/wake') {
  renderWakePage()
} else {
  renderGenerator()
}

function renderGenerator() {
  app.innerHTML = `
  <main class="shell"><section class="card">
    <div class="eyebrow">URL SCHEME BUILDER</div>
    <h1>生成唤醒链接</h1>
    <p class="desc">粘贴客户端的 URL Scheme，生成一个可以分享的网页唤醒链接。</p>
    <label>URL Scheme<input id="scheme" value="xhsuserprofile://user_id=68ebc3ac00000000370313a2" placeholder="例如：xhsuserprofile://user_id=..." /></label>
    <label>备用网页地址 <span class="optional">可选</span><input id="fallback-input" placeholder="https://example.com" /></label>
    <div class="result"><span>生成的链接</span><code id="result"></code></div>
    <div class="actions"><button id="copy" type="button">复制链接</button><button id="preview" class="secondary" type="button">打开测试</button></div>
    <p id="copy-status" class="status" aria-live="polite"></p>
  </section></main>`

  const schemeInput = document.querySelector<HTMLInputElement>('#scheme')!
  const fallbackInput = document.querySelector<HTMLInputElement>('#fallback-input')!
  const result = document.querySelector<HTMLElement>('#result')!
  const copyStatus = document.querySelector<HTMLParagraphElement>('#copy-status')!
  const makeLink = () => {
    const url = new URL('/wake', location.origin)
    url.searchParams.set('target', schemeInput.value.trim())
    if (fallbackInput.value.trim()) url.searchParams.set('fallback', fallbackInput.value.trim())
    result.textContent = url.toString()
    return url.toString()
  }
  schemeInput.addEventListener('input', makeLink)
  fallbackInput.addEventListener('input', makeLink)
  makeLink()
  document.querySelector<HTMLButtonElement>('#copy')!.addEventListener('click', async () => {
    await navigator.clipboard.writeText(makeLink())
    copyStatus.textContent = '已复制，可直接分享。'
  })
  document.querySelector<HTMLButtonElement>('#preview')!.addEventListener('click', () => { location.href = makeLink() })
}

function renderWakePage() {
app.innerHTML = `
  <main class="shell">
    <section class="card">
      <div class="eyebrow">URL SCHEME ASSIST</div>
      <h1>正在唤醒应用</h1>
      <p class="desc">点击下面按钮打开客户端。如果没有反应，请确认应用已安装。</p>
      <div class="target"><span>目标</span><code>${escapeHtml(target)}</code></div>
      <button id="open" type="button">打开应用</button>
      <a id="fallback" class="fallback" href="${escapeAttr(fallback)}" hidden>打开网页备用入口</a>
      <p id="status" class="status" aria-live="polite"></p>
    </section>
</main>
`

const openButton = document.querySelector<HTMLButtonElement>('#open')!
const status = document.querySelector<HTMLParagraphElement>('#status')!
const fallbackLink = document.querySelector<HTMLAnchorElement>('#fallback')!

if (fallback) fallbackLink.hidden = false

openButton.addEventListener('click', () => {
  status.textContent = '已发起唤醒，请稍候…'
  window.location.href = target
  window.setTimeout(() => {
    status.textContent = '如果页面没有变化，请安装客户端或使用备用入口。'
  }, 1500)
})
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
}

function escapeAttr(value: string) {
  return escapeHtml(value)
}
