/** Иконки из vector drawable ATM БТК (filled pathData) */

import type { ReactNode } from 'react'
import type { MetricIcon } from '../types'

type IconProps = {
  size?: number
  className?: string
  title?: string
}

function Svg({
  size = 24,
  className,
  title,
  children,
  fill = 'currentColor',
}: IconProps & { children: ReactNode; fill?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <g fill={fill}>{children}</g>
    </svg>
  )
}

export function IconInbox(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M19,3H5C3.9,3 3.01,3.9 3.01,5L3,19c0,1.1 0.89,2 1.99,2H19c1.1,0 2,-0.9 2,-2V5C21,3.9 20.1,3 19,3zM19,15h-4c0,1.66 -1.35,3 -3,3s-3,-1.34 -3,-3H5V5h14V15z" />
    </Svg>
  )
}

export function IconClosed(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12,2C6.48,2 2,6.48 2,12s4.48,10 10,10 10,-4.48 10,-10S17.52,2 12,2zM10,17l-5,-5 1.41,-1.41L10,14.17l7.59,-7.59L19,8l-9,9z" />
    </Svg>
  )
}

export function IconSettings(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M19.14,12.94c0.04,-0.31 0.06,-0.63 0.06,-0.94c0,-0.31 -0.02,-0.63 -0.06,-0.94l2.03,-1.58c0.18,-0.14 0.23,-0.41 0.12,-0.61l-1.92,-3.32c-0.12,-0.22 -0.37,-0.29 -0.59,-0.22l-2.39,0.96c-0.5,-0.38 -1.03,-0.7 -1.62,-0.94L14.4,2.81c-0.04,-0.24 -0.24,-0.41 -0.48,-0.41h-3.84c-0.24,0 -0.43,0.17 -0.47,0.41L9.25,5.35C8.66,5.59 8.12,5.92 7.63,6.29L5.24,5.33c-0.22,-0.08 -0.47,0 -0.59,0.22L2.74,8.87C2.62,9.08 2.66,9.34 2.86,9.48l2.03,1.58C4.84,11.37 4.8,11.69 4.8,12s0.02,0.63 0.06,0.94l-2.03,1.58c-0.18,0.14 -0.23,0.41 -0.12,0.61l1.92,3.32c0.12,0.22 0.37,0.29 0.59,0.22l2.39,-0.96c0.5,0.38 1.03,0.7 1.62,0.94l0.36,2.54c0.05,0.24 0.24,0.41 0.48,0.41h3.84c0.24,0 0.44,-0.17 0.47,-0.41l0.36,-2.54c0.59,-0.24 1.13,-0.56 1.62,-0.94l2.39,0.96c0.22,0.08 0.47,0 0.59,-0.22l1.92,-3.32c0.12,-0.22 0.07,-0.47 -0.12,-0.61L19.14,12.94zM12,15.6c-1.98,0 -3.6,-1.62 -3.6,-3.6s1.62,-3.6 3.6,-3.6s3.6,1.62 3.6,3.6S13.98,15.6 12,15.6z" />
    </Svg>
  )
}

export function IconBack(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20,11H7.83l5.59,-5.59L12,4l-8,8 8,8 1.41,-1.41L7.83,13H20v-2z" />
    </Svg>
  )
}

export function IconPlace(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5 2.5,1.12 2.5,2.5 -1.12,2.5 -2.5,2.5z" />
    </Svg>
  )
}

export function IconNotify(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20,4H4C2.9,4 2,4.9 2,6v12c0,1.1 0.9,2 2,2h16c1.1,0 2,-0.9 2,-2V6C22,4.9 21.1,4 20,4zM20,18H4V8l8,5 8,-5V18zM12,11L4,6h16L12,11z" />
    </Svg>
  )
}

export function IconLogout(p: IconProps) {
  return (
    <Svg {...p} fill="#33cee1">
      <path d="M10.09,15.59L11.5,17l5,-5 -5,-5 -1.41,1.41L12.67,11H3v2h9.67l-2.58,2.59zM19,3H5c-1.11,0 -2,0.9 -2,2v4h2V5h14v14H5v-4H3v4c0,1.1 0.89,2 2,2h14c1.1,0 2,-0.9 2,-2V5c0,-1.1 -0.9,-2 -2,-2z" />
    </Svg>
  )
}

/** SNR / уровень сигнала — cell_wifi */
export function IconSignal(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12,4c-4.42,0 -8.18,1.91 -10.66,4.94l1.85,1.85C5.16,8.36 8.38,6.5 12,6.5s6.84,1.86 8.81,4.29l1.85,-1.85C20.18,5.91 16.42,4 12,4zM12,9.5c-2.76,0 -5.26,1.12 -7.07,2.93l1.85,1.85C8.15,12.91 9.97,12 12,12s3.85,0.91 5.22,2.28l1.85,-1.85C17.26,10.62 14.76,9.5 12,9.5zM12,15c-1.38,0 -2.63,0.56 -3.54,1.46L12,20l3.54,-3.54C14.63,15.56 13.38,15 12,15z" />
    </Svg>
  )
}

/** Оптика — ic_btk_optical */
export function IconOptical(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9,21c0,0.55 0.45,1 1,1h4c0.55,0 1,-0.45 1,-1v-1H9V21zM12,2C8.14,2 5,5.14 5,9c0,2.38 1.19,4.47 3,5.74V17c0,0.55 0.45,1 1,1h6c0.55,0 1,-0.45 1,-1v-2.26c1.81,-1.27 3,-3.36 3,-5.74 0,-3.86 -3.14,-7 -7,-7z" />
    </Svg>
  )
}

/** Напряжение — bolt */
export function IconVolt(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M11,21h-1l1,-7H7.5c-0.88,0 -0.33,-0.98 -0.13,-1.3C8.58,10.78 10.42,7.54 13,3h1l-1,7h3.5c0.49,0 0.56,0.33 0.47,0.51l-0.07,0.15C12.96,17.55 11,21 11,21z" />
    </Svg>
  )
}

/** Отклонение — ic_btk_delta */
export function IconDelta(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M19,13H5v-2h14V13zM13,19V5h-2v14H13z" />
    </Svg>
  )
}

/** Модем / порт — router */
export function IconModem(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20.2,5.9l0.8,-0.8C19.5,3.6 17.4,3 15.5,3c-1.9,0 -3.9,0.6 -5.5,2.1l0.8,0.8C12.2,4.6 13.8,4 15.5,4s3.3,0.6 4.7,1.9zM19.3,6.7c-1,-1 -2.4,-1.6 -3.8,-1.6s-2.8,0.6 -3.8,1.6l0.8,0.8c0.8,-0.8 1.8,-1.2 3,-1.2s2.2,0.4 3,1.2L19.3,6.7zM19,13h-2v-2h-2v2H5c-1.1,0 -2,0.9 -2,2v4c0,1.1 0.9,2 2,2h14c1.1,0 2,-0.9 2,-2v-4C21,13.9 20.1,13 19,13zM8,18H6v-2h2V18zM12,18h-2v-2h2V18zM16,18h-2v-2h2V18z" />
    </Svg>
  )
}

/** OLT / маршрутизатор — settings_input_antenna */
export function IconRouter(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12,5c-3.87,0 -7,3.13 -7,7h2c0,-2.76 2.24,-5 5,-5s5,2.24 5,5h2C19,8.13 15.87,5 12,5zM12,9c-1.66,0 -3,1.34 -3,3h2c0,-0.55 0.45,-1 1,-1s1,0.45 1,1h2C13,10.34 11.66,9 12,9zM12,1C5.93,1 1,5.93 1,12h2c0,-4.97 4.03,-9 9,-9s9,4.03 9,9h2C23,5.93 18.07,1 12,1zM13,15.88V22h-2v-6.12c-1.14,-0.36 -2,-1.42 -2,-2.68 0,-1.66 1.34,-3 3,-3s3,1.34 3,3c0,1.26 -0.86,2.32 -2,2.68z" />
    </Svg>
  )
}

/** Заметка / кросс — cable */
export function IconNote(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20,5V4c0,-0.55 -0.45,-1 -1,-1h-2c-0.55,0 -1,0.45 -1,1v1h-1v4c0,0.55 0.45,1 1,1h1v7c0,1.1 -0.9,2 -2,2s-2,-0.9 -2,-2V7c0,-2.21 -1.79,-4 -4,-4S5,4.79 5,7v7H4c-0.55,0 -1,0.45 -1,1v4h1v1c0,0.55 0.45,1 1,1h2c0.55,0 1,-0.45 1,-1v-1h1v-4c0,-0.55 -0.45,-1 -1,-1H7V7c0,-1.1 0.9,-2 2,-2s2,0.9 2,2v10c0,2.21 1.79,4 4,4s4,-1.79 4,-4v-7h1c0.55,0 1,-0.45 1,-1V5H20z" />
    </Svg>
  )
}

/** Температура — device_thermostat */
export function IconThermo(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M15,13V5c0,-1.66 -1.34,-3 -3,-3S9,3.34 9,5v8c-1.21,0.91 -2,2.37 -2,4 0,2.76 2.24,5 5,5s5,-2.24 5,-5c0,-1.63 -0.79,-3.09 -2,-4zM11,5c0,-0.55 0.45,-1 1,-1s1,0.45 1,1v7h-2V5zM12,20c-1.66,0 -3,-1.34 -3,-3 0,-0.94 0.44,-1.77 1.12,-2.32L11,14h2l0.88,0.68C14.56,15.23 15,16.06 15,17c0,1.66 -1.34,3 -3,3z" />
    </Svg>
  )
}

/** Затухание — trending_down */
export function IconAttenuation(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M16,18l2.29,-2.29 -4.88,-4.88 -4,4L2,7.41 3.41,6l6,6 4,-4 6.3,6.29L22,12v6H16z" />
    </Svg>
  )
}

/** Лазер / ток лазера — ic_btk_laser */
export function IconLaser(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12,2L4.5,20.29l0.71,0.71L12,18l6.79,3 0.71,-0.71L12,2z" />
    </Svg>
  )
}

/** Скорость / профиль — speed */
export function IconSpeed(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M20.38,8.57l-1.23,1.85a8,8 0 0 1 -0.22,7.58H5.07A8,8 0 0 1 15.58,6.85l1.85,-1.23A10,10 0 0 0 3,13a10,10 0 0 0 10,10 10,10 0 0 0 7.38,-16.43zM10.59,15.41l2.83,-2.83V5h-2v5.76L8.41,13.41l2.18,2z" />
    </Svg>
  )
}

export function IconCalendar(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M19,4h-1V2h-2v2H8V2H6v2H5C3.89,4 3,4.9 3,6v14c0,1.1 0.89,2 2,2h14c1.1,0 2,-0.9 2,-2V6C21,4.9 20.1,4 19,4zM19,20H5V10h14V20zM7,12h2v2H7V12zM11,12h2v2h-2V12zM15,12h2v2h-2V12z" />
    </Svg>
  )
}

export function IconChart(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3.5,18.49l6,-6.01 4,4L22,6.92l-1.41,-1.41 -7.09,7.97 -4,-4L2,16.99z" />
    </Svg>
  )
}

/** Платная — payments */
export function IconPay(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M19,14V6c0,-1.1 -0.9,-2 -2,-2H3C1.9,4 1,4.9 1,6v8c0,1.1 0.9,2 2,2h14c1.1,0 2,-0.9 2,-2zM3,6h14v8H3V6zM14,12c0,-1.1 -0.9,-2 -2,-2s-2,0.9 -2,2 0.9,2 2,2 2,-0.9 2,-2zM23,7v11c0,1.1 -0.9,2 -2,2H4v-2h17V7H23z" />
    </Svg>
  )
}

/** ТВ — live_tv */
export function IconTv(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M21,6h-7.59l3.29,-3.29L16,2l-4,4 -4,-4 -0.71,0.71L10.59,6H3C1.9,6 1,6.9 1,8v12c0,1.1 0.9,2 2,2h18c1.1,0 2,-0.9 2,-2V8C23,6.9 22.1,6 21,6zM21,20H3V8h18V20zM9,10v8l7,-4L9,10z" />
    </Svg>
  )
}

/** Wi‑Fi */
export function IconWifi(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M1,9l2,2c4.97,-4.97 13.03,-4.97 18,0l2,-2C16.93,2.93 7.08,2.93 1,9zM5,13l2,2c2.76,-2.76 7.24,-2.76 10,0l2,-2C15.14,9.14 8.87,9.14 5,13zM9,17l3,3 3,-3C13.35,15.34 10.66,15.34 9,17z" />
    </Svg>
  )
}

/** VIP — workspace_premium */
export function IconVip(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9.68,13.69L12,11.93l2.32,1.76 -0.88,-2.85L15.75,9h-2.84L12,6.19 11.09,9H8.25l2.31,1.84 -0.88,2.85zM20,10c0,-4.42 -3.58,-8 -8,-8s-8,3.58 -8,8c0,2.03 0.76,3.87 2,5.28V23l6,-2 6,2v-7.72C19.24,13.87 20,12.03 20,10zM12,4c3.31,0 6,2.69 6,6s-2.69,6 -6,6 -6,-2.69 -6,-6 2.69,-6 6,-6zM12,19l-4,1.02v-3.1C9.18,17.6 10.54,18 12,18s2.82,-0.4 4,-1.08v3.1L12,19z" />
    </Svg>
  )
}

/** Отчёт / отписано — assignment */
export function IconReceipt(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M19,3h-4.18C14.4,1.84 13.3,1 12,1S9.6,1.84 9.18,3H5C3.9,3 3,3.9 3,5v14c0,1.1 0.9,2 2,2h14c1.1,0 2,-0.9 2,-2V5C21,3.9 20.1,3 19,3zM12,3c0.55,0 1,0.45 1,1s-0.45,1 -1,1 -1,-0.45 -1,-1 0.45,-1 1,-1zM14,17H7v-2h7V17zM17,13H7v-2h10V13zM17,9H7V7h10V9z" />
    </Svg>
  )
}

export function MetricGlyph({ name, size = 22 }: { name: MetricIcon; size?: number }) {
  switch (name) {
    case 'signal':
      return <IconSignal size={size} />
    case 'optical':
      return <IconOptical size={size} />
    case 'volt':
      return <IconVolt size={size} />
    case 'delta':
      return <IconDelta size={size} />
    case 'modem':
      return <IconModem size={size} />
    case 'router':
      return <IconRouter size={size} />
    case 'thermo':
      return <IconThermo size={size} />
    case 'attenuation':
      return <IconAttenuation size={size} />
    case 'laser':
      return <IconLaser size={size} />
    case 'speed':
      return <IconSpeed size={size} />
    case 'calendar':
      return <IconCalendar size={size} />
    case 'chart':
      return <IconChart size={size} />
    default:
      return <IconNote size={size} />
  }
}
