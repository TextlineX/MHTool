import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!
const params = new URLSearchParams(location.search)
const target = params.get('target') || 'mhapp://open/home'

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
    <div class="result"><span>生成的链接</span><code id="result"></code></div>
    <div class="actions"><button id="copy" type="button">复制链接</button><a id="launch" class="button secondary" href="#">打开应用</a></div>
    <p id="copy-status" class="status" aria-live="polite"></p>
  </section></main>`

  const schemeInput = document.querySelector<HTMLInputElement>('#scheme')!
  const result = document.querySelector<HTMLElement>('#result')!
  const launch = document.querySelector<HTMLAnchorElement>('#launch')!
  const copyStatus = document.querySelector<HTMLParagraphElement>('#copy-status')!
  const makeLink = () => {
    const url = new URL('/wake', location.origin)
    url.searchParams.set('target', schemeInput.value.trim())
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
