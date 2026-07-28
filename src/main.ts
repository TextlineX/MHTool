import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!
const params = new URLSearchParams(location.search)
const target = params.get('target') || 'mhapp://open/home'
const fallback = params.get('fallback') || ''

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

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
}

function escapeAttr(value: string) {
  return escapeHtml(value)
}
