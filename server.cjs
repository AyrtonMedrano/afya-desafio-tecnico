const jsonServer = require('json-server')
const path = require('path')

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

const findPlanByStoreId = (db, storeId) => {
  const plans = db.get('plans').value()
  return plans.find((p) => p.storeId === storeId)
}
const findCouponByCode = (db, code) => {
  const coupons = db.get('coupons').value()
  return coupons.find((c) => c.code === code)
}

server.post('/coupon/validate', (req, res) => {
  const { code } = req.body || {}
  const db = router.db
  const coupon = findCouponByCode(db, code)
  if (!code) return res.status(400).json({ valid: false, message: 'Código não informado' })
  if (!coupon) return res.status(404).json({ valid: false, message: 'Cupom inválido' })

  return res.json({ valid: true, discount: coupon.discount })
})

server.post('/subscription', (req, res) => {
  const db = router.db
  const payload = req.body || {}

  const {
    storeId,
    cardCpf,
    CVV,
    expirationDate,
    holder,
    number,
    installments,
    couponCode,
    userId,
  } = payload

  if (!storeId || !cardCpf || !CVV || !expirationDate || !holder || !number || !installments || !userId) {
    return res.status(400).json({ message: 'Campos obrigatórios faltantes.' })
  }

  const plan = findPlanByStoreId(db, storeId)
  if (!plan) return res.status(404).json({ message: 'Plano não encontrado!' })

  let price = plan.fullPrice
  const period = plan.period

  if (plan.period === 'annually' && installments === 1) {
    price = Math.round(price * 0.9 * 100) / 100
  }

  let appliedCoupon = null
  if (couponCode) {
    const coupon = findCouponByCode(db, couponCode)
    if (coupon ) {
      appliedCoupon = coupon
      price = Math.round(price * (1 - coupon.discount / 100) * 100) / 100
    }
  }

  const id = Date.now()
  const subscription = {
    id,
    userId: id,
    cardCpf,
    method: 'credit_card',
    installments,
    period,
    number,
    price,
    storeId,
    couponCode: appliedCoupon ? appliedCoupon.code : null,
  }

  db.get('subscriptions').push(subscription).write()

  return res.status(201).json(subscription)
})

server.get('/subscriptions/:userId', (req, res) => {
  const db = router.db
  const userId = Number(req.params.userId)
  const subs = db.get('subscriptions').filter({ userId }).value()
  if (!subs.length) return res.status(404).json({ message: 'Assinatura não encontrada' })
  const latest = subs.sort((a, b) => b.id - a.id)[0]
  return res.json(latest)
})

server.use(router)

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`JSON Server rodando na porta 3000 - http://localhost:${PORT}`)
})