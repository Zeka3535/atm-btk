# Генерация недостающих экранов Stitch + прошивка навигации
$ErrorActionPreference = 'Stop'
$cfg = Get-Content "$env:USERPROFILE\.cursor\mcp.json" -Raw | ConvertFrom-Json
$Key = $cfg.mcpServers.stitch.headers.'X-Goog-Api-Key'
$Uri = 'https://stitch.googleapis.com/mcp'
$ProjectId = '786355720389804835'
$DS = 'assets/16058079710893854729'
$Headers = @{ 'X-Goog-Api-Key' = $Key; 'Accept' = 'application/json' }
$OutDir = 'd:\ATM\atm-pwa\design\exports'

function Invoke-StitchTool([string]$Name, $Arguments, [int]$TimeoutSec = 420) {
  $obj = @{
    jsonrpc = '2.0'
    id = [guid]::NewGuid().ToString()
    method = 'tools/call'
    params = @{ name = $Name; arguments = $Arguments }
  }
  $bytes = [System.Text.Encoding]::UTF8.GetBytes(($obj | ConvertTo-Json -Depth 50 -Compress))
  Invoke-RestMethod -Uri $Uri -Method POST -Headers $Headers -Body $bytes -ContentType 'application/json; charset=utf-8' -TimeoutSec $TimeoutSec
}

function Get-StitchText($Resp) {
  $parts = @()
  foreach ($c in @($Resp.result.content)) {
    if ($c.type -eq 'text') { $parts += $c.text }
  }
  return ($parts -join "`n")
}

function New-Screen([string]$File, [string]$Prompt) {
  Write-Host "`n>>> $File"
  $gen = Invoke-StitchTool 'generate_screen_from_text' @{
    projectId = $ProjectId
    prompt = $Prompt
    deviceType = 'MOBILE'
    modelId = 'GEMINI_3_FLASH'
    designSystem = $DS
  }
  $txt = Get-StitchText $gen
  $path = Join-Path $OutDir $File
  [System.IO.File]::WriteAllText($path, $txt, [System.Text.UTF8Encoding]::new($false))
  if ($txt -match 'unavailable|invalid argument|ERROR') {
    Write-Host "FAIL: $($txt.Substring(0, [Math]::Min(200, $txt.Length)))"
    return $null
  }
  $d = $txt | ConvertFrom-Json
  $s = $d.outputComponents[0].design.screens[0]
  Write-Host ("OK $($s.title) $($s.id)")
  return $s
}

$common = @'
App ATM БТК Beltelecom field PWA, mobile 390x844, LIGHT only, Manrope.
Palette primary #663479, accent #33CEE1, bg #F5F3F7, white cards radius 16-20.
Same product as our existing Inbox/Task Details screens. Russian labels. No emoji. No dark theme.
'@

# --- Detail tabs ---
$screens = @{}

$screens.DetailServices = New-Screen 'screen-detail-services.json' @"
Screen name: DetailServices
$common
Task detail tab Сервисы (active):
- Compact purple toolbar: back arrow + «Назад»
- Tabs row: Сервисы (active), Huawei xPON, История, Вторичка
- White head card: address green, Сегодня + period, FIO, 0: Нет данных, bold text «Ясна 200 Смарт, выдать модем huawei, дог СЦ»
- Footer: map icon, phone, Wi‑Fi chip, Отчёт button
- Services list cards: ByFly + ZALA, login 160002..., tariff Ясна 500_Smart; city phone chip
- Bottom island Inbox/Closed
Prototype: Назад→Inbox; tab Huawei xPON→DetailHuawei; tab История→DetailHistory; tab Вторичка→DetailSecondary; Отчёт→ModalReport; phone→ModalContacts; map→ModalMaps; Wi‑Fi→ModalWifi; island Closed→Closed; island Inbox→Inbox
"@

$screens.DetailHuawei = New-Screen 'screen-detail-huawei.json' @"
Screen name: DetailHuawei
$common
Task detail tab Huawei xPON (active):
- Same purple toolbar «Назад» and same tabs (Huawei xPON active)
- Same head card collapsed/summary optional OR keep head card
- Carrier block: modem status «в сети», port [ON], profile Ясна 200 Смарт, ports ByFly/IPTV/IMS chips
- Metric rows with icons: Оптический уровень −19.8 дБм, Лазер TX, Серийный номер HWTC4A7B2C91, Температура
- Bottom island
Prototype: tabs to DetailServices / DetailHistory / DetailSecondary; Назад→Inbox; island links
"@

$screens.DetailHistory = New-Screen 'screen-detail-history.json' @"
Screen name: DetailHistory
$common
Task detail tab История (active):
- Toolbar Назад + tabs (История active)
- History cards: date 30.07.2026, worker Ковалёв А.С., note text, closeNote
- Clean timeline/card list polish
- Bottom island
Prototype: other tabs + Назад→Inbox
"@

$screens.DetailSecondary = New-Screen 'screen-detail-secondary.json' @"
Screen name: DetailSecondary
$common
Task detail tab Вторичка (active):
- Toolbar Назад + tabs (Вторичка active)
- PON measure tiles or compact metric list: RX optical, voltage, laser current, temperature
- Chart bar button «График» optional
- Bottom island
Prototype: other tabs + Назад→Inbox
"@

$screens.DetailDslam = New-Screen 'screen-detail-dslam.json' @"
Screen name: DetailDslam
$common
Task detail for ADSL: tabs Сервисы, DSLAM (active), История, Первичка, Вторичка
- DSLAM modem panel + metrics: SNR, attenuation, profile ADSL2+, port
- Toolbar Назад
Prototype: Назад→Inbox; tab История→DetailHistory
"@

# --- Modals ---
$screens.ModalReport = New-Screen 'screen-modal-report.json' @"
Screen name: ModalReport
$common
Bottom-sheet modal over dimmed full-screen backdrop:
Title «Текст отчёта», address line, textarea, custom select «Зона аварии» (абонентский участок…), clear + counter 0/506, Отмена + Послать purple
Looks like our Report modal polish.
Prototype: Отмена/backdrop → DetailServices; Послать → Inbox
"@

$screens.ModalContacts = New-Screen 'screen-modal-contacts.json' @"
Screen name: ModalContacts
$common
Modal: «Хотите связаться с абонентом?» list of mobile +375… and city #80162… with call actions. Backdrop dismiss.
Prototype: backdrop → DetailServices
"@

$screens.ModalMaps = New-Screen 'screen-modal-maps.json' @"
Screen name: ModalMaps
$common
Modal «Открыть в картах»: options Яндекс.Карты (priority) and Google Maps, Cancel.
Prototype: Cancel/backdrop → DetailServices
"@

$screens.ModalWifi = New-Screen 'screen-modal-wifi.json' @"
Screen name: ModalWifi
$common
Modal «Настройка Wi‑Fi»: SSID, password with show/hide, custom select Диапазон 2.4/5/2.4+5, Apply button. Demo note.
Prototype: close/backdrop → DetailServices
"@

# Save ids
$map = @{}
foreach ($k in $screens.Keys) {
  if ($screens[$k]) { $map[$k] = $screens[$k].id }
}
$map | ConvertTo-Json | Set-Content (Join-Path $OutDir 'new-screens-ids.json') -Encoding utf8
Write-Host "`nSaved ids:"
$map.GetEnumerator() | ForEach-Object { Write-Host ("  $($_.Key)=$($_.Value)") }
