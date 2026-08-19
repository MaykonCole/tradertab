import React, { useEffect, useMemo, useState } from 'react'
import {
  Activity, AlertTriangle, Check, ChevronRight, CircleOff, Clipboard, Database,
  KeyRound, LayoutDashboard, Loader2, MonitorSmartphone, Plus, RefreshCw, RotateCcw,
  Search, Server, Settings, ShieldCheck, Trash2, UserRound, X, XCircle
} from 'lucide-react'


function cn(...values){ return values.filter(Boolean).join(' ') }
function fmtDate(value){
  if(!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(d)
}
function daysLeft(value){
  if(!value) return null
  return Math.ceil((new Date(value).getTime()-Date.now())/86400000)
}
function shortKey(key=''){ return key.length > 29 ? `${key.slice(0,17)}…${key.slice(-9)}` : key }
function statusTone(status){
  return ({active:'green',expired:'amber',revoked:'red',suspended:'red',inactive:'muted'})[status] || 'muted'
}

class ApiError extends Error {
  constructor(message, status, data){ super(message); this.status=status; this.data=data }
}

function useApi(baseUrl, token){
  return useMemo(()=>{
    const base = baseUrl.replace(/\/$/,'')
    async function request(path, options={}){
      const headers = {
        'X-License-Server-Url': base,
        ...(options.body ? {'Content-Type':'application/json'} : {}),
        ...(options.admin !== false && token ? {'X-Admin-Token': token} : {}),
        ...options.headers,
      }
      const query = new URLSearchParams({ path })
      const response = await fetch(`/api/license-admin-proxy?${query.toString()}`, {
        ...options,
        headers,
        cache: 'no-store',
        credentials: 'same-origin',
      })
      let data = null
      try { data = await response.json() } catch { data = {error:`HTTP ${response.status}`} }
      if(!response.ok) throw new ApiError(data?.error || `HTTP ${response.status}`, response.status, data)
      return data
    }
    return {
      health:()=>request('/health',{admin:false}),
      ready:()=>request('/ready',{admin:false}),
      list:()=>request('/admin/licenses'),
      one:key=>request(`/admin/licenses?key=${encodeURIComponent(key)}`),
      catalog:()=>request('/admin/kirvano/catalog-check'),
      create:body=>request('/admin/licenses',{method:'POST',body:JSON.stringify(body)}),
      revoke:licenseKey=>request('/admin/licenses/revoke',{method:'POST',body:JSON.stringify({licenseKey})}),
      resetLicense:licenseKey=>request('/admin/licenses/reset',{method:'POST',body:JSON.stringify({licenseKey})}),
      resetDevices:licenseKey=>request('/admin/licenses/reset-devices',{method:'POST',body:JSON.stringify({licenseKey})}),
      resetTrial:body=>request('/admin/trial-device/reset',{method:'POST',body:JSON.stringify(body)}),
      deleteByEmail:email=>request(`/admin/licenses?email=${encodeURIComponent(email)}`,{method:'DELETE'}),
      deleteByFingerprint:fingerprint=>request(`/admin/licenses?fingerprintSuffix=${encodeURIComponent(fingerprint)}`,{method:'DELETE'}),
    }
  },[baseUrl,token])
}

function Modal({open,title,subtitle,onClose,children,width='640px'}){
  if(!open) return null
  return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
    <div className="modal" style={{maxWidth:width}}>
      <div className="modal-head"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>
      {children}
    </div>
  </div>
}

function Toast({toast,onClose}){
  if(!toast) return null
  return <div className={cn('toast',toast.type==='error'&&'toast-error')}>
    {toast.type==='error'?<XCircle size={18}/>:<Check size={18}/>}<span>{toast.message}</span><button onClick={onClose}><X size={15}/></button>
  </div>
}

function StatusBadge({status}){ return <span className={cn('badge',`badge-${statusTone(status)}`)}><span className="dot"/>{status || 'desconhecido'}</span> }
function SourceBadge({license}){ return <span className="mini-badge">{license.source?.provider || 'manual'} · {license.renewalMode || 'manual'}</span> }

export default function AdminLicensePage(){
  const [baseUrl,setBaseUrl] = useState('')
  const [token,setToken] = useState('')
  const [connected,setConnected] = useState(false)
  const [loading,setLoading] = useState(false)
  const [licenses,setLicenses] = useState([])
  const [summary,setSummary] = useState(null)
  const [health,setHealth] = useState(null)
  const [catalog,setCatalog] = useState(null)
  const [search,setSearch] = useState('')
  const [statusFilter,setStatusFilter] = useState('all')
  const [sourceFilter,setSourceFilter] = useState('all')
  const [productFilter,setProductFilter] = useState('all')
  const [selected,setSelected] = useState(null)
  const [createOpen,setCreateOpen] = useState(false)
  const [deleteOpen,setDeleteOpen] = useState(false)
  const [resetTrialOpen,setResetTrialOpen] = useState(false)
  const [settingsOpen,setSettingsOpen] = useState(false)
  const [toast,setToast] = useState(null)
  const api = useApi(baseUrl, token)

  const notify=(message,type='ok')=>{ setToast({message,type}); setTimeout(()=>setToast(null),4000) }

  async function connect(){
    if(!baseUrl||!token){ notify('Informe a URL do servidor e o ADMIN_TOKEN.','error'); return }
    setLoading(true)
    try{
      const [h,l,c] = await Promise.all([api.health(), api.list(), api.catalog().catch(()=>null)])
      setHealth(h); setLicenses(l.licenses||[]); setSummary(l.summary||null); setCatalog(c); setConnected(true)
      notify('Conectado ao License Server.')
    }catch(e){
      const isNetworkError = e instanceof TypeError || /failed to fetch|networkerror|load failed/i.test(String(e?.message||''))
      notify(
        e.status===401
          ? 'ADMIN_TOKEN inválido ou não autorizado.'
          : isNetworkError
            ? 'Não foi possível acessar o Worker pelo proxy seguro do TraderTab. Verifique a URL do License Server.'
            : `Falha ao conectar: ${e.message}`,
        'error'
      )
    }
    finally{ setLoading(false) }
  }

  async function refresh(silent=false){
    setLoading(true)
    try{
      const [h,l,c] = await Promise.all([api.health(),api.list(),api.catalog().catch(()=>null)])
      setHealth(h); setLicenses(l.licenses||[]); setSummary(l.summary||null); setCatalog(c)
      if(selected){ const fresh=(l.licenses||[]).find(x=>x.key===selected.key); setSelected(fresh||null) }
      if(!silent) notify('Dados atualizados.')
    }catch(e){ notify(`Erro ao atualizar: ${e.message}`,'error'); if(e.status===401)setConnected(false) }
    finally{ setLoading(false) }
  }


  const productOptions = useMemo(()=>{
    const map = new Map()
    for(const l of licenses){
      const id = String(l.product?.id || '').trim()
      const name = String(l.product?.name || '').trim()
      const key = id || name
      if(!key) continue
      if(!map.has(key)) map.set(key, { value:key, label:name || id })
    }
    return Array.from(map.values()).sort((a,b)=>a.label.localeCompare(b.label,'pt-BR'))
  },[licenses])

  const filtered = useMemo(()=>licenses.filter(l=>{
    const q=search.trim().toLowerCase()
    const matchesQ=!q || [l.key,l.customerEmail,l.product?.name,l.product?.plan,l.source?.saleId,l.source?.subscriptionId].some(v=>String(v||'').toLowerCase().includes(q)) || (l.devices||[]).some(d=>d.fingerprintSuffix?.toLowerCase().includes(q))
    const productKey=String(l.product?.id || l.product?.name || '').trim()
    return matchesQ && (statusFilter==='all'||l.status===statusFilter) && (sourceFilter==='all'||(l.source?.provider||'manual')===sourceFilter) && (productFilter==='all'||productKey===productFilter)
  }),[licenses,search,statusFilter,sourceFilter,productFilter])

  if(!connected){
    return <div className="license-admin-root"><div className="login-shell"><div className="glow glow-a"/><div className="glow glow-b"/>
      <section className="login-card">
        <div className="brand-mark"><KeyRound size={25}/></div>
        <div><div className="eyebrow">MYRADAR</div><h1>License Admin</h1><p>Gestão centralizada das licenças do MyRadar e HistoryOdd.</p></div>
        <label>URL do License Server<input value={baseUrl} onChange={e=>setBaseUrl(e.target.value)} placeholder="https://seu-worker.workers.dev" autoFocus autoComplete="off" spellCheck="false" /></label>
        <label>ADMIN_TOKEN<input type="password" value={token} onChange={e=>setToken(e.target.value)} placeholder="Token administrativo" autoComplete="new-password" spellCheck="false" onKeyDown={e=>e.key==='Enter'&&connect()}/></label>
        <button className="btn btn-primary btn-full" onClick={connect} disabled={loading}>{loading?<Loader2 className="spin" size={18}/>:<ShieldCheck size={18}/>} Acessar painel</button>
        <p className="security-note">Worker e ADMIN_TOKEN ficam <b>somente na memória desta página</b>. Nada é salvo em localStorage ou sessionStorage; ao recarregar ou sair, será necessário informar novamente.</p>
      </section>
    </div></div>
  }

  const active=summary?.active ?? licenses.filter(x=>x.status==='active').length
  const expired=licenses.filter(x=>x.status==='expired').length
  const revoked=licenses.filter(x=>x.status==='revoked').length
  const trials=licenses.filter(x=>String(x.product?.name||'').toLowerCase().includes('historyodd')&&[10,20].includes(x.durationDays)).length

  return <div className="license-admin-root"><div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark small"><KeyRound size={19}/></div><div><strong>MyRadar</strong><span>License Admin</span></div></div>
      <nav><button className="nav-active"><LayoutDashboard size={18}/> Licenças</button><button onClick={()=>setCreateOpen(true)}><Plus size={18}/> Criar licença</button><button onClick={()=>setResetTrialOpen(true)}><MonitorSmartphone size={18}/> Reset de Trial</button><button onClick={()=>setSettingsOpen(true)}><Server size={18}/> Servidor</button></nav>
      <div className="sidebar-bottom"><div className={cn('server-pill',health?.readyForSales?'ready':'warning')}><span className="dot"/><div><b>{health?.readyForSales?'Pronto para vendas':'Atenção no servidor'}</b><small>{health?.service||'License Server'}</small></div></div><button className="logout" onClick={()=>{setConnected(false);setToken('');setBaseUrl('');setLicenses([]);setSummary(null);setHealth(null);setCatalog(null);setSelected(null)}}><CircleOff size={16}/> Sair da sessão</button></div>
    </aside>

    <main>
      <header className="topbar"><div><div className="eyebrow">VISÃO GERAL</div><h1>Gestão de licenças</h1></div><div className="top-actions"><button className="btn btn-ghost" onClick={()=>refresh()} disabled={loading}>{loading?<Loader2 className="spin" size={17}/>:<RefreshCw size={17}/>} Atualizar</button><button className="btn btn-primary" onClick={()=>setCreateOpen(true)}><Plus size={18}/> Nova licença</button></div></header>

      <section className="stats-grid">
        <Stat icon={<KeyRound/>} label="Total" value={licenses.length} note="licenças cadastradas"/>
        <Stat icon={<ShieldCheck/>} label="Ativas" value={active} note={`${Math.round((active/Math.max(licenses.length,1))*100)}% do total`} tone="green"/>
        <Stat icon={<Activity/>} label="Expiradas" value={expired} note="prazo encerrado" tone="amber"/>
        <Stat icon={<XCircle/>} label="Revogadas" value={revoked} note={`${trials} trials detectadas`} tone="red"/>
      </section>

      {!health?.readyForSales && <div className="warning-banner"><AlertTriangle size={19}/><div><b>Servidor vivo, mas não totalmente pronto para vendas.</b><span>{[...(health?.missingRequiredSecrets||[]),...(health?.missingOtpConfig||[]),...(health?.catalogIssues||[])].join(' · ') || 'Verifique readiness e catálogo.'}</span></div><button onClick={()=>setSettingsOpen(true)}>Ver diagnóstico</button></div>}

      <section className="panel">
        <div className="panel-head"><div><h2>Licenças</h2><p>{filtered.length} de {licenses.length} registros</p></div><div className="filters"><div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="E-mail, chave, plano, fingerprint…"/></div><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">Todos status</option><option value="active">Ativas</option><option value="expired">Expiradas</option><option value="revoked">Revogadas</option><option value="suspended">Suspensas</option></select><select value={sourceFilter} onChange={e=>setSourceFilter(e.target.value)}><option value="all">Todas origens</option><option value="manual">Manual</option><option value="kirvano">Kirvano</option></select><select value={productFilter} onChange={e=>setProductFilter(e.target.value)}><option value="all">Todos produtos</option>{productOptions.map(p=><option key={p.value} value={p.value}>{p.label}</option>)}</select></div></div>
        <div className="table-wrap"><table><thead><tr><th>Cliente / licença</th><th>Produto</th><th>Status</th><th>Origem</th><th>Dispositivos</th><th>Validade</th><th></th></tr></thead><tbody>
          {filtered.map(l=><tr key={l.key} onClick={()=>setSelected(l)}><td><div className="cell-main">{l.customerEmail}</div><div className="cell-sub mono">{shortKey(l.key)}</div></td><td><div className="cell-main">{l.product?.name||'—'}</div><div className="cell-sub">{l.product?.plan||`${l.durationDays} dias`}</div></td><td><StatusBadge status={l.status}/>{l.storedStatus!==l.status&&<div className="cell-sub">salvo: {l.storedStatus}</div>}</td><td><SourceBadge license={l}/></td><td><span className="device-count"><MonitorSmartphone size={15}/>{l.registeredDevices}/{l.maxDevices}</span></td><td><div className="cell-main">{fmtDate(l.expiresAt)}</div><div className={cn('cell-sub',daysLeft(l.expiresAt)!=null&&daysLeft(l.expiresAt)<=3&&'danger-text')}>{daysLeft(l.expiresAt)==null?'inicia na ativação':daysLeft(l.expiresAt)>=0?`${daysLeft(l.expiresAt)} dias restantes`:`expirada há ${Math.abs(daysLeft(l.expiresAt))} dias`}</div></td><td><ChevronRight size={18}/></td></tr>)}
          {!filtered.length&&<tr><td colSpan="7"><div className="empty"><Database size={28}/><b>Nenhuma licença encontrada</b><span>Ajuste os filtros ou crie uma nova licença.</span></div></td></tr>}
        </tbody></table></div>
      </section>
    </main>

    <LicenseDrawer license={selected} onClose={()=>setSelected(null)} api={api} refresh={refresh} notify={notify} onDelete={()=>setDeleteOpen(true)} onResetTrial={()=>setResetTrialOpen(true)}/>
    <CreateLicense open={createOpen} onClose={()=>setCreateOpen(false)} api={api} refresh={refresh} notify={notify} catalog={catalog}/>
    <DeleteLicenses open={deleteOpen} onClose={()=>setDeleteOpen(false)} license={selected} api={api} refresh={refresh} notify={notify}/>
    <ResetTrial open={resetTrialOpen} onClose={()=>setResetTrialOpen(false)} license={selected} api={api} refresh={refresh} notify={notify}/>
    <ServerSettings open={settingsOpen} onClose={()=>setSettingsOpen(false)} baseUrl={baseUrl} health={health} catalog={catalog}/>
    <Toast toast={toast} onClose={()=>setToast(null)}/>
  </div></div>
}

function Stat({icon,label,value,note,tone}){ return <div className={cn('stat',tone&&`stat-${tone}`)}><div className="stat-icon">{React.cloneElement(icon,{size:20})}</div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div> }

function LicenseDrawer({license,onClose,api,refresh,notify,onDelete,onResetTrial}){
  const [busy,setBusy]=useState('')
  if(!license)return null
  const action=async(name,fn,success)=>{ if(busy)return; setBusy(name); try{await fn();notify(success);await refresh(true)}catch(e){notify(e.message,'error')}finally{setBusy('')} }
  const copy=async text=>{ await navigator.clipboard.writeText(text); notify('Copiado para a área de transferência.') }
  const commercialBlocked=['past_due','refunded','chargeback','canceled'].includes(String(license.subscriptionStatus||'').toLowerCase())
  const canResetLicense=['revoked','suspended'].includes(String(license.storedStatus||license.status||'').toLowerCase()) || commercialBlocked
  const resetLicense=()=>{
    if(!window.confirm('Resetar esta licença? O bloqueio/revogação será removido, mas a data de expiração não será alterada.'))return
    action('license',()=>api.resetLicense(license.key),'Licença resetada e reativada sem alterar a validade.')
  }
  return <div className="drawer-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><aside className="drawer"><div className="drawer-head"><div><span className="eyebrow">DETALHES DA LICENÇA</span><h2>{license.customerEmail}</h2></div><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>
    <div className="key-box"><div><span>Chave</span><code>{license.key}</code></div><button className="icon-btn" onClick={()=>copy(license.key)}><Clipboard size={17}/></button></div>
    <div className="detail-status"><StatusBadge status={license.status}/><SourceBadge license={license}/></div>
    <div className="detail-grid"><Info label="Produto" value={license.product?.name}/><Info label="Plano" value={license.product?.plan}/><Info label="Duração" value={`${license.durationDays} dias`}/><Info label="Dispositivos" value={`${license.registeredDevices}/${license.maxDevices}`}/><Info label="Criada em" value={fmtDate(license.createdAt)}/><Info label="Ativada em" value={fmtDate(license.activatedAt)}/><Info label="Expira em" value={fmtDate(license.expiresAt)}/><Info label="Próxima cobrança" value={fmtDate(license.nextChargeAt)}/></div>
    {license.source?.provider==='kirvano'&&<div className="source-box"><b>Kirvano</b><Info label="Sale ID" value={license.source?.saleId||'—'}/><Info label="Subscription ID" value={license.source?.subscriptionId||'—'}/><Info label="Status assinatura" value={license.subscriptionStatus||'—'}/><Info label="Cancelar no período" value={license.cancelAtPeriodEnd?'Sim':'Não'}/></div>}
    <div className="devices"><div className="section-title"><b>Dispositivos</b><span>{license.devices?.length||0}</span></div>{(license.devices||[]).map((d,i)=><div className="device" key={`${d.fingerprintSuffix}-${i}`}><MonitorSmartphone size={18}/><div><b>•••• {d.fingerprintSuffix}</b><span>Último uso {fmtDate(d.lastSeenAt)} · {d.extensionVersion||'sem versão'}</span></div></div>)}{!license.devices?.length&&<div className="empty compact">Nenhum dispositivo vinculado.</div>}</div>
    <div className="drawer-actions">{canResetLicense&&<button className="btn btn-primary" disabled={!!busy} onClick={resetLicense}>{busy==='license'?<Loader2 className="spin" size={17}/>:<RotateCcw size={17}/>} Resetar licença</button>}<button className="btn btn-ghost" disabled={!!busy||!license.registeredDevices} onClick={()=>action('devices',()=>api.resetDevices(license.key),'Dispositivos da licença resetados.')}>{busy==='devices'?<Loader2 className="spin" size={17}/>:<RotateCcw size={17}/>} Resetar dispositivos</button><button className="btn btn-ghost" disabled={!!busy} onClick={onResetTrial}><MonitorSmartphone size={17}/> Reset Trial</button>{!canResetLicense&&license.status!=='revoked'&&<button className="btn btn-danger-soft" disabled={!!busy} onClick={()=>action('revoke',()=>api.revoke(license.key),'Licença revogada.')}>{busy==='revoke'?<Loader2 className="spin" size={17}/>:<CircleOff size={17}/>} Revogar</button>}<button className="btn btn-danger-soft" disabled={!!busy} onClick={onDelete}><Trash2 size={17}/> Excluir</button></div>
  </aside></div>
}
function Info({label,value}){return <div className="info"><span>{label}</span><b>{value||'—'}</b></div>}

function CreateLicense({open,onClose,api,refresh,notify,catalog}){
  const [form,setForm]=useState({customerEmail:'',productName:'HistoryOddPro',productId:'historyoddpro',durationDays:30,maxDevices:1,startsOnActivation:false,plan:'manual-30d',saleId:''})
  const [busy,setBusy]=useState(false)
  const change=(key,val)=>setForm(f=>({...f,[key]:val,...(key==='durationDays'?{plan:`manual-${val}d`}:{})}))
  async function submit(e){e.preventDefault();setBusy(true);try{const body={...form,durationDays:Number(form.durationDays),maxDevices:Number(form.maxDevices)};if(!body.saleId)delete body.saleId;const r=await api.create(body);notify(`Licença criada: ${shortKey(r.licenseKey)}`);onClose();await refresh(true)}catch(e){notify(e.message,'error')}finally{setBusy(false)}}
  return <Modal open={open} onClose={onClose} title="Criar licença" subtitle="Criação administrativa via POST /admin/licenses"><form className="form" onSubmit={submit}><div className="field-row"><label>E-mail do cliente<input type="email" required value={form.customerEmail} onChange={e=>change('customerEmail',e.target.value)} placeholder="cliente@exemplo.com"/></label><label>Produto<input required value={form.productName} onChange={e=>change('productName',e.target.value)}/></label></div><div className="field-row"><label>Product ID<input value={form.productId} onChange={e=>change('productId',e.target.value)}/></label><label>Plano<input value={form.plan} onChange={e=>change('plan',e.target.value)}/></label></div><div className="field-row"><label>Duração (dias)<input type="number" min="1" required value={form.durationDays} onChange={e=>change('durationDays',e.target.value)}/></label><label>Máx. dispositivos<select value={form.maxDevices} onChange={e=>change('maxDevices',e.target.value)}>{[1,2,3,4,5].map(n=><option key={n}>{n}</option>)}</select></label></div><label>Sale ID opcional<input value={form.saleId} onChange={e=>change('saleId',e.target.value)} placeholder="TRIAL-MANUAL-001"/></label><label className="check"><input type="checkbox" checked={form.startsOnActivation} onChange={e=>change('startsOnActivation',e.target.checked)}/><span><b>Iniciar validade na primeira ativação</b><small>Se desligado, o prazo começa imediatamente.</small></span></label>{catalog?.products?.length>0&&<div className="catalog-hint"><b>Catálogo do servidor</b><span>{catalog.products.map(x=>`${x.name} (${x.durationDays}d)`).join(' · ')}</span></div>}<div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" disabled={busy}>{busy?<Loader2 className="spin" size={17}/>:<Plus size={17}/>} Criar licença</button></div></form></Modal>
}

function DeleteLicenses({open,onClose,license,api,refresh,notify}){
  const [mode,setMode]=useState('email'); const [value,setValue]=useState(''); const [busy,setBusy]=useState(false)
  useEffect(()=>{if(open&&license){setMode('email');setValue(license.customerEmail||'')}},[open,license])
  async function submit(e){e.preventDefault();setBusy(true);try{const r=mode==='email'?await api.deleteByEmail(value):await api.deleteByFingerprint(value);notify(`${r.deleted} licença(s) excluída(s).`);onClose();await refresh(true)}catch(e){notify(e.message,'error')}finally{setBusy(false)}}
  return <Modal open={open} onClose={onClose} title="Excluir licenças" subtitle="O servidor exige exatamente um filtro para evitar exclusão ampla."><form className="form" onSubmit={submit}><div className="segmented"><button type="button" className={mode==='email'?'active':''} onClick={()=>{setMode('email');setValue(license?.customerEmail||'')}}>Por e-mail</button><button type="button" className={mode==='fingerprint'?'active':''} onClick={()=>{setMode('fingerprint');setValue(license?.devices?.[0]?.fingerprintSuffix||'')}}>Por fingerprint</button></div><label>{mode==='email'?'E-mail':'Sufixo do fingerprint'}<input required value={value} onChange={e=>setValue(e.target.value)} placeholder={mode==='email'?'cliente@exemplo.com':'a1b2c3d4'}/></label><div className="danger-box"><AlertTriangle size={18}/><div><b>Ação permanente</b><span>{mode==='email'?'Todas as licenças desse e-mail serão removidas. Marcadores permanentes de Trial por e-mail continuam preservados pelo servidor.':'Serão excluídas as licenças que possuírem dispositivo com esse sufixo.'}</span></div></div><div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-danger" disabled={busy}>{busy?<Loader2 className="spin" size={17}/>:<Trash2 size={17}/>} Excluir definitivamente</button></div></form></Modal>
}

function ResetTrial({open,onClose,license,api,refresh,notify}){
  const [selector,setSelector]=useState('licenseKey');const [value,setValue]=useState('');const [trialType,setTrialType]=useState('all');const [suffix,setSuffix]=useState('');const [busy,setBusy]=useState(false)
  useEffect(()=>{if(open&&license){setSelector('licenseKey');setValue(license.key);setSuffix('')}},[open,license])
  async function submit(e){e.preventDefault();setBusy(true);try{const body={[selector]:value,trialType};if(suffix)body.fingerprintSuffix=suffix;const r=await api.resetTrial(body);notify(`${r.removedDevices} dispositivo(s) de Trial liberado(s).`);onClose();await refresh(true)}catch(e){notify(e.message,'error')}finally{setBusy(false)}}
  return <Modal open={open} onClose={onClose} title="Reset de dispositivo Trial" subtitle="Libera o vínculo do computador sem liberar uma nova Trial por e-mail."><form className="form" onSubmit={submit}><div className="segmented"><button type="button" className={selector==='licenseKey'?'active':''} onClick={()=>{setSelector('licenseKey');setValue(license?.key||'')}}>Chave</button><button type="button" className={selector==='customerEmail'?'active':''} onClick={()=>{setSelector('customerEmail');setValue(license?.customerEmail||'')}}>E-mail</button></div><label>{selector==='licenseKey'?'Chave da licença':'E-mail'}<input required value={value} onChange={e=>setValue(e.target.value)}/></label><div className="field-row"><label>Tipo de Trial<select value={trialType} onChange={e=>setTrialType(e.target.value)}><option value="all">Todas</option><option value="normal">Normal</option><option value="video">Vídeo</option></select></label><label>Fingerprint específico (opcional)<input value={suffix} onChange={e=>setSuffix(e.target.value)} placeholder="últimos 8 hex"/></label></div><div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button><button className="btn btn-primary" disabled={busy}>{busy?<Loader2 className="spin" size={17}/>:<RotateCcw size={17}/>} Resetar Trial</button></div></form></Modal>
}

function ServerSettings({open,onClose,baseUrl,health,catalog}){
  return <Modal open={open} onClose={onClose} title="Servidor" subtitle={baseUrl}><div className="server-diagnostics"><div className={cn('readiness',health?.readyForSales?'ok':'bad')}>{health?.readyForSales?<ShieldCheck size={22}/>:<AlertTriangle size={22}/>}<div><b>{health?.readyForSales?'Ready for Sales':'Configuração incompleta'}</b><span>Worker {health?.version||'—'} · {health?.alive?'online':'offline'}</span></div></div><div className="diag-grid"><Info label="Segredos base" value={health?.configured?'OK':(health?.missingRequiredSecrets||[]).join(', ')||'Pendente'}/><Info label="E-mail OTP" value={health?.otpEmailConfigured?'OK':(health?.missingOtpConfig||[]).join(', ')||'Pendente'}/><Info label="Catálogo" value={`${health?.catalogProductCount||0} produto(s) · ${health?.catalogValid?'válido':'inválido'}`}/><Info label="Horário servidor" value={fmtDate(health?.serverTime)}/></div><div className="section-title"><b>Catálogo Kirvano</b><span>{catalog?.products?.length||0}</span></div><div className="catalog-list">{catalog?.products?.map((p,i)=><div className="catalog-item" key={`${p.offerId}-${i}`}><div><b>{p.name}</b><span>{p.plan}</span></div><div><strong>{p.durationDays}d</strong><span>{p.subscription?'Assinatura':'Avulso'}</span></div></div>)}{!catalog?.products?.length&&<div className="empty compact">Nenhum produto retornado.</div>}</div></div></Modal>
}

